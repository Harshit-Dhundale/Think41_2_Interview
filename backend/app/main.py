from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .chat import router as chat_router
from .conversations_router import router as conv_router

app = FastAPI(title="E-Com Chatbot")
app.add_middleware(CORSMiddleware, allow_origins=["*"],allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(chat_router)
app.include_router(conv_router, prefix="/api")