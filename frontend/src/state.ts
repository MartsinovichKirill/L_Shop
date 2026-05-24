import type { User } from "./types";

type Listener = () => void;

const listeners = new Set<Listener>();

export const state: {
  user: User | null;
  basketCount: number;
  message: string | null;
  messageType: "success" | "error";
} = {
  user: null,
  basketCount: 0,
  message: null,
  messageType: "success"
};

export function setUser(user: User | null): void {
  state.user = user;
  emit();
}

export function setBasketCount(n: number): void {
  state.basketCount = n;
  emit();
}

export function setMessage(msg: string | null, type: "success" | "error" = "success"): void {
  state.message = msg;
  state.messageType = type;
  emit();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(): void {
  listeners.forEach((fn) => fn());
}
