#!/usr/bin/env node
/**
 * Operation 111 · Agent 34 — static energy architecture contracts against the V9.4 monolith.
 * Does not execute game code; verifies required symbols and wiring strings remain present.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const monolith = join(root, '(V9.4) australia-game-with-ai.tsx');

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function check(name, ok) {
  if (ok) console.log(`OK  ${name}`);
  else fail(name);
}

let src;
try {
  src = readFileSync(monolith, 'utf8');
} catch {
  fail(`missing monolith at ${monolith}`);
  process.exit(1);
}

const mustInclude = [
  ["NATIONAL_NETWORKS includes energy", /export const NATIONAL_NETWORKS[^]*?'energy'/],
  ['computeNationalSystems exported', /export function computeNationalSystems\(/],
  ['nsDemand energy industry load', /energy: \[f\('Baseline energy use'/],
  ['LR renewable_grid profile', /renewable_grid: \{ capacity: \{ energy:/],
  ['LR offshore_wind_farm profile', /offshore_wind_farm: \{ capacity: \{ energy:/],
  ['LR green_hydrogen_terminal profile', /green_hydrogen_terminal: \{ capacity: \{ energy:/],
  ['V10.2 renewable_grid network role', /renewable_grid: ip\('renewable_grid', \[\{ network: 'energy'/],
  ['renewable_energy_grid contract type', /'renewable_energy_grid'/],
  ['sa_clean_energy_council faction', /id: 'sa_clean_energy_council'/],
  ['Strategic supply energy kind', /export type StrategicSupplyKind[^]*'energy'/],
  ['nationalProjectNetworkEffects', /export function nationalProjectNetworkEffects\(/],
  ['energy crisis factor in nsCrisisFactor', /grid\|blackout\|energy\|power\|fuel/],
  ['V10.0 self-test hook', /runV100NationalSystemsSelfTests/],
  ['V10.2 self-test hook', /runV102StrategicInfrastructureNetworksSelfTests/],
];

for (const [name, re] of mustInclude) {
  check(name, re.test(src));
}

if (process.exitCode) {
  console.error('\nEnergy systems contract: FAILED');
  process.exit(process.exitCode);
}
console.log('\nEnergy systems contract: PASSED');
