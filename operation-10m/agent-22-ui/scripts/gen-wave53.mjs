import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engine = path.join(__dirname, '../src/engine');
const tests = path.join(__dirname, '../tests');

function bump(text) {
  return text
    .replaceAll('Round52', 'Round53')
    .replaceAll('round52', 'round53')
    .replaceAll('r52_', 'r53_')
    .replaceAll('O10-235', 'O10-237')
    .replaceAll('v1.52.0', 'v1.53.0')
    .replaceAll('Thirteenth', 'Fourteenth')
    .replaceAll('thirteenth', 'fourteenth')
    .replaceAll('newlyUnlockedPanelIds[12]', 'newlyUnlockedPanelIds[13]')
    .replaceAll('slice(0, 13)', 'slice(0, 14)')
    .replaceAll('Undecim', 'Duodecim')
    .replaceAll('undecim', 'duodecim')
    .replaceAll('queueDepth === 11', 'queueDepth === 12')
    .replaceAll('combinedQueueDepth: 11', 'combinedQueueDepth: 12')
    .replaceAll('Oct', 'Nov')
    .replaceAll('oct', 'nov')
    .replaceAll('Day 16', 'Day 17')
    .replaceAll('Day 17', 'Day 18')
    .replaceAll('gameDay: 16', 'gameDay: 17')
    .replaceAll('turnCount: 16', 'turnCount: 17');
}

const enginePairs = [
  ['thirteenth-unlock-headline-day-coach.ts', 'fourteenth-unlock-headline-day-coach.ts'],
  ['undecim-deferred-queue-day-coach.ts', 'duodecim-deferred-queue-day-coach.ts'],
  ['preview-coverage-breadth-day-coach.ts', 'preview-coverage-depth-day-coach.ts'],
  ['pacing-deferred-oct-day-coach.ts', 'pacing-deferred-nov-day-coach.ts'],
];

for (const [from, to] of enginePairs) {
  fs.writeFileSync(path.join(engine, to), bump(fs.readFileSync(path.join(engine, from), 'utf8')));
}

fs.writeFileSync(
  path.join(engine, 'round53-self-tests.ts'),
  bump(fs.readFileSync(path.join(engine, 'round52-self-tests.ts'), 'utf8')),
);

if (fs.existsSync(path.join(tests, 'round52.test.ts'))) {
  fs.writeFileSync(path.join(tests, 'round53.test.ts'), bump(fs.readFileSync(path.join(tests, 'round52.test.ts'), 'utf8')));
}

const chunkPath = path.join(__dirname, 'build-chunk.mjs');
let chunk = fs.readFileSync(chunkPath, 'utf8');
const insert = `  'engine/fourteenth-unlock-headline-day-coach.ts',
  'engine/duodecim-deferred-queue-day-coach.ts',
  'engine/preview-coverage-depth-day-coach.ts',
  'engine/pacing-deferred-nov-day-coach.ts',
  'engine/round53-self-tests.ts',
`;
if (!chunk.includes('round53-self-tests')) {
  chunk = chunk.replace("  'engine/round52-self-tests.ts',", "  'engine/round52-self-tests.ts'," + insert);
  fs.writeFileSync(chunkPath, chunk);
}

console.log('gen-wave53 agent-22 ok');
