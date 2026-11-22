const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({
        ok: true,
        app: "AnimeMotion AI",
        server: "online",
        videoProviderConfigured: Boolean(env.VIDEO_PROVIDER_URL && env.VIDEO_PROVIDER_KEY)
      });
    }

    if (url.pathname === "/api/generate" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "invalid_json", message: "Отправь корректный JSON." }, 400);
      }

      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
      if (!prompt) {
        return json({ ok: false, error: "prompt_required", message: "Напиши описание видео." }, 400);
      }
      if (prompt.length > 2000) {
        return json({ ok: false, error: "prompt_too_long", message: "Описание должно быть короче 2000 символов." }, 400);
      }

      // Настоящая генерация будет добавлена после выбора и настройки видеопровайдера.
      if (!env.VIDEO_PROVIDER_URL || !env.VIDEO_PROVIDER_KEY) {
        return json({
          ok: false,
          error: "video_provider_not_configured",
          message: "Сервер работает, но модель генерации видео ещё не подключена. Видео не создавалось."
        }, 503);
      }

      return json({
        ok: false,
        error: "provider_adapter_not_implemented",
        message: "Данные провайдера настроены, но адаптер модели ещё не реализован. Генерация не запускалась."
      }, 501);
    }

    return json({ ok: false, error: "not_found" }, 404);
  }
};
