import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Vaayu Backend", description="The Intelligence Layer for Vaayu Extension")

class ExplainRequest(BaseModel):
    url: str
    content: str
    language: str = "en"

@app.get("/")
def read_root():
    return {"message": "Vaayu Backend is running. The Guardian is awake."}

@app.post("/api/explain")
def explain_page(request: ExplainRequest):
    # TODO: Integrate Groq API call here
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set.")
    
    return {
        "status": "success",
        "message": f"Explanation for {request.url} in {request.language} will go here.",
        "summary": "This is a mock summary.",
        "risks": []
    }
