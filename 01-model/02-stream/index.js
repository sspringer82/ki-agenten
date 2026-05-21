const MODEL = 'gemma4:e2b';
const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';

const requestBody = {
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
  stream: true, // Enable streaming
};

async function getTravelPlan() {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    console.log('--- Travel Plan (Streaming) ---');

    for await (const chunk of response.body) {
      const decodedChunk = new TextDecoder().decode(chunk);
      const lines = decodedChunk.split('\n');

      for (const line of lines) {
        if (!line.trim() || line.includes('[DONE]')) continue;

        const cleanLine = line.replace(/^data: /, '');
        try {
          const json = JSON.parse(cleanLine);
          const content = json.choices[0].delta?.content || '';
          process.stdout.write(content);
        } catch {
          // Ignore partial JSON lines if they occur
        }
      }
    }

    console.log('\n\n--- Done ---');
  } catch (error) {
    console.error('Error connecting to Ollama:', error.message);
  }
}

getTravelPlan();
