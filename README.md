# Monte Magic

`Monte Magic` — это новая версия сайта `Montenegro Travel`, собранная не на PHP, а на стеке `Next.js + React + Payload CMS + PostgreSQL`.

Проект повторяет структуру и подачу текущего WordPress-сайта, но перенесён на современную архитектуру с управляемым контентом через админку Payload. В проекте уже настроены 4 языка контента:

- `ru`
- `en`
- `de`
- `me`

Админка Payload при этом ориентирована на русскоязычную работу.

## Стек

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Payload CMS 3`
- `PostgreSQL 18`
- `Docker Compose`

## Что уже реализовано

- отдельный проект в папке `Monte-Magic`, не затрагивающий `Goose_Garden` и `montenegro-travel`
- отдельные контейнеры и порты
- русифицированная админка Payload
- 4 локали контента
- сущности для:
  - экскурсий
  - расписания
  - команды
  - трансферов
  - партнёров
  - контактов
  - заявок
  - медиа
- сид с демо-наполнением
- форма заявок с записью в БД
- готовая Docker-конфигурация
- исправленная навигация для блока `Трансферы / Партнёры`

## Маршруты и порты по умолчанию

- сайт: [http://localhost:3006/ru](http://localhost:3006/ru)
- админка: [http://localhost:3006/admin](http://localhost:3006/admin)
- PostgreSQL: `localhost:5434`

## Переменные окружения

Скопируйте `.env.example` в `.env` и при необходимости измените значения.

Ключевые переменные:

- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL`

Опционально:

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_PORT`
- `NOTIFICATION_EMAIL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Если `ADMIN_EMAIL` и `ADMIN_PASSWORD` заданы, сид может автоматически создать первого администратора.

## Запуск локально

### Вариант 1: полностью через Docker

```bash
docker compose up --build
```

### Вариант 2: Postgres в Docker, приложение локально

```bash
docker compose up -d postgres
npm install
npm run dev
```

## Наполнение демо-данными

После запуска базы выполните:

```bash
npm run seed
```

Сид заполняет:

- главную страницу
- трансферы
- партнёров
- контакты
- 7 экскурсий
- 5 ближайших выездов
- 3 карточки команды
- медиафайлы из локальной папки `src/assets/seed`

## Список экскурсий в демо-наборе

- Дурмитор, мост Джуржевича, Пивское озеро
- Котор, Пераст
- Тиват, Херцег-Нови
- Будва, Петровац, Свети-Стефан
- Монастырь Острог
- Луштица
- По запросу

## Структура контента

### Коллекции

- `users`
- `media`
- `tours`
- `schedule-items`
- `team-members`
- `inquiry-requests`

### Globals

- `site-settings`
- `home-page`
- `transfers-settings`
- `partners-settings`
- `contact-settings`
- `social-links`

## Локализация

В проекте используются 4 локали:

- `ru`
- `en`
- `de`
- `me`

Middleware автоматически добавляет локаль к URL, если она не указана.

Примеры:

- `/ru`
- `/en`
- `/de`
- `/me`

## Форма заявок

Форма отправляется через `POST /api/submit-inquiry`.

Реализовано:

- клиентская и серверная валидация
- honeypot
- простое rate limiting
- запись в коллекцию `inquiry-requests`
- опциональные уведомления на email и в Telegram

Если SMTP и Telegram не настроены, форма всё равно сохраняет заявку в базу.

## Сборка production

```bash
npm run build
npm start
```

Также production-сценарий поддержан в Docker:

```bash
docker compose up --build -d
```

## Полезные команды

```bash
npm run dev
npm run build
npm run start
npm run seed
npm run generate:types
npm run generate:importmap
```

## Примечания

- проект специально вынесен на `3006`, чтобы не конфликтовать с другими локальными приложениями
- Postgres использует `18`, а не `16`
- папка `docker/postgres/init/` в этом проекте намеренно пустая: схема создаётся Payload, а не SQL-дампом
