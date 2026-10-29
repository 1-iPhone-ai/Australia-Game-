#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function patchFile(rel, mutator) {
  const fp = path.join(root, rel);
  let c = fs.readFileSync(fp, 'utf8');
  const next = mutator(c);
  if (next === c) console.warn('no change:', rel);
  fs.writeFileSync(fp, next);
}

function insertTier(c, anchorRound, anchorConst, newRound, newConst) {
  const TIER_ANCHOR = `(waveRound >= ${anchorRound}\n      ? ${anchorConst}`;
  const TIER_INSERT = `(waveRound >= ${newRound}\n      ? ${newConst}\n      : waveRound >= ${anchorRound}\n      ? ${anchorConst}`;
  if (c.includes(`waveRound >= ${newRound}`)) return c;
  if (!c.includes(TIER_ANCHOR)) return c;
  return c.replace(TIER_ANCHOR, TIER_INSERT);
}

function addImport(c, afterConst, newConst) {
  if (!c.includes(afterConst)) return c;
  if (c.includes(newConst)) return c;
  return c.replace(`${afterConst},`, `${afterConst},\n  ${newConst},`);
}

const tierFiles = [
  'src/replay-scale-wave-dryrun-handoff.ts',
  'src/replay-scale-wave-full-chunks-handoff.ts',
  'src/replay-scale-wave-projection-handoff.ts',
  'src/replay-scale-wave-dryrun-verification.ts',
  'src/replay-scale-wave-full-chunks-verification.ts',
  'src/replay-scale-wave-projection-verification.ts',
  'src/replay-scale-wave-integration-verification.ts',
  'src/replay-scale-wave-attestation.ts',
  'src/replay-scale-wave-attestation-verification.ts',
  'src/replay-scale-wave-closeout.ts',
  'src/replay-scale-wave-verification.ts',
  'src/replay-scale-wave-handoff-seal.ts',
  'src/archive-scale-wave-export-gate.ts',
  'src/archive-scale-wave-finalization.ts',
  'src/archive-scale-wave-full-chunks-gate.ts',
  'src/archive-scale-wave-post-projection-gate.ts',
  'src/archive-scale-wave-release-handoff-gate.ts',
  'src/archive-release-gate.ts',
  'src/replay-scale-wave-acceptance.ts',
];

function applyWaveTier({ waveNum, sha, ticket, prevNum, prevConst, newConst }) {
  patchFile('src/replay-scale-wave-integration-closeout.ts', c => {
    if (!c.includes(newConst)) {
      c = c.replace(
        `export const ${prevConst} = '${prevNum === 52 ? 'ba97bdce' : '51039c5e'}';`,
        `export const ${prevConst} = '${prevNum === 52 ? 'ba97bdce' : '51039c5e'}';\n\n/** ${ticket} integration baseline anchor (wave ${waveNum} roster). */\nexport const ${newConst} = '${sha}';`,
      );
    }
    c = insertTier(c, prevNum, prevConst, waveNum, newConst);
    return c;
  });

  for (const f of tierFiles) {
    patchFile(f, c => {
      c = addImport(c, prevConst, newConst);
      return insertTier(c, prevNum, prevConst, waveNum, newConst);
    });
  }

  patchFile('src/replay-scale-wave-wave23-integration-handoff.ts', c => {
    c = addImport(c, prevConst, newConst);
    if (c.includes(`waveRound >= ${waveNum}`)) return c;
    const needle = `    waveRound >= ${prevNum}
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        ${prevConst}`;
    const insert = `    waveRound >= ${waveNum}
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        ${newConst}
      : waveRound >= ${prevNum}
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        ${prevConst}`;
    return c.includes(needle) ? c.replace(needle, insert) : c;
  });
}

applyWaveTier({
  waveNum: 53,
  sha: '51039c5e',
  ticket: 'O10-237',
  prevNum: 52,
  prevConst: 'O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA',
  newConst: 'O6K_AGENT24_WAVE53_INTEGRATION_BASELINE_SHA',
});

applyWaveTier({
  waveNum: 54,
  sha: '5bd043ad',
  ticket: 'O10-240',
  prevNum: 53,
  prevConst: 'O6K_AGENT24_WAVE53_INTEGRATION_BASELINE_SHA',
  newConst: 'O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA',
});

patchFile('src/replay-scale-wave-integration-closeout.ts', c =>
  c.replace(
    'report.integrationBaselineSha === O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA',
    'report.integrationBaselineSha === O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA',
  ),
);

patchFile('src/history-replay-analytics.ts', c => {
  if (c.includes("'1.2.0-op10m-r54'")) return c;
  return c.replace(
    /export const O6K_AGENT24_MODULE_VERSION = '1\.2\.0-op10m-r\d+';/,
    "export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r54';",
  );
});

console.log('apply-wave54-tier ok');
