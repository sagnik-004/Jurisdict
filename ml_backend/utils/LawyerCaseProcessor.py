import os
import pymongo
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize MongoDB (connection kept for potential future use)
MONGO_URI = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.Themisync
case_collection = db.cases

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class LawyerCaseProcessor:
    def __init__(self):
        pass  # Removed vectorization/case fetching

    def process_case_for_lawyer(self, case_summary, grounds_of_bail):
        try:
            # Generate detailed legal analysis using AI
            ai_report = self._generate_lawyer_report(case_summary, grounds_of_bail)

            response = {
                "decision": "Legal analysis provided.",
                "detailedAnalysis": ai_report,
                "keyPoints": {
                    "caseSummary": case_summary,
                    "groundsOfBail": grounds_of_bail,
                    "recommendation": "Consider the following legal strategies."
                },
                "additionalInfo": {
                    "note": "This analysis is based on the provided case details and does not reference past cases.",
                    "disclaimer": "This is an AI-generated analysis and should not replace professional legal advice."
                }
            }
            return response

        except Exception as e:
            return {"error": str(e)}

    def _generate_lawyer_report(self, case_summary, grounds_of_bail):
        try:
            model = genai.GenerativeModel("gemini-pro")
            prompt = f"""
            As a legal AI, provide a detailed and structured bail case analysis for a lawyer.
            Focus strictly on the provided case details without comparing to historical cases.

            Case Summary: {case_summary}
            Grounds for Bail: {', '.join(grounds_of_bail)}

            Provide a detailed analysis including:
            1. Key legal arguments for and against bail.
            2. Potential strategies for the bail application.
            3. Strengths and weaknesses of the case.
            4. Recommendations for next steps.

            Maintain a professional tone and avoid speculative judicial outcomes.
            """
            response = model.generate_content(prompt)
            return response.text if response else "AI report generation failed."
        except Exception as e:
            print(f"Lawyer AI error: {str(e)}")
            return "Unable to generate detailed legal summary at this time."