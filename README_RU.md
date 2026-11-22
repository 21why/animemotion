AnimeMotion AI — Cloudflare Worker

Файлы:
- worker.js — серверные маршруты /api/health и /api/generate
- wrangler.toml — конфигурация Cloudflare Worker

Публикация:
1. Добавьте оба файла в корень репозитория 21why/animemotion.
2. В Cloudflare выберите Workers & Pages → Create → Connect to Git.
3. Выберите репозиторий 21why/animemotion.
4. Build command оставьте пустым.
5. Deploy command: npx wrangler deploy
6. После публикации откройте https://ИМЯ-WORKER.ИМЯ-АККАУНТА.workers.dev/api/health

Важно:
Сейчас сервер является безопасной заготовкой и НЕ генерирует видео.
Он честно возвращает 503, пока не подключён поддерживаемый видеопровайдер и не реализован его API-адаптер.
Не помещайте API-ключи в index.html, GitHub или этот архив.
После публикации Worker его адрес потребуется подключить во frontend вместо относительного /api/generate.
