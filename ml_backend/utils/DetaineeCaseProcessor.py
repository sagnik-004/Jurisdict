import os
import sys
import logging
from typing import Dict, List, Any
import pymongo
import google.generativeai as genai
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class DetaineeCaseProcessor:
    def __init__(self):
        """Initialize the DetaineeCaseProcessor with MongoDB and Gemini AI configurations."""
        try:
            # Initialize MongoDB
            self.mongo_uri = os.getenv("MONGODB_URI")
            if not self.mongo_uri:
                raise ValueError("MongoDB URI not found in environment variables")
            
            self.client = pymongo.MongoClient(self.mongo_uri)
            self.db = self.client.Themisync
            self.case_collection = self.db.cases

            # Configure Gemini AI
            gemini_api_key = os.getenv("GEMINI_API_KEY")
            if not gemini_api_key:
                raise ValueError("Gemini API key not found in environment variables")
            
            genai.configure(api_key=gemini_api_key)
            
        except Exception as e:
            logger.error(f"Initialization error: {str(e)}")
            raise

    def process_case_for_detainee(self, case_summary: str, grounds_of_bail: List[str]) -> Dict[str, Any]:
        """
        Process a case for a detainee with the given details.
        
        Args:
            case_summary: A string containing the case summary
            grounds_of_bail: A list of strings containing grounds for bail
            
        Returns:
            Dict containing the analysis and recommendations
        """
        try:
            if not case_summary or not grounds_of_bail:
                raise ValueError("Case summary and grounds of bail are required")

            # Generate detailed analysis using AI
            ai_statement = self._generate_detainee_statement(case_summary, grounds_of_bail)

            response = {
                "status": "success",
                "decision": "Case analysis provided",
                "detailedAnalysis": ai_statement,
                "keyPoints": {
                    "caseSummary": case_summary,
                    "groundsOfBail": grounds_of_bail,
                    "recommendation": "Please consult your legal representative for detailed advice"
                },
                "additionalInfo": {
                    "note": "This analysis is based on the provided case details only",
                    "disclaimer": "This is an AI-generated analysis and should not be considered legal advice",
                    "lastUpdated": self._get_timestamp()
                }
            }
            return response

        except ValueError as ve:
            logger.warning(f"Validation error: {str(ve)}")
            return {
                "status": "error",
                "error": str(ve),
                "errorType": "ValidationError"
            }
        except Exception as e:
            logger.error(f"Processing error: {str(e)}")
            return {
                "status": "error",
                "error": "An unexpected error occurred while processing the case",
                "errorType": "ProcessingError"
            }

    def _generate_detainee_statement(self, case_summary: str, grounds_of_bail: List[str]) -> str:
        """
        Generate an AI-powered statement for the detainee.
        
        Args:
            case_summary: Case summary text
            grounds_of_bail: List of grounds for bail
            
        Returns:
            Generated analysis text
        """
        try:
            model = genai.GenerativeModel("gemini-pro")
            prompt = f"""
            As an AI assistant providing guidance to a detainee, analyze this case:
            
            CASE SUMMARY:
            {case_summary}
            
            GROUNDS FOR BAIL:
            {', '.join(grounds_of_bail)}
            
            Please provide a detailed analysis including:
            1. Main points from the case summary in simple terms
            2. Analysis of the bail application's strengths and potential challenges
            3. Suggested next steps and preparations
            4. Important reminders about legal representation
            
            Keep the language simple and clear. Focus on facts and avoid making legal promises or guarantees.
            Maintain a balanced and supportive tone while being realistic about the situation.
            """
            
            response = model.generate_content(prompt)
            if not response or not response.text:
                raise ValueError("Failed to generate AI analysis")
                
            return response.text

        except Exception as e:
            logger.error(f"AI generation error: {str(e)}")
            return ("We are currently experiencing technical difficulties with the detailed analysis. "
                   "Please consult your legal representative for guidance on your case.")

    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format."""
        from datetime import datetime
        return datetime.utcnow().isoformat()

    def __del__(self):
        """Cleanup method to close MongoDB connection."""
        try:
            if hasattr(self, 'client'):
                self.client.close()
        except Exception as e:
            logger.error(f"Error closing MongoDB connection: {str(e)}")
