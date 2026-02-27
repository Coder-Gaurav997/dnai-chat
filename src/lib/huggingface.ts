import { supabase } from "@/integrations/supabase/client";
import { Model } from "./models";
import { ChatConfig } from "./config";

export async function generateResponse(
  model: Model,
  messages: { role: string; content: string }[],
  config: ChatConfig
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("huggingface-proxy", {
    body: {
      messages,
      model: model.huggingFaceId,
      system_prompt: config.systemPrompt,
      temperature: config.temperature,
      top_p: config.topP,
      max_tokens: config.maxTokens,
    },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(`Failed to call AI: ${error.message}`);
  }

  if (data?.error) {
    console.error("HuggingFace API error:", data.error);
    throw new Error(`HuggingFace error: ${data.error}`);
  }

  const content = data?.response;
  if (!content) {
    console.error("Unexpected response format:", data);
    throw new Error("No response content received");
  }

  return content;
}
