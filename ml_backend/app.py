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

from ml_backend.utils.CaseProcessor import CaseProcessor

app = Flask(__name__)
CORS(app)

@app.route('/process_case', methods=['POST'])
def process_case():
    try:
        data = request.json
        processor = CaseProcessor()
        
        result = processor.process_new_case(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", []),
            past_criminal_records=data.get("pastOffenses", [])
        )

        # Extract top 5 matched case details
        top_cases_details = [
            {
                "caseId": case.get("caseId", "Unknown"),
                "title": case.get("title", "No Title"),
                "bailStatus": case.get("bailStatus", "Unknown"),
                "caseSummary": case.get("caseSummary", "No Summary"),
                "groundsOfBail": case.get("groundsOfBail", [])
            }
            for case in result.get("topCases", [])
        ]

        response = {
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Error"),
            "aiReport": result.get("report", "AI report unavailable."),
            "topCases": top_cases_details
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)