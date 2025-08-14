import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

from ml_backend.utils.JudgeCaseProcessor import JudgeCaseProcessor
from ml_backend.utils.LawyerCaseProcessor import LawyerCaseProcessor
from ml_backend.utils.DetaineeCaseProcessor import DetaineeCaseProcessor

app = Flask(__name__)

CORS(app, resources={
    r"/process_case*": {
        "origins": ["https://jurisdict-puri.onrender.com", "http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Optional: Handle OPTIONS for undefined routes. This dynamically echoes back the request origin.
@app.route('/<undefined_path>', methods=['OPTIONS'])
def handle_undefined_options(undefined_path):
    response = jsonify()
    origin = request.headers.get('Origin')
    allowed_origins = ["https://jurisdict-puri.onrender.com", "http://localhost:5173"]
    if origin in allowed_origins:
        response.headers.add("Access-Control-Allow-Origin", origin)
    else:
        response.headers.add("Access-Control-Allow-Origin", "https://jurisdict-puri.onrender.com")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response, 200

# Judge-specific case processing API
@app.route('/process_case_judge', methods=['POST', 'OPTIONS'])
def process_case_judge():
    if request.method == 'OPTIONS':
        return jsonify(), 200
        
    try:
        data = request.json
        processor = JudgeCaseProcessor()
        
        result = processor.process_new_case(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", []),
            past_criminal_records=data.get("pastOffenses", [])
        )

        return jsonify({
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Error"),
            "aiReport": result.get("report", "AI report unavailable."),
            "topCases": result.get("topCases", [])
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/process_case_lawyer', methods=['POST', 'OPTIONS'])
def process_case_lawyer():
    if request.method == 'OPTIONS':
        return jsonify(), 200
        
    try:
        data = request.json
        processor = LawyerCaseProcessor()
        
        result = processor.process_case_for_lawyer(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", [])
        )

        return jsonify({
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Error"),
            "detailedAnalysis": result.get("detailedAnalysis", "No analysis available"),
            "keyPoints": result.get("keyPoints", {}),
            "additionalInfo": result.get("additionalInfo", {})
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Detainee-specific case processing API
@app.route('/process_case_detainee', methods=['POST', 'OPTIONS'])
def process_case_detainee():
    if request.method == 'OPTIONS':
        return jsonify(), 200
        
    try:
        data = request.json
        processor = DetaineeCaseProcessor()

        result = processor.process_case_for_detainee(
            case_summary=data.get("caseSummary"),
            grounds_of_bail=data.get("groundsOfBail", [])
        )

        return jsonify({
            "caseId": data.get("caseId"),
            "decision": result.get("decision", "Pending"),
            "detailedAnalysis": result.get("detailedAnalysis", "No analysis available"),
            "keyPoints": result.get("keyPoints", {}),
            "additionalInfo": result.get("additionalInfo", {})
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Run the Flask app
if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
