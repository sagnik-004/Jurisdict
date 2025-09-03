import os
import requests
import json

def generate_ai_assistance(bail_decision_data, entity):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: GEMINI_API_KEY not found in environment variables."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    
    headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': api_key
    }

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

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
        response.raise_for_status()
        result = response.json()
        
        return result['candidates'][0]['content']['parts'][0]['text']
    
    except requests.exceptions.RequestException as e:
        return f"Error communicating with AI service: {str(e)}"
    except (KeyError, IndexError) as e:
        return f"Error parsing AI service response: {str(e)}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"