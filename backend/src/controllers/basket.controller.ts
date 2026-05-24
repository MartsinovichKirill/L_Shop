import type { Request, Response } from "express";
import { basketsStore, productsStore, ordersStore } from "../storage/initData.js";
import { isRecord, mustInt, mustString, mustOneOf } from "../utils/validate.js";
import { AppError } from "../utils/errors.js";
import { newId, nowIso } from "../utils/ids.js";
import type { Basket, DeliveryForm, Order, OrderItemSnapshot, PaymentMethod } from "../types/domain.js";

async function getOrCreateBasket(userId: string): Promise<Basket> {
  const baskets = await basketsStore.read();
  const found = baskets.find((b) => b.userId === userId);
  if (found) return found;

  const created: Basket = { userId, items: [], updatedAt: nowIso() };
  baskets.push(created);
  await basketsStore.write(baskets);
  return created;
}

async function saveBasket(next: Basket): Promise<void> {
  const baskets = await basketsStore.read();
  const idx = baskets.findIndex((b) => b.userId === next.userId);
  if (idx >= 0) baskets[idx] = next;
  else baskets.push(next);
  await basketsStore.write(baskets);
}

export async function getBasket(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const basket = await getOrCreateBasket(userId);
  const products = await productsStore.read();

  const items = basket.items
    .map((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!p) return undefined;
      return {
        product: p,
        qty: it.qty,
        lineTotal: p.price * it.qty
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== undefined);

  const total = items.reduce((s, x) => s + x.lineTotal, 0);

  res.json({ items, total });
}

export async function addToBasket(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!isRecord(req.body)) throw new AppError("Invalid body");

  const productId = mustString(req.body.productId, "productId");
  const qty = mustInt(req.body.qty, "qty", 1, 99);

  const products = await productsStore.read();
  const product = products.find((p) => p.id === productId);
  if (!product) throw new AppError("Product not found", 404);
  if (!product.available) throw new AppError("Product is not available");

  const basket = await getOrCreateBasket(userId);
  const existing = basket.items.find((x) => x.productId === productId);
  if (existing) existing.qty = Math.min(99, existing.qty + qty);
  else basket.items.push({ productId, qty });

  basket.updatedAt = nowIso();
  await saveBasket(basket);

  res.json({ ok: true });
}

export async function updateQty(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!isRecord(req.body)) throw new AppError("Invalid body");

  const productId = mustString(req.body.productId, "productId");
  const qty = mustInt(req.body.qty, "qty", 0, 99);

  const basket = await getOrCreateBasket(userId);
  const idx = basket.items.findIndex((x) => x.productId === productId);
  if (idx < 0) throw new AppError("Item not in basket");

  if (qty === 0) basket.items.splice(idx, 1);
  else basket.items[idx] = { productId, qty };

  basket.updatedAt = nowIso();
  await saveBasket(basket);

  res.json({ ok: true });
}

export async function removeItem(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!isRecord(req.body)) throw new AppError("Invalid body");

  const productId = mustString(req.body.productId, "productId");
  const basket = await getOrCreateBasket(userId);

  basket.items = basket.items.filter((x) => x.productId !== productId);
  basket.updatedAt = nowIso();
  await saveBasket(basket);

  res.json({ ok: true });
}

export async function checkout(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!isRecord(req.body)) throw new AppError("Invalid body");

  const delivery: DeliveryForm = {
    address: mustString(req.body.address, "address"),
    phone: mustString(req.body.phone, "phone"),
    email: mustString(req.body.email, "email"),
    paymentMethod: mustOneOf<PaymentMethod>(req.body.paymentMethod, "paymentMethod", ["card", "cash"] as const)
  };

  const basket = await getOrCreateBasket(userId);
  if (basket.items.length === 0) throw new AppError("Basket is empty");

  const products = await productsStore.read();

  const snapshot: OrderItemSnapshot[] = basket.items.map((it) => {
    const p = products.find((x) => x.id === it.productId);
    if (!p) throw new AppError("Product not found in catalog", 404);
    return { productId: p.id, title: p.title, price: p.price, qty: it.qty };
  });

  const order: Order = {
    id: newId(),
    userId,
    items: snapshot,
    delivery,
    createdAt: nowIso()
  };

  const orders = await ordersStore.read();
  orders.push(order);
  await ordersStore.write(orders);

  basket.items = [];
  basket.updatedAt = nowIso();
  await saveBasket(basket);

  res.status(201).json({ order });
}
