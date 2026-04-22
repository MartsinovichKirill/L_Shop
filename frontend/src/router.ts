export type Route = "/" | "/auth" | "/basket" | "/delivery" | "/orders";

type Handler = () => Promise<void> | void;

const routes = new Map<Route, Handler>();

export function registerRoute(path: Route, handler: Handler): void {
  routes.set(path, handler);
}

export function navigate(path: Route): void {
  window.history.pushState({}, "", path);
  void renderRoute();
}

export async function renderRoute(): Promise<void> {
  const path = (window.location.pathname as Route) || "/";
  const handler = routes.get(path) ?? routes.get("/")!;
  await handler();
}

export function initRouter(): void {
  window.addEventListener("popstate", () => void renderRoute());

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    const a = t.closest("a[data-link]") as HTMLAnchorElement | null;
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute("href") as Route | null;
    if (href) navigate(href);
  });
}
