# Printo KZ Backend

REST API на FastAPI для мобильного приложения заказа печати документов. Полный цикл: SMS-логин → загрузка файла → заказ → оплата.

## Стек

- **Python 3.11+**, **FastAPI**, **Uvicorn**
- **PostgreSQL** + **SQLAlchemy 2 (async)** + **Alembic**
- **Redis** — rate limiting
- **MinIO / S3** — хранение файлов
- **JWT** (HS256) — авторизация
- **Docker Compose** — локальная инфраструктура

## Быстрый старт

```bash
cd backend
cp .env.example .env
docker compose up --build
```

После старта:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- MinIO Console: http://localhost:9001 (`minio` / `miniominio`)

Миграции применяются автоматически при старте контейнера `api`.

### Локально без Docker

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # отредактируйте DATABASE_URL/REDIS_URL/S3_*
alembic upgrade head
uvicorn app.main:app --reload
```

### Тесты

```bash
pytest
```

Тесты используют SQLite in-memory и не требуют запущенного Postgres/Redis/MinIO.

## Архитектура

```
backend/
├── app/
│   ├── main.py              # FastAPI app, middleware, error handlers, lifespan
│   ├── core/                # config (pydantic-settings), logging, JWT/hashing
│   ├── api/v1/              # роутеры: auth, files, orders, payments, health
│   ├── dependencies/        # FastAPI Depends: текущий пользователь, redis
│   ├── services/            # бизнес-логика (auth, sms, files, orders, pricing, payments, rate_limit)
│   ├── repositories/        # доступ к данным (SQLAlchemy queries)
│   ├── schemas/             # Pydantic DTO
│   ├── models/              # SQLAlchemy ORM
│   ├── db/                  # engine, session, redis client, declarative base
│   └── utils/               # PDF page count, исключения
├── alembic/                 # миграции
├── tests/                   # pytest
├── Dockerfile
├── docker-compose.yml       # postgres + redis + minio + api
└── requirements.txt
```

Слоистая архитектура: **API → Service → Repository → Model**. Бизнес-правила живут в сервисах, SQL — в репозиториях, валидация — в Pydantic-схемах.

## Endpoints

Базовый префикс: `/api`. Полная схема — в `/docs`.

### Аутентификация

| Метод | Путь | Описание |
|------|------|----------|
| `POST` | `/api/auth/send-code` | Отправляет SMS-код на номер. Rate-limited (Redis). |
| `POST` | `/api/auth/verify-code` | Проверяет код, создаёт пользователя при первом входе, возвращает JWT. |
| `GET` | `/api/auth/me` | Профиль текущего пользователя (Bearer JWT). |

### Файлы

| Метод | Путь | Описание |
|------|------|----------|
| `POST` | `/api/files/upload` | `multipart/form-data`, поле `file`. Проверка расширения и размера. Кладёт в S3, считает страницы PDF. |
| `GET` | `/api/files/{file_id}` | Метаданные файла (только владельцу). |

### Заказы

| Метод | Путь | Описание |
|------|------|----------|
| `POST` | `/api/orders` | Создать черновик заказа из файла + параметров печати. Цена считается автоматически. |
| `GET` | `/api/orders` | Список заказов пользователя (`limit`/`offset`). |
| `GET` | `/api/orders/{order_id}` | Детали заказа. |
| `PATCH` | `/api/orders/{order_id}` | Обновить параметры (только в статусах `draft`/`pending_payment`). |
| `POST` | `/api/orders/{order_id}/confirm` | Перевести `draft` → `pending_payment`. |

### Оплата

| Метод | Путь | Описание |
|------|------|----------|
| `POST` | `/api/payments/create` | Создаёт платёж и возвращает `redirect_url` провайдера. |
| `POST` | `/api/payments/webhook` | Webhook платёжной системы; HMAC-подпись по `PAYMENT_WEBHOOK_SECRET`. |
| `GET` | `/api/payments/{payment_id}` | Статус платежа (доступ только владельцу заказа). |

### Служебные

| Метод | Путь | Описание |
|------|------|----------|
| `GET` | `/health` | Liveness probe. |
| `GET` | `/docs`, `/redoc`, `/openapi.json` | Документация. |

## Бизнес-логика

1. `POST /api/auth/send-code` — Redis-rate-limit, генерация 6-значного кода, hash в `auth_codes`, отправка через `SmsProvider`.
2. `POST /api/auth/verify-code` — проверка кода, создание `User` (если новый), JWT.
3. `POST /api/files/upload` — валидация (расширение, размер), загрузка в S3, подсчёт страниц для PDF.
4. `POST /api/orders` — создаёт `Order` со статусом `draft`, считает `price = copies × rate`.
5. `PATCH` / `POST /confirm` — изменение/подтверждение заказа.
6. `POST /api/payments/create` — выбор способа оплаты, создание `Payment` (status=`pending`), запрос к провайдеру.
7. `POST /api/payments/webhook` — провайдер вызывает с подписью; при `succeeded` заказ переходит в `paid`.

## Расчёт стоимости

```
price = copies × (180 ₸ если color else 90 ₸)
```

Тарифы настраиваются через `PRICE_BW` / `PRICE_COLOR` в `.env`. Логика изолирована в `app/services/pricing_service.py` — расширяется без изменения роутеров (страницы, скидки, наценки).

## Статусы заказа

`draft` → `pending_payment` → `paid` → `in_progress` → `ready` → `completed`

Альтернативно: → `cancelled` из любого нефинального состояния.

## Безопасность

- JWT (HS256) на приватных endpoint через `Depends(get_current_user)`.
- Rate limiting на `send-code` (Redis, окно 60 сек, лимит из `SMS_RATE_LIMIT_PER_MIN`).
- Лимит попыток ввода кода (`SMS_MAX_ATTEMPTS`).
- Whitelist расширений (`FILE_ALLOWED_EXT`) и максимальный размер файла (`FILE_MAX_SIZE_MB`).
- HMAC-SHA256 подпись webhook (`PAYMENT_WEBHOOK_SECRET`).
- Доступ к чужим файлам/заказам/платежам блокируется на уровне репозиториев (`get_for_user`).
- Все секреты из `.env`, не коммитятся.

## Платёжный/SMS-провайдеры

`STUB`-реализации в `app/services/sms_service.py` и `app/services/payment_service.py` живут за интерфейсами `SmsProvider` / `PaymentProvider` (PEP 544 `Protocol`). Подмена на реальные (Twilio, Kaspi, Stripe) — добавлением класса и веткой в фабрике. Stub-SMS просто пишет код в логи; stub-платёж возвращает фейковый `external_payment_id`.

Чтобы вручную «оплатить» в dev-среде, сгенерируйте подпись и дёрните webhook:

```python
from app.models.payment import PaymentStatus
from app.services.payment_service import sign_for_testing
sign_for_testing("stub_<id>", PaymentStatus.SUCCEEDED)
```

```bash
curl -X POST http://localhost:8000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"external_payment_id":"stub_xxx","status":"succeeded","signature":"<hex>"}'
```

## Миграции

```bash
alembic revision --autogenerate -m "your message"
alembic upgrade head
alembic downgrade -1
```
