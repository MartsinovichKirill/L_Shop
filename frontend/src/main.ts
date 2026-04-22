import "./style.css";
import { initRouter, registerRoute, renderRoute } from "./router";
import { renderHome } from "./pages/home";
import { renderAuth } from "./pages/auth";
import { renderBasket } from "./pages/basket";
import { renderDelivery } from "./pages/delivery";
import { api } from "./api";
import { setUser, subscribe } from "./state";

initRouter();

registerRoute("/", async () => {
  await renderHome();
});
registerRoute("/auth", () => {
  renderAuth();
});
registerRoute("/basket", async () => {
  await renderBasket();
});
registerRoute("/delivery", () => {
  renderDelivery();
});

subscribe(() => {
  // состояние хранится глобально; страницы перерисовываются по роутам/действиям
});

async function bootstrap(): Promise<void> {
  const user = await api.me();
  setUser(user);
  await renderRoute();
}

bootstrap().catch((e) => console.error(e));
