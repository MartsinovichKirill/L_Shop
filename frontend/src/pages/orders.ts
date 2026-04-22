import { api } from "../api";
import { renderLayout } from "../layout";
import { setMessage, state } from "../state";
import type { Order } from "../types";

export async function renderOrders(): Promise<void> {
  if (!state.user) {
    renderLayout(`<section class="panel"><h1>Мои заказы</h1><p class="muted">Нужно войти.</p></section>`);
    return;
  }

  try {
    const orders = await api.orders();

    renderLayout(`
      <section class="panel">
        <h1>Мои заказы</h1>
        ${orders.length === 0
          ? `<p class="muted">Заказов пока нет. <a data-link href="/" class="link">Перейти в каталог →</a></p>`
          : `<div class="order-list">${orders.map(orderCard).join("")}</div>`
        }
      </section>
    `);
  } catch (err) {
    setMessage(err instanceof Error ? err.message : "Ошибка загрузки заказов", "error");
    renderLayout(`<section class="panel"><h1>Мои заказы</h1><p class="muted">Не удалось загрузить заказы.</p></section>`);
  }
}

function orderCard(order: Order): string {
  const total = order.items.reduce((s, x) => s + x.price * x.qty, 0);
  const date = new Date(order.createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const payment = order.delivery.paymentMethod === "card" ? "Карта" : "Наличные";

  return `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">Заказ <b>#${escapeHtml(order.id.slice(0, 8))}</b></span>
        <span class="muted small">${date}</span>
        <span class="order-total">${total.toFixed(2)} €</span>
      </div>

      <div class="order-items">
        ${order.items.map((item) => `
          <div class="order-item">
            <span class="grow">${escapeHtml(item.title)}</span>
            <span class="muted">${item.qty} × ${item.price.toFixed(2)} €</span>
            <span class="order-line-total">${(item.qty * item.price).toFixed(2)} €</span>
          </div>
        `).join("")}
      </div>

      <div class="order-footer muted small">
        <span>📍 ${escapeHtml(order.delivery.address)}</span>
        <span>📞 ${escapeHtml(order.delivery.phone)}</span>
        <span>✉️ ${escapeHtml(order.delivery.email)}</span>
        <span>💳 ${payment}</span>
      </div>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
