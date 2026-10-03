import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from services.gemini import evaluate_startup_idea

load_dotenv()

app = FastAPI(
    title="Startup Idea Evaluator API",
    description="FastAPI service connecting React Native mobile app with Google Gemini 2.5 Flash for startup idea analysis.",
    version="1.0.0"
)

# Enable CORS for Mobile App requests (Expo local dev + device/emulator)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    startupName: str = Field(..., min_length=2, max_length=100, description="The name of the startup")
    tagline: str = Field(..., min_length=5, max_length=200, description="A short tagline or elevator pitch")
    description: str = Field(..., min_length=15, max_length=2000, description="Detailed problem & solution description")

class EvaluationResponse(BaseModel):
    score: int
    marketPotential: int
    originality: int
    problemClarity: int
    feasibility: int
    strengths: list[str]
    weaknesses: list[str]
    feedback: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "Startup Idea Evaluator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))}

@app.post("/api/evaluate", response_model=EvaluationResponse, status_code=status.HTTP_200_OK)
def evaluate_idea(payload: IdeaRequest):
    try:
        result = evaluate_startup_idea(
            startup_name=payload.startupName,
            tagline=payload.tagline,
            description=payload.description
        )
        return result
    except Exception as e:
        print(f"[API Error] Error evaluating idea: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate startup idea. Please try again later."
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting Startup Idea Evaluator API server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
