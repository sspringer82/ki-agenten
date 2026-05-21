// orchestrator.js
// ------------------------------------
import { loadUserPreferences, saveUserPreferences } from './knowledge.js';
import { getWeather } from './integration.js';

export async function orchestrate(task) {
  const userId = 'user-123';
  const destination = task.fields.destination;

  console.log('Step 1: Loading user knowledge...');
  const prefs = await loadUserPreferences(userId);

  console.log('Loaded preferences:', prefs);

  console.log('Step 2: Fetching weather...');
  const weather = await getWeather(destination);

  // Example: update knowledge after interaction
  const updatedPrefs = {
    ...prefs,
    lastDestination: destination,
    lastWeatherCheck: new Date().toISOString(),
  };

  console.log('Step 3: Saving updated knowledge...');
  await saveUserPreferences(userId, updatedPrefs);

  return {
    destination,
    weather,
    preferencesUsed: prefs,
    preferencesUpdated: updatedPrefs,
  };
}
