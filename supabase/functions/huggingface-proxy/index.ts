import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_URL = "https://darkneuronai-chat-humour-llm-v1.hf.space/api/chat";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, system_prompt, temperature, top_p, max_tokens } = await req.json();

    // Request more tokens than the user setting to avoid mid-sentence cutoff,
    // then trim to the last full stop on the client side if needed.
    const requestedTokens = Math.min((max_tokens ?? 64) + 40, 600);

    console.log("Calling HF Space with", messages.length, "messages, max_tokens:", requestedTokens);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        system_prompt: system_prompt || "You are DN-Humour, a helpful and humorous AI assistant, created by DarkNeuronAI. Always answer in a funny, sarcastic and humorous way. You like to joke and make fun of everything.",
        temperature: temperature ?? 0.7,
        top_p: top_p ?? 0.8,
        max_tokens: requestedTokens,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("HF Space error:", response.status, responseText);
      return new Response(
        JSON.stringify({ error: responseText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(responseText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
