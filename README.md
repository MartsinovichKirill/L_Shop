# L_Shop — интернет-магазин настольных игр и аксессуаров (SPA + Express + TS)

Тема: **Интернет-магазин настольных игр и аксессуаров** (категории: boardgames/cards/accessories/merch).

## Быстрый старт (локально)
### 1) Backend
```bash
cd backend
npm install
npm run dev
```
Backend: http://localhost:3001

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## Важное по ТЗ
- Backend: **Express + TypeScript**
- Frontend: **SPA на TypeScript** (рендер на клиенте)
- Cookie сессии: **HttpOnly**, жизнь **10 минут**
- Данные: JSON-файлы в `backend/data/`
- Query-параметры для товаров (поиск/сорт/фильтры)
- Data-атрибуты для тестов: `data-title`, `data-price`, `data-registration`, `data-delivery`, и basket-варианты

## Git / review ветка (обязательно)
1) Репозиторий: **L_Shop**
2) Сразу создайте пустую ветку `review`, потом PR `main -> review` (НЕ закрывать):

```bash
git checkout --orphan review
git rm -rf .
git commit --allow-empty -m "chore: init review branch (empty)"
git push -u origin review
git checkout main
```

## Рекомендованные ветки по людям
- `feat/auth` — users + sessions (ЛИД)
- `feat/products` — products API + фильтры
- `feat/front` — SPA страницы + UI + data-*

Подробный план PR/коммитов — ниже в сообщении ассистента.
