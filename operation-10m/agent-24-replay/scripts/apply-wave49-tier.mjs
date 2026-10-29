#!/usr/bin/env node
/**
 * Mechanical wave-49 tier bump (mirrors round-48 O10-227 pattern).
 */
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'src');

const TIER_INSERT = `(waveRound >= 49
      ? O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA
      : waveRound >= 48`;

const WAVE23_BASELINE_INSERT = `    waveRound >= 49
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA
      : waveRound >= 48`;

function patchFile(rel, mutator) {
  const fp = path.join(root, rel);
  let c = fs.readFileSync(fp, 'utf8');
  const next = mutator(c);
  if (next === c) {
    console.warn('no change:', rel);
  }
  fs.writeFileSync(fp, next);
}

function insertWave49Tier(c) {
  if (c.includes('(waveRound >= 49')) return c;
  if (!c.includes('(waveRound >= 48')) return c;
  return c.replace('(waveRound >= 48', TIER_INSERT);
}

function addWave49ImportFromCloseout(c) {
  if (!c.includes('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,')) return c;
  return c.replace(
    'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,',
    'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,',
  );
}

function bumpPinnedWave48To49(c) {
  return c
    .replaceAll('waveRound: 49,', 'waveRound: 49,')
    .replaceAll('report.waveRound === 48', 'report.waveRound === 49');
}

// integration closeout
patchFile('src/replay-scale-wave-integration-closeout.ts', c => {
  if (!c.includes('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      "export const O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA = '456efb92';",
      "export const O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA = '456efb92';\n\n/** O10-227 integration baseline anchor (wave 48 roster). */\nexport const O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA = '4404bf0f';",
    );
  }
  c = insertWave49Tier(c);
  c = c.replace(
    'report.integrationBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
    'report.integrationBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
  );
  return bumpPinnedWave48To49(c);
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
    c = addWave49ImportFromCloseout(c);
    c = insertWave49Tier(c);
    if (f.includes('dryrun-handoff') || f.includes('projection-handoff') || f.includes('full-chunks-handoff')) {
      c = c.replaceAll('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,', 'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,');
      c = c.replaceAll(
        'seal.dryrunBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
        'seal.dryrunBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'seal.projectionBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
        'seal.projectionBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'seal.fullChunksBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
        'seal.fullChunksBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'report.dryrunBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
        'report.dryrunBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
      );
    }
    if (f.includes('dryrun-verification') || f.includes('projection-verification') || f.includes('full-chunks-verification') || f.includes('integration-verification')) {
      c = c.replaceAll('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA');
    }
    return bumpPinnedWave48To49(c);
  });
}

