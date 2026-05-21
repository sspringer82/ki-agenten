// flight-agent.js
// Subagent: bewertet Flüge anhand eines fertigen Task-Objekts
// 5-Schichten-Architektur: Knowledge, Integration, Orchestration

// -------------------- Knowledge Layer --------------------

const knowledge = {
  cheapThreshold: 180,
  durationWeight: 0.3,
  priceWeight: 0.5,
  airlineWeight: 0.2,

  airlineScores: {
    Lufthansa: 0.9,
    Vueling: 0.7,
    Ryanair: 0.4,
  },

  scoreFlight(flight, preferences) {
    const priceScore = Math.max(0, 1 - flight.price / 400);
    const durationScore = Math.max(0, 1 - flight.durationHours / 5);
    const airlineScore = this.airlineScores[flight.airline] ?? 0.5;

    let score =
      priceScore * this.priceWeight +
      durationScore * this.durationWeight +
      airlineScore * this.airlineWeight;

    if (preferences?.includes('cheap')) {
      score += priceScore * 0.2;
    }

    return score;
  },

  isCheap(flight, maxBudget) {
    return flight.price <= maxBudget;
  },
};

// -------------------- Integration Layer --------------------

const integration = {
  async getFlightOptions({ destination, dateRange }) {
    // In echt: API-Call
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

// -------------------- Orchestration Layer (Subagent) --------------------

export async function flightAgent(task) {
  const { destination, dateRange, maxBudget, preferences } = task;

  const flights = await integration.getFlightOptions({
    destination,
    dateRange,
  });

  if (flights.length === 0) {
    return {
      best: null,
      all: [],
      reasoning: 'No flights found.',
    };
  }

  const scored = flights.map((f) => ({
    ...f,
    score: knowledge.scoreFlight(f, preferences),
    cheap: knowledge.isCheap(f, maxBudget),
  }));

  scored.sort((a, b) => b.score - a.score);

  return {
    best: scored[0],
    all: scored,
    reasoning: `Evaluated ${scored.length} flights using monolithic scoring logic.`,
  };
}
