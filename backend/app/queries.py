from bson.regex import Regex
from .db import db

async def answer_from_db(msg: str):
    m = msg.lower()

    # 1. Top 5 sold products
    if "top" in m and "sold" in m:
        pipeline = [
            # sold_at != null means item sold
            {"$match": {"sold_at": {"$ne": None}}},
            # group by product_name for human‐readable labels
            {"$group": {"_id": "$product_name", "sold_count": {"$sum": 1}}},
            {"$sort": {"sold_count": -1}},
            {"$limit": 5}
        ]
        rows = await db["inventory_items"].aggregate(pipeline).to_list(5)
        ans = "\n".join(f"{r['_id']} – {r['sold_count']} units" for r in rows)
        return ans, None

    # 2. Order status
    if "status of order" in m:
        import re
        num = re.findall(r"\d+", m)
        if not num:
            return None, "Could you provide the order number?"
        oid = int(num[0])
        order = await db["orders"].find_one({"order_id":oid},
                 {"_id":0,"status":1,"shipped_at":1,"delivered_at":1})
        if not order:
            return None, f"Order {oid} not found."
        ans = (f"Order {oid} is **{order['status']}**.\n"
               f"Shipped: {order.get('shipped_at')}, Delivered: {order.get('delivered_at')}")
        return ans, None

    # 3. Stock left
    if "left in stock" in m:
        name = m.split("how many")[1].split("left")[0].strip()
        qty = await db["inventory_items"].count_documents({
            "sold_at": None,
            "product_name": Regex(f"^{name}$", "i")
        })
        ans = f"There are {qty} units of '{name}' left."
        return ans, None

    # otherwise let LLM decide
    return "", None
