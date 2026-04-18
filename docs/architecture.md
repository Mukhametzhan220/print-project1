# Архитектура

## Структура проекта

```
print-project1/
├── frontend/                       # Next.js 15 приложение
│   ├── app/                        # App Router — страницы приложения
│   │   ├── layout.tsx              # Корневой layout (метаданные, шрифты, провайдеры)
│   │   ├── page.tsx                # Главная страница (редирект на /login)
│   │   ├── providers.tsx           # Обёртка с контекст-провайдерами
│   │   ├── globals.css             # Глобальные стили и дизайн-система
│   │   ├── login/
│   │   │   └── page.tsx            # Шаг 1: Ввод номера телефона
│   │   ├── verify/
│   │   │   └── page.tsx            # Шаг 2: Верификация SMS-кода
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Шаг 3: Главное меню
│   │   ├── upload/
│   │   │   ├── page.tsx            # Шаг 4: Загрузка файла
│   │   │   └── selected/
│   │   │       └── page.tsx        # Шаг 5: Просмотр и переименование файла
│   │   ├── settings/
│   │   │   └── page.tsx            # Шаг 6: Настройки печати
│   │   ├── preview/
│   │   │   └── page.tsx            # Шаг 7: Предпросмотр и принятие условий
│   │   └── payment/
│   │       └── page.tsx            # Шаг 8: Выбор способа оплаты
│   ├── components/                 # Переиспользуемые UI-компоненты
│   │   ├── mobile-shell.tsx        # Обёртка экрана (заголовок + подзаголовок)
│   │   ├── primary-button.tsx      # Основная кнопка действия
│   │   ├── progress-header.tsx     # Индикатор прогресса (шаг X из Y)
│   │   └── bottom-nav.tsx          # Нижняя навигационная панель
│   ├── lib/                        # Утилиты и контексты
│   │   └── flow-context.tsx        # Глобальное состояние (React Context)
│   ├── next.config.ts              # Конфигурация Next.js
│   ├── tsconfig.json               # Конфигурация TypeScript
│   └── package.json                # Зависимости и скрипты
└── docs/                           # Документация
```

## Архитектурные решения

### App Router (Next.js 15)

Проект использует **App Router** — современный подход к маршрутизации в Next.js. Каждая папка внутри `frontend/app/` соответствует маршруту URL:

- `frontend/app/login/page.tsx` → `/login`
- `frontend/app/upload/selected/page.tsx` → `/upload/selected`

### Серверные и клиентские компоненты

Серверными остаются страницы без интерактивного состояния:

- `frontend/app/layout.tsx` — корневой layout
- `frontend/app/page.tsx` — редирект на `/login` через `redirect()` из `next/navigation`
- `frontend/app/dashboard/page.tsx` — статическая сетка карточек
- Все компоненты в `frontend/components/` (используются и в server, и в client деревьях)

Директивой `"use client"` помечены интерактивные страницы (`/login`, `/verify`, `/upload`, `/upload/selected`, `/settings`, `/preview`, `/payment`) и сам провайдер `frontend/app/providers.tsx`. Route Handlers в Next.js не используются — REST API вынесен в отдельный сервис [`backend/`](../backend/README.md) и на текущий момент с фронтом ещё не интегрирован.

### Состояние через React Context

Глобальное состояние (телефон, файл, настройки печати и т.д.) управляется через единый `FlowContext`. Провайдер оборачивает всё приложение в `frontend/app/providers.tsx` → `frontend/app/layout.tsx`.

### Mobile-First дизайн

- Максимальная ширина контента: **420px**
- Все элементы оптимизированы под мобильное взаимодействие
- Фиксированная нижняя навигация

### Навигация

Используется `useRouter()` из `next/navigation` для программной навигации между шагами. Защиты маршрутов (route guards) не реализованы — все страницы доступны напрямую по URL.

## Поток данных

```
FlowProvider (frontend/lib/flow-context.tsx)
    │
    ├── layout.tsx (оборачивает всё приложение)
    │
    ├── /login      → setPhone, setLanguage
    ├── /verify     → setCode
    ├── /upload     → setFileName
    ├── /settings   → setSettings
    ├── /preview    → setTermsAccepted
    └── /payment    → setPaymentMethod, читает settings для расчёта цены
```

Каждая страница через хук `useFlow()` получает доступ ко всему состоянию и может его модифицировать.
