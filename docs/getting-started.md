# Начало работы

## Требования

- **Node.js** >= 18.x
- **npm** (поставляется вместе с Node.js)

## Установка

```bash
# Клонировать репозиторий
git clone <url-репозитория>
cd print-project1/frontend

# Установить зависимости
npm install
```

> Все frontend-команды запускаются из папки `frontend/`.

## Запуск

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### Production-сборка

```bash
# Собрать проект
npm run build

# Запустить production-сервер
npm start
```

### Линтинг

```bash
npm run lint
```

## Структура команд

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера с hot reload |
| `npm run build` | Сборка production-бандла |
| `npm start` | Запуск production-сервера |
| `npm run lint` | Проверка кода с помощью ESLint |

## Первый запуск

После `npm run dev` откройте `http://localhost:3000`. Вы будете перенаправлены на страницу `/login`, откуда начинается пользовательский флоу.

## Backend

Для работы самого frontend backend не обязателен — все данные хранятся в React Context и никуда не отправляются. Инструкция по запуску backend (FastAPI + Postgres + Redis + MinIO через Docker Compose) — в [../backend/README.md](../backend/README.md).
