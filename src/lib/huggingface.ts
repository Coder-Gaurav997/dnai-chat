import { Model } from "./models";

export async function generateResponse(
  model: Model,
  messages: { role: string; content: string }[]
): Promise<string> {
  const API_URL = `https://api-inference.huggingface.co/models/${model.huggingFaceId}/v1/chat/completions`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        max_tokens: 512,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace API error:", response.status, errorText);
      throw new Error(`Model returned ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling HuggingFace:", error);
    throw error;
  }
}
