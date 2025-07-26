from datetime import datetime
from bson import ObjectId
from .db import db

convos = db["conversations"]

async def new_convo(user_id: str | None):
    res = await convos.insert_one(
        {"user_id": user_id, "created_at": datetime.utcnow(), "messages":[]}
    )
    return str(res.inserted_id)

async def append(convo_id: str, role: str, content: str):
    await convos.update_one(
        {"_id": ObjectId(convo_id)},
        {"$push": {"messages": {
            "role": role, "content": content, "ts": datetime.utcnow()
        }}}
    )
async def get_recent_messages(convo_id: str, limit: int = 5):
    convo = await convos.find_one({"_id": ObjectId(convo_id)}, {"messages": 1})
    if not convo or "messages" not in convo:
        return []
    return convo["messages"][-limit:]
