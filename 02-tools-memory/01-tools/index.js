import OpenAI from 'openai';

const MODEL = 'llama3.2:1b';
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

// 1. Define the actual tool logic
async function getWeather(city) {
  // In a real scenario, you'd fetch from an API like OpenWeatherMap
  console.log(`\n[System]: Fetching weather for ${city}...`);
  const mockWeather = {
    Reykjavik: '5°C, Partly Cloudy, 15km/h wind',
    Akureyri: '2°C, Light Snow',
    Vik: '6°C, Rainy',
  };
  return mockWeather[city] || '7°C, Overcast';
}

// 2. Define the tool metadata for the LLM
const tools = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description:
        'Get the current weather for a specific city to help plan outdoor activities.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The name of the city, e.g., Reykjavik',
          },
        },
        required: ['city'],
      },
    },
  },
];

async function getTravelPlan() {
  try {
    let messages = [
      {
        role: 'system',
        content:
          'You are a comprehensive Travel Consultant. Use the weather tool to provide accurate advice for the photography route.',
      },
      {
        role: 'user',
        content:
          'Design a 5-day vacation to Iceland for a couple interested in photography and nature. Check the weather in Reykjavik first to decide if the first day is good for outdoor shots.',
      },
    ];

    // --- Step 1: Initial Call to see if the model wants to use a tool ---
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = response.choices[0].message;

    const toolCalls = responseMessage.tool_calls;

    // --- Step 2: Handle Tool Calls ---
    if (toolCalls) {
      messages.push(responseMessage); // Add the model's request to call the tool

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        if (functionName === 'getWeather') {
          const weatherData = await getWeather(functionArgs.city);

          // Add the tool result to the conversation
          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: functionName,
            content: weatherData,
          });
        }
      }
    }

    // --- Step 3: Get the Final Streaming Response ---
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      stream: true,
    });

    console.log('--- Travel Plan (Integrating Weather Data) ---');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }

    console.log('\n\n--- Done ---');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getTravelPlan();
