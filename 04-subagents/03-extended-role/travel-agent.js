// travel-agent.js
// Orchestrator: erzeugt Task-Objekte und ruft Subagenten auf

import { flightAgent } from './flight-agent.js';

export async function travelAgent(userIntent) {
  const flightTask = {
    destination: userIntent.destination,
    dateRange: userIntent.dateRange,
    maxBudget: userIntent.budget,
    preferences: userIntent.preferences,
  };

  const flights = await flightAgent(flightTask);

  return {
    flights,
    summary: `Bester Flug: ${flights.best.flight} für ${flights.best.price} €`,
  };
}
