export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  huggingFaceId: string;
}

export const AVAILABLE_MODELS: Model[] = [
  {
    id: "dnai-humour",
    name: "DNAI Humour 0.5B",
    description: "A lightweight instruct model with a sense of humour",
    huggingFaceId: "meta-llama/Llama-3.2-3B-Instruct",
  },
];
