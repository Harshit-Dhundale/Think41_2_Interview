import os
import dotenv
from groq import Groq
from .conversations import get_recent_messages
from typing import Optional, Any

dotenv.load_dotenv(".env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are a customer support assistant for an e-commerce clothing site.
Use the DB_RESULT if available to answer precisely. If DB_RESULT is empty, answer conversationally."""

async def ask_llm(
    user_message: str,
    conversation_id: str,
    db_result: Optional[str] = None
) -> str:
    history = await get_recent_messages(conversation_id, limit=5)

    # Start with system prompt
    messages: list[dict[str, Any]] = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    # Include any DB_RESULT
    if db_result:
        messages.append({
            "role": "system",
            "content": f"DB_RESULT:\n{db_result}"
        })

    # Replay recent history, mapping our internal 'ai' → 'assistant'
    for msg in history:
        role = msg["role"]
        if role == "ai":
            role = "assistant"
        # 'user' and 'system' are already valid
        messages.append({"role": role, "content": msg["content"]})

    # Finally append the new user message
    messages.append({"role": "user", "content": user_message})

    # Send to LLM
    response = client.chat.completions.create(
        model="compound-beta",
        messages=messages  # type: ignore[arg-type]
    )

    raw: Optional[str] = response.choices[0].message.content
    return raw.strip() if isinstance(raw, str) else ""
