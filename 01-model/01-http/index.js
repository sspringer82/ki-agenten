const MODEL = 'gemma4:e2b'; // Change this to your local model name
const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';

const prompt = {
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
  stream: false,
};

async function getTravelPlan() {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const content = data.choices[0].message.content;

    console.log('--- Travel Plan ---');
    console.log(content);
  } catch (error) {
    console.error('Error connecting to Ollama:', error.message);
  }
}

getTravelPlan();
