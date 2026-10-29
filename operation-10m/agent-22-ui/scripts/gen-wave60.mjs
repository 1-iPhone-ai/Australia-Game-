import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engine = path.join(__dirname, '../src/engine');
const tests = path.join(__dirname, '../tests');

function bump(text) {
  return text
    .replaceAll('Round54', 'Round60')
    .replaceAll('round54', 'round60')
    .replaceAll('r54_', 'r55_')
    .replaceAll('O10-240', 'O10-265')
    .replaceAll('v1.54.0', 'v1.55.0')
    .replaceAll('Fifteenth', 'Sixteenth')
    .replaceAll('fifteenth', 'sixteenth')
    .replaceAll('newlyUnlockedPanelIds[14]', 'newlyUnlockedPanelIds[15]')
    .replaceAll('slice(0, 15)', 'slice(0, 16)')
    .replaceAll('Tredecim', 'Quattuordecim')
    .replaceAll('tredecim', 'quattuordecim')
    .replaceAll('queueDepth === 13', 'queueDepth === 14')
    .replaceAll('combinedQueueDepth: 13', 'combinedQueueDepth: 14')
    .replaceAll('Thirteen coach', 'Fourteen coach')
    .replaceAll('PacingDeferredDec', 'PacingDeferredJan')
    .replaceAll('pacingDeferredDec', 'pacingDeferredJan')
    .replaceAll('pacing-deferred-dec', 'pacing-deferred-jan')
    .replaceAll('pacing deferred dec', 'pacing deferred jan')
    .replaceAll('gameDay: 18', 'gameDay: 19')
    .replaceAll('turnCount: 18', 'turnCount: 19')
    .replaceAll('Day 19', 'Day 20')
    .replaceAll('twelveIds[14]', 'twelveIds[15]')
    .replaceAll('slice(0, 14)', 'slice(0, 15)')
    .replaceAll('span coaching', 'reach coaching');
}

const enginePairs = [
  ['fifteenth-unlock-headline-day-coach.ts', 'sixteenth-unlock-headline-day-coach.ts'],
  ['tredecim-deferred-queue-day-coach.ts', 'quattuordecim-deferred-queue-day-coach.ts'],
  ['preview-coverage-span-day-coach.ts', 'preview-coverage-reach-day-coach.ts'],
  ['pacing-deferred-dec-day-coach.ts', 'pacing-deferred-jan-day-coach.ts'],
];

for (const [from, to] of enginePairs) {
  fs.writeFileSync(path.join(engine, to), bump(fs.readFileSync(path.join(engine, from), 'utf8')));
}

fs.writeFileSync(
  path.join(engine, 'round60-self-tests.ts'),
  bump(fs.readFileSync(path.join(engine, 'round54-self-tests.ts'), 'utf8')),
);

if (fs.existsSync(path.join(tests, 'round54.test.ts'))) {
  fs.writeFileSync(
    path.join(tests, 'round60.test.ts'),
    bump(fs.readFileSync(path.join(tests, 'round54.test.ts'), 'utf8')),
  );
}

console.log('gen-wave60 agent-22 ok');
