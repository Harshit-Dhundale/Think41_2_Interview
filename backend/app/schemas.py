from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    user_id: Optional[str] = Field(None, description="Anonymous if null")
    conversation_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
