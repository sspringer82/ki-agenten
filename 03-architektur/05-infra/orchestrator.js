// orchestrator.js
import { getWeather } from './integration.js';
import { log } from './infrastructure.js';

export async function orchestrate(task) {
  const destination = task.fields.destination;

  log('info', 'Starting orchestration', { task });

  const weather = await getWeather(destination);

  log('info', 'Finished orchestration');

  return {
    destination,
    weather,
  };
}
