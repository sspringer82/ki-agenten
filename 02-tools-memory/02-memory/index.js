import OpenAI from 'openai';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';

const MODEL = 'llama3.2:1b';
const PREFS_FILE = './preferences.json';

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

// --- Utility Functions ---

function loadPreferences() {
  if (fs.existsSync(PREFS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PREFS_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function savePreferences(prefs) {
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
}

/**
 * The "Brain" step: Analyzes the chat and extracts preferences as JSON.
 */
async function extractAndMergePreferences(
  userMessage,
  aiResponse,
  currentPrefs,
) {
  const extractionPrompt = `
    Analyze the following conversation between a user and a travel consultant.
    Extract any permanent travel preferences (e.g., diet, budget style, interests, pace of travel).
    
    Current Preferences: ${JSON.stringify(currentPrefs)}
    User said: "${userMessage}"
    AI replied: "${aiResponse}"

    Return ONLY a JSON object representing the UPDATED preferences. 
    Merge new info with old info. Do not include any prose or explanation.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: extractionPrompt }],
      stream: false, // We want the full JSON back at once
    });

    const rawContent = response.choices[0].message.content;
    // Attempt to parse the JSON (cleaning up potential markdown blocks)
    const jsonString = rawContent.replace(/```json|```/g, '').trim();
    const newPrefs = JSON.parse(jsonString);

    savePreferences(newPrefs);
    return newPrefs;
  } catch (error) {
    console.error('\n[System] Failed to update preferences auto-magically.');
    return currentPrefs;
  }
}

// --- Main Loop ---

async function startTravelConsultant() {
  const rl = readline.createInterface({ input, output });
  let userPrefs = loadPreferences();

  console.log('--- AI Travel Consultant (with Auto-Memory) ---');
  console.log('Type your request. I will remember your details as we talk.\n');

  while (true) {
    const userPrompt = await rl.question('User: ');

    if (userPrompt.toLowerCase() === 'exit') {
      rl.close();
      break;
    }

    try {
      // 1. Generate the Travel Response (Streaming)
      const stream = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a travel consultant. Current User Profile: ${JSON.stringify(userPrefs)}`,
          },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
      });

      process.stdout.write('\nConsultant: ');
      let fullAIResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullAIResponse += content;
        process.stdout.write(content);
      }
      process.stdout.write('\n\n');

      // 2. Background Extraction (The "Analysis" step)
      process.stdout.write('(Updating preferences...) ');
      userPrefs = await extractAndMergePreferences(
        userPrompt,
        fullAIResponse,
        userPrefs,
      );
      process.stdout.write('Done.\n\n');
    } catch (error) {
      console.error('\nError:', error.message);
    }
  }
}

startTravelConsultant();
