// infrastructure.js
// ------------------------------------
// Lightweight Infrastructure Layer
// ------------------------------------

export const config = {
  model: 'llama3.2:1b',
  maxTokens: 2000,
  weatherApiKey: 'demo-weather-key',
  logLevel: 'info',
};

export function log(level, message, data = {}) {
  if (level === 'error' || config.logLevel === 'info') {
    console.log(`[${level.toUpperCase()}] ${message}`, data);
  }
}

export function getApiKey(name) {
  if (name === 'weather') return config.weatherApiKey;
  return null;
}
