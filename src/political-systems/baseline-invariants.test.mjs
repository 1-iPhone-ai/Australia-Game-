import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  BASELINE_GAME_FILE,
  REQUIRED_EXPORTS,
  REQUIRED_SECTION_HEADERS,
  REQUIRED_SETTINGS_KEYS,
  V1011_OWNERSHIP_MARKERS,
} from './baseline-invariants.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const baselinePath = join(repoRoot, BASELINE_GAME_FILE);

function readBaseline() {
  return readFileSync(baselinePath, 'utf8');
}

test('baseline game file exists', () => {
  const src = readBaseline();
  assert.ok(src.length > 200_000, 'expected full V9.4 monolith');
});

test('section headers for political layers are present', () => {
  const src = readBaseline();
  for (const header of REQUIRED_SECTION_HEADERS) {
    assert.match(src, new RegExp(header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), header);
  }
});

test('V10.11 ownership markers are intact', () => {
  const src = readBaseline();
  for (const marker of V1011_OWNERSHIP_MARKERS) {
    assert.ok(src.includes(marker), `missing ownership marker: ${marker}`);
  }
});

test('core political exports exist', () => {
  const src = readBaseline();
  for (const exp of REQUIRED_EXPORTS) {
    assert.ok(src.includes(exp), `missing export signature: ${exp}`);
  }
});

test('settings keys referenced in spec exist in monolith', () => {
  const src = readBaseline();
  for (const key of REQUIRED_SETTINGS_KEYS) {
    assert.ok(src.includes(key), `missing settings key: ${key}`);
  }
});

test('Regional Factions stability routing test id exists', () => {
  const src = readBaseline();
  assert.ok(src.includes("check('rf_stability'"), 'rf_stability self-test anchor missing');
});
