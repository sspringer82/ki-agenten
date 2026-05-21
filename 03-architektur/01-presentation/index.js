import OpenAI from 'openai';

import { callModel } from './shared/callModel.js';
import { getUserInput } from './shared/getUserInput.js';

const SCHEMA = {
  task: 'travel_plan',
  destination: '',
  dateRange: '',
  preferences: {},
  followUpQuestion: null,
};

const PROMPT = `
You are a travel consultant.

Your task:
Extract structured information about the user's travel plans and always respond with a JSON object that matches exactly this schema:

{
  "task": "travel_plan",
  "destination": "",
  "dateRange": "",
  "preferences": {},
  "followUpQuestion": null
}

Strict rules:
1. "destination" and "dateRange" are mandatory fields.
2. If the user does NOT clearly provide a value for a mandatory field:
   - leave the field as an empty string ""
   - AND you MUST set "followUpQuestion" to a single clarifying question.
3. Only when BOTH mandatory fields are present and unambiguous:
   - set "followUpQuestion" to null.
4. "preferences" must always be an object ({} if nothing is mentioned).
5. Output must be valid JSON only. No explanations, no markdown, no text outside the JSON.

Important:
- Never guess missing information.
- Never invent a dateRange or destination.
- If dateRange is missing or empty, ALWAYS include a question for it in the followUpQuestion field.
- If destination is missing or empty, ALWAYS include a question for it in the followUpQuestion field.
- Respect the information in the message history. If the user has already provided a value for a field in a previous message, you can use that information to avoid asking redundant questions.

Examples:
- User: "plan a trip to london"
  Response:
  {
    "task": "travel_plan",
    "destination": "London",
    "dateRange": "",
    "preferences": {},
    "followUpQuestion": "What date range are you planning for this trip?"
  }
- User: "plan a trip to london next week"
  Response:
  {
    "task": "travel_plan",
    "destination": "London",
    "dateRange": "next week",
    "preferences": {},
    "followUpQuestion": null
  }
- User: "plan a trip next week"
  Response:
  {
    "task": "travel_plan",
    "destination": "",
    "dateRange": "next week",
    "preferences": {},
    "followUpQuestion": "What destination are you interested in for this trip?"
  }
`;

const messages = [{ role: 'system', content: PROMPT }];

async function main() {
  const userInput = await getUserInput(
    'How can I help you with your travel plans?\nUser: ',
  );
  messages.push({ role: 'user', content: userInput });

  while (true) {
    const rawResponse = await callModel(messages);

    const parsed =
      typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

    messages.push({
      role: 'assistant',
      content: JSON.stringify(parsed),
    });

    if (parsed.followUpQuestion) {
      const followUpInput = await getUserInput(
        `Follow-up: ${parsed.followUpQuestion}\nUser: `,
      );
      messages.push({ role: 'user', content: followUpInput });
    } else {
      console.log('Final structured output:', parsed);
      break;
    }
  }
}

main();
