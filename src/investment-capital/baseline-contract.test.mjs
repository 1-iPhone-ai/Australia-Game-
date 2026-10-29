/**
 * Operation 111 · Agent 28 — baseline structural contracts for investment & capital.
 * Pins section markers and export names in (V9.4) australia-game-with-ai.tsx until Agent 111 merges.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASELINE = join(__dirname, '../../(V9.4) australia-game-with-ai.tsx');

function readBaseline() {
  return readFileSync(BASELINE, 'utf8');
}

test('baseline file exists', () => {
  const src = readBaseline();
  assert.ok(src.length > 200_000, 'expected full V9.4 monolith');
});

test('section markers for capital systems', () => {
  const src = readBaseline();
  assert.match(src, /SECTION 20AA: V10\.8 REGIONAL COMPETITION/);
  assert.match(src, /SECTION 20AB: V10\.9 STRATEGIC CAPITAL ALLOCATION/);
  assert.match(src, /Never creates a second economy, never mutates cash\/debt\/costs/);
});

test('regional investment catalog has eight regions', () => {
  const src = readBaseline();
  const block = src.match(
    /const REGIONAL_INVESTMENTS: Record<string, \{ name: string; cost: number; dailyIncome: number \}> = \{([\s\S]*?)\};/
  );
  assert.ok(block, 'REGIONAL_INVESTMENTS block');
  const keys = [...block[1].matchAll(/^\s*([A-Z]{2,3}):/gm)].map((m) => m[1]);
  assert.deepEqual(
    keys.sort(),
    ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'].sort()
  );
});

test('strategic capital public API exports', () => {
  const src = readBaseline();
  const required = [
    'export function buildStrategicCapitalInputs',
    'export function computeStrategicCapitalPosition',
    'export function computeStrategicCapital',
    'export function runV109StrategicCapitalSelfTests',
  ];
  for (const sig of required) {
    assert.match(src, new RegExp(sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('yield and net-worth helpers present', () => {
  const src = readBaseline();
  assert.match(src, /function applyInvestmentReturn\(/);
  assert.match(src, /function getActorScaledInvestmentReturn\(/);
  assert.match(src, /export const calculateNetWorth/);
  assert.match(src, /REGIONAL_INVESTMENTS\[regionCode\]\?\.cost/);
});

test('runtime gating hooks', () => {
  const src = readBaseline();
  assert.match(src, /strategicCapitalEnabled/);
  assert.match(src, /investmentsEnabled/);
  assert.match(src, /buildStrategicCapitalInputs\(\{/);
  assert.match(src, /computeStrategicCapital\(inputs/);
});

test('regression registry wires V10.9 self-tests', () => {
  const src = readBaseline();
  assert.match(src, /runV109StrategicCapitalSelfTests\(\)/);
  assert.match(src, /V10\.9 Strategic Capital Allocation/);
});
