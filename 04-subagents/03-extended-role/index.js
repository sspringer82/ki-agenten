// index.js
// Einstiegspunkt der Applikation

import { travelAgent } from './travel-agent.js';

async function main() {
  const userIntent = {
    destination: 'Barcelona',
    dateRange: 'next_week',
    budget: 300,
    preferences: ['cheap'],
  };

  const result = await travelAgent(userIntent);

  console.log(result.summary);
  console.log('Verwendete Rolle:', result.flights.roleUsed);
  console.log('Alle Optionen:', result.flights.all);
}

main();
