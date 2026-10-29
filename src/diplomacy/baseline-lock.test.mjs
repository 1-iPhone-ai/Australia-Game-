import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '../..');
const manifest = JSON.parse(readFileSync(join(here, 'baseline-manifest.json'), 'utf8'));
const baselinePath = join(repoRoot, manifest.baselineFile);
const src = readFileSync(baselinePath, 'utf8');

test('baseline file exists and contains Section 20H', () => {
  assert.match(src, new RegExp(manifest.sectionMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('documented layer invariants remain in baseline', () => {
  for (const pattern of manifest.requiredPatterns) {
    assert.ok(src.includes(pattern), `missing invariant marker: ${pattern}`);
  }
});

test('required exported functions remain in baseline', () => {
  for (const name of manifest.requiredExports) {
    assert.match(
      src,
      new RegExp(`export function ${name}(?:<[^>]+>)?\\(`),
      `missing export function ${name}`
    );
  }
});

test('self-test registry still references dn2', () => {
  assert.match(src, /id:\s*['"]dn2['"]/);
  assert.match(src, /runDiplomacyNegotiation2SelfTests\(\)/);
});

test('validateSaveDataCore still sanitizes diplomacyState', () => {
  assert.match(src, /diplomacyState:\s*sanitizeDiplomacyState\(/);
});
