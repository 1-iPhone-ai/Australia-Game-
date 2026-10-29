import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const game = join(root, '(V9.4) australia-game-with-ai.tsx');
const src = readFileSync(game, 'utf8');

const markers = [
  'O111 Agent 108',
  'buildStateCapacityStakeholdersFromRegionalFactions',
  "'SC53'",
  'relationshipsByActor'
];

for (const m of markers) {
  if (!src.includes(m)) {
    console.error('missing marker:', m);
    process.exit(1);
  }
}

const probe = spawnSync(
  'npx',
  [
    'tsx',
    '-e',
    "import { runV1011AdaptiveGovernanceSelfTests } from './(V9.4) australia-game-with-ai.tsx'; const r = runV1011AdaptiveGovernanceSelfTests(); if (r.failed) { console.error(r.results.filter(x=>!x.passed)); process.exit(1);} console.log('ok', r.total);"
  ],
  { cwd: root, encoding: 'utf8', stdio: 'pipe' }
);

if (probe.status !== 0) {
  console.error(probe.stderr || probe.stdout);
  process.exit(probe.status ?? 1);
}

console.log(probe.stdout.trim());
