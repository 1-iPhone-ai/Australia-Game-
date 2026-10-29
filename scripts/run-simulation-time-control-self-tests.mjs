#!/usr/bin/env node
/**
 * Headless runner for Operation 111 Agent 105 simulation time-control self-tests.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameModuleUrl = pathToFileURL(
  path.join(__dirname, '..', '(V9.4) australia-game-with-ai.tsx')
).href;

const { runO111SimulationTimeControlSelfTests } = await import(gameModuleUrl);
const results = runO111SimulationTimeControlSelfTests();
const failed = results.filter(r => !r.passed);
for (const r of results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id}: ${r.name}${r.detail && r.detail !== 'ok' ? ` — ${r.detail}` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
