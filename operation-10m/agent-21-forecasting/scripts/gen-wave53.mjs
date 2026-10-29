import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function bump(text) {
  return text
    .replaceAll('wave 52', 'wave 53')
    .replaceAll('wave 51', 'wave 52')
    .replaceAll('Wave52', 'Wave53')
    .replaceAll('wave52', 'wave53')
    .replaceAll('Wave51', 'Wave52')
    .replaceAll('wave51', 'wave52')
    .replaceAll('Round52', 'Round53')
    .replaceAll('round52', 'round53')
    .replaceAll('Round51', 'Round52')
    .replaceAll('round51', 'round52')
    .replaceAll('O10-235', 'O10-237')
    .replaceAll('O10-233', 'O10-235')
    .replaceAll('O10-231', 'O10-233')
    .replaceAll('ba97bdce', '51039c5e')
    .replaceAll('a32b2b15', 'ba97bdce')
    .replaceAll('2_932_752', '2_979_928')
    .replaceAll('2_887_600', '2_932_752')
    .replaceAll('2.44.0', '2.45.0')
    .replaceAll('2.43.0', '2.44.0');
}

const pairs = [
  ['forecast-wave52-projection-sync.ts', 'forecast-wave53-projection-sync.ts'],
  ['forecast-integration-wave52-origin-handoff.ts', 'forecast-integration-wave53-origin-handoff.ts'],
  ['forecast-round52-console.tsx', 'forecast-round53-console.tsx'],
  ['scale-wave-round52-gate-latch.ts', 'scale-wave-round53-gate-latch.ts'],
];

for (const [from, to] of pairs) {
  const srcPath = path.join(root, from);
  const outPath = path.join(root, to);
  fs.writeFileSync(outPath, bump(fs.readFileSync(srcPath, 'utf8')));
}

const testFrom = path.join(root, 'tests/forecast-round52-depth.test.ts');
const testTo = path.join(root, 'tests/forecast-round53-depth.test.ts');
if (fs.existsSync(testFrom)) {
  fs.writeFileSync(testTo, bump(fs.readFileSync(testFrom, 'utf8')));
}

let index = fs.readFileSync(path.join(root, 'index.ts'), 'utf8');
if (!index.includes('forecast-wave53-projection-sync')) {
  index = index.replace(
    "export * from './scale-wave-round52-gate-latch.ts';",
    `export * from './scale-wave-round52-gate-latch.ts';
export * from './forecast-wave53-projection-sync';
export * from './forecast-integration-wave53-origin-handoff';
export * from './forecast-round53-console';
export * from './scale-wave-round53-gate-latch.ts';`,
  );
  fs.writeFileSync(path.join(root, 'index.ts'), index);
}

let bundle = fs.readFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), 'utf8');
if (!bundle.includes('forecast-wave53-projection-sync')) {
  bundle = bundle.replace(
    "'operation-10m/agent-21-forecasting/forecast-round52-console.tsx'",
    `'operation-10m/agent-21-forecasting/forecast-round52-console.tsx',
  'operation-10m/agent-21-forecasting/forecast-wave53-projection-sync.ts',
  'operation-10m/agent-21-forecasting/forecast-integration-wave53-origin-handoff.ts',
  'operation-10m/agent-21-forecasting/forecast-round53-console.tsx',
  'operation-10m/agent-21-forecasting/scale-wave-round53-gate-latch.ts'`,
  );
  fs.writeFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), bundle);
}

console.log('gen-wave53 agent-21 ok');
