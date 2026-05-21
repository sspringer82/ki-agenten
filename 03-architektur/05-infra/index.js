// main.js
import { orchestrate } from './orchestrator.js';
import { staticTask } from './task.js';

async function main() {
  const result = await orchestrate(staticTask);

  console.log('\nFinal Result:');
  console.log(JSON.stringify(result, null, 2));
}

main();