patchFile('src/replay-scale-wave-wave23-integration-handoff.ts', c => {
  c = addWave49ImportFromCloseout(c);
  if (!c.includes('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('waveRound >= 49')) return c;
  return c.replace(
    '    waveRound >= 48\n      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===\n        O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA',
    WAVE23_BASELINE_INSERT +
      '\n      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===\n        O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA',
  );
});

patchFile('src/history-replay-analytics.ts', c =>
  c.replace("export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r47';", "export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r49';"),
);

// index + build-chunk
patchFile('src/index.ts', c => {
  if (c.includes('wave49-integration-handoff')) return c;
  return c.replace(
    "export * from './replay-scale-wave-wave47-integration-handoff.ts';",
    "export * from './replay-scale-wave-wave47-integration-handoff.ts';\nexport * from './replay-scale-wave-wave48-integration-verification.ts';\nexport * from './archive-scale-wave-wave49-export-gate.ts';\nexport * from './replay-scale-wave-wave49-integration-handoff.ts';",
  );
});

patchFile('scripts/build-chunk.mjs', c => {
  if (c.includes('wave49-integration-handoff')) return c;
  return c.replace(
    "    'replay-scale-wave-wave47-integration-handoff.ts',",
    "    'replay-scale-wave-wave47-integration-handoff.ts',\n    'replay-scale-wave-wave48-integration-verification.ts',\n    'archive-scale-wave-wave49-export-gate.ts',\n    'replay-scale-wave-wave49-integration-handoff.ts',",
  );
});

// replay-determinism.ts
patchFile('src/replay-determinism.ts', c => {
  if (c.includes('Wave49IntegrationHandoffReport')) return c;
  const importBlock = `import {
  buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport,
  type Agent24ReplayScaleWaveWave48IntegrationVerificationReport,
} from './replay-scale-wave-wave48-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave49ExportGateReport,
  type Agent24ArchiveScaleWaveWave49ExportGateReport,
} from './archive-scale-wave-wave49-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport,
  type Agent24ReplayScaleWaveWave49IntegrationHandoffReport,
} from './replay-scale-wave-wave49-integration-handoff.ts';
`;
  c = c.replace(
    "} from './replay-scale-wave-wave47-integration-handoff.ts';\n",
    "} from './replay-scale-wave-wave47-integration-handoff.ts';\n" + importBlock,
  );
  c = c.replace(
    '  replayScaleWaveWave48IntegrationHandoff: Agent24ReplayScaleWaveWave47IntegrationHandoffReport;\n',
    '  replayScaleWaveWave48IntegrationHandoff: Agent24ReplayScaleWaveWave47IntegrationHandoffReport;\n  replayScaleWaveWave48IntegrationVerification: Agent24ReplayScaleWaveWave48IntegrationVerificationReport;\n  archiveScaleWaveWave49ExportGate: Agent24ArchiveScaleWaveWave49ExportGateReport;\n  replayScaleWaveWave49IntegrationHandoff: Agent24ReplayScaleWaveWave49IntegrationHandoffReport;\n',
  );
  c = c.replace('    waveRound: 47,\n    archiveContinuityVerification,', '    waveRound: 49,\n    archiveContinuityVerification,');
  const buildBlock = `  const replayScaleWaveWave48IntegrationVerification = buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport({
    matchId: input.matchId,
    replayScaleWaveWave48IntegrationHandoff,
    archiveScaleWaveWave48ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
  const archiveScaleWaveWave49ExportGate = buildAgent24ArchiveScaleWaveWave49ExportGateReport({
    matchId: input.matchId,
    replayScaleWaveWave48IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });
  const replayScaleWaveWave49IntegrationHandoff = buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave49ExportGate,
    replayScaleWaveWave48IntegrationVerification,
  });
`;
  c = c.replace(
    `  const replayScaleWaveWave48IntegrationHandoff = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave48ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
  const replayScaleWaveWave34IntegrationHandoff`,
    `  const replayScaleWaveWave48IntegrationHandoff = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave48ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
${buildBlock}  const replayScaleWaveWave34IntegrationHandoff`,
  );
  c = c.replace(
    '    replayScaleWaveWave48IntegrationHandoff: replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint,\n',
    '    replayScaleWaveWave48IntegrationHandoff: replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint,\n    replayScaleWaveWave48IntegrationVerification: replayScaleWaveWave48IntegrationVerification.deterministicFingerprint,\n    archiveScaleWaveWave49ExportGate: archiveScaleWaveWave49ExportGate.deterministicFingerprint,\n    replayScaleWaveWave49IntegrationHandoff: replayScaleWaveWave49IntegrationHandoff.deterministicFingerprint,\n',
  );
  c = c.replace(
    '    replayScaleWaveWave48IntegrationHandoff,\n    replayScaleWaveWave34IntegrationHandoff,',
    '    replayScaleWaveWave48IntegrationHandoff,\n    replayScaleWaveWave48IntegrationVerification,\n    archiveScaleWaveWave49ExportGate,\n    replayScaleWaveWave49IntegrationHandoff,\n    replayScaleWaveWave34IntegrationHandoff,',
  );
  const twinBlock = `    {
      name: 'replay_scale_wave_wave48_integration_verification_twin',
      passed:
        a.replayScaleWaveWave48IntegrationVerification.deterministicFingerprint ===
        b.replayScaleWaveWave48IntegrationVerification.deterministicFingerprint,
      detail: 'Twin replay scale wave wave48 integration verification fingerprints',
    },
    {
      name: 'archive_scale_wave_wave49_export_gate_twin',
      passed:
        a.archiveScaleWaveWave49ExportGate.deterministicFingerprint ===
        b.archiveScaleWaveWave49ExportGate.deterministicFingerprint,
      detail: 'Twin archive scale wave wave49 export gate fingerprints',
    },
    {
      name: 'replay_scale_wave_wave49_integration_handoff_twin',
      passed:
        a.replayScaleWaveWave49IntegrationHandoff.deterministicFingerprint ===
        b.replayScaleWaveWave49IntegrationHandoff.deterministicFingerprint,
      detail: 'Twin replay scale wave wave49 integration handoff fingerprints',
    },
`;
  c = c.replace(
    `    {
      name: 'replay_scale_wave_wave49_integration_handoff_twin',
      passed:
        a.replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint ===
        b.replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint,
      detail: 'Twin replay scale wave wave47 integration handoff fingerprints',
    },
    {
      name: 'composite_twin',`,
    twinBlock + `    {
      name: 'composite_twin',`,
  );
  return c;
});

// tests
patchFile('tests/agent24-replay.test.ts', c => {
  if (!c.includes('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      '  O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,',
      '  O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,',
    );
  }
  if (!c.includes('wave49-integration-handoff')) {
    c = c.replace(
      "} from '../src/replay-scale-wave-wave47-integration-handoff.ts';",
      "} from '../src/replay-scale-wave-wave47-integration-handoff.ts';\nimport {\n  buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport,\n  runAgent24ReplayScaleWaveWave48IntegrationVerificationSelfTests,\n} from '../src/replay-scale-wave-wave48-integration-verification.ts';\nimport {\n  buildAgent24ArchiveScaleWaveWave49ExportGateReport,\n  runAgent24ArchiveScaleWaveWave49ExportGateSelfTests,\n} from '../src/archive-scale-wave-wave49-export-gate.ts';\nimport {\n  buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport,\n  runAgent24ReplayScaleWaveWave49IntegrationHandoffSelfTests,\n} from '../src/replay-scale-wave-wave49-integration-handoff.ts';",
    );
    const newTests = `
describe('Agent 24 replay scale wave wave48 integration verification', () => {
  it('verifies wave48 integration when handoff, export, and wave46 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave48IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave48IntegrationVerification.waveRound, 49);
    assert.equal(
      bundle.replayScaleWaveWave48IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave48IntegrationHandoff: bundle.replayScaleWaveWave49IntegrationHandoff,
      archiveScaleWaveWave48ExportGate: bundle.archiveScaleWaveWave49ExportGate,
      replayScaleWaveWave47IntegrationVerification: bundle.replayScaleWaveWave47IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave48IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave48IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave49 export gate', () => {
  it('allows export when wave48 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave49ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave49ExportGate.waveRound, 49);
    const direct = buildAgent24ArchiveScaleWaveWave49ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave48IntegrationVerification: bundle.replayScaleWaveWave48IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave49ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave49ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave49 integration handoff', () => {
  it('completes integration handoff at wave 49 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave49IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave49IntegrationHandoff.waveRound, 49);
    assert.equal(
      bundle.replayScaleWaveWave49IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave49ExportGate: bundle.archiveScaleWaveWave49ExportGate,
      replayScaleWaveWave48IntegrationVerification: bundle.replayScaleWaveWave48IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave49IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave49IntegrationHandoffSelfTests().every(t => t.passed));
  });
});
`;
    c = c.replace(
      "describe('Agent 24 replay scale wave wave39 integration verification', () => {",
      newTests + "\ndescribe('Agent 24 replay scale wave wave39 integration verification', () => {",
    );
  }
  // bump stack pins 47 -> 48 except wave47 export gate block
  const parts = c.split("describe('Agent 24 archive scale wave wave47 export gate'");
  if (parts.length === 2) {
    parts[0] = parts[0]
      .replaceAll('waveRound, 47', 'waveRound, 49')
      .replaceAll('waveRound: 47', 'waveRound: 49')
      .replaceAll('accepts wave 47 when', 'accepts wave 49 when')
      .replaceAll('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA');
    c = parts[0] + "describe('Agent 24 archive scale wave wave47 export gate'" + parts[1];
  }
  // wave47 export stays at 47
  c = c.replace(
    /describe\('Agent 24 archive scale wave wave47 export gate'[\s\S]*?assert\.equal\(bundle\.archiveScaleWaveWave48ExportGate\.waveRound, 49\)/,
    m => m.replace('waveRound, 49', 'waveRound, 47'),
  );
  // wave47 IV baseline stays WAVE47
  c = c.replace(
    /describe\('Agent 24 replay scale wave wave48 integration verification'[\s\S]*?O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA/,
    m => m.replace('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA'),
  );
  // wave46 IV waveRound stays 47
  c = c.replace(
    /describe\('Agent 24 replay scale wave wave46 integration verification'[\s\S]*?assert\.equal\(bundle\.replayScaleWaveWave46IntegrationVerification\.waveRound, 49\)/,
    m => m.replace('waveRound, 49', 'waveRound, 47'),
  );
  return c;
});

console.log('apply-wave49-tier done');
