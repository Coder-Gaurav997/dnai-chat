import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const allowedOrigins = [
  "https://dnai-chat.lovable.app",
  "https://id-preview--74541d7a-2a9a-4d6b-8b31-8ed09c13864f.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const API_URL = "https://darkneuronai-chat-humour-llm-v1.hf.space/api/chat";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, system_prompt, temperature, top_p, max_tokens } = await req.json();

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (messages.length > 100) {
      return new Response(
        JSON.stringify({ error: "Message history too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid message format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > 10000) {
        return new Response(
          JSON.stringify({ error: "Message too long" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate system_prompt
    if (system_prompt && (typeof system_prompt !== "string" || system_prompt.length > 5000)) {
      return new Response(
        JSON.stringify({ error: "Invalid system prompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clamp numeric parameters
    const validTemp = Math.max(0, Math.min(2, temperature ?? 0.7));
    const validTopP = Math.max(0, Math.min(1, top_p ?? 0.8));
    const validMaxTokens = Math.max(1, Math.min(2048, max_tokens ?? 64));
    const requestedTokens = Math.min(validMaxTokens + 40, 600);

    console.log("Calling HF Space with", messages.length, "messages, max_tokens:", requestedTokens);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        system_prompt: system_prompt || "You are DN-Humour, a helpful and humorous AI assistant, created by DarkNeuronAI. Always answer in a funny, sarcastic and humorous way. You like to joke and make fun of everything.",
        temperature: validTemp,
        top_p: validTopP,
        max_tokens: requestedTokens,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("HF Space error:", response.status, responseText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(responseText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Request failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
