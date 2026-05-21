// integration.js
import { getApiKey, log } from './infrastructure.js';

export async function getWeather(city) {
  const apiKey = getApiKey('weather');

  log('info', 'Calling weather API', { city });

  // Simulated API call
  return {
    city,
    avgTemp: 22,
    rainChance: 10,
    // uncomment for debugging
    // apiKeyUsed: apiKey,
  };
}
