import { state } from "./state";
import { navigate } from "./router";
import { api } from "./api";
import { setMessage, setUser } from "./state";

export function renderLayout(contentHtml: string): void {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  const userPart = state.user
    ? `<span class="muted">Привет, <b>${escapeHtml(state.user.name)}</b></span>
       <button id="logoutBtn" class="btn">Выйти</button>`
    : `<a data-link href="/auth" class="btn">Войти / Регистрация</a>`;

  const msg = state.message
    ? `<div class="toast ${state.messageType === "error" ? "error" : ""}">${escapeHtml(state.message)}</div>`
    : "";

  app.innerHTML = `
    <div class="wrap">
      <header class="header">
        <a data-link href="/" class="logo">L_Shop</a>
        <nav class="nav">
          <a data-link href="/" class="link">Товары</a>
          <a data-link href="/basket" class="link">Корзина <span class="badge">${state.basketCount}</span></a>
        </nav>
        <div class="userbox">${userPart}</div>
      </header>

      ${msg}
      <main class="main">${contentHtml}</main>
      <footer class="footer muted">L_Shop — настольные игры и аксессуары</footer>
    </div>
  `;

  const logoutBtn = document.querySelector<HTMLButtonElement>("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await api.logout();
      setUser(null);
      setMessage("Вы вышли из аккаунта");
      navigate("/");
    });
  }
}

function escapeHtml(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
