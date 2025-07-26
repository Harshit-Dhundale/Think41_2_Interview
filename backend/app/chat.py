from fastapi import APIRouter, Depends
from .schemas import ChatRequest, ChatResponse
from .db import get_db
from .conversations import new_convo, append
from .queries import answer_from_db
from .llm import ask_llm
from bson import ObjectId
from typing import Optional

router = APIRouter()

@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, db=Depends(get_db)):
    convo_id = req.conversation_id or await new_convo(req.user_id)
    await append(convo_id, "user", req.message)

    db_ans, clar = await answer_from_db(req.message)
    if clar:
        answer = clar
    elif db_ans:
        answer = db_ans
    else:
        answer = await ask_llm(req.message, convo_id, db_result=db_ans)

    await append(convo_id, "ai", answer)
    return ChatResponse(conversation_id=str(convo_id), answer=answer)
