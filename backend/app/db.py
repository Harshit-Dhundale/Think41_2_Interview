# backend/app/db.py
import os, dotenv, motor.motor_asyncio

dotenv.load_dotenv(".env")

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise RuntimeError("Please set MONGO_URI or MONGODB_URI in .env")

MONGO_DB = os.getenv("MONGO_DB") or os.getenv("MONGODB_DB") or "ecom"
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI, uuidRepresentation="standard"
)
db = client[MONGO_DB]

async def get_db():
    yield db
