#!/usr/bin/env node
/**
 * Mechanical wave-48 tier bump (mirrors round-47 O10-225 pattern).
 */
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'src');

const TIER_INSERT = `(waveRound >= 48
      ? O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA
      : waveRound >= 47`;

const WAVE23_BASELINE_INSERT = `    waveRound >= 48
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA
      : waveRound >= 47`;

function patchFile(rel, mutator) {
  const fp = path.join(root, rel);
  let c = fs.readFileSync(fp, 'utf8');
  const next = mutator(c);
  if (next === c) {
    console.warn('no change:', rel);
  }
  fs.writeFileSync(fp, next);
}

function insertWave48Tier(c) {
  if (c.includes('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA')) return c;
  if (!c.includes('(waveRound >= 47')) return c;
  return c.replace('(waveRound >= 47', TIER_INSERT);
}

function addWave48ImportFromCloseout(c) {
  if (!c.includes('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA')) return c;
  return c.replace(
    'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,',
    'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,',
  );
}

function bumpPinnedWave47To48(c) {
  return c
    .replaceAll('waveRound: 47,', 'waveRound: 48,')
    .replaceAll('report.waveRound === 47', 'report.waveRound === 48')
    .replaceAll('waveRound >= 47\n      ? input.replayScaleWaveFullChunksVerification', WAVE23_BASELINE_INSERT);
}

// integration closeout
patchFile('src/replay-scale-wave-integration-closeout.ts', c => {
  if (!c.includes('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      "export const O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA = '456efb92';",
      "export const O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA = '456efb92';\n\n/** O10-227 integration baseline anchor (wave 48 roster). */\nexport const O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA = '4404bf0f';",
    );
  }
  c = insertWave48Tier(c);
  c = c.replace(
    'report.integrationBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
    'report.integrationBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA',
  );
  return bumpPinnedWave47To48(c);
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
    c = addWave48ImportFromCloseout(c);
    c = insertWave48Tier(c);
    if (f.includes('dryrun-handoff') || f.includes('projection-handoff') || f.includes('full-chunks-handoff')) {
      c = c.replaceAll('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,', 'O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,');
      c = c.replaceAll(
        'seal.dryrunBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
        'seal.dryrunBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'seal.projectionBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
        'seal.projectionBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'seal.fullChunksBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
        'seal.fullChunksBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'report.dryrunBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
        'report.dryrunBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA',
      );
    }
    if (f.includes('dryrun-verification') || f.includes('projection-verification') || f.includes('full-chunks-verification') || f.includes('integration-verification')) {
      c = c.replaceAll('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA');
    }
    return bumpPinnedWave47To48(c);
  });
}

