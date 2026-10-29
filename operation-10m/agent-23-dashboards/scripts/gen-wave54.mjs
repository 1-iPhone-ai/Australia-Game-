import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const core = path.join(__dirname, '../core');
const root = path.join(__dirname, '..');

const wave52Files = [
  'adjacency-merged-national-chokepoint-border-link-saturation-share.ts',
  'all-regions-open-needs-severity-tier-spread.ts',
  'high-derived-major-history-overlap-gap.ts',
  'rim-merged-national-chokepoint-border-link-saturation-share.ts',
  'triad-merged-derived-major-snippet-source-gap.ts',
  'you-rival-open-needs-severity-tier-spread.ts',
];

function wave54Name(file) {
  return file.replace(/\.ts$/, '-wave54.ts');
}

const newFiles = [];
for (const file of wave52Files) {
  const src = path.join(core, file);
  const outName = wave54Name(file);
  const out = path.join(core, outName);
  let content = fs.readFileSync(src, 'utf8');
  const fnMatch = content.match(/export function (nrDash[A-Za-z0-9]+)/);
  if (fnMatch) {
    const fn = fnMatch[1];
    content = content.replaceAll(fn, `${fn}Wave54`);
  }
  const typeMatch = content.match(/export interface (NrDash[A-Za-z0-9]+)/);
  if (typeMatch) {
    const ty = typeMatch[1];
    content = content.replaceAll(ty, `${ty}Wave54`);
  }
  content = content.replaceAll('O10-235', 'O10-240');
  content = content.replaceAll('O10-237', 'O10-240');
  content = content.replaceAll('wave 52', 'wave 54');
  content = content.replaceAll('wave 53', 'wave 54');
  content = content.replaceAll('round 52', 'round 54');
  content = content.replaceAll('round 53', 'round 54');
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
  const lines = newFiles.map(f => `  'operation-10m/agent-23-dashboards/core/${f}',`).join('\n');
  bundle = bundle.replace(
    "  'operation-10m/agent-23-dashboards/core/you-rival-open-needs-severity-tier-spread-wave53.ts',",
    `  'operation-10m/agent-23-dashboards/core/you-rival-open-needs-severity-tier-spread-wave53.ts',\n${lines}`,
  );
  fs.writeFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), bundle);
}
fs.writeFileSync(path.join(root, 'index.ts'), index);

console.log('gen-wave54 agent-23 ok', newFiles.length);
