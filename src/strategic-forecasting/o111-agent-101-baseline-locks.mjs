/**
 * Operation 111 · Agent 101 — baseline locks for strategic forecasting surfaces.
 * Static checks only (no import of the 241k-line game module).
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GAME = resolve(__dirname, '../../(V9.4) australia-game-with-ai.tsx');
const src = readFileSync(GAME, 'utf8');

const required = [
  { id: 'sec-20y', needle: 'SECTION 20Y: V10.6 RESILIENCE, DEPENDENCIES & SYSTEMIC RISK' },
  { id: 'export-runSystemicStressTest', needle: 'export function runSystemicStressTest(' },
  { id: 'export-compareStressTests', needle: 'export function compareStressTests(' },
  { id: 'export-createSystemicRiskFixture', needle: 'export function createSystemicRiskFixture(' },
  { id: 'export-projectNationalDevelopment', needle: 'export function projectNationalDevelopment(' },
  { id: 'export-nationalPriorityWhatIf', needle: 'export function nationalPriorityWhatIf(' },
  { id: 'export-nationalPriorityIgnoreProjection', needle: 'export function nationalPriorityIgnoreProjection(' },
  { id: 'type-StrategicStressTest', needle: 'export interface StrategicStressTest' },
  { id: 'stress-deterministic', needle: 'Deterministic counterfactual on the current structure' },
  { id: 'v106-regression', needle: "id: 'v106', label: 'V10.6 Resilience & Systemic Risk'" },
  { id: 'flag-systemicRiskEnabled', needle: 'systemicRiskEnabled: true' },
  { id: 'flag-nationalDevelopmentEnabled', needle: 'nationalDevelopmentEnabled: true' },
  { id: 'flag-nationalPrioritiesEnabled', needle: 'nationalPrioritiesEnabled: true' },
  { id: 'max-shocks-bound', needle: 'V106_LIMITS.maxShocks' },
  { id: 'crisis-boundary-test', needle: 'TEST 16 — crisis boundary: V10.6 never creates or advances a crisis' },
];

const forbidden = [
  {
    id: 'no-fake-probability-engine',
    pattern: /export function runStrategicForecast\s*\(/,
    message: 'Unified forecast must use proposed buildStrategicForecastBundle name until Agent 111 lands it',
  },
];

let failed = 0;

for (const { id, needle } of required) {
  if (!src.includes(needle)) {
    console.error(`FAIL [${id}] missing: ${needle.slice(0, 72)}…`);
    failed++;
  }
}

for (const { id, pattern, message } of forbidden) {
  if (pattern.test(src)) {
    console.error(`FAIL [${id}] ${message}`);
    failed++;
  }
}

// Sanity: stress test function must slice scenarios (bounded shocks)
const runBlock = src.slice(src.indexOf('export function runSystemicStressTest'), src.indexOf('export function compareStressTests'));
if (!runBlock.includes('.slice(0, V106_LIMITS.maxShocks)')) {
  console.error('FAIL [bounded-shocks] runSystemicStressTest must slice scenarios with V106_LIMITS.maxShocks');
  failed++;
}

if (failed) {
  console.error(`\n${failed} forecast contract check(s) failed.`);
  process.exit(1);
}

console.log(`OK — ${required.length} baseline locks + bounded-shock invariant (${GAME})`);
