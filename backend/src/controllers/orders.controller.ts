import type { Request, Response } from "express";
import { ordersStore } from "../storage/initData.js";
import { qInt } from "../utils/query.js";

export async function listOrders(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const limit = qInt(req.query.limit, 1, 100) ?? 20;
  const offset = qInt(req.query.offset, 0, Number.MAX_SAFE_INTEGER) ?? 0;

  const orders = await ordersStore.read();
  const userOrders = orders.filter((o) => o.userId === userId).reverse();
  const total = userOrders.length;
  const items = userOrders.slice(offset, offset + limit);

  res.json({ items, total, limit, offset });
}
