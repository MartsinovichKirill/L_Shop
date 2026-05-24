import { api } from "../api";
import { renderLayout } from "../layout";
import { setBasketCount, setMessage, state } from "../state";
import { navigate } from "../router";

export async function renderBasket(): Promise<void> {
  if (!state.user) {
    renderLayout(`<section class="panel"><h1>Корзина</h1><p>Нужно войти.</p></section>`);
    return;
  }

  const b = await api.basket();
  setBasketCount(b.items.reduce((s, x) => s + x.qty, 0));

  const html = `
    <section class="panel">
      <h1>Корзина</h1>

      ${b.items.length === 0 ? `<p class="muted">Корзина пустая</p>` : ""}

      <div class="list">
        ${b.items
          .map(
            (x) => `
            <div class="line">
              <div class="grow">
                <div class="t" data-title="basket">${escapeHtml(x.product.title)}</div>
                <div class="muted small">${escapeHtml(x.product.description)}</div>
              </div>

              <div class="price" data-price="basket">${x.product.price.toFixed(2)} €</div>

              <div class="row">
                <button class="btn" data-dec="${x.product.id}">-</button>
                <span class="qtyLabel">${x.qty}</span>
                <button class="btn" data-inc="${x.product.id}">+</button>
              </div>

              <button class="btn danger" data-remove="${x.product.id}">Удалить</button>
            </div>`
          )
          .join("")}
      </div>

      <div class="total">
        <b>Итого:</b> ${b.total.toFixed(2)} €
      </div>

      <div class="row">
        <a data-link href="/" class="btn">Назад</a>
        <button id="toDelivery" class="btn primary" ${b.items.length === 0 ? "disabled" : ""}>Оформить доставку</button>
      </div>
    </section>
  `;

  renderLayout(html);

  document.querySelector<HTMLButtonElement>("#toDelivery")?.addEventListener("click", () => {
    navigate("/delivery");
  });

  bindButtons();
}

function setAllBasketBtns(disabled: boolean): void {
  document.querySelectorAll<HTMLButtonElement>("button[data-inc], button[data-dec], button[data-remove]").forEach((b) => {
    b.disabled = disabled;
  });
}

function bindButtons(): void {
  document.querySelectorAll<HTMLButtonElement>("button[data-inc]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-inc");
      if (!id) return;
      setAllBasketBtns(true);
      try {
        const label = btn.parentElement?.querySelector<HTMLSpanElement>(".qtyLabel");
        const current = label ? Number(label.textContent) : 1;
        const qty = Math.min(99, Number.isFinite(current) ? current + 1 : 1);
        await api.basketUpdate(id, qty);
        setMessage("Количество обновлено");
        await renderBasket();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Ошибка обновления", "error");
        setAllBasketBtns(false);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>("button[data-dec]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-dec");
      if (!id) return;
      setAllBasketBtns(true);
      try {
        const label = btn.parentElement?.querySelector<HTMLSpanElement>(".qtyLabel");
        const current = label ? Number(label.textContent) : 1;
        const qty = Math.max(0, Number.isFinite(current) ? current - 1 : 0);
        await api.basketUpdate(id, qty);
        setMessage("Количество обновлено");
        await renderBasket();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Ошибка обновления", "error");
        setAllBasketBtns(false);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-remove");
      if (!id) return;
      setAllBasketBtns(true);
      try {
        await api.basketRemove(id);
        setMessage("Удалено из корзины");
        await renderBasket();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Ошибка удаления", "error");
        setAllBasketBtns(false);
      }
    });
  });
}

function escapeHtml(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
