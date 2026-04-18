# Компоненты

Проект содержит 4 переиспользуемых компонента в папке `frontend/components/`.

---

## MobileShell

**Файл:** `frontend/components/mobile-shell.tsx`

Обёртка для экранов приложения. Отображает заголовок и подзаголовок.

### Props

| Prop | Тип | Обязательный | Описание |
|------|-----|:---:|----------|
| `title` | `string` | да | Заголовок экрана |
| `subtitle` | `string` | нет | Подзаголовок (отображается серым) |
| `children` | `ReactNode` | да | Содержимое экрана |

### Использование

```tsx
<MobileShell title="Upload document" subtitle="Choose a file to print">
  {/* содержимое страницы */}
</MobileShell>
```

### Структура HTML

```html
<div class="screen">
  <div class="screen__header">
    <h1>title</h1>
    <p>subtitle</p>
  </div>
  <div class="screen__content">
    {children}
  </div>
</div>
```

---

## PrimaryButton

**Файл:** `frontend/components/primary-button.tsx`

Основная кнопка действия (CTA).

### Props

Компонент расширяет стандартные `ButtonHTMLAttributes<HTMLButtonElement>` — поддерживает любые нативные пропсы кнопки (`onClick`, `disabled`, `type` и т.д.). Текст передаётся через `children`.

| Prop | Тип | Обязательный | Описание |
|------|-----|:---:|----------|
| `children` | `ReactNode` | да | Содержимое кнопки (обычно текст) |
| `...rest` | `ButtonHTMLAttributes` | — | Любые HTML-атрибуты `<button>` |

### Использование

```tsx
<PrimaryButton onClick={handleNext} disabled={!isValid}>
  Continue
</PrimaryButton>
```

### CSS-классы

- `.btn` — базовые стили кнопки
- `.btn--primary` — синий фон (#295cff), белый текст
- `.btn--full` — ширина 100%
- `.btn--primary:disabled` — полупрозрачность (opacity: 0.5)

---

## ProgressHeader

**Файл:** `frontend/components/progress-header.tsx`

Индикатор прогресса — показывает текущий шаг из общего количества.

### Props

| Prop | Тип | Обязательный | Описание |
|------|-----|:---:|----------|
| `step` | `number` | да | Текущий шаг |
| `total` | `number` | да | Общее количество шагов |

### Использование

```tsx
<ProgressHeader step={4} total={8} />
```

### Визуальное представление

```
Step 4 of 8
[████████░░░░░░░░]  50%
```

Прогресс-бар заполняется пропорционально: `width = (step / total) * 100%`. Градиент от `#295cff` до `#00b1ff`.

---

## BottomNav

**Файл:** `frontend/components/bottom-nav.tsx`

Фиксированная нижняя навигационная панель с 5 секциями.

### Props

| Prop | Тип | Обязательный | Описание |
|------|-----|:---:|----------|
| `current` | `"home" \| "upload" \| "orders" \| "chat" \| "profile"` | да | Ключ активной секции — подсвечивается синим |

### Секции навигации

| Ключ | Название | URL |
|------|----------|-----|
| `home` | Home | `/dashboard` |
| `upload` | Upload | `/upload` |
| `orders` | Orders | `/dashboard#orders` |
| `chat` | Support | `/dashboard#support` |
| `profile` | Profile | `/dashboard#profile` |

Иконок нет — только текстовые подписи. «Заглушечные» секции ведут на якоря внутри `/dashboard`.

### Использование

```tsx
<BottomNav current="home" />
```

Компонент используется на странице `/dashboard`. Активная секция подсвечивается синим цветом (`color: var(--primary)`, `background: #ebf0ff`).
