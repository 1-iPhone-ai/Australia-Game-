import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE54_SHA = '5bd043ad';
const WAVE70_SHA = '6bf2bf7b';

function bumpWave70(content) {
  return content
    .replaceAll('Wave54', 'Wave70')
    .replaceAll('wave54', 'wave70')
    .replaceAll('Wave53', 'Wave54')
    .replaceAll('wave53', 'wave54')
    .replaceAll('O10-240', 'O10-309')
    .replaceAll(WAVE54_SHA, WAVE70_SHA)
    .replaceAll('waveRound: 54', 'waveRound: 55')
    .replaceAll('report.waveRound === 54', 'report.waveRound === 55')
    .replaceAll('turn: 54', 'turn: 55')
    .replaceAll('O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE70_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w54_cp', 'scale_wave_w55_cp')
    .replaceAll('wave54_export', 'wave70_export')
    .replaceAll('wave54_baseline', 'wave70_baseline')
    .replaceAll('asww54', 'asww55')
    .replaceAll('rsww53iv_t54', 'rsww54iv_t55')
    .replaceAll("'eg54'", "'eg55'")
    .replaceAll('asww54_t53', 'asww55_t54');
}

function writeWave70Export() {
  const c = bumpWave70(fs.readFileSync(path.join(src, 'archive-scale-wave-wave54-export-gate.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave70-export-gate.ts'), c);
}

function writeWave70Handoff() {
  const c = bumpWave70(fs.readFileSync(path.join(src, 'replay-scale-wave-wave54-integration-handoff.ts'), 'utf8'));
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave70-integration-handoff.ts'), c);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  const add = `  'archive-scale-wave-wave70-export-gate.ts',
  'replay-scale-wave-wave70-integration-handoff.ts',
`;
  if (!chunk.includes('wave70-integration-handoff')) {
    chunk = chunk.replace(
      "  'replay-scale-wave-wave54-integration-handoff.ts',",
      `  'replay-scale-wave-wave54-integration-handoff.ts',
${add}`,
    );
    fs.writeFileSync(chunkPath, chunk);
  }
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  const block = `
export * from './archive-scale-wave-wave70-export-gate.ts';
export * from './replay-scale-wave-wave70-integration-handoff.ts';
`;
  if (!index.includes('wave70-integration-handoff')) {
    index = index.replace(
      "export * from './replay-scale-wave-wave54-integration-handoff.ts';",
      `export * from './replay-scale-wave-wave54-integration-handoff.ts';${block}`,
    );
    fs.writeFileSync(indexPath, index);
  }
}

writeWave70Export();
writeWave70Handoff();
patchBuildChunk();
patchIndex();
console.log('gen-wave70 ok');
