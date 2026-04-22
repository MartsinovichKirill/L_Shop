import { api } from "../api";
import { renderLayout } from "../layout";
import { setBasketCount, setMessage, state } from "../state";
import type { Category, Product } from "../types";
import { navigate } from "../router";

const categories: Array<{ key: Category; label: string }> = [
  { key: "boardgames", label: "Настолки" },
  { key: "cards", label: "Карты" },
  { key: "accessories", label: "Аксессуары" },
  { key: "merch", label: "Мерч" }
];

export async function renderHome(): Promise<void> {
  const html = `
    <section class="panel">
      <h1>Каталог</h1>

      <div class="filters">
        <input id="search" class="input" placeholder="Поиск по названию/описанию..." />
        <select id="sort" class="input">
          <option value="">Сортировка</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
        </select>

        <label class="check">
          <input id="available" type="checkbox" />
          Только в наличии
        </label>

        <div class="cats">
          ${categories
            .map(
              (c) => `
              <label class="check">
                <input type="checkbox" class="cat" value="${c.key}" />
                ${c.label}
              </label>`
            )
            .join("")}
        </div>

        <button id="apply" class="btn primary">Применить</button>
      </div>
    </section>

    <section id="grid" class="grid"></section>
  `;

  renderLayout(html);

  const btn = document.querySelector<HTMLButtonElement>("#apply");
  const grid = document.querySelector<HTMLDivElement>("#grid");
  if (!btn || !grid) return;

  async function load(): Promise<void> {
    const search = document.querySelector<HTMLInputElement>("#search")?.value.trim() || undefined;
    const sort = (document.querySelector<HTMLSelectElement>("#sort")?.value || undefined) as
      | "price_asc"
      | "price_desc"
      | undefined;
    const available = document.querySelector<HTMLInputElement>("#available")?.checked ?? false;

    const catInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input.cat"));
    const cats = catInputs.filter((x) => x.checked).map((x) => x.value);

    try {
      const items = await api.products({
        search,
        sort,
        available: available ? true : undefined,
        category: cats.length ? cats : undefined
      });

      grid.innerHTML = items.map(cardHtml).join("");
      bindAddButtons();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка загрузки товаров", "error");
    }
  }

  btn.addEventListener("click", () => void load());

  await load();

  if (state.user) {
    try {
      const b = await api.basket();
      setBasketCount(b.items.reduce((s, x) => s + x.qty, 0));
    } catch {
      setBasketCount(0);
    }
  } else {
    setBasketCount(0);
  }
}

function cardHtml(p: Product): string {
  const avail = p.available ? `<span class="tag ok">в наличии</span>` : `<span class="tag bad">нет</span>`;
  const img = p.imageUrl
    ? `<img class="card-img" src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" />`
    : "";
  return `
    <article class="card">
      ${img}
      <div class="cardTop">
        <h3 class="title" data-title>${escapeHtml(p.title)}</h3>
        ${avail}
      </div>
      <p class="desc">${escapeHtml(p.description)}</p>
      <div class="cardBottom">
        <div class="price" data-price>${p.price.toFixed(2)} €</div>
        <div class="row">
          <input class="qty" type="number" min="1" max="99" value="1" data-qty="${p.id}" ${!p.available ? "disabled" : ""} />
          <button class="btn primary" data-add="${p.id}" ${!p.available ? "disabled" : ""}>В корзину</button>
        </div>
      </div>
    </article>
  `;
}

function bindAddButtons(): void {
  const btns = Array.from(document.querySelectorAll<HTMLButtonElement>("button[data-add]"));
  btns.forEach((b) => {
    b.addEventListener("click", async () => {
      const id = b.getAttribute("data-add");
      if (!id) return;

      if (!state.user) {
        setMessage("Нужно войти, чтобы пользоваться корзиной");
        navigate("/auth");
        return;
      }

      const qtyInput = document.querySelector<HTMLInputElement>(`input[data-qty="${id}"]`);
      const qty = qtyInput ? Number(qtyInput.value) : 1;
      const safeQty = Number.isFinite(qty) && qty >= 1 && qty <= 99 ? Math.floor(qty) : 1;

      b.disabled = true;
      try {
        await api.basketAdd(id, safeQty);
        const bres = await api.basket();
        setBasketCount(bres.items.reduce((s, x) => s + x.qty, 0));
        setMessage("Добавлено в корзину");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Ошибка при добавлении в корзину", "error");
      } finally {
        b.disabled = false;
      }
    });
  });
}

function escapeHtml(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
