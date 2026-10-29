#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'src');

const TIER_ANCHOR = `(waveRound >= 50
      ? O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA`;
const TIER_INSERT = `(waveRound >= 51
      ? O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA
      : waveRound >= 50
      ? O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA`;

function patchFile(rel, mutator) {
  const fp = path.join(root, rel);
  let c = fs.readFileSync(fp, 'utf8');
  const next = mutator(c);
  if (next === c) console.warn('no change:', rel);
  fs.writeFileSync(fp, next);
}

function insertWave51Tier(c) {
  if (c.includes('waveRound >= 51')) return c;
  if (!c.includes(TIER_ANCHOR)) return c;
  return c.replace(TIER_ANCHOR, TIER_INSERT);
}

function addWave51Import(c) {
  if (!c.includes('O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA')) return c;
  return c.replace(
    'O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA,',
    'O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA,',
  );
}

patchFile('src/replay-scale-wave-integration-closeout.ts', c => {
  if (!c.includes('O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      "export const O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA = '8aaaf700';",
      "export const O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA = '8aaaf700';\n\n/** O10-232 integration baseline anchor (wave 51 roster). */\nexport const O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA = 'a32b2b15';",
    );
  }
  c = insertWave51Tier(c);
  c = c.replace(
    'report.integrationBaselineSha === O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA',
    'report.integrationBaselineSha === O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA',
  );
  return c;
});

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

for (const f of tierFiles) {
  patchFile(f, c => {
    c = addWave51Import(c);
    return insertWave51Tier(c);
  });
}

patchFile('src/replay-scale-wave-wave23-integration-handoff.ts', c => {
  c = addWave51Import(c);
  if (c.includes('waveRound >= 51')) return c;
  return c.replace(
    `    waveRound >= 50
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA`,
    `    waveRound >= 51
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA
      : waveRound >= 50
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA`,
  );
});

patchFile('src/history-replay-analytics.ts', c =>
  c.replace("export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r50';", "export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r51';"),
);

console.log('apply-wave51-tier ok');
