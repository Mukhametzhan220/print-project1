# Paraq KZ

Мобильное веб-приложение для заказа печати документов в Казахстане. Полный цикл: SMS-логин → загрузка файла → настройки печати → оплата → отслеживание заказа.

Монорепозиторий: **Next.js 15 frontend** + **FastAPI backend**.

---

## Структура

```
print-project1/
├── frontend/             # Next.js 15 (App Router)
│   ├── app/              # Страницы и layout
│   ├── components/       # React-компоненты
│   ├── lib/              # FlowContext (глобальный стейт)
│   ├── next.config.ts    # Конфигурация Next.js
│   ├── tsconfig.json     # Конфигурация TypeScript
│   └── package.json      # Зависимости и скрипты
├── docs/                 # Документация по frontend (RU)
├── backend/              # FastAPI backend (Python)
│   ├── app/              # API, services, repositories, models
│   ├── alembic/          # Миграции БД
│   ├── tests/            # pytest
│   └── README.md         # Документация backend
└── README.md             # Этот файл
```

---

## Технологический стек

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 15.3.2 | React-фреймворк (App Router) |
| React | 19.1.0 | UI |
| TypeScript | 5.8.3 | Типизация |
| CSS (vanilla) | — | Стилизация (CSS-переменные, без UI-библиотек) |

### Backend

| Технология | Назначение |
|------------|------------|
| Python 3.11+ / FastAPI | REST API |
| PostgreSQL + SQLAlchemy 2 (async) | Основная БД |
| Alembic | Миграции |
| Redis | Rate limiting, временные данные |
| MinIO / S3 | Хранение файлов |
| JWT (HS256) | Авторизация |
| Docker Compose | Локальная инфраструктура |

---

## Быстрый старт

Требуется **Node.js ≥ 18** и **Docker** (для backend).

### 1. Запустить backend

```bash
cd backend
cp .env.example .env
docker compose up --build
```

После старта:
- API: <http://localhost:8000>
- Swagger UI: <http://localhost:8000/docs>
- MinIO Console: <http://localhost:9001> (`minio` / `miniominio`)

Миграции применяются автоматически при старте контейнера `api`.

### 2. Запустить frontend

В отдельном терминале:

```bash
cd frontend
npm install
npm run dev
```

Откройте <http://localhost:3000> — редирект на `/login`, далее 8-шаговый флоу заказа.

---

## Пользовательский флоу

```
/login → /verify → /dashboard → /upload → /upload/selected → /settings → /preview → /payment
  (1)      (2)        (3)         (4)          (5)              (6)         (7)        (8)
```

Подробное описание каждого шага: [docs/user-flow.md](./docs/user-flow.md).

---

## API (backend)

Базовый префикс: `/api`. Полный список и схемы — в [Swagger UI](http://localhost:8000/docs).

### Аутентификация
- `POST /api/auth/send-code` — отправка SMS-кода (rate-limited)
- `POST /api/auth/verify-code` — проверка кода, выдача JWT
- `GET /api/auth/me` — текущий пользователь

### Файлы
- `POST /api/files/upload` — загрузка (`multipart/form-data`)
- `GET /api/files/{id}` — метаданные

### Заказы
- `POST /api/orders` — создание (статус `draft`)
- `GET /api/orders` — список заказов пользователя
- `GET /api/orders/{id}` — детали
- `PATCH /api/orders/{id}` — обновление параметров
- `POST /api/orders/{id}/confirm` — `draft → pending_payment`

### Оплата
- `POST /api/payments/create` — создание платежа
- `POST /api/payments/webhook` — webhook платёжной системы (HMAC-подпись)
- `GET /api/payments/{id}` — статус платежа

### Служебные
- `GET /health` — liveness probe
- `GET /docs`, `/redoc`, `/openapi.json` — документация

Полное описание endpoints, бизнес-логики и безопасности — в [backend/README.md](./backend/README.md).

---

## Расчёт стоимости

```
price = copies × (180 ₸ если color else 90 ₸)
```

Тарифы настраиваются через `PRICE_BW` / `PRICE_COLOR` в [backend/.env.example](./backend/.env.example).

---

## Статусы заказа

`draft` → `pending_payment` → `paid` → `in_progress` → `ready` → `completed`

В любой момент возможен переход в `cancelled`.

---

## Команды

### Frontend

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с hot reload |
| `npm run build` | Production-сборка |
| `npm start` | Production-сервер |
| `npm run lint` | ESLint |

### Backend

| Команда | Описание |
|---------|----------|
| `docker compose up --build` | Запуск всей инфраструктуры (api + db + redis + minio) |
| `pytest` | Тесты (SQLite in-memory, без внешних сервисов) |
| `alembic upgrade head` | Применить миграции |
| `alembic revision --autogenerate -m "msg"` | Создать новую миграцию |
| `uvicorn app.main:app --reload` | Запуск API локально без Docker |

---

## Безопасность

- JWT (HS256) на приватных endpoint
- Rate limiting на отправку SMS-кодов (Redis)
- Лимит попыток ввода кода
- Whitelist расширений и максимальный размер файла
- HMAC-SHA256 подпись webhook платежей
- Доступ к чужим файлам/заказам/платежам блокируется на уровне репозиториев
- Все секреты — в `.env` (не коммитятся)

---

## Документация

### Frontend (RU)

- [Обзор проекта](./docs/overview.md)
- [Начало работы](./docs/getting-started.md)
- [Архитектура](./docs/architecture.md)
- [Пользовательский флоу](./docs/user-flow.md)
- [Компоненты](./docs/components.md)
- [Управление состоянием](./docs/state-management.md)
- [Стилизация](./docs/styling.md)
- [Развитие проекта](./docs/roadmap.md)

### Backend

- [backend/README.md](./backend/README.md) — endpoints, архитектура, бизнес-логика, безопасность

---

## Этапы развития

Текущая версия — функциональный прототип:

- ✅ Frontend: 8-шаговый флоу, mobile-first, FlowContext
- ✅ Backend: REST API, JWT, файлы, заказы, оплата (со stub-провайдерами SMS/платежей)
- ⏳ Реальные интеграции: Twilio/SMSC для SMS, Kaspi/Stripe для платежей
- ⏳ Frontend ↔ Backend интеграция (сейчас фронт работает только с локальным контекстом)
- ⏳ Персистентность фронтенд-стейта (localStorage)
- ⏳ Страницы «Мои заказы», карта точек печати, профиль

Подробный список — в [docs/roadmap.md](./docs/roadmap.md).
