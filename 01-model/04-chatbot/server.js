import express from 'express';
import OpenAI from 'openai';

const app = express();

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

app.use(express.json());
app.use(express.static('public')); // Serves our HTML/CSS

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const stream = await openai.chat.completions.create({
      model: 'llama3.2:1b',
      messages: [
        { role: 'system', content: 'You are a helpful Travel Agent.' },
        { role: 'user', content: message },
      ],
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      res.write(content);
    }
    res.end();
  } catch (error) {
    res.status(500).send('Error connecting to Ollama');
  }
});

app.listen(3332, () => console.log('Server running at http://localhost:3000'));
