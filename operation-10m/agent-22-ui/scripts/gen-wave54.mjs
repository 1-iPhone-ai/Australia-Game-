import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engine = path.join(__dirname, '../src/engine');
const tests = path.join(__dirname, '../tests');

function bump(text) {
  return text
    .replaceAll('Round53', 'Round54')
    .replaceAll('round53', 'round54')
    .replaceAll('r53_', 'r54_')
    .replaceAll('O10-237', 'O10-240')
    .replaceAll('v1.53.0', 'v1.54.0')
    .replaceAll('Fourteenth', 'Fifteenth')
    .replaceAll('fourteenth', 'fifteenth')
    .replaceAll('newlyUnlockedPanelIds[13]', 'newlyUnlockedPanelIds[14]')
    .replaceAll('slice(0, 14)', 'slice(0, 15)')
    .replaceAll('Duodecim', 'Tredecim')
    .replaceAll('duodecim', 'tredecim')
    .replaceAll('queueDepth === 12', 'queueDepth === 13')
    .replaceAll('combinedQueueDepth: 12', 'combinedQueueDepth: 13')
    .replaceAll('Nov', 'Dec')
    .replaceAll('nov', 'dec')
    .replaceAll('gameDay: 17', 'gameDay: 18')
    .replaceAll('turnCount: 17', 'turnCount: 18')
    .replaceAll('Day 18', 'Day 19')
    .replaceAll('twelveIds[12]', 'twelveIds[14]')
    .replaceAll('slice(0, 12)', 'slice(0, 14)')
    .replaceAll('breadth coaching', 'span coaching');
}

const enginePairs = [
  ['fourteenth-unlock-headline-day-coach.ts', 'fifteenth-unlock-headline-day-coach.ts'],
  ['duodecim-deferred-queue-day-coach.ts', 'tredecim-deferred-queue-day-coach.ts'],
  ['preview-coverage-depth-day-coach.ts', 'preview-coverage-span-day-coach.ts'],
  ['pacing-deferred-nov-day-coach.ts', 'pacing-deferred-dec-day-coach.ts'],
];

for (const [from, to] of enginePairs) {
  fs.writeFileSync(path.join(engine, to), bump(fs.readFileSync(path.join(engine, from), 'utf8')));
}

fs.writeFileSync(
  path.join(engine, 'round54-self-tests.ts'),
  bump(fs.readFileSync(path.join(engine, 'round53-self-tests.ts'), 'utf8')),
);

if (fs.existsSync(path.join(tests, 'round53.test.ts'))) {
  fs.writeFileSync(
    path.join(tests, 'round54.test.ts'),
    bump(fs.readFileSync(path.join(tests, 'round53.test.ts'), 'utf8')),
  );
}

console.log('gen-wave54 agent-22 ok');
