# Управление состоянием

## Обзор

Проект использует **React Context API** для глобального управления состоянием. Весь стейт сосредоточен в одном контексте — `FlowContext`.

**Файл:** `frontend/lib/flow-context.tsx`

## Архитектура

```
FlowProvider (frontend/app/providers.tsx → frontend/app/layout.tsx)
    │
    └── useFlow() — хук для доступа к стейту
         │
         ├── Страницы читают и обновляют состояние
         └── Компоненты читают состояние для отображения
```

## Типы

### PrintSettings

```typescript
type PrintSettings = {
  copies: number;        // Количество копий (1-99)
  colorMode: "bw" | "color";  // Цветовой режим
  duplex: boolean;       // Двусторонняя печать
};
```

### FlowState

```typescript
type FlowState = {
  // Данные
  phone: string;                          // Номер телефона
  language: "en" | "ru";                  // Язык интерфейса
  code: string;                           // SMS-код
  fileName: string;                       // Имя загруженного файла
  termsAccepted: boolean;                 // Принятие условий
  paymentMethod: "kaspi" | "card" | "apple"; // Способ оплаты
  settings: PrintSettings;                // Настройки печати

  // Сеттеры
  setPhone: (value: string) => void;
  setLanguage: (value: "en" | "ru") => void;
  setCode: (value: string) => void;
  setFileName: (value: string) => void;
  setTermsAccepted: (value: boolean) => void;
  setPaymentMethod: (value: "kaspi" | "card" | "apple") => void;
  setSettings: (value: PrintSettings) => void;
};
```

## Значения по умолчанию

| Поле | Значение |
|------|----------|
| `phone` | `""` |
| `language` | `"en"` |
| `code` | `""` |
| `fileName` | `""` |
| `termsAccepted` | `false` |
| `paymentMethod` | `"kaspi"` |
| `settings.copies` | `1` |
| `settings.colorMode` | `"bw"` |
| `settings.duplex` | `true` |

## Использование

### Подключение провайдера

```tsx
// frontend/app/providers.tsx
import { FlowProvider } from "@/lib/flow-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FlowProvider>{children}</FlowProvider>;
}
```

### Чтение и запись состояния в страницах

```tsx
"use client";
import { useFlow } from "@/lib/flow-context";

export default function LoginPage() {
  const { phone, setPhone, language, setLanguage } = useFlow();

  return (
    <input
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
  );
}
```

## Оптимизация

Объект `value` контекста обёрнут в `useMemo` с зависимостями от всех полей состояния. Это предотвращает лишние ре-рендеры компонентов, которые подписаны на контекст, когда ссылка на объект не изменилась.

## Ограничения

- **Нет персистентности:** все данные теряются при перезагрузке страницы
- **Единый контекст:** при изменении любого поля обновляются все подписчики
- **Нет серверной синхронизации:** данные существуют только в памяти браузера. REST API реализован в [../backend/](../../backend/README.md), но интеграция с фронтом пока не сделана — см. [roadmap.md](./roadmap.md).
