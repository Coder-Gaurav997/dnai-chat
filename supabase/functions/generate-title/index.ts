import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstMessage } = await req.json();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: "Generate a short, meaningful title (2-5 words) for a chat conversation. Return ONLY the title, nothing else. No quotes, no punctuation at the end.",
          },
          {
            role: "user",
            content: `The first message in the chat is: "${firstMessage}"`,
          },
        ],
        max_tokens: 20,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim() || "Chat Export";

    return new Response(JSON.stringify({ title }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ title: "Chat Export" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
