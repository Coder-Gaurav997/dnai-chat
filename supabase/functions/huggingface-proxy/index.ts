import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, max_tokens } = await req.json();

    const hfToken = Deno.env.get("HUGGINGFACE_API_TOKEN");
    if (!hfToken) {
      return new Response(
        JSON.stringify({ error: "HUGGINGFACE_API_TOKEN is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // OpenAI-compatible endpoint — model goes in the body, not the URL
    const API_URL = "https://router.huggingface.co/hf-inference/v1/chat/completions";

    console.log("Calling HF API with model:", model);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hfToken}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: max_tokens || 512,
        stream: false,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("HuggingFace API error:", response.status, responseText);
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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
