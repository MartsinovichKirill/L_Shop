import type { Request, Response } from "express";
import { productsStore } from "../storage/initData.js";
import { qBool, qString, qStringArray } from "../utils/query.js";
import type { Category, Product } from "../types/domain.js";

function isCategory(v: string): v is Category {
  return v === "boardgames" || v === "cards" || v === "accessories" || v === "merch";
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  const all = await productsStore.read();

  const search = qString(req.query.search);
  const sort = qString(req.query.sort); // price_asc | price_desc
  const available = qBool(req.query.available);
  const categoryRaw = qStringArray(req.query.category);

  let items: Product[] = all.slice();

  if (search) {
    const s = search.toLowerCase();
    items = items.filter(
      (p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
    );
  }

  if (typeof available === "boolean") {
    items = items.filter((p) => p.available === available);
  }

  if (categoryRaw && categoryRaw.length) {
    const cats = categoryRaw.filter(isCategory);
    if (cats.length) items = items.filter((p) => cats.includes(p.category));
  }

  if (sort === "price_asc") {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    items.sort((a, b) => b.price - a.price);
  }

  res.json({ items });
}
