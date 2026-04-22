import { api } from "../api";
import { renderLayout } from "../layout";
import { setBasketCount, setMessage, setUser } from "../state";
import { navigate } from "../router";

export function renderAuth(): void {
  renderLayout(`
    <section class="panel">
      <h1>Вход / Регистрация</h1>

      <div class="cols">
        <form id="reg" data-registration class="box">
          <h2>Регистрация</h2>
          <input class="input" name="name" placeholder="Имя" required />
          <input class="input" name="email" placeholder="Email (необязательно)" />
          <input class="input" name="login" placeholder="Логин (необязательно)" />
          <input class="input" name="phone" placeholder="Телефон (необязательно)" />
          <input class="input" name="password" placeholder="Пароль" type="password" required />
          <button class="btn primary" type="submit">Зарегистрироваться</button>
          <p class="muted small">Нужно заполнить имя + пароль + хотя бы одно из: email/login/phone</p>
        </form>

        <form id="login" class="box">
          <h2>Вход</h2>
          <input class="input" name="email" placeholder="Email (или оставь пустым)" />
          <input class="input" name="login" placeholder="Логин (или оставь пустым)" />
          <input class="input" name="phone" placeholder="Телефон (или оставь пустым)" />
          <input class="input" name="password" placeholder="Пароль" type="password" required />
          <button class="btn primary" type="submit">Войти</button>
          <p class="muted small">Нужно заполнить пароль + хотя бы одно из: email/login/phone</p>
        </form>
      </div>
    </section>
  `);

  const reg = document.querySelector<HTMLFormElement>("#reg");
  const login = document.querySelector<HTMLFormElement>("#login");
  if (!reg || !login) return;

  reg.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = reg.querySelector<HTMLButtonElement>("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const fd = new FormData(reg);
      const body = {
        name: String(fd.get("name") ?? ""),
        email: strOrUndef(fd.get("email")),
        login: strOrUndef(fd.get("login")),
        phone: strOrUndef(fd.get("phone")),
        password: String(fd.get("password") ?? "")
      };

      const user = await api.register(body);
      setUser(user);
      const b = await api.basket().catch(() => null);
      setBasketCount(b ? b.items.reduce((s, x) => s + x.qty, 0) : 0);
      setMessage("Регистрация успешна");
      navigate("/");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка регистрации", "error");
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  login.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = login.querySelector<HTMLButtonElement>("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const fd = new FormData(login);
      const body = {
        email: strOrUndef(fd.get("email")),
        login: strOrUndef(fd.get("login")),
        phone: strOrUndef(fd.get("phone")),
        password: String(fd.get("password") ?? "")
      };

      const user = await api.login(body);
      setUser(user);
      const b = await api.basket().catch(() => null);
      setBasketCount(b ? b.items.reduce((s, x) => s + x.qty, 0) : 0);
      setMessage("Вы вошли в аккаунт");
      navigate("/");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка входа", "error");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function strOrUndef(v: FormDataEntryValue | null): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
