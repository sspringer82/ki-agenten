// role-flight-evaluator.js
// Rolle: Bewertet Flüge anhand definierter Kriterien
// Enthält: Input-Validierung, Heuristiken, Fallbacks, deterministische Logik

export const FlightEvaluatorRole = {
  name: 'FlightEvaluator',

  // -------------------- Input Validation --------------------
  validateInput(task) {
    if (!task.destination) throw new Error('Missing destination');
    if (!task.dateRange) throw new Error('Missing dateRange');
    if (typeof task.maxBudget !== 'number')
      throw new Error('maxBudget must be a number');
    if (!Array.isArray(task.preferences))
      throw new Error('preferences must be an array');
  },

  // -------------------- Role Boundaries --------------------
  boundaries: {
    noApiCalls: true,
    noTextGeneration: true,
    noPlanning: true,
    noUserInterpretation: true,
  },

  // -------------------- Heuristics & Criteria --------------------
  weights: {
    price: 0.5,
    duration: 0.3,
    airline: 0.2,
    cheapPreferenceBoost: 0.2,
  },

  airlineScores: {
    Lufthansa: 0.9,
    Vueling: 0.7,
    Ryanair: 0.4,
  },

  fallbackAirlineScore: 0.5,

  getAirlineScore(airline) {
    return this.airlineScores[airline] ?? this.fallbackAirlineScore;
  },

  // -------------------- Output Formatting --------------------
  formatOutput(flight, score, cheap) {
    return {
      flight: flight.flight,
      price: flight.price,
      durationHours: flight.durationHours,
      airline: flight.airline,
      score: Number(score.toFixed(2)),
      cheap,
    };
  },

  // -------------------- Core Evaluation Logic --------------------
  evaluate(flight, task) {
    this.validateInput(task);

    const priceScore = Math.max(0, 1 - flight.price / 400);
    const durationScore = Math.max(0, 1 - flight.durationHours / 5);
    const airlineScore = this.getAirlineScore(flight.airline);

    let score =
      priceScore * this.weights.price +
      durationScore * this.weights.duration +
      airlineScore * this.weights.airline;

    if (task.preferences.includes('cheap')) {
      score += priceScore * this.weights.cheapPreferenceBoost;
    }

    const cheap = flight.price <= task.maxBudget;

    return this.formatOutput(flight, score, cheap);
  },
};
