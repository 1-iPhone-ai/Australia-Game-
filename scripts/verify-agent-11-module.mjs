#!/usr/bin/env node
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = join(root, 'expansion/o6k/agent-11-division-c-v1014-city-regional-intercity.tsx');

let stat;
try {
  stat = statSync(modulePath);
} catch {
  console.error('Missing Agent 11 expansion module');
  process.exit(1);
}

const source = readFileSync(modulePath, 'utf8');
const physicalLines = source.split('\n').length;

if (source.includes("from './") || source.includes('from "./')) {
  console.error('Agent 11 module must not use relative imports');
  process.exit(1);
}

const required = [
  'V1014_SCHEMA_VERSION',
  'recomputeV1014CityRegionalState',
  'runV1014CityRegionalIntercitySelfTests',
  'V1014_CITY_CATALOG',
  'V1014_INTERCITY_LINKS',
];

for (const sym of required) {
  if (!source.includes(sym)) {
    console.error(`Missing symbol: ${sym}`);
    process.exit(1);
  }
}

if (physicalLines < 400) {
  console.error(`Module too small (${physicalLines} lines)`);
  process.exit(1);
}

console.log(`Agent 11 V10.14 module OK — ${physicalLines} physical lines, ${(stat.size / 1024).toFixed(1)} KiB`);
