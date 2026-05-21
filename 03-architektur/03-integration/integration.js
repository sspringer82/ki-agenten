// integration.js
// -----------------------------
// Integration Layer (Tools)
// -----------------------------

export async function getWeather(city) {
  // In reality: call weather API
  return {
    city,
    avgTemp: 22,
    rainChance: 10,
  };
}

export async function searchFlights(from, to) {
  // In reality: call flight API
  return [
    { airline: 'Lufthansa', price: 320, direct: true },
    { airline: 'Vueling', price: 180, direct: false },
  ];
}
