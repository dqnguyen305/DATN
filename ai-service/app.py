from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.rag_service import ask
from models.schemas import (
    ChatRequest,
    ChatResponse
)

app = FastAPI(
    title="BookStore AI Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post(
    "/chat",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    answer = ask(
        request.history,
        request.message
    )

    return ChatResponse(
        answer=answer
    )