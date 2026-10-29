import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function bump(text) {
  return text
    .replaceAll('wave 54', 'wave 74')
    .replaceAll('wave 53', 'wave 54')
    .replaceAll('Wave54', 'Wave74')
    .replaceAll('wave54', 'wave74')
    .replaceAll('Wave53', 'Wave54')
    .replaceAll('wave53', 'wave54')
    .replaceAll('Round54', 'Round74')
    .replaceAll('round54', 'round74')
    .replaceAll('Round53', 'Round54')
    .replaceAll('round53', 'round54')
    .replaceAll('O10-240', 'O10-343')
    .replaceAll('O10-237', 'O10-240')
    .replaceAll('5bd043ad', '72a7aee6')
    .replaceAll('51039c5e', '5bd043ad')
    .replaceAll('3_542_367', '3_569_219')
    .replaceAll('2_979_928', '3_542_367')
    .replaceAll('2.65.0', '2.66.0')
    .replaceAll('2.45.0', '2.65.0');
}

const pairs = [
  ['forecast-wave54-projection-sync.ts', 'forecast-wave74-projection-sync.ts'],
  ['forecast-integration-wave54-origin-handoff.ts', 'forecast-integration-wave74-origin-handoff.ts'],
  ['forecast-round54-console.tsx', 'forecast-round74-console.tsx'],
  ['scale-wave-round54-gate-latch.ts', 'scale-wave-round74-gate-latch.ts'],
];

for (const [from, to] of pairs) {
  const srcPath = path.join(root, from);
  const outPath = path.join(root, to);
  fs.writeFileSync(outPath, bump(fs.readFileSync(srcPath, 'utf8')));
}

const testFrom = path.join(root, 'tests/forecast-round54-depth.test.ts');
const testTo = path.join(root, 'tests/forecast-round74-depth.test.ts');
if (fs.existsSync(testFrom)) {
  fs.writeFileSync(testTo, bump(fs.readFileSync(testFrom, 'utf8')));
}

let index = fs.readFileSync(path.join(root, 'index.ts'), 'utf8');
if (!index.includes('forecast-wave74-projection-sync')) {
  index = index.replace(
    "export * from './scale-wave-round54-gate-latch.ts';",
    `export * from './scale-wave-round54-gate-latch.ts';
export * from './forecast-wave74-projection-sync';
export * from './forecast-integration-wave74-origin-handoff';
export * from './forecast-round74-console';
export * from './scale-wave-round74-gate-latch.ts';`,
  );
  fs.writeFileSync(path.join(root, 'index.ts'), index);
}

let bundle = fs.readFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), 'utf8');
if (!bundle.includes('forecast-wave74-projection-sync')) {
  bundle = bundle.replace(
    "'operation-10m/agent-21-forecasting/scale-wave-round54-gate-latch.ts'",
    `'operation-10m/agent-21-forecasting/scale-wave-round54-gate-latch.ts',
  'operation-10m/agent-21-forecasting/forecast-wave74-projection-sync.ts',
  'operation-10m/agent-21-forecasting/forecast-integration-wave74-origin-handoff.ts',
  'operation-10m/agent-21-forecasting/forecast-round74-console.tsx',
  'operation-10m/agent-21-forecasting/scale-wave-round74-gate-latch.ts'`,
  );
  fs.writeFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), bundle);
}

console.log('gen-wave74 agent-21 ok');
