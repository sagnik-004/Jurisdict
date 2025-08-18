from flask import jsonify
from utils.similarcasefetcher import find_similar_cases
from utils.baildecider import decide_bail
from utils.aiassistancegenerator import generate_ai_assistance
import traceback

def similarCaseFetcher(request):
    try:
        case_data = request.get_json()
        if not case_data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        entity = case_data.get('entity')
        case_points = case_data.get('casePoints', {})

        similar_cases_data = find_similar_cases(case_data)
        bail_decision_data = decide_bail(case_points)
        ai_assistance_text = generate_ai_assistance(bail_decision_data, entity)

        response_data = {
            "similarCases": similar_cases_data,
            "bailDecision": bail_decision_data,
            "aiAssistance": ai_assistance_text
        }

        return jsonify(response_data), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred", "details": str(e)}), 500