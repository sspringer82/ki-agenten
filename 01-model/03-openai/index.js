import OpenAI from 'openai';

const MODEL = 'llama3.2:1b';
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

async function getTravelPlan() {
  try {
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a comprehensive Travel Consultant.',
        },
        {
          role: 'user',
          content:
            'Design a 5-day vacation to Iceland for a couple interested in photography and nature, with a budget of $5,000. Provide a daily route, suggest types of accommodation, and provide a categorized budget breakdown.',
        },
      ],
      stream: true,
    });

    console.log('--- Travel Plan (Streaming with SDK) ---');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }

    console.log('\n\n--- Done ---');
  } catch (error) {
    console.error('Error connecting via SDK:', error.message);
  }
}

getTravelPlan();
