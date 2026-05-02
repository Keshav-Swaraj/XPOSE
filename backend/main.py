import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI(title="Vaayu Backend", description="The Intelligence Layer for Vaayu Extension")

# Add CORS to allow the extension to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq Client
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

class ExplainRequest(BaseModel):
    url: str
    content: str
    language: str = "en"

@app.get("/")
def read_root():
    return {"message": "Vaayu Backend is running. The Guardian is awake."}

@app.post("/api/explain")
def explain_page(request: ExplainRequest):
    if not client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set.")
    
    # Define the system prompt for Vaayu
    system_prompt = f"""
    You are Vaayu, an AI designed to protect users from financial 'Dark Patterns'.
    You are analyzing the text from: {request.url}
    
    Extract the key terms, hidden fees, and risks from the text.
    Return a JSON object containing:
    1. 'summary': A simple, 2-sentence summary translated into '{request.language}'.
    2. 'status': Either 'Safe', 'Attention', or 'Risky'.
    3. 'risks': A list of strings detailing specific risks or hidden fees found.
    4. 'true_cost': If any fees or prices are mentioned, try to calculate a true cost. Otherwise, return null.
    
    Only output the JSON object. Do not output markdown code blocks.
    """
    
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the page content:\n{request.content[:4000]}"} # truncate for safety
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1024
        )
        
        result_json = json.loads(response.choices[0].message.content)
        return {
            "status": "success",
            "data": result_json
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API Error: {str(e)}")
