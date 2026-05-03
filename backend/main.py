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
    
    CRITICAL INSTRUCTION: You MUST translate ALL user-facing text into {request.language}. If {request.language} is not English, the output arrays and descriptions MUST be in {request.language}.
    
    If the page content clearly belongs to a NON-FINANCIAL website (e.g. general search engine, wikipedia, non-ecommerce blog, general news, etc) and does NOT contain financial products, checkouts, or loans:
    Set 'status' to 'Neutral' and provide a brief summary stating "XPOSE is resting. No financial risks detected here." Return empty lists for risks, highlights, and violations, and null for costs.
    
    Otherwise, if it IS a financial site:
    Extract the key terms, hidden fees, risks, and dark patterns from the text.
    Return a JSON object containing:
    1. 'summary': A simple, 2-sentence summary in {request.language}.
    2. 'status': Either 'Safe', 'Attention', 'Risky', or 'Neutral' (Keep this exactly as English).
    3. 'risks': A list of strings detailing specific risks or hidden fees found. MUST be translated to {request.language}.
    4. 'true_cost': If any fees or prices are mentioned, calculate a true cost string. Otherwise, return null. (Translate text to {request.language}).
    5. 'violations': A list of objects representing ACTUAL dark patterns. Do NOT flag standard features (like "get policy instantly") or standard terms (like "I agree to terms") as violations. Each object: 'pattern_name' (Translate to {request.language}), 'severity' ('high', 'med', 'low'), 'description' (what is wrong, Translate to {request.language}), 'regulation' (Translate to {request.language}), and 'quote' (the EXACT English substring from the page that proves this).
    6. 'highlights': A list of EXACTLY 3 objects to highlight on the page. 
       - First, add objects for your violations. 'text' must be the exact English 'quote' from the violation, 'translated_text' is the {request.language} translation, and 'level' must be 'risky' (if high severity) or 'attention' (if med/low).
       - Then, fill the rest of the 3 items with 'safe' highlights. For safe highlights, use standard good terms (like "I agree to terms" or "Pay now") and set 'level' to 'safe'.
    7. 'est_cost_value': The estimated cost mentioned (e.g., '₹3,200', '₹378'). If none, return 'N/A'.
    8. 'est_cost_label': A concise label for the cost. MUST be translated to {request.language}.
    
    Only output the JSON object. Do not output markdown code blocks.
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
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
            model="llama-3.1-8b-instant",
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
