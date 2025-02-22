import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Add project root to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)  # Go one level up to the root directory
sys.path.append(project_root)

# Import the processors
from ml_backend.utils.JudgeCaseProcessor import JudgeCaseProcessor
from ml_backend.utils.LawyerCaseProcessor import LawyerCaseProcessor
from ml_backend.utils.DetaineeCaseProcessor import DetaineeCaseProcessor  # Import detainee processor

app = Flask(__name__)
CORS(app)

@app.route('/process_case_judge', methods=['POST'])
def process_case_judge():
    """Judge-specific case processing API"""
    try:
        data = request.json
        processor = JudgeCaseProcessor()
        
        result = processor.process_new_case(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", []),
            past_criminal_records=data.get("pastOffenses", [])
        )

        response = {
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Error"),
            "aiReport": result.get("report", "AI report unavailable."),
            "topCases": result.get("topCases", [])
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/process_case_lawyer', methods=['POST'])
def process_case_lawyer():
    """Lawyer-specific case processing API"""
    try:
        data = request.json
        processor = LawyerCaseProcessor()  # Create an instance of the Lawyer processor
        
        result = processor.process_case_for_lawyer(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", [])
        )

        response = {
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Error"),
            "detailedAnalysis": result.get("detailedAnalysis", "No analysis available"),
            "keyPoints": result.get("keyPoints", {}),
            "additionalInfo": result.get("additionalInfo", {})
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/process_case_detainee', methods=['POST'])
def process_case_detainee():
    """Detainee-specific case processing API"""
    try:
        data = request.json
        processor = DetaineeCaseProcessor()  # Create an instance of the Detainee processor

        result = processor.process_case_for_detainee(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", [])
        )

        response = {
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Pending"),
            "detailedAnalysis": result.get("detailedAnalysis", "No analysis available"),
            "keyPoints": result.get("keyPoints", {}),
            "additionalInfo": result.get("additionalInfo", {})
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)