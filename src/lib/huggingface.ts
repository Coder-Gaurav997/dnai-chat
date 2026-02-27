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

  let content = data?.response;
  if (!content) {
    console.error("Unexpected response format:", data);
    throw new Error("No response content received");
  }

  // Trim to last full sentence to avoid mid-sentence cutoff
  content = trimToLastSentence(content);

  return content;
}

function trimToLastSentence(text: string): string {
  const trimmed = text.trim();
  // Find the last sentence-ending punctuation
  const lastPeriod = trimmed.lastIndexOf(".");
  const lastExclaim = trimmed.lastIndexOf("!");
  const lastQuestion = trimmed.lastIndexOf("?");
  const lastEnd = Math.max(lastPeriod, lastExclaim, lastQuestion);

  // If we found sentence-ending punctuation and it's not the whole string's last char,
  // trim to it (meaning the response was cut off mid-sentence)
  if (lastEnd > 0 && lastEnd < trimmed.length - 1) {
    return trimmed.substring(0, lastEnd + 1);
  }

  return trimmed;
}
