

## Connect to Your HuggingFace Space

Your Space (`DarkNeuronAI/Chat-Humour-LLM-v1`) runs a FastAPI server with a `/api/chat` endpoint. We'll rewrite the backend function to call your Space directly -- no HuggingFace API token needed since Spaces are public.

### How Your Space API Works

Your Space accepts POST requests to `/api/chat` with this body:
```text
{
  "messages": [{"role": "user", "content": "Hello"}],
  "temperature": 0.7,
  "top_p": 0.9,
  "max_tokens": 256,
  "system_prompt": "You are DNAI, a helpful and humorous AI assistant."
}
```

And returns: `{"response": "..."}`

This is different from the OpenAI format we were using before, so both the edge function and client code need updating.

### No API Token Required

Since your Space is public, no secret or API key is needed. We can remove the `HUGGINGFACE_API_TOKEN` dependency entirely.

---

### Changes

**1. Rewrite `supabase/functions/huggingface-proxy/index.ts`**
- Change the API URL to `https://darkneuronai-chat-humour-llm-v1.hf.space/api/chat`
- Remove the `HUGGINGFACE_API_TOKEN` check and `Authorization` header
- Send the request body in the format your Space expects (`messages`, `temperature`, `top_p`, `max_tokens`, `system_prompt`)
- Return the response as-is

**2. Update `src/lib/huggingface.ts`**
- Change response parsing from `data.choices[0].message.content` to `data.response` (matching your Space's response format)

**3. Update `src/lib/models.ts`**
- Change `huggingFaceId` to `"DarkNeuronAI/dnai-humour-0.5B-instruct"` (for display purposes; the Space URL is hardcoded in the edge function)

---

### Technical Details

- The Space may take 30-60 seconds to cold-start if it has been sleeping. During this time, requests will get a 503 error. The existing error handling in the UI already covers this gracefully.
- No database changes needed.
- No secrets needed.

