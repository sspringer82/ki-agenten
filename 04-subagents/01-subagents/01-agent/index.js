// index.js
// Orchestrator der Applikation: erzeugt Task-Objekte und ruft Subagenten auf

import { flightAgent } from './flight-agent.js';

async function main() {
  // Beispiel: Der Reiseplanungs-Agent hat bereits NLU gemacht
  const flightTask = {
    destination: 'Barcelona',
    dateRange: 'next_week',
    maxBudget: 300,
    preferences: ['cheap'],
  };

  const result = await flightAgent(flightTask);

  if (!result.best) {
    console.log('Keine passenden Flüge gefunden.');
    return;
  }

  const best = result.best;

  console.log('Bester Flug:');
  console.log(`  Flug: ${best.flight}`);
  console.log(`  Airline: ${best.airline}`);
  console.log(`  Preis: ${best.price} €`);
  console.log(`  Dauer: ${best.durationHours} h`);
  console.log(`  Score: ${best.score.toFixed(2)}`);
  console.log(`  Unter Budget: ${best.cheap ? 'Ja' : 'Nein'}`);
}

main();
