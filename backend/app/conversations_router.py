from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from bson import ObjectId
from .db import get_db

router = APIRouter()

@router.get("/healthz")
async def healthz():
    return {"status": "ok"}

@router.get("/conversations")
async def list_conversations(
    user_id: Optional[str] = None,
    db=Depends(get_db)
):
    query = {}
    if user_id:
        query["user_id"] = user_id
    docs = await db["conversations"].find(query, {"messages": 0}).to_list(100)
    return [
        {
            "conversation_id": str(doc["_id"]),
            "user_id": doc.get("user_id"),
            "created_at": doc["created_at"]
        }
        for doc in docs
    ]

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, db=Depends(get_db)):
    doc = await db["conversations"].find_one({"_id": ObjectId(conversation_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {
        "conversation_id": conversation_id,
        "user_id": doc.get("user_id"),
        "messages": doc["messages"]
    }
