#!/usr/bin/env node
/**
 * Operation 111 · Agent 83 — static determinism / RNG architecture contracts against the V9.4 monolith.
 * Does not execute game code; verifies required symbols and invariants remain present.
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
  ['GameplayRngRegistry class', /export class GameplayRngRegistry/],
  ['globalRngRegistry singleton', /export const globalRngRegistry = new GameplayRngRegistry/],
  ['RNG stream name table', /export const RNG_STREAM_NAMES = \[/],
  ['drawGameplayRandom entry', /function drawGameplayRandom\(/],
  ['withRngScope wrapper', /function withRngScope</],
  ['strict unscoped draw guard', /Unscoped random draw detected inside active gameplay/],
  ['markReplayUncertified', /markReplayUncertified\(/],
  ['exportStreamStates / importStreamStates', /exportStreamStates\(\)/],
  ['save rngRegistryState round-trip hook', /s_rng_counters_restored/],
  ['LAB global isolation helper', /export function v95WithIsolatedGlobals</],
  ['V95 replay suite in gate', /id: 'replay', label: 'Replay Studio'/],
  ['V95 reliability suite in gate', /id: 'reliability', label: 'Reliability upgrade regressions'/],
  ['deterministic id counters', /export function createInitialDeterministicCounters/],
  ['2x determinism harness', /function verify2xDeterminism\(/],
  ['preserveReplayDeterminism setting', /preserveReplayDeterminism/],
  ['hybrid fallback marks uncertified (F11)', /Hybrid RNG fallback was silent/],
];

for (const [name, re] of mustInclude) {
  check(name, re.test(src));
}

// Gameplay code must not call bare Math.random without audit path (allow in RNG implementation only).
const mathRandomHits = [...src.matchAll(/\bMath\.random\s*\(/g)];
const implWindowStart = src.indexOf('export class GameplayRngRegistry');
const implWindowEnd = src.indexOf('export function runReliabilityUpgradeSelfTests');
const gameplayRandomCalls = mathRandomHits.filter((m) => {
  const idx = m.index ?? 0;
  return idx < implWindowStart || idx > implWindowEnd;
});
check(
  'no Math.random in gameplay band outside RNG/test implementation windows',
  gameplayRandomCalls.length === 0
);

if (process.exitCode) {
  console.error('\nDeterminism contract: FAILED');
  process.exit(process.exitCode);
}
console.log('\nDeterminism contract: PASSED');
