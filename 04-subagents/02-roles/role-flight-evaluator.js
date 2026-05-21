// role-flight-evaluator.js
// Rolle: Bewertet Flüge anhand definierter Kriterien

export const FlightEvaluatorRole = {
  name: 'FlightEvaluator',

  evaluate(flight, task) {
    const { preferences, maxBudget } = task;

    const priceScore = Math.max(0, 1 - flight.price / 400);
    const durationScore = Math.max(0, 1 - flight.durationHours / 5);

    const airlineScores = {
      Lufthansa: 0.9,
      Vueling: 0.7,
      Ryanair: 0.4,
    };

    const airlineScore = airlineScores[flight.airline] ?? 0.5;

    let score = priceScore * 0.5 + durationScore * 0.3 + airlineScore * 0.2;

    if (preferences?.includes('cheap')) {
      score += priceScore * 0.2;
    }

    return {
      score,
      cheap: flight.price <= maxBudget,
    };
  },
};
