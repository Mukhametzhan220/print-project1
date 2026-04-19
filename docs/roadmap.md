# Развитие проекта

Текущее состояние — функциональный прототип: frontend (8-шаговый флоу) и backend (REST API с заглушками SMS/платежей) работают по отдельности. Ниже — что осталось до production-ready версии.

## Backend — уже реализовано

- [x] Auth-endpoints (`POST /api/auth/send-code`, `POST /api/auth/verify-code`, `GET /api/auth/me`)
- [x] JWT (HS256), rate limiting SMS через Redis, лимит попыток ввода кода
- [x] Загрузка файлов (`POST /api/files/upload`) → MinIO/S3, whitelist расширений, лимит размера
- [x] Заказы (`/api/orders`, lifecycle `draft → pending_payment → paid → in_progress → ready → completed`)
- [x] Платежи (`/api/payments/create`, `/api/payments/webhook` c HMAC-SHA256)
- [x] PostgreSQL + SQLAlchemy 2 (async) + Alembic
- [x] Docker Compose (api + db + redis + minio), автоматические миграции
- [x] pytest (SQLite in-memory, без внешних сервисов)

Подробности — [../backend/README.md](../backend/README.md).

## Backend — что осталось

- [ ] Реальный SMS-провайдер (Twilio / SMSC / Mobizon) вместо stub
- [ ] Реальный платёжный провайдер (Kaspi / Stripe) вместо stub
- [ ] Генерация превью PDF (первая страница как изображение)
- [ ] Webhook в типографию и прокидывание статусов в заказ
- [ ] Мониторинг (Sentry/OpenTelemetry) и структурированные логи

## Frontend ↔ Backend интеграция

Сейчас фронт работает только с локальным контекстом. Нужно:

- [ ] Клиент API (fetch/axios) с автоподстановкой JWT
- [ ] Замена `setPhone/setCode` на реальные вызовы `/api/auth/…`
- [ ] Загрузка файла на `/api/files/upload` вместо хранения `File` в памяти
- [ ] Создание и обновление заказа через `/api/orders`
- [ ] Запуск платежа через `/api/payments/create`, опрос статуса
- [ ] Обработка ошибок сети и невалидных токенов (401 → редирект на `/login`)

## Frontend — улучшения

### Функциональность

- [ ] Защита маршрутов (route guards) — редирект неавторизованных на `/login`
- [ ] Реальный предпросмотр PDF (`react-pdf` или `pdf.js`)
- [ ] Drag & drop для загрузки файлов
- [ ] Страница «Мои заказы» с отслеживанием статуса
- [ ] Карта ближайших точек печати (2GIS API)
- [ ] Страница профиля и история заказов
- [ ] Чат поддержки (Intercom / Crisp / WebSocket)

### UX

- [ ] Персистентность стейта (localStorage или серверные сессии)
- [ ] Toast-уведомления об ошибках
- [ ] Скелетоны и loading states
- [ ] Анимации переходов между шагами
- [ ] Поддержка казахского языка (KZ)

### Качество

- [ ] Unit-тесты (Jest + React Testing Library)
- [ ] E2E-тесты (Playwright)
- [ ] Storybook для компонентов
- [ ] Accessibility (ARIA-атрибуты, keyboard navigation)

## Инфраструктура

- [ ] Деплой backend (Railway / Fly.io / собственный сервер + managed Postgres)
- [ ] Деплой frontend (Vercel / Cloudflare Pages)
- [ ] CI/CD (GitHub Actions): lint + typecheck + tests + build
- [x] HTTPS, security headers, CORS-политика на backend
- [ ] Мониторинг ошибок (Sentry — backend и frontend)
- [ ] Аналитика (PostHog)

## Приоритеты

1. **Frontend ↔ Backend интеграция** — главный блокер для реального использования
2. **Реальные SMS и платёжный провайдеры** — замена stub-реализаций
3. **Route guards + обработка 401** — стабильность UX после интеграции
4. **Персистентность стейта** — чтобы пользователь не терял прогресс при обновлении
5. **Превью PDF** — ключевой UX-элемент, сейчас плейсхолдер
6. **Деплой + CI/CD**
7. **Мои заказы, карта, профиль** — расширение функциональности
8. **Тесты, accessibility, i18n (KZ)**
