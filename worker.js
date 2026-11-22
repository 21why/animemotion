const ALLOWED_ORIGIN = "https://21why.github.io";
const MODEL = "@cf/black-forest-labs/flux-1-schnell";

function json(data, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const corsOrigin = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      if (origin && origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
      }});
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok:true, app:"AnimeMotion AI", server:"online",
        imageGenerationConfigured:Boolean(env.AI), model:MODEL,
        videoGenerationConfigured:false,
        note:"Image generation uses Cloudflare Workers AI daily quota. Video provider is not connected." }, 200, corsOrigin);
    }

    if (url.pathname === "/api/generate-image" && request.method === "POST") {
      if (origin && origin !== ALLOWED_ORIGIN) return json({ok:false,error:"origin_not_allowed"},403,corsOrigin);
      let body;
      try { body = await request.json(); }
      catch { return json({ok:false,error:"invalid_json",message:"Отправлен некорректный JSON."},400,corsOrigin); }

      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
      if (!prompt) return json({ok:false,error:"prompt_required",message:"Напиши описание изображения."},400,corsOrigin);
      if (prompt.length > 1800) return json({ok:false,error:"prompt_too_long",message:"Описание должно быть не длиннее 1800 символов."},400,corsOrigin);
      if (!env.AI) return json({ok:false,error:"ai_binding_missing",message:"В Cloudflare не включена привязка Workers AI (AI)."},503,corsOrigin);

      const styles = {
        Anime:"anime illustration, expressive character design, polished anime artwork",
        Realistic:"photorealistic image, natural lighting, detailed textures",
        "3D":"high quality 3D render, detailed materials, cinematic lighting",
        Illustration:"beautiful digital illustration, refined composition",
        Cinematic:"cinematic concept art, dramatic composition, atmospheric lighting"
      };
      const style = styles[body.style] ? body.style : "Anime";
      try {
        const result = await env.AI.run(MODEL, { prompt:styles[style]+", "+prompt, steps:4 });
        if (!result || !result.image) return json({ok:false,error:"empty_model_response",message:"Модель не вернула изображение. Попробуй ещё раз."},502,corsOrigin);
        return json({ok:true,model:MODEL,style,mimeType:"image/jpeg",image:result.image},200,corsOrigin);
      } catch(error) {
        return json({ok:false,error:"generation_failed",
          message:"Генерация не удалась. Возможно, дневная квота исчерпана или модель временно недоступна.",
          detail:String(error).slice(0,300)},502,corsOrigin);
      }
    }

    if (url.pathname === "/api/generate-video" && request.method === "POST") {
      return json({ok:false,error:"video_provider_not_configured",
        message:"Видеопровайдер пока не подключён. Видео не было сгенерировано."},503,corsOrigin);
    }

    return json({ok:false,error:"not_found"},404,corsOrigin);
  }
};
