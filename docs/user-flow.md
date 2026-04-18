# Пользовательский флоу

Приложение проводит пользователя через 8 последовательных шагов — от авторизации до оплаты.

## Схема флоу

```
/login → /verify → /dashboard → /upload → /upload/selected → /settings → /preview → /payment
  (1)      (2)        (3)         (4)          (5)              (6)         (7)        (8)
```

---

## Шаг 1: Авторизация (`/login`)

**Файл:** `frontend/app/login/page.tsx`

- Выбор языка интерфейса (EN / RU) через переключатель
- Ввод номера телефона
- **Валидация:** длина номера >= 8 символов
- Кнопка «Continue» ведёт на `/verify`

**Состояние:** `setPhone()`, `setLanguage()`

---

## Шаг 2: Верификация (`/verify`)

**Файл:** `frontend/app/verify/page.tsx`

- Ввод SMS-кода (`maxLength={6}`, `inputMode="numeric"`)
- Отображение номера телефона из предыдущего шага (или плейсхолдер «your number»)
- **Валидация:** длина кода >= 4 символа
- Кнопка «Verify» ведёт на `/dashboard`

**Состояние:** `setCode()`

---

## Шаг 3: Главное меню (`/dashboard`)

**Файл:** `frontend/app/dashboard/page.tsx`

- Сетка из 5 карточек-действий:
  - **New Print** → `/upload` (единственный активный маршрут)
  - **My Orders** → `/dashboard#orders` (якорь-заглушка)
  - **Nearby Shops** → `/dashboard#shops` (якорь-заглушка)
  - **Support** → `/dashboard#support` (якорь-заглушка)
  - **Profile** → `/dashboard#profile` (якорь-заглушка)
- Нижняя навигационная панель (`<BottomNav current="home" />`)
- Индикатор прогресса: шаг 3 из 8

---

## Шаг 4: Загрузка файла (`/upload`)

**Файл:** `frontend/app/upload/page.tsx`

- Зона загрузки файла (drag & drop не реализован, только `<input type="file">`)
- **Допустимые форматы:** `.pdf`, `.doc`, `.docx`, `.png`, `.jpg`, `.jpeg`
- Кнопка «Use sample document» — переходит на `/upload/selected` без выбора файла; в этом случае на следующем экране используется фолбэк-имя `Campus-notes.pdf`
- При выборе файла — автоматический переход на `/upload/selected`

**Состояние:** `setFileName()`

---

## Шаг 5: Просмотр файла (`/upload/selected`)

**Файл:** `frontend/app/upload/selected/page.tsx`

- Отображение информации о файле:
  - Имя файла (редактируемое поле)
  - Размер: 2.4 MB (захардкожено)
  - Страниц: 12 (захардкожено)
  - Статус: «Ready for printing»
- Возможность переименовать файл
- Кнопка «Continue» ведёт на `/settings`

**Состояние:** `fileName`, `setFileName()`

---

## Шаг 6: Настройки печати (`/settings`)

**Файл:** `frontend/app/settings/page.tsx`

- **Количество копий:** числовое поле (1–99)
- **Цветовой режим:** переключатель (Black & White / Color)
- **Двусторонняя печать:** toggle (вкл/выкл)
- Кнопка «Preview PDF» ведёт на `/preview`

**Состояние:** `setSettings()`

**Настройки по умолчанию:**
```typescript
{
  copies: 1,
  colorMode: "bw",
  duplex: true
}
```

---

## Шаг 7: Предпросмотр (`/preview`)

**Файл:** `frontend/app/preview/page.tsx`

- Заглушка предпросмотра PDF (плейсхолдер «PDF PREVIEW»)
- Имя файла и сводка настроек
- Чекбокс «I agree to Terms of Public Printing Service» (привязан к якорю `#terms`)
- **Валидация:** чекбокс должен быть отмечен для продолжения
- Кнопка «Continue to payment» ведёт на `/payment`

**Состояние:** `setTermsAccepted()`

---

## Шаг 8: Оплата (`/payment`)

**Файл:** `frontend/app/payment/page.tsx`

- Блок с итоговой ценой:
  - Чёрно-белая печать: **90 ₸** за копию
  - Цветная печать: **180 ₸** за копию
  - Формула: `copies × (colorMode === "color" ? 180 : 90)`
- Выбор способа оплаты:
  - **Kaspi QR** — рекомендованный (по умолчанию)
  - **Bank Card** — Visa, MasterCard, Mir
  - **Apple Pay**
- Кнопка «Pay now» (заглушка — не выполняет действий)

**Состояние:** `setPaymentMethod()`, читает `settings` для расчёта

---

## Примеры расчёта цены

| Копий | Режим | Цена |
|-------|-------|------|
| 1 | Ч/Б | 90 ₸ |
| 1 | Цвет | 180 ₸ |
| 5 | Ч/Б | 450 ₸ |
| 5 | Цвет | 900 ₸ |
| 10 | Цвет | 1 800 ₸ |
