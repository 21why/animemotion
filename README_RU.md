AnimeMotion AI — генератор изображений на Cloudflare Workers AI

Файлы:
- index.html — сайт генератора изображений
- worker.js — API для генерации
- wrangler.toml — конфигурация Worker и AI binding
- package.json — Wrangler

Замените в GitHub-репозитории 21why/animemotion файлы index.html, worker.js и wrangler.toml.
package.json можно оставить существующий.

После commit Cloudflare должен автоматически развернуть Worker из GitHub.
Проверьте:
https://animemotion.ebashynamid.workers.dev/api/health

Ожидаемое поле: "imageGenerationConfigured": true.

Модель: @cf/black-forest-labs/flux-1-schnell.
Workers AI использует бесплатную дневную квоту, которая ограничена и может меняться. При исчерпании квоты запросы могут перестать выполняться до сброса.
Не включайте платный план и не добавляйте способ оплаты ради проекта.
