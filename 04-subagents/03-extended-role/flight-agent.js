// flight-agent.js
// Subagent: bewertet Flüge mithilfe der FlightEvaluatorRole

import { FlightEvaluatorRole } from './role-flight-evaluator.js';

const integration = {
  async getFlightOptions({ destination, dateRange }) {
    // Mock-Daten (Integration Layer)
    return [
      {
        flight: 'LH1810',
        price: 220,
        durationHours: 2.5,
        airline: 'Lufthansa',
      },
      { flight: 'VY7821', price: 140, durationHours: 2.7, airline: 'Vueling' },
      { flight: 'FR1234', price: 90, durationHours: 3.2, airline: 'Ryanair' },
    ];
  },
};

export async function flightAgent(task) {
  const flights = await integration.getFlightOptions(task);

  const evaluated = flights.map((f) => FlightEvaluatorRole.evaluate(f, task));

  evaluated.sort((a, b) => b.score - a.score);

  return {
    best: evaluated[0],
    all: evaluated,
    roleUsed: FlightEvaluatorRole.name,
  };
}