patchFile('src/replay-scale-wave-wave23-integration-handoff.ts', c => {
  c = addWave48ImportFromCloseout(c);
  if (!c.includes('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('waveRound >= 47')) return c;
  return c.replace(
    '    waveRound >= 47\n      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===\n        O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
    WAVE23_BASELINE_INSERT +
      '\n      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===\n        O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
  );
});

patchFile('src/history-replay-analytics.ts', c =>
  c.replace("export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r47';", "export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r48';"),
);

// index + build-chunk
patchFile('src/index.ts', c => {
  if (c.includes('wave48-integration-handoff')) return c;
  return c.replace(
    "export * from './replay-scale-wave-wave47-integration-handoff.ts';",
    "export * from './replay-scale-wave-wave47-integration-handoff.ts';\nexport * from './replay-scale-wave-wave47-integration-verification.ts';\nexport * from './archive-scale-wave-wave48-export-gate.ts';\nexport * from './replay-scale-wave-wave48-integration-handoff.ts';",
  );
});

patchFile('scripts/build-chunk.mjs', c => {
  if (c.includes('wave48-integration-handoff')) return c;
  return c.replace(
    "    'replay-scale-wave-wave47-integration-handoff.ts',",
    "    'replay-scale-wave-wave47-integration-handoff.ts',\n    'replay-scale-wave-wave47-integration-verification.ts',\n    'archive-scale-wave-wave48-export-gate.ts',\n    'replay-scale-wave-wave48-integration-handoff.ts',",
  );
});

// replay-determinism.ts
patchFile('src/replay-determinism.ts', c => {
  if (c.includes('Wave48IntegrationHandoffReport')) return c;
  const importBlock = `import {
  buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport,
  type Agent24ReplayScaleWaveWave47IntegrationVerificationReport,
} from './replay-scale-wave-wave47-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave48ExportGateReport,
  type Agent24ArchiveScaleWaveWave48ExportGateReport,
} from './archive-scale-wave-wave48-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport,
  type Agent24ReplayScaleWaveWave48IntegrationHandoffReport,
} from './replay-scale-wave-wave48-integration-handoff.ts';
`;
  c = c.replace(
    "} from './replay-scale-wave-wave47-integration-handoff.ts';\n",
    "} from './replay-scale-wave-wave47-integration-handoff.ts';\n" + importBlock,
  );
  c = c.replace(
    '  replayScaleWaveWave47IntegrationHandoff: Agent24ReplayScaleWaveWave47IntegrationHandoffReport;\n',
    '  replayScaleWaveWave47IntegrationHandoff: Agent24ReplayScaleWaveWave47IntegrationHandoffReport;\n  replayScaleWaveWave47IntegrationVerification: Agent24ReplayScaleWaveWave47IntegrationVerificationReport;\n  archiveScaleWaveWave48ExportGate: Agent24ArchiveScaleWaveWave48ExportGateReport;\n  replayScaleWaveWave48IntegrationHandoff: Agent24ReplayScaleWaveWave48IntegrationHandoffReport;\n',
  );
  c = c.replace('    waveRound: 47,\n    archiveContinuityVerification,', '    waveRound: 48,\n    archiveContinuityVerification,');
  const buildBlock = `  const replayScaleWaveWave47IntegrationVerification = buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport({
    matchId: input.matchId,
    replayScaleWaveWave47IntegrationHandoff,
    archiveScaleWaveWave47ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
  const archiveScaleWaveWave48ExportGate = buildAgent24ArchiveScaleWaveWave48ExportGateReport({
    matchId: input.matchId,
    replayScaleWaveWave47IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });
  const replayScaleWaveWave48IntegrationHandoff = buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave48ExportGate,
    replayScaleWaveWave47IntegrationVerification,
  });
`;
  c = c.replace(
    `  const replayScaleWaveWave47IntegrationHandoff = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave47ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
  const replayScaleWaveWave34IntegrationHandoff`,
    `  const replayScaleWaveWave47IntegrationHandoff = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave47ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
${buildBlock}  const replayScaleWaveWave34IntegrationHandoff`,
  );
  c = c.replace(
    '    replayScaleWaveWave47IntegrationHandoff: replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint,\n',
    '    replayScaleWaveWave47IntegrationHandoff: replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint,\n    replayScaleWaveWave47IntegrationVerification: replayScaleWaveWave47IntegrationVerification.deterministicFingerprint,\n    archiveScaleWaveWave48ExportGate: archiveScaleWaveWave48ExportGate.deterministicFingerprint,\n    replayScaleWaveWave48IntegrationHandoff: replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint,\n',
  );
  c = c.replace(
    '    replayScaleWaveWave47IntegrationHandoff,\n    replayScaleWaveWave34IntegrationHandoff,',
    '    replayScaleWaveWave47IntegrationHandoff,\n    replayScaleWaveWave47IntegrationVerification,\n    archiveScaleWaveWave48ExportGate,\n    replayScaleWaveWave48IntegrationHandoff,\n    replayScaleWaveWave34IntegrationHandoff,',
  );
  const twinBlock = `    {
      name: 'replay_scale_wave_wave47_integration_verification_twin',
      passed:
        a.replayScaleWaveWave47IntegrationVerification.deterministicFingerprint ===
        b.replayScaleWaveWave47IntegrationVerification.deterministicFingerprint,
      detail: 'Twin replay scale wave wave47 integration verification fingerprints',
    },
    {
      name: 'archive_scale_wave_wave48_export_gate_twin',
      passed:
        a.archiveScaleWaveWave48ExportGate.deterministicFingerprint ===
        b.archiveScaleWaveWave48ExportGate.deterministicFingerprint,
      detail: 'Twin archive scale wave wave48 export gate fingerprints',
    },
    {
      name: 'replay_scale_wave_wave48_integration_handoff_twin',
      passed:
        a.replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint ===
        b.replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint,
      detail: 'Twin replay scale wave wave48 integration handoff fingerprints',
    },
`;
  c = c.replace(
    `    {
      name: 'replay_scale_wave_wave47_integration_handoff_twin',
      passed:
        a.replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint ===
        b.replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint,
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
  if (!c.includes('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      '  O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,',
      '  O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,',
    );
  }
  if (!c.includes('wave48-integration-handoff')) {
    c = c.replace(
      "} from '../src/replay-scale-wave-wave47-integration-handoff.ts';",
      "} from '../src/replay-scale-wave-wave47-integration-handoff.ts';\nimport {\n  buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport,\n  runAgent24ReplayScaleWaveWave47IntegrationVerificationSelfTests,\n} from '../src/replay-scale-wave-wave47-integration-verification.ts';\nimport {\n  buildAgent24ArchiveScaleWaveWave48ExportGateReport,\n  runAgent24ArchiveScaleWaveWave48ExportGateSelfTests,\n} from '../src/archive-scale-wave-wave48-export-gate.ts';\nimport {\n  buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport,\n  runAgent24ReplayScaleWaveWave48IntegrationHandoffSelfTests,\n} from '../src/replay-scale-wave-wave48-integration-handoff.ts';",
    );
    const newTests = `
describe('Agent 24 replay scale wave wave47 integration verification', () => {
  it('verifies wave47 integration when handoff, export, and wave46 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave47IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave47IntegrationVerification.waveRound, 48);
    assert.equal(
      bundle.replayScaleWaveWave47IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave47IntegrationHandoff: bundle.replayScaleWaveWave47IntegrationHandoff,
      archiveScaleWaveWave47ExportGate: bundle.archiveScaleWaveWave47ExportGate,
      replayScaleWaveWave46IntegrationVerification: bundle.replayScaleWaveWave46IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave47IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave47IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave48 export gate', () => {
  it('allows export when wave47 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave48ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave48ExportGate.waveRound, 48);
    const direct = buildAgent24ArchiveScaleWaveWave48ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave47IntegrationVerification: bundle.replayScaleWaveWave47IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave48ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave48ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave48 integration handoff', () => {
  it('completes integration handoff at wave 48 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave48IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave48IntegrationHandoff.waveRound, 48);
    assert.equal(
      bundle.replayScaleWaveWave48IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave48ExportGate: bundle.archiveScaleWaveWave48ExportGate,
      replayScaleWaveWave47IntegrationVerification: bundle.replayScaleWaveWave47IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave48IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave48IntegrationHandoffSelfTests().every(t => t.passed));
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
      .replaceAll('waveRound, 47', 'waveRound, 48')
      .replaceAll('waveRound: 47', 'waveRound: 48')
      .replaceAll('accepts wave 47 when', 'accepts wave 48 when')
      .replaceAll('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA');
    c = parts[0] + "describe('Agent 24 archive scale wave wave47 export gate'" + parts[1];
  }
  // wave47 export stays at 47
  c = c.replace(
    /describe\('Agent 24 archive scale wave wave47 export gate'[\s\S]*?assert\.equal\(bundle\.archiveScaleWaveWave47ExportGate\.waveRound, 48\)/,
    m => m.replace('waveRound, 48', 'waveRound, 47'),
  );
  // wave47 IV baseline stays WAVE47
  c = c.replace(
    /describe\('Agent 24 replay scale wave wave47 integration verification'[\s\S]*?O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA/,
    m => m.replace('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA'),
  );
  // wave46 IV waveRound stays 47
  c = c.replace(
    /describe\('Agent 24 replay scale wave wave46 integration verification'[\s\S]*?assert\.equal\(bundle\.replayScaleWaveWave46IntegrationVerification\.waveRound, 48\)/,
    m => m.replace('waveRound, 48', 'waveRound, 47'),
  );
  return c;
});

console.log('apply-wave48-tier done');
