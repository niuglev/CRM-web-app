# Design Tokens — CRM Project

Единый набор цветов и типографики для проекта.  
Используется в Figma (через **Figma Tokens**), в коде (через SCSS/CSS) и в документации.

---

## Дизайн-стиль (контекст)
Ключевые слова, описывающие продукт: **надёжный · профессиональный · дружелюбный**.  
Исходя из этого выбраны цвета и шрифты: строгий, но тёплый базовый тон; читаемая нейтральная типографика; дружелюбные акценты.

---

## Brand Colors (визуальные примеры)

| Визуал | Token | HEX | Описание | Использование |
|--------|-------|-----:|----------|---------------|
| <div style="display:inline-block;width:48px;height:24px;background:#2563eb;border:1px solid #dcdcdc;"></div> | `professionalBlue` | `#2563eb` | Основной брендовый цвет | Главные кнопки, ссылки, заголовки |
| <div style="display:inline-block;width:48px;height:24px;background:#1e40af;border:1px solid #dcdcdc;"></div> | `deepNavy` | `#1e40af` | Тёмный профессиональный оттенок | Навигация, важные элементы |
| <div style="display:inline-block;width:48px;height:24px;background:#dbeafe;border:1px solid #dcdcdc;"></div> | `lightBlue` | `#dbeafe` | Светлый акцент | Фоны, выделение областей |
| <div style="display:inline-block;width:48px;height:24px;background:#16a34a;border:1px solid #dcdcdc;"></div> | `successGreen` | `#16a34a` | Дружелюбный зелёный | Статусы, подтверждения, рост |
| <div style="display:inline-block;width:48px;height:24px;background:#ea580c;border:1px solid #dcdcdc;"></div> | `warmOrange` | `#ea580c` | Тёплый предупреждающий цвет | Предупреждения, важные уведомления |
| <div style="display:inline-block;width:48px;height:24px;background:#dc2626;border:1px solid #dcdcdc;"></div> | `softRed` | `#dc2626` | Мягкий красный | Ошибки, критические статусы |
| <div style="display:inline-block;width:48px;height:24px;background:#8b5cf6;border:1px solid #dcdcdc;"></div> | `softPurple` | `#8b5cf6` | Дружелюбный фиолетовый | Акцентные элементы, метки |
| <div style="display:inline-block;width:48px;height:24px;background:#374151;border:1px solid #dcdcdc;"></div> | `charcoal` | `#374151` | Основной текст | Заголовки, основной контент |
| <div style="display:inline-block;width:48px;height:24px;background:#6b7280;border:1px solid #dcdcdc;"></div> | `mediumGray` | `#6b7280` | Вторичный текст | Подписи, дополнительная информация |
| <div style="display:inline-block;width:48px;height:24px;background:#e5e7eb;border:1px solid #dcdcdc;"></div> | `lightGray` | `#e5e7eb` | Границы и разделители | Границы, разделители, фоны |
| <div style="display:inline-block;width:48px;height:24px;background:#f9fafb;border:1px solid #dcdcdc;"></div> | `softBackground` | `#f9fafb` | Мягкий фон | Фон страниц, карточек |
| <div style="display:inline-block;width:48px;height:24px;background:#ffffff;border:1px solid #dcdcdc;"></div> | `pureWhite` | `#ffffff` | Чистый белый | Основной фон, карточки |

---

## ✅ Рекомендуемые сочетания (быстрые примеры)
- **Основная кнопка (Primary):** `background: #2563eb; color: #ffffff`  
- **Успех / подтверждение:** `#16a34a`  
- **Предупреждение:** `#ea580c`  
- **Ошибка:** `#dc2626`  
- **Основной текст:** `#374151` (хорошая читаемость на `#ffffff`/`#f9fafb`)  
- **Вторичный текст:** `#6b7280`  
- **Границы/структура:** `#e5e7eb`

---

## ✍️ Типографика — выбор шрифтов (рекомендации, лицензии, обоснование)

### Резюме выбора
1. **Primary / UI (body)** — **Inter**  
   - Почему: нейтральный, очень читаемый на малых размерах, хорошая кириллическая поддержка, оптимизирован для экранов.  
   - Лицензия: *SIL Open Font License* (подходит для коммерческого использования).  
   - Рекомендованные веса: `400`, `500`, `600`, `700`.

2. **Heading / Display** — **Poppins** (или Rubik / Manrope — вариант по вкусу)  
   - Почему: дружелюбный, современный геометрический гротеск; обеспечивает характер и легко читается.  
   - Лицензия: *SIL Open Font License* (Google Fonts).  
   - Рекомендованные веса: `500`, `600`, `700`.

3. **Monospace (иногда)** — **Roboto Mono** или **JetBrains Mono**  
   - Почему: для кодовых фрагментов, идентификаторов, логов в UI.  
   - Лицензия: *SIL Open Font License*.

> Примечание: все предложенные шрифты есть на Google Fonts — открытые, подходят для коммерческого и образовательного использования. Для production: либо подключаем через Google Fonts (CDN), либо self-host (рекомендуется для контроля производительности).

---

## 🧩 Типографическая система (примеры стилей)
| Style | Пример | Описание |
|-------|--------|---------|
| H1 | `font-family: "Poppins", "Inter", system-ui; font-weight: 700; font-size: 32px; line-height: 40px;` | Крупные заголовки страниц |
| H2 | `font-weight: 600; font-size: 24px; line-height: 32px;` | Заголовки секций |
| Body | `font-family: "Inter", system-ui; font-weight: 400; font-size: 16px; line-height: 24px;` | Основной текст |
| Small / Caption | `font-size: 12px; font-weight: 400; line-height: 16px; color: #6b7280;` | Подписи, подсказки |
| Button | `font-weight: 600; font-size: 14px; text-transform: none;` | Кнопки основного действия |



---

## 📎 Быстрые рекомендации командой
- Дизайнеры меняют цвета в Figma Styles (или через Tokens) — затем экспорт → разработчики обновляют `tokens.json` в Git и запускают сборку.  
- При смене цветовой системы — создавай Pull Request с описанием (почему меняешь) и кратким скриншотом (или ссылкой на Figma).

---
