import os
import json
import random
import re
import requests
from typing import Dict, Any

def fallback_evaluation(startup_name: str, tagline: str, description: str) -> Dict[str, Any]:
    """
    Fallback deterministic smart evaluator when Gemini API key is missing or unavailable.
    Generates realistic, positive startup feedback (65-95 score range).
    """
    text_length = len(description) + len(tagline) + len(startup_name)
    has_tech_keywords = any(kw in (description + tagline).lower() for kw in ['ai', 'platform', 'app', 'mobile', 'saas', 'automation', 'eco', 'health', 'smart', 'cloud'])

    # Calculate dimensional scores
    base = 70 + (hash(startup_name + tagline) % 15)

    problem_clarity = min(98, max(68, base + (5 if len(description) > 60 else -5)))
    originality = min(96, max(65, base + (8 if has_tech_keywords else 2)))
    market_potential = min(97, max(70, base + (hash(description) % 10)))
    feasibility = min(95, max(66, base + (6 if len(tagline) > 15 else -3)))

    overall_score = round((problem_clarity * 0.25) + (originality * 0.25) + (market_potential * 0.25) + (feasibility * 0.25))

    strengths = [
        f"Clear core value proposition around '{tagline[:40]}...'",
        "Addresses a recognizable customer pain point with scalability",
        "High potential for early adopter adoption in target market"
    ]

    weaknesses = [
        "Customer acquisition strategy requires further market validation",
        "Competitive landscape will demand strong differentiation"
    ]

    feedback = (
        f"'{startup_name}' shows impressive potential! The concept addresses a clear operational or consumer "
        f"need. Focusing initial execution on validating the core tagline ('{tagline}') with early users will "
        "provide crucial insights for scaling."
    )

    return {
        "score": overall_score,
        "marketPotential": market_potential,
        "originality": originality,
        "problemClarity": problem_clarity,
        "feasibility": feasibility,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "feedback": feedback
    }


def evaluate_startup_idea(startup_name: str, tagline: str, description: str) -> Dict[str, Any]:
    """
    Evaluates a startup idea using Google Gemini 2.5 Flash API with JSON response format.
    Falls back gracefully if key is missing or API call fails.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key or api_key == "your_gemini_api_key_here":
        print("[AI Service] No valid GEMINI_API_KEY found in environment. Using smart fallback evaluator.")
        return fallback_evaluation(startup_name, tagline, description)

    system_instruction = (
        "You are an expert startup incubator evaluator. Evaluate the user's startup idea. "
        "You MUST respond ONLY with valid, raw JSON matching this exact structure, with no markdown formatting or backticks:\n"
        "{\n"
        '  "score": integer (0-100),\n'
        '  "marketPotential": integer (0-100),\n'
        '  "originality": integer (0-100),\n'
        '  "problemClarity": integer (0-100),\n'
        '  "feasibility": integer (0-100),\n'
        '  "strengths": [string, string],\n'
        '  "weaknesses": [string, string],\n'
        '  "feedback": "detailed paragraph encouraging feedback"\n'
        "}\n"
        "Ensure ratings are constructive and realistic (generally between 60 and 98)."
    )

    prompt = f"Startup Name: {startup_name}\nTagline: {tagline}\nDescription: {description}"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_instruction + "\n\n" + prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.7
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=12)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get("candidates", [])
            if candidates:
                content_part = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")

                # Clean up any potential markdown formatting in text
                cleaned_text = re.sub(r"^```json\s*", "", content_part.strip(), flags=re.IGNORECASE)
                cleaned_text = re.sub(r"```$", "", cleaned_text.strip())

                result = json.loads(cleaned_text)

                # Validate required fields
                required_keys = ["score", "marketPotential", "originality", "problemClarity", "feasibility", "strengths", "weaknesses", "feedback"]
                if all(k in result for k in required_keys):
                    print(f"[AI Service] Successfully evaluated '{startup_name}' using Gemini 2.5 Flash (Score: {result['score']})")
                    return result

        print(f"[AI Service] Gemini API returned status {response.status_code} or unexpected response: {response.text[:200]}")
    except Exception as e:
        print(f"[AI Service] Exception during Gemini API call: {e}")

    # If primary gemini-2.5-flash fails, try fallback gemini-1.5-flash
    try:
        fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        response = requests.post(fallback_url, json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get("candidates", [])
            if candidates:
                content_part = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                cleaned_text = re.sub(r"^```json\s*", "", content_part.strip(), flags=re.IGNORECASE)
                cleaned_text = re.sub(r"```$", "", cleaned_text.strip())
                result = json.loads(cleaned_text)
                print(f"[AI Service] Successfully evaluated '{startup_name}' using Gemini 1.5 Flash (Score: {result['score']})")
                return result
    except Exception as e:
        print(f"[AI Service] Exception during fallback Gemini call: {e}")

    print("[AI Service] Falling back to smart offline evaluator.")
    return fallback_evaluation(startup_name, tagline, description)
