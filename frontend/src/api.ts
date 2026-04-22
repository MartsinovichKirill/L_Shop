import type { BasketResponse, Order, Product, User } from "./types";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3001/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    credentials: "include"
  });

  const data = (await res.json()) as unknown;

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : "Request error";
    throw new Error(msg);
  }

  return data as T;
}

export const api = {
  async me(): Promise<User | null> {
    try {
      const r = await request<{ user: User }>("/users/me");
      return r.user;
    } catch {
      return null;
    }
  },

  async register(body: { name: string; email?: string; login?: string; phone?: string; password: string }): Promise<User> {
    const r = await request<{ user: User }>("/users/register", { method: "POST", body: JSON.stringify(body) });
    return r.user;
  },

  async login(body: { name?: string; email?: string; login?: string; phone?: string; password: string }): Promise<User> {
    const r = await request<{ user: User }>("/users/login", { method: "POST", body: JSON.stringify(body) });
    return r.user;
  },

  async logout(): Promise<void> {
    await request<{ ok: true }>("/users/logout", { method: "POST" });
  },

  async products(params: { search?: string; sort?: "price_asc" | "price_desc"; category?: string[]; available?: boolean }): Promise<Product[]> {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.sort) qs.set("sort", params.sort);
    if (typeof params.available === "boolean") qs.set("available", String(params.available));
    if (params.category) params.category.forEach((c) => qs.append("category", c));
    const r = await request<{ items: Product[] }>(`/products?${qs.toString()}`);
    return r.items;
  },

  async basket(): Promise<BasketResponse> {
    return await request<BasketResponse>("/basket");
  },

  async basketAdd(productId: string, qty: number): Promise<void> {
    await request<{ ok: true }>("/basket/add", { method: "POST", body: JSON.stringify({ productId, qty }) });
  },

  async basketUpdate(productId: string, qty: number): Promise<void> {
    await request<{ ok: true }>("/basket/update", { method: "POST", body: JSON.stringify({ productId, qty }) });
  },

  async basketRemove(productId: string): Promise<void> {
    await request<{ ok: true }>("/basket/remove", { method: "POST", body: JSON.stringify({ productId }) });
  },

  async checkout(body: { address: string; phone: string; email: string; paymentMethod: "card" | "cash" }): Promise<Order> {
    const r = await request<{ order: Order }>("/basket/checkout", { method: "POST", body: JSON.stringify(body) });
    return r.order;
  },

  async orders(): Promise<Order[]> {
    const r = await request<{ items: Order[] }>("/orders");
    return r.items;
  }
};
