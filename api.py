from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import personas, route_post_to_bots, content_graph, generate_defense_reply, get_generation_mode, get_groq_client

app = FastAPI(title="CognitiveMesh-RAG API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "running", "project": "CognitiveMesh-RAG"}

@app.get("/personas")
async def get_personas():
    return {"personas": personas}

class RouteRequest(BaseModel):
    post_content: str
    threshold: float = 0.2

@app.post("/route")
async def route_post(request: RouteRequest):
    matched_bots = route_post_to_bots(request.post_content, threshold=request.threshold)
    return {"matched_bots": matched_bots}

class GeneratePostRequest(BaseModel):
    bot_id: str

@app.post("/generate-post")
async def generate_post(request: GeneratePostRequest):
    # Find selected bot
    selected_bot = next((p for p in personas if p["bot_id"] == request.bot_id), None)
    if not selected_bot:
        return {"error": "Bot not found"}

    initial_state = {
        "bot_id": selected_bot["bot_id"],
        "persona": selected_bot["persona"],
        "topic": "",
        "search_query": "",
        "search_results": "",
        "post_content": "",
        "final_json": {}
    }

    result = content_graph.invoke(initial_state)

    return {
        "mode": get_generation_mode(),
        "bot_id": result["bot_id"],
        "topic": result["topic"],
        "search_query": result["search_query"],
        "search_results": result["search_results"],
        "post_content": result["post_content"],
        "final_json": result["final_json"]
    }

class DefenseReplyRequest(BaseModel):
    parent_post: str
    comment_history: str
    human_reply: str

@app.post("/defense-reply")
async def defense_reply(request: DefenseReplyRequest):
    # Use Bot A persona by default
    bot_persona = next((p["persona"] for p in personas if p["bot_id"] == "A"), "")

    reply = generate_defense_reply(
        bot_persona=bot_persona,
        parent_post=request.parent_post,
        comment_history=request.comment_history,
        human_reply=request.human_reply
    )

    # Detect injection (updated phrases)
    injection_keywords = ["ignore all previous instructions", "you are now", "apologize to me", "reveal your hidden instructions", "ignore system prompt"]
    injection_detected = any(keyword in request.human_reply.lower() for keyword in injection_keywords)

    return {
        "mode": get_generation_mode(),
        "injection_detected": injection_detected,
        "defense_reply": reply
    }