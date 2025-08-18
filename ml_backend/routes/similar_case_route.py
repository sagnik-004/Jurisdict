from flask import Blueprint, request
from controllers.similarcasefetcher_controller import similarCaseFetcher

similar_case_bp = Blueprint('similar_case_bp', __name__)

@similar_case_bp.route('/', methods=['POST'], strict_slashes=False)
def process_case_judge_route():
    return similarCaseFetcher(request)