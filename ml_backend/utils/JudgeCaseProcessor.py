import os
import pymongo
import numpy as np
import google.generativeai as genai
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from dotenv import load_dotenv

# Load environment variables from parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize NLTK and MongoDB
nltk.download('stopwords', quiet=True)
MONGO_URI = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.Themisync
case_collection = db.cases

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class JudgeCaseProcessor:
    def __init__(self):
        self.vectorizer = CountVectorizer(stop_words="english")
        self.past_cases = self._fetch_and_vectorize_past_cases()

    def _fetch_and_vectorize_past_cases(self):
        try:
            cases = list(case_collection.find({"bailStatus": {"$in": ["Accepted", "Declined"]}}))
            if not cases:
                return {"cases": [], "vectors": None}
            
            text_data = [f"{case.get('caseSummary', '')} {' '.join(case.get('groundsOfBail', []))}" 
                        for case in cases]
            vectors = self.vectorizer.fit_transform(text_data)
            return {"cases": cases, "vectors": vectors}
        except Exception as e:
            print(f"Database error: {str(e)}")
            return {"cases": [], "vectors": None}

    def process_new_case(self, case_summary, grounds_of_bail, past_criminal_records):
        try:
            if not self.past_cases["cases"]:
                return {
                    "decision": "Pending",
                    "report": "No past cases available for analysis. Manual review required.",
                    "topCases": []
                }

            new_text = f"{case_summary} {' '.join(grounds_of_bail)}"
            new_vector = self.vectorizer.transform([new_text])
            similarities = cosine_similarity(new_vector, self.past_cases["vectors"]).flatten()
            top_indices = np.argsort(similarities)[-5:][::-1]
            
            top_cases = [self.past_cases["cases"][i] for i in top_indices]
            bail_granted_count = sum(1 for case in top_cases if case["bailStatus"] == "Accepted")
            
            tentative_decision = "Accepted" if bail_granted_count / len(top_cases) >= 0.6 else "Declined"
            final_decision = "Declined" if self._is_severe_offender(past_criminal_records) else tentative_decision

            report = self._generate_ai_report(case_summary, grounds_of_bail, top_cases, final_decision)
            
            return {
                "decision": final_decision,
                "report": report,
                "topCases": [
                    {
                        "caseId": case.get("caseId", "Unknown"),
                        "title": case.get("caseTitle", "Untitled Case"),
                        "bailStatus": case.get("bailStatus", "Unknown"),
                        "caseSummary": case.get("caseSummary", "No Summary Available"),
                        "groundsOfBail": case.get("groundsOfBail", [])
                    }
                    for case in top_cases
                ]
            }
        except Exception as e:
            print(f"Processing error: {str(e)}")
            return {
                "decision": "Error",
                "report": "An error occurred during case processing.",
                "topCases": []
            }

    def _is_severe_offender(self, past_criminal_records):
        severe_offenses = {"Murder", "Rape", "Terrorism", "Human Trafficking", "Acid Attack"}
        return any(offense in severe_offenses for offense in past_criminal_records)

    def _generate_ai_report(self, case_summary, grounds_of_bail, top_cases, final_decision):
        try:
            model = genai.GenerativeModel("gemini-pro")
            prompt = f"""
            As a legal AI assistant, analyze this bail case:
            Case Summary: {case_summary}
            Grounds for Bail: {', '.join(grounds_of_bail)}
            Similar Cases: {', '.join(case.get('caseId', 'Unknown') for case in top_cases)}
            Recommendation: {final_decision}

            Generate a structured legal report analyzing the merits of the bail application.
            """
            response = model.generate_content(prompt)
            return response.text if response else "AI report generation failed."
        except Exception as e:
            print(f"AI report generation error: {str(e)}")
            return "Unable to generate AI report at this time."

if __name__ == "__main__":
    processor = JudgeCaseProcessor()
    test_result = processor.process_new_case(
        case_summary="Financial fraud case under BNS sections 420 and 335",
        grounds_of_bail=["No prior record", "Permanent residence"],
        past_criminal_records=["Fraud"]
    )
    print(test_result)