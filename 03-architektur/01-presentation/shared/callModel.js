import OpenAI from 'openai';

const MODEL = 'llama3.2:latest';
// const MODEL = 'llama3.2:1b';
// const MODEL = 'gemma4:e4b';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

export async function callModel(messages, stream = false) {
  const result = await client.chat.completions.create({
    model: MODEL,
    messages,
    stream,
    temperature: 0,
  });

  if (!stream) {
    return result.choices[0].message.content;
  }
  return result;
}
