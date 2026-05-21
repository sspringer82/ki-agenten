// orchestrator.js
// -----------------------------
// Orchestrator
// -----------------------------

import { getWeather, searchFlights } from './integration.js';
import { weatherAgent } from './weatherAgent.js';

export async function orchestrate(task) {
  if (task.task !== 'travel_plan') {
    throw new Error('Unsupported task');
  }

  const { from, to } = task.fields;

  console.log('Step 1: Fetching weather...');
  const weather = await weatherAgent(to);

  console.log('Step 2: Searching flights...');
  const flights = await searchFlights(from, to);

  console.log('Step 3: Combining results...');
  return {
    destination: to,
    weather,
    flights,
  };
}
