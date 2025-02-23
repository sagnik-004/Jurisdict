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

class LawyerCaseProcessor:
    def __init__(self):
        """Initialize the LawyerCaseProcessor with MongoDB and Gemini AI configurations."""
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

    def process_case_for_lawyer(self, case_summary: str, grounds_of_bail: List[str]) -> Dict[str, Any]:
        """
        Process a case for a lawyer with the given details.
        
        Args:
            case_summary: A string containing the case summary
            grounds_of_bail: A list of strings containing grounds for bail
            
        Returns:
            Dict containing the legal analysis and recommendations
        """
        try:
            if not case_summary or not grounds_of_bail:
                raise ValueError("Case summary and grounds of bail are required")

            # Generate detailed legal analysis using AI
            ai_report = self._generate_lawyer_report(case_summary, grounds_of_bail)

            response = {
                "status": "success",
                "decision": "Legal analysis provided",
                "detailedAnalysis": ai_report,
                "keyPoints": {
                    "caseSummary": case_summary,
                    "groundsOfBail": grounds_of_bail,
                    "recommendation": "Consider the following legal strategies"
                },
                "additionalInfo": {
                    "note": "This analysis is based on the provided case details",
                    "disclaimer": "This AI-generated analysis should complement professional legal judgment",
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

    def _generate_lawyer_report(self, case_summary: str, grounds_of_bail: List[str]) -> str:
        """
        Generate an AI-powered legal analysis report.
        
        Args:
            case_summary: Case summary text
            grounds_of_bail: List of grounds for bail
            
        Returns:
            Generated legal analysis text
        """
        try:
            model = genai.GenerativeModel("gemini-pro")
            prompt = f"""
            As a legal AI assistant, provide a comprehensive bail case analysis for a lawyer:
            
            CASE SUMMARY:
            {case_summary}
            
            GROUNDS FOR BAIL:
            {', '.join(grounds_of_bail)}
            
            Please provide a detailed legal analysis including:
            1. Critical evaluation of legal arguments supporting and opposing bail
            2. Strategic recommendations for the bail application
            3. Analysis of case strengths and potential vulnerabilities
            4. Suggested legal precedents and authorities (if applicable)
            5. Recommended next steps in the legal process
            
            Maintain professional legal language and focus on actionable insights.
            Base all analysis strictly on the provided case details.
            """
            
            response = model.generate_content(prompt)
            if not response or not response.text:
                raise ValueError("Failed to generate AI legal analysis")
                
            return response.text

        except Exception as e:
            logger.error(f"AI generation error: {str(e)}")
            return ("Technical difficulties encountered in generating detailed legal analysis. "
                   "Please proceed with standard legal evaluation protocols.")

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
