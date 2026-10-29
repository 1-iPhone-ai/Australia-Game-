#!/usr/bin/env node
/**
 * Operation 111 / Agent 02 — static architecture gate for `(V9.4) australia-game-with-ai.tsx`.
 * Does not import the TSX bundle (too large); parses markers and SECTION 1A snapshot instead.
 */
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const tsxPath = path.join(repoRoot, '(V9.4) australia-game-with-ai.tsx');

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function pass(msg) {
  console.log(`ok: ${msg}`);
}

const src = fs.readFileSync(tsxPath, 'utf8');

const headerLines = [];
for (const line of src.split('\n')) {
  const m = line.match(/^\/\/ SECTION (.+)$/);
  if (m) headerLines.push(m[1]);
}

const markerCountMatch = src.match(
  /export const SOURCE_FILE_SECTION_MARKER_COUNT = (\d+) as const;/,
);
const expectedMarkers = markerCountMatch ? Number(markerCountMatch[1]) : NaN;

if (!Number.isFinite(expectedMarkers)) {
  fail('SOURCE_FILE_SECTION_MARKER_COUNT not found');
} else if (headerLines.length !== expectedMarkers) {
  fail(`expected ${expectedMarkers} // SECTION markers, found ${headerLines.length}`);
} else {
  pass(`${expectedMarkers} section markers on disk`);
}

const snapMatch = src.match(
  /export const SOURCE_FILE_SECTION_HEADER_SNAPSHOT = `([\s\S]*?)`;/,
);
if (!snapMatch) {
  fail('SOURCE_FILE_SECTION_HEADER_SNAPSHOT not found');
} else {
  const snapshot = snapMatch[1].trim().split('\n').filter(Boolean);
  if (snapshot.length !== headerLines.length) {
    fail(`snapshot length ${snapshot.length} !== on-disk ${headerLines.length}`);
  } else if (snapshot.join('\n') !== headerLines.join('\n')) {
    fail('SOURCE_FILE_SECTION_HEADER_SNAPSHOT drift vs file markers (regenerate SECTION 1A)');
  } else {
    pass('embedded snapshot matches on-disk section headers');
  }
}

if (!/SOURCE_FILE_ARCHITECTURE_VERSION = 'op111-agent02-v1'/.test(src)) {
  fail('SOURCE_FILE_ARCHITECTURE_VERSION pin missing or changed');
} else {
  pass('architecture version pin present');
}

if (!src.includes('export function runSourceArchitectureSelfTests')) {
  fail('runSourceArchitectureSelfTests missing');
} else {
  pass('in-file architecture self-test suite exported');
}

if (!src.includes("id: 'src_arch'")) {
  fail('V95_EXISTING_SUITES src_arch entry missing');
} else {
  pass('release suite registers src_arch');
}

const indexMatch = src.match(
  /export const SOURCE_FILE_SECTION_INDEX: SourceFileSectionMeta\[\] = (\[[\s\S]*?\]) as SourceFileSectionMeta\[\];/,
);
if (!indexMatch) {
  fail('SOURCE_FILE_SECTION_INDEX block not found');
} else {
  let entries;
  try {
    entries = JSON.parse(indexMatch[1]);
  } catch (e) {
    fail(`SOURCE_FILE_SECTION_INDEX JSON parse: ${e.message}`);
    entries = [];
  }
  const ids = entries.map(e => e.id);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    fail('duplicate section ids in SOURCE_FILE_SECTION_INDEX');
  } else {
    pass(`${ids.length} indexed sections with unique ids`);
  }
  const phantom = entries.find(e => e.id === '18');
  if (!phantom?.reserved) {
    fail('phantom section 18 not marked reserved');
  } else {
    pass('phantom section 18 documents numbering gap');
  }
  const v94 = entries.find(e => e.id === '20P');
  if (v94?.family !== 'v9-player' || v94?.layer !== 6) {
    fail('section 20P family/layer metadata wrong');
  } else {
    pass('V9.4 section 20P catalogued as v9-player layer 6');
  }
}

if (process.exitCode) {
  console.error('\nSource architecture gate failed.');
  process.exit(process.exitCode);
}
console.log('\nSource architecture gate passed.');
