# AnimeMotion AI 2.0

## Состав
- `index.html` — сайт с IMAGE STUDIO и интерфейсом VIDEO STUDIO.
- `worker.js` — рабочая генерация изображений через Cloudflare Workers AI / FLUX.1 Schnell; видео endpoint честно возвращает `503`, пока видеопровайдер не подключён.
- `wrangler.toml` — конфигурация Worker и AI binding.
- `package.json` — Wrangler.

## Важно
Image Studio сохраняет текущую рабочую схему. Video Studio поддерживает выбор Text to Video / Image to Video и параметры интерфейса, но реальная генерация MP4 ещё не подключена. Никакая фальшивая генерация не запускается. Для реального видео потребуется отдельный видеопровайдер с доступным API и его настройка.

## Обновление
Заменить в GitHub репозитории `21why/animemotion` файлы `index.html` и `worker.js` содержимым из архива. `wrangler.toml` и `package.json` оставить/заменить соответствующими файлами из архива. После коммита дождаться публикации GitHub Pages и деплоя Worker.
