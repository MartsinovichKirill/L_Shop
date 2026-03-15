# L_Shop

Интернет-магазин настольных игр и аксессуаров. Учебный командный проект.

## Стек

**Backend** — Node.js, Express, TypeScript, bcryptjs, JSON-хранилище
**Frontend** — Vanilla TypeScript, Vite, CSS (без фреймворков)

## Структура

```
L_Shop/
├── backend/      Express API
└── frontend/     SPA на TypeScript + Vite
```

## Запуск

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Сервер запустится на `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Откроется на `http://localhost:5173`

## API

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/users/register | Регистрация |
| POST | /api/users/login | Вход |
| POST | /api/users/logout | Выход |
| GET | /api/users/me | Текущий пользователь |
| GET | /api/products | Список товаров (фильтры: search, sort, category, available) |
| GET | /api/basket | Корзина |
| POST | /api/basket/add | Добавить товар |
| POST | /api/basket/update | Изменить количество |
| POST | /api/basket/remove | Удалить товар |
| POST | /api/basket/checkout | Оформить заказ |
| GET | /api/orders | История заказов (limit, offset) |

## Переменные окружения

**backend/.env**
```
PORT=3001
FRONT_ORIGIN=http://localhost:5173
SESSION_TTL_MS=86400000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:3001/api
```

## Ветки

- `feat/auth` — авторизация, корзина, заказы
- `feat/products` — каталог товаров
- `feat/front` — фронтенд

## Команда

- [Slava-Mshar](https://github.com/Slava-Mshar) — лид, бэкенд (auth, basket, orders)
- [MartsinovichKirill](https://github.com/MartsinovichKirill) — бэкенд (products)
- [EG0RG](https://github.com/EG0RG) — фронтенд
