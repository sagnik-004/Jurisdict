import os
import pymongo
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize MongoDB
MONGO_URI = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.Themisync
case_collection = db.cases

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class DetaineeCaseProcessor:
    def __init__(self):
        pass

    def process_case_for_detainee(self, case_summary, grounds_of_bail):
        try:
            # Generate detailed analysis using AI
            ai_statement = self._generate_detainee_statement(case_summary, grounds_of_bail)

            response = {
                "decision": "Case analysis provided.",
                "detailedAnalysis": ai_statement,
                "keyPoints": {
                    "caseSummary": case_summary,
                    "groundsOfBail": grounds_of_bail,
                    "recommendation": "Consult your lawyer for detailed legal advice."
                },
                "additionalInfo": {
                    "note": "This analysis is based on the provided case details and does not reference past cases.",
                    "disclaimer": "This is an AI-generated analysis and should not be considered legal advice."
                }
            }
            return response

        except Exception as e:
            return {"error": str(e)}

    def _generate_detainee_statement(self, case_summary, grounds_of_bail):
        try:
            model = genai.GenerativeModel("gemini-pro")
            prompt = f"""
            You are an AI assistant providing detailed guidance to a detainee. 
            Analyze the case and provide a structured, detainee-friendly response.

            Case Summary: {case_summary}
            Grounds for Bail: {', '.join(grounds_of_bail)}

            Provide a detailed analysis including:
            1. Key points from the case summary.
            2. Strengths and weaknesses of the bail application.
            3. General advice on next steps.
            4. A reminder to consult a lawyer for legal advice.

            Keep the tone optimistic but realistic, and avoid making legal guarantees.
            """
            response = model.generate_content(prompt)
            return response.text if response else "Unable to generate detailed analysis at this time."
        except Exception as e:
            print(f"Detainee AI response error: {str(e)}")
            return "Your case is being evaluated. Please consult your lawyer for detailed advice."