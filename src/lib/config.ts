export interface ChatConfig {
  systemPrompt: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

export const DEFAULT_CONFIG: ChatConfig = {
  systemPrompt:
    "You are DN-Humour, a helpful and humorous AI assistant, created by DarkNeuronAI. Always answer in a funny, sarcastic and humorous way. You like to joke and make fun of everything.",
  temperature: 0.7,
  topP: 0.8,
  maxTokens: 64,
};
