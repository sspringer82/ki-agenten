import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const USER_EXIT = 'exit';

const rl = readline.createInterface({ input, output });

export async function getUserInput(prompt) {
  const userPrompt = await rl.question(`${prompt} `);

  console.log(userPrompt);

  if (userPrompt.toLowerCase() === USER_EXIT) {
    rl.close();
    throw new Error(USER_EXIT);
  }

  return userPrompt;
}
