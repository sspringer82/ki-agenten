// flight-agent.js
export function flightAgent(request) {
  return {
    flight: 'LH1810',
    price: 220,
  };
}

// hotel-agent.js
export function hotelAgent(request) {
  return {
    hotel: 'Hotel Sol',
    pricePerNight: 120,
    nights: request.nights,
  };
}

// budget-agent.js
export function budgetAgent({ flight, hotel, maxBudget }) {
  const total = flight.price + hotel.pricePerNight * hotel.nights;

  return {
    total,
    affordable: total <= maxBudget,
  };
}

// main.js
const request = {
  destination: 'Barcelona',
  nights: 3,
  maxBudget: 600,
};

const flight = flightAgent(request);
const hotel = hotelAgent(request);
const budget = budgetAgent({ flight, hotel, maxBudget: request.maxBudget });

console.log('Gesamtpreis:', budget.total);
console.log('Leistbar:', budget.affordable);
