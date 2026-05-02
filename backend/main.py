import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI(title="XPOSE Backend", description="The Intelligence Layer for XPOSE Extension")

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
    language: str = "English"

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    url: str
    content: str  # original page content for context
    history: List[ChatMessage] = []
    question: str
    language: str = "English"

@app.get("/")
def read_root():
    return {"message": "XPOSE Backend is running. The Guardian is awake."}

@app.post("/api/explain")
def explain_page(request: ExplainRequest):
    if not client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set.")
    
    system_prompt = f"""
    You are XPOSE, an AI financial guardian designed to protect users from financial 'Dark Patterns'.
    You are analyzing the text from: {request.url}
    
    Extract the key terms, hidden fees, and risks from the text.
    Return a JSON object containing:
    1. 'summary': A simple, 2-sentence summary translated into {request.language}.
    2. 'status': Either 'Safe', 'Attention', or 'Risky'.
    3. 'risks': A list of strings detailing specific risks or hidden fees found (translate to {request.language}).
    4. 'true_cost': If any fees or prices are mentioned, calculate a true cost string. Otherwise, return null.
    5. 'highlights': A list of objects with 'text' (a short phrase from the page) and 'level' ('safe', 'attention', or 'risky') for the top 3 most important clauses.
    
    Only output the JSON object. Do not output markdown code blocks.
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the page content:\n{request.content[:5000]}"}
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


@app.post("/api/chat")
def chat_with_page(request: ChatRequest):
    """
    Conversational Q&A grounded in the page content.
    Accepts a conversation history and a new user question.
    Returns the assistant's answer in the chosen language.
    """
    if not client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set.")

    system_prompt = f"""
    You are XPOSE, an expert financial guardian AI. You have already analyzed a financial webpage.
    
    Page URL: {request.url}
    
    Original page content (first 4000 chars):
    ---
    {request.content[:4000]}
    ---
    
    The user is asking follow-up questions about this page. Answer ONLY based on what is in the page content.
    If the answer cannot be found in the page content, say so honestly.
    Keep your answers concise, clear, and in {request.language}.
    Do NOT use markdown formatting in your response — plain text only.
    Always be protective and warn the user of any risk implied by their question.
    """

    # Build messages: system + history + new question
    messages = [{"role": "system", "content": system_prompt}]
    for msg in request.history[-10:]:  # keep last 10 messages for context
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": request.question})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.4,
            max_tokens=512
        )
        
        answer = response.choices[0].message.content.strip()
        return {
            "status": "success",
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API Error: {str(e)}")
