// weatherAgent.js
import OpenAI from 'openai';
import { getWeather } from './integration.js';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

export async function weatherAgent(destination) {
  const response = await client.chat.completions.create({
    model: 'llama3.2:1b',
    messages: [
      {
        role: 'system',
        content: `
You are a weather agent. 
If you need weather data, call the tool "getWeather".
        `,
      },
      {
        role: 'user',
        content: `Get weather for ${destination}`,
      },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'getWeather',
          parameters: {
            type: 'object',
            properties: {
              city: { type: 'string' },
            },
            required: ['city'],
          },
        },
      },
    ],
  });

  const msg = response.choices[0].message;

  if (msg.tool_calls) {
    const call = msg.tool_calls[0];
    if (call.function.name === 'getWeather') {
      const args = JSON.parse(call.function.arguments);
      return await getWeather(args.city);
    }
  }

  return msg.content;
}
