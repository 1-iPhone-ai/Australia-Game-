import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const core = path.join(__dirname, '../core');
const root = path.join(__dirname, '..');

const wave54Files = [
  'adjacency-merged-national-chokepoint-border-link-saturation-share-wave54.ts',
  'all-regions-open-needs-severity-tier-spread-wave54.ts',
  'high-derived-major-history-overlap-gap-wave54.ts',
  'rim-merged-national-chokepoint-border-link-saturation-share-wave54.ts',
  'triad-merged-derived-major-snippet-source-gap-wave54.ts',
  'you-rival-open-needs-severity-tier-spread-wave54.ts',
];

function wave61Name(file) {
  return file.replace(/wave54\.ts$/, 'wave61.ts');
}

const newFiles = [];
for (const file of wave54Files) {
  const src = path.join(core, file);
  const outName = wave61Name(file);
  const out = path.join(core, outName);
  let content = fs.readFileSync(src, 'utf8');
  content = content
    .replaceAll('Wave54', 'Wave61')
    .replaceAll('wave54', 'wave61')
    .replaceAll('wave 54', 'wave 61')
    .replaceAll('round 54', 'round 61')
    .replaceAll('O10-240', 'O10-267');
  fs.writeFileSync(out, content);
  newFiles.push(outName);
}

let index = fs.readFileSync(path.join(root, 'index.ts'), 'utf8');
let bundle = fs.readFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), 'utf8');
for (const outName of newFiles) {
  const exportLine = `export * from './core/${outName}';`;
  if (!index.includes(outName)) {
    index += `\n${exportLine}`;
  }
}
if (!bundle.includes(newFiles[0])) {
  const lines = newFiles.map((f) => `  'operation-10m/agent-23-dashboards/core/${f}',`).join('\n');
  bundle = bundle.replace(
    "  'operation-10m/agent-23-dashboards/core/you-rival-open-needs-severity-tier-spread-wave54.ts',",
    `  'operation-10m/agent-23-dashboards/core/you-rival-open-needs-severity-tier-spread-wave54.ts',\n${lines}`,
  );
  fs.writeFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), bundle);
}
fs.writeFileSync(path.join(root, 'index.ts'), index);

console.log('gen-wave61 agent-23 ok', newFiles.length);
