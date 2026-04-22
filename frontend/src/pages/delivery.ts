import { api } from "../api";
import { renderLayout } from "../layout";
import { setBasketCount, setMessage, state } from "../state";
import { navigate } from "../router";

export function renderDelivery(): void {
  if (!state.user) {
    renderLayout(`<section class="panel"><h1>Доставка</h1><p>Нужно войти.</p></section>`);
    return;
  }

  renderLayout(`
    <section class="panel">
      <h1>Оформление доставки</h1>

      <form id="deliveryForm" data-delivery class="box">
        <input class="input" name="address" placeholder="Адрес" required />
        <input class="input" name="phone" placeholder="Телефон" required />
        <input class="input" name="email" placeholder="Email" required />

        <select class="input" name="paymentMethod" required>
          <option value="card">Карта</option>
          <option value="cash">Наличные</option>
        </select>

        <div class="row">
          <a data-link href="/basket" class="btn">Назад</a>
          <button class="btn primary" type="submit">Оплатить и оформить</button>
        </div>

        <p class="muted small">После успешного оформления корзина очищается.</p>
      </form>
    </section>
  `);

  const form = document.querySelector<HTMLFormElement>("#deliveryForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector<HTMLButtonElement>("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const fd = new FormData(form);

      const order = await api.checkout({
        address: String(fd.get("address") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        paymentMethod: String(fd.get("paymentMethod") ?? "card") === "cash" ? "cash" : "card"
      });

      setMessage(`Заказ создан: ${order.id}`);
      setBasketCount(0);
      navigate("/");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка оформления заказа", "error");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
