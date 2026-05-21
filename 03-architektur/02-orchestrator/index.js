// -----------------------------
// Example Agents (very simplified)
// -----------------------------

async function loadPreferences(userId) {
  return {
    prefersDirectFlights: true,
    budget: 'medium',
  };
}

async function searchFlights(destination, preferences) {
  return [
    { id: 1, airline: 'Lufthansa', price: 320, direct: true },
    { id: 2, airline: 'Vueling', price: 180, direct: false },
  ];
}

async function searchHotels(destination) {
  return [
    { id: 1, name: 'Hotel Barcelona Center', price: 120 },
    { id: 2, name: 'Budget Inn', price: 60 },
  ];
}

async function suggestActivities(destination) {
  return [
    { name: 'Sagrada Familia', duration: 2 },
    { name: 'Beach Day', duration: 6 },
  ];
}

async function optimizePlan(flights, hotels, activities, preferences) {
  return {
    bestFlight: flights.find(
      (f) => f.direct === preferences.prefersDirectFlights,
    ),
    bestHotel: hotels[0],
    recommendedActivities: activities.slice(0, 2),
  };
}

// -----------------------------
// Orchestrator
// -----------------------------

export async function orchestrate(taskObject) {
  if (taskObject.task !== 'travel_plan') {
    throw new Error('Unsupported task');
  }

  const destination = taskObject.fields.destination;

  console.log('Step 1: Loading preferences...');
  const preferences = await loadPreferences('user-123');

  console.log('Step 2: Searching flights...');
  const flights = await searchFlights(destination, preferences);

  console.log('Step 3: Searching hotels...');
  const hotels = await searchHotels(destination);

  console.log('Step 4: Suggesting activities...');
  const activities = await suggestActivities(destination);

  console.log('Step 5: Optimizing...');
  const optimized = await optimizePlan(
    flights,
    hotels,
    activities,
    preferences,
  );

  return {
    destination,
    preferences,
    flights,
    hotels,
    activities,
    optimized,
  };
}

// -----------------------------
// Example usage
// -----------------------------

async function main() {
  const task = {
    task: 'travel_plan',
    fields: {
      destination: 'Barcelona',
    },
  };

  const result = await orchestrate(task);
  console.log('\nFinal Orchestrated Result:');
  console.log(JSON.stringify(result, null, 2));
}

main();
