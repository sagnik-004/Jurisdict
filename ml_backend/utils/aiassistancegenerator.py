import os
import google.generativeai as genai

def generate_ai_assistance(bail_decision_data, entity):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: GEMINI_API_KEY not found in environment variables."

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
    except Exception as e:
        return f"Error configuring AI model: {str(e)}"

    decision = bail_decision_data.get('decision', 'N/A')
    reasoning = bail_decision_data.get('reasoning', {})
    red_flags = reasoning.get('red_flags', [])
    green_flags = reasoning.get('green_flags', [])
    prompt = ""

    if entity == 'judge':
        adverse_factors = "\n- ".join(red_flags) if red_flags else "None"
        favorable_factors = "\n- ".join(green_flags) if green_flags else "None"
        prompt = (
            "You are a neutral judicial AI assistant. Your task is to provide a detailed, precise, and reason-backed summary of a bail assessment for a judge. "
            "Base your analysis strictly on the information provided below. Do not invent facts or speculate. "
            "Structure your response logically, starting with the overall recommendation and then detailing the factors for and against bail.\n\n"
            f"**Bail Assessment Outcome:** {decision}\n\n"
            f"**Factors Weighing Against Bail:**\n- {adverse_factors}\n\n"
            f"**Factors Weighing in Favour of Bail:**\n- {favorable_factors}\n\n"
            "**Detailed Judicial Summary:**"
        )
    else:
        vague_summary = "a complex matter with multiple factors under consideration."
        if decision == "Grant Bail":
            vague_summary = "leaning favorably, though subject to judicial review."
        elif decision == "Deny Bail":
            vague_summary = "presenting significant challenges."
        
        if entity == 'lawyer':
            prompt = (
                "Generate a brief, high-level professional summary for a lawyer. "
                f"The preliminary computational analysis indicates the bail outlook is '{decision}'. "
                f"The case is considered {vague_summary} This is a computational tool and not a substitute for legal strategy."
            )
        else:
            prompt = (
                "Generate a simple and brief message for a detainee. "
                f"A preliminary analysis of the case details has been completed. The initial assessment is that the situation is {vague_summary}. "
                "Please understand this is not a final judicial decision."
            )

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An unexpected error occurred while communicating with the AI service: {str(e)}"