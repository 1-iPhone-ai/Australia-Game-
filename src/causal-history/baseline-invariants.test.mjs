import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import {
  BASELINE_GAME_FILE,
  REQUIRED_MARKERS,
  REQUIRED_SETTINGS_KEYS,
  SWR_CAUSAL_TEST_IDS,
  SWR_SUITE_ANCHOR,
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

test('causal history ownership markers are present', () => {
  const src = readBaseline();
  for (const marker of REQUIRED_MARKERS) {
    assert.ok(src.includes(marker), `missing marker: ${marker}`);
  }
});

test('causal history settings keys exist in monolith', () => {
  const src = readBaseline();
  for (const key of REQUIRED_SETTINGS_KEYS) {
    assert.ok(src.includes(key), `missing settings key: ${key}`);
  }
});

test('World Reaction suite is registered in V95 menu', () => {
  const src = readBaseline();
  assert.ok(src.includes(SWR_SUITE_ANCHOR), 'swr suite registration missing');
});

test('core SWR causal self-test anchors exist', () => {
  const src = readBaseline();
  for (const id of SWR_CAUSAL_TEST_IDS) {
    assert.ok(src.includes(id), `missing self-test anchor: ${id}`);
  }
});
