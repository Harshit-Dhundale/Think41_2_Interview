import asyncio
import pandas as pd
import pathlib
import os
import dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from tqdm import tqdm

# ─── load .env ─────────────────────────────────────────────────────────────────────
dotenv.load_dotenv()

# ─── config ────────────────────────────────────────────────────────────────────────
ROOT      = pathlib.Path(__file__).parents[2]
DATA_DIR  = ROOT / "data"
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise RuntimeError("🛑 MONGO_URI (or MONGODB_URI) not set in .env")
DB_NAME   = os.getenv("MONGO_DB") or os.getenv("MONGODB_DB") or "ecom"
CHUNK     = 20_000        # for ~0.5 M rows in inventory_items

print(f"▶️  Targeting MongoDB at {MONGO_URI!r}, DB = {DB_NAME!r}")

async def load(table, client, chunk=None):
    coll  = client[DB_NAME][table]
    print(f"  • Loading `{table}`…", end=" ", flush=True)
    await coll.delete_many({})       # idempotent clear
    fn    = DATA_DIR / f"{table}.csv"
    if not chunk:
        df = pd.read_csv(fn)
        await coll.insert_many(df.to_dict("records"))
    else:
        for ch in tqdm(pd.read_csv(fn, chunksize=chunk), desc=table):
            await coll.insert_many(ch.to_dict("records"))
    print("done")

async def main():
    # ─── connect & verify ───────────────────────────────────────────────────────────
    client = AsyncIOMotorClient(MONGO_URI, uuidRepresentation="standard")
    try:
        await client.admin.command("ping")
        dbs = await client.list_database_names()
        print("✅ Connected to MongoDB. Databases:", dbs)
    except Exception as e:
        print("❌ Failed to connect to MongoDB:", e)
        return

    # ─── ingest all six CSVs ──────────────────────────────────────────────────────────
    tables = [
        "distribution_centers",
        "products",
        "orders",
        "order_items",
        "users",
        "inventory_items",
    ]
    for t in tables[:-1]:
        await load(t, client)
    await load("inventory_items", client, CHUNK)

    # ─── create indexes ─────────────────────────────────────────────────────────────
    db = client[DB_NAME]
    print("▶️  Creating indexes…")
    await db["order_items"].create_index([("product_id",1),("status",1)])
    await db["orders"].create_index("order_id", unique=True)
    await db["inventory_items"].create_index([("product_name",1),("sold_at",1)])
    print("✅ Indexes created")

    # ─── list collections in target DB ───────────────────────────────────────────────
    colls = await db.list_collection_names()
    print(f"📚 Collections in `{DB_NAME}`:", colls)

    print("🎉  All CSVs loaded and indexed!")

if __name__ == "__main__":
    asyncio.run(main())
