import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function bump(text) {
  return text
    .replaceAll('wave 53', 'wave 54')
    .replaceAll('wave 52', 'wave 53')
    .replaceAll('Wave53', 'Wave54')
    .replaceAll('wave53', 'wave54')
    .replaceAll('Wave52', 'Wave53')
    .replaceAll('wave52', 'wave53')
    .replaceAll('Round53', 'Round54')
    .replaceAll('round53', 'round54')
    .replaceAll('Round52', 'Round53')
    .replaceAll('round52', 'round53')
    .replaceAll('O10-237', 'O10-240')
    .replaceAll('O10-235', 'O10-237')
    .replaceAll('51039c5e', '5bd043ad')
    .replaceAll('ba97bdce', '51039c5e')
    .replaceAll('2_979_928', '3_022_056')
    .replaceAll('2_932_752', '2_979_928')
    .replaceAll('2.45.0', '2.46.0')
    .replaceAll('2.44.0', '2.45.0');
}

const pairs = [
  ['forecast-wave53-projection-sync.ts', 'forecast-wave54-projection-sync.ts'],
  ['forecast-integration-wave53-origin-handoff.ts', 'forecast-integration-wave54-origin-handoff.ts'],
  ['forecast-round53-console.tsx', 'forecast-round54-console.tsx'],
  ['scale-wave-round53-gate-latch.ts', 'scale-wave-round54-gate-latch.ts'],
];

for (const [from, to] of pairs) {
  const srcPath = path.join(root, from);
  const outPath = path.join(root, to);
  fs.writeFileSync(outPath, bump(fs.readFileSync(srcPath, 'utf8')));
}

const testFrom = path.join(root, 'tests/forecast-round53-depth.test.ts');
const testTo = path.join(root, 'tests/forecast-round54-depth.test.ts');
if (fs.existsSync(testFrom)) {
  fs.writeFileSync(testTo, bump(fs.readFileSync(testFrom, 'utf8')));
}

let index = fs.readFileSync(path.join(root, 'index.ts'), 'utf8');
if (!index.includes('forecast-wave54-projection-sync')) {
  index = index.replace(
    "export * from './scale-wave-round53-gate-latch.ts';",
    `export * from './scale-wave-round53-gate-latch.ts';
export * from './forecast-wave54-projection-sync';
export * from './forecast-integration-wave54-origin-handoff';
export * from './forecast-round54-console';
export * from './scale-wave-round54-gate-latch.ts';`,
  );
  fs.writeFileSync(path.join(root, 'index.ts'), index);
}

let bundle = fs.readFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), 'utf8');
if (!bundle.includes('forecast-wave54-projection-sync')) {
  bundle = bundle.replace(
    "'operation-10m/agent-21-forecasting/scale-wave-round53-gate-latch.ts'",
    `'operation-10m/agent-21-forecasting/scale-wave-round53-gate-latch.ts',
  'operation-10m/agent-21-forecasting/forecast-wave54-projection-sync.ts',
  'operation-10m/agent-21-forecasting/forecast-integration-wave54-origin-handoff.ts',
  'operation-10m/agent-21-forecasting/forecast-round54-console.tsx',
  'operation-10m/agent-21-forecasting/scale-wave-round54-gate-latch.ts'`,
  );
  fs.writeFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), bundle);
}

console.log('gen-wave54 agent-21 ok');
