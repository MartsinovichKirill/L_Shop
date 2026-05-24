import path from "node:path";
import { JsonStore } from "./jsonStore.js";
import type { Basket, Order, Product, Session, User } from "../types/domain.js";

export const dataDir = path.join(process.cwd(), "data");

export const usersStore = new JsonStore<User[]>(path.join(dataDir, "users.json"));
export const sessionsStore = new JsonStore<Session[]>(path.join(dataDir, "sessions.json"));
export const productsStore = new JsonStore<Product[]>(path.join(dataDir, "products.json"));
export const basketsStore = new JsonStore<Basket[]>(path.join(dataDir, "baskets.json"));
export const ordersStore = new JsonStore<Order[]>(path.join(dataDir, "orders.json"));

export async function initDataFiles(): Promise<void> {
  await usersStore.ensure([]);
  await sessionsStore.ensure([]);
  await basketsStore.ensure([]);
  await ordersStore.ensure([]);
  await productsStore.ensure([]);
}
