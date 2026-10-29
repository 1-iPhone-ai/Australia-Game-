#!/usr/bin/env node
/**
 * Operation 111 · Agent 63 — static contract checks against `(V9.4) australia-game-with-ai.tsx`.
 * Run: npm test
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const baseline = path.join(root, '(V9.4) australia-game-with-ai.tsx');
const src = fs.readFileSync(baseline, 'utf8');

const failures = [];

const targetBlock = src.match(/export type IntentNavTarget =([\s\S]*?);\n/);
if (!targetBlock) {
  failures.push('IntentNavTarget type block not found');
} else {
  const unionTargets = [...targetBlock[1].matchAll(/\|\s*'([^']+)'/g)].map(m => m[1]);
  const arrayMatch = src.match(/export const INTENT_NAV_TARGETS[^[]*\[([\s\S]*?)\]\s*as const/);
  if (!arrayMatch) failures.push('INTENT_NAV_TARGETS array not found');
  else {
    const listed = [...arrayMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
    const missingInArray = unionTargets.filter(t => !listed.includes(t));
    const extraInArray = listed.filter(t => !unionTargets.includes(t));
    if (missingInArray.length) failures.push(`INTENT_NAV_TARGETS missing: ${missingInArray.join(', ')}`);
    if (extraInArray.length) failures.push(`INTENT_NAV_TARGETS extra: ${extraInArray.join(', ')}`);
  }
}

for (const fn of ['composeIntentNavUiStatePatch', 'mergeIntentNavUiPatches', 'runIntentNavigationSelfTests']) {
  if (!src.includes(`export function ${fn}`)) failures.push(`missing export function ${fn}`);
}

if (!src.includes("case 'settings': return { showSettings: true, settingsActiveTab: INTENT_NAV_ROUTE_META.settings")) {
  failures.push('settings target should open home tab via INTENT_NAV_ROUTE_META');
}

if (src.includes("case 'settings':\n    case 'assistant_advanced'")) {
  failures.push('settings and assistant_advanced must not share one switch case');
}

if (failures.length) {
  console.error('intent-navigation contract FAILED:\n' + failures.map(f => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log('intent-navigation contract OK');
