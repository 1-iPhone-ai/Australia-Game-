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

function wave53Name(file) {
  return file.replace(/\.ts$/, '-wave53.ts');
}

function bumpExports(content, baseName) {
  const stem = baseName.replace(/\.ts$/, '').replace(/-/g, '_');
  const cap = stem
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return content
    .replaceAll(`NrDash${cap.replace(/^NrDash/, '')}`, `NrDash${cap.replace(/^NrDash/, '')}Wave53`)
    .replaceAll(`nrDashBuild${cap.replace(/^NrDash/, '')}`, `nrDashBuild${cap.replace(/^NrDash/, '')}Wave53`)
    .replaceAll('O10-235', 'O10-237')
    .replaceAll('wave 52', 'wave 53')
    .replaceAll('round 52', 'round 53');
}

const newFiles = [];
for (const file of wave52Files) {
  const src = path.join(core, file);
  const outName = wave53Name(file);
  const out = path.join(core, outName);
  let content = fs.readFileSync(src, 'utf8');
  const fnMatch = content.match(/export function (nrDash[A-Za-z0-9]+)/);
  if (fnMatch) {
    const fn = fnMatch[1];
    content = content.replaceAll(fn, `${fn}Wave53`);
  }
  const typeMatch = content.match(/export interface (NrDash[A-Za-z0-9]+)/);
  if (typeMatch) {
    const ty = typeMatch[1];
    content = content.replaceAll(ty, `${ty}Wave53`);
  }
  content = content.replaceAll('O10-235', 'O10-237');
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
    "  'operation-10m/agent-23-dashboards/core/you-rival-open-needs-severity-tier-spread.ts',",
    `  'operation-10m/agent-23-dashboards/core/you-rival-open-needs-severity-tier-spread.ts',\n${lines}`,
  );
  fs.writeFileSync(path.join(root, 'scripts/bundle-chunk.mjs'), bundle);
}
fs.writeFileSync(path.join(root, 'index.ts'), index);

console.log('gen-wave53 agent-23 ok', newFiles.length);
