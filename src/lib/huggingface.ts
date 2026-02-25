import { supabase } from "@/integrations/supabase/client";
import { Model } from "./models";

export async function generateResponse(
  model: Model,
  messages: { role: string; content: string }[]
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("huggingface-proxy", {
      body: {
        messages,
        model: model.huggingFaceId,
        max_tokens: 512,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error("Failed to get response");
    }

    if (data.error) {
      console.error("HuggingFace error:", data.error);
      throw new Error(data.error);
    }

    return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling HuggingFace:", error);
    throw error;
  }
}
