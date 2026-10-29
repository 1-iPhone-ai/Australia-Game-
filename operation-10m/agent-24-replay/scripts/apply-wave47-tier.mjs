#!/usr/bin/env node
/**
 * Mechanical wave-47 tier bump (mirrors round-46 O10-223 pattern).
 */
import fs from 'fs';
import path from 'path';

const root = '/workspace/operation-10m/agent-24-replay';
const src = path.join(root, 'src');

const TIER_INSERT = `(waveRound >= 47
      ? O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA
      : waveRound >= 46`;

const WAVE23_BASELINE_INSERT = `    waveRound >= 47
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA
      : waveRound >= 46`;

function patchFile(rel, mutator) {
  const fp = path.join(root, rel);
  let c = fs.readFileSync(fp, 'utf8');
  const next = mutator(c);
  if (next === c) {
    console.warn('no change:', rel);
  }
  fs.writeFileSync(fp, next);
}

function insertWave47Tier(c) {
  if (c.includes('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')) return c;
  if (!c.includes('(waveRound >= 46')) return c;
  return c.replace('(waveRound >= 46', TIER_INSERT);
}

function addWave47ImportFromCloseout(c) {
  if (!c.includes('O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')) return c;
  return c.replace(
    'O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,',
    'O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,',
  );
}

function bumpPinnedWave46To47(c) {
  return c
    .replaceAll('waveRound: 46,', 'waveRound: 47,')
    .replaceAll('report.waveRound === 46', 'report.waveRound === 47')
    .replaceAll('waveRound >= 46\n      ? input.replayScaleWaveFullChunksVerification', WAVE23_BASELINE_INSERT);
}

// integration closeout
patchFile('src/replay-scale-wave-integration-closeout.ts', c => {
  if (!c.includes('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      "export const O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA = 'a9bb07e5';",
      "export const O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA = 'a9bb07e5';\n\n/** O10-225 integration baseline anchor (wave 47 roster). */\nexport const O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA = '456efb92';",
    );
  }
  c = insertWave47Tier(c);
  c = c.replace(
    'report.integrationBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
    'report.integrationBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
  );
  return bumpPinnedWave46To47(c);
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
    c = addWave47ImportFromCloseout(c);
    c = insertWave47Tier(c);
    if (f.includes('dryrun-handoff') || f.includes('projection-handoff') || f.includes('full-chunks-handoff')) {
      c = c.replaceAll('O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,', 'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,');
      c = c.replaceAll(
        'seal.dryrunBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
        'seal.dryrunBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'seal.projectionBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
        'seal.projectionBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'seal.fullChunksBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
        'seal.fullChunksBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
      );
      c = c.replaceAll(
        'report.dryrunBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
        'report.dryrunBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA',
      );
    }
    if (f.includes('dryrun-verification') || f.includes('projection-verification') || f.includes('full-chunks-verification') || f.includes('integration-verification')) {
      c = c.replaceAll('O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA');
    }
    return bumpPinnedWave46To47(c);
  });
}

patchFile('src/replay-scale-wave-wave23-integration-handoff.ts', c => {
  c = addWave47ImportFromCloseout(c);
  if (!c.includes('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')) return c;
  if (c.includes('waveRound >= 47')) return c;
  return c.replace(
    '    waveRound >= 46\n      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===\n        O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
    WAVE23_BASELINE_INSERT +
      '\n      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===\n        O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA',
  );
});

patchFile('src/history-replay-analytics.ts', c =>
  c.replace("export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r46';", "export const O6K_AGENT24_MODULE_VERSION = '1.2.0-op10m-r47';"),
);

// index + build-chunk
patchFile('src/index.ts', c => {
  if (c.includes('wave47-integration-handoff')) return c;
  return c.replace(
    "export * from './replay-scale-wave-wave46-integration-handoff.ts';",
    "export * from './replay-scale-wave-wave46-integration-handoff.ts';\nexport * from './replay-scale-wave-wave46-integration-verification.ts';\nexport * from './archive-scale-wave-wave47-export-gate.ts';\nexport * from './replay-scale-wave-wave47-integration-handoff.ts';",
  );
});

patchFile('scripts/build-chunk.mjs', c => {
  if (c.includes('wave47-integration-handoff')) return c;
  return c.replace(
    "    'replay-scale-wave-wave46-integration-handoff.ts',",
    "    'replay-scale-wave-wave46-integration-handoff.ts',\n    'replay-scale-wave-wave46-integration-verification.ts',\n    'archive-scale-wave-wave47-export-gate.ts',\n    'replay-scale-wave-wave47-integration-handoff.ts',",
  );
});

// replay-determinism.ts
patchFile('src/replay-determinism.ts', c => {
  if (c.includes('Wave47IntegrationHandoff')) return c;
  const importBlock = `import {
  buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport,
  type Agent24ReplayScaleWaveWave46IntegrationVerificationReport,
} from './replay-scale-wave-wave46-integration-verification.ts';
import {
  buildAgent24ArchiveScaleWaveWave47ExportGateReport,
  type Agent24ArchiveScaleWaveWave47ExportGateReport,
} from './archive-scale-wave-wave47-export-gate.ts';
import {
  buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport,
  type Agent24ReplayScaleWaveWave47IntegrationHandoffReport,
} from './replay-scale-wave-wave47-integration-handoff.ts';
`;
  c = c.replace(
    "} from './replay-scale-wave-wave46-integration-handoff.ts';\n",
    "} from './replay-scale-wave-wave46-integration-handoff.ts';\n" + importBlock,
  );
  c = c.replace(
    '  replayScaleWaveWave46IntegrationHandoff: Agent24ReplayScaleWaveWave46IntegrationHandoffReport;\n',
    '  replayScaleWaveWave46IntegrationHandoff: Agent24ReplayScaleWaveWave46IntegrationHandoffReport;\n  replayScaleWaveWave46IntegrationVerification: Agent24ReplayScaleWaveWave46IntegrationVerificationReport;\n  archiveScaleWaveWave47ExportGate: Agent24ArchiveScaleWaveWave47ExportGateReport;\n  replayScaleWaveWave47IntegrationHandoff: Agent24ReplayScaleWaveWave47IntegrationHandoffReport;\n',
  );
  c = c.replace('    waveRound: 46,\n    archiveContinuityVerification,', '    waveRound: 47,\n    archiveContinuityVerification,');
  const buildBlock = `  const replayScaleWaveWave46IntegrationVerification = buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport({
    matchId: input.matchId,
    replayScaleWaveWave46IntegrationHandoff,
    archiveScaleWaveWave46ExportGate,
    replayScaleWaveWave45IntegrationVerification,
  });
  const archiveScaleWaveWave47ExportGate = buildAgent24ArchiveScaleWaveWave47ExportGateReport({
    matchId: input.matchId,
    replayScaleWaveWave46IntegrationVerification,
    snapshotSeal,
    sealVerification,
  });
  const replayScaleWaveWave47IntegrationHandoff = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave47ExportGate,
    replayScaleWaveWave46IntegrationVerification,
  });
`;
  c = c.replace(
    `  const replayScaleWaveWave46IntegrationHandoff = buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave46ExportGate,
    replayScaleWaveWave45IntegrationVerification,
  });
  const replayScaleWaveWave34IntegrationHandoff`,
    `  const replayScaleWaveWave46IntegrationHandoff = buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport({
    matchId: input.matchId,
    archiveScaleWaveWave46ExportGate,
    replayScaleWaveWave45IntegrationVerification,
  });
${buildBlock}  const replayScaleWaveWave34IntegrationHandoff`,
  );
  c = c.replace(
    '    replayScaleWaveWave46IntegrationHandoff: replayScaleWaveWave46IntegrationHandoff.deterministicFingerprint,\n',
    '    replayScaleWaveWave46IntegrationHandoff: replayScaleWaveWave46IntegrationHandoff.deterministicFingerprint,\n    replayScaleWaveWave46IntegrationVerification: replayScaleWaveWave46IntegrationVerification.deterministicFingerprint,\n    archiveScaleWaveWave47ExportGate: archiveScaleWaveWave47ExportGate.deterministicFingerprint,\n    replayScaleWaveWave47IntegrationHandoff: replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint,\n',
  );
  c = c.replace(
    '    replayScaleWaveWave46IntegrationHandoff,\n    replayScaleWaveWave34IntegrationHandoff,',
    '    replayScaleWaveWave46IntegrationHandoff,\n    replayScaleWaveWave46IntegrationVerification,\n    archiveScaleWaveWave47ExportGate,\n    replayScaleWaveWave47IntegrationHandoff,\n    replayScaleWaveWave34IntegrationHandoff,',
  );
  const twinBlock = `    {
      name: 'replay_scale_wave_wave46_integration_verification_twin',
      passed:
        a.replayScaleWaveWave46IntegrationVerification.deterministicFingerprint ===
        b.replayScaleWaveWave46IntegrationVerification.deterministicFingerprint,
      detail: 'Twin replay scale wave wave46 integration verification fingerprints',
    },
    {
      name: 'archive_scale_wave_wave47_export_gate_twin',
      passed:
        a.archiveScaleWaveWave47ExportGate.deterministicFingerprint ===
        b.archiveScaleWaveWave47ExportGate.deterministicFingerprint,
      detail: 'Twin archive scale wave wave47 export gate fingerprints',
    },
    {
      name: 'replay_scale_wave_wave47_integration_handoff_twin',
      passed:
        a.replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint ===
        b.replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint,
      detail: 'Twin replay scale wave wave47 integration handoff fingerprints',
    },
`;
  c = c.replace(
    `    {
      name: 'replay_scale_wave_wave46_integration_handoff_twin',
      passed:
        a.replayScaleWaveWave46IntegrationHandoff.deterministicFingerprint ===
        b.replayScaleWaveWave46IntegrationHandoff.deterministicFingerprint,
      detail: 'Twin replay scale wave wave46 integration handoff fingerprints',
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
  if (!c.includes('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')) {
    c = c.replace(
      '  O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,',
      '  O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,\n  O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,',
    );
  }
  if (!c.includes('wave47-integration-handoff')) {
    c = c.replace(
      "} from '../src/replay-scale-wave-wave46-integration-handoff.ts';",
      "} from '../src/replay-scale-wave-wave46-integration-handoff.ts';\nimport {\n  buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport,\n  runAgent24ReplayScaleWaveWave46IntegrationVerificationSelfTests,\n} from '../src/replay-scale-wave-wave46-integration-verification.ts';\nimport {\n  buildAgent24ArchiveScaleWaveWave47ExportGateReport,\n  runAgent24ArchiveScaleWaveWave47ExportGateSelfTests,\n} from '../src/archive-scale-wave-wave47-export-gate.ts';\nimport {\n  buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport,\n  runAgent24ReplayScaleWaveWave47IntegrationHandoffSelfTests,\n} from '../src/replay-scale-wave-wave47-integration-handoff.ts';",
    );
    const newTests = `
describe('Agent 24 replay scale wave wave46 integration verification', () => {
  it('verifies wave46 integration when handoff, export, and wave45 verification align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave46IntegrationVerification.verified, true);
    assert.equal(bundle.replayScaleWaveWave46IntegrationVerification.waveRound, 47);
    assert.equal(
      bundle.replayScaleWaveWave46IntegrationVerification.integrationBaselineSha,
      O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport({
      matchId: 'm',
      replayScaleWaveWave46IntegrationHandoff: bundle.replayScaleWaveWave46IntegrationHandoff,
      archiveScaleWaveWave46ExportGate: bundle.archiveScaleWaveWave46ExportGate,
      replayScaleWaveWave45IntegrationVerification: bundle.replayScaleWaveWave45IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave46IntegrationVerification.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave46IntegrationVerificationSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 archive scale wave wave47 export gate', () => {
  it('allows export when wave46 integration verified and seals align', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.archiveScaleWaveWave47ExportGate.exportAllowed, true);
    assert.equal(bundle.archiveScaleWaveWave47ExportGate.waveRound, 47);
    const direct = buildAgent24ArchiveScaleWaveWave47ExportGateReport({
      matchId: 'm',
      replayScaleWaveWave46IntegrationVerification: bundle.replayScaleWaveWave46IntegrationVerification,
      snapshotSeal: bundle.snapshotSeal,
      sealVerification: bundle.sealVerification,
    });
    assert.equal(direct.deterministicFingerprint, bundle.archiveScaleWaveWave47ExportGate.deterministicFingerprint);
    assert.ok(runAgent24ArchiveScaleWaveWave47ExportGateSelfTests().every(t => t.passed));
  });
});

describe('Agent 24 replay scale wave wave47 integration handoff', () => {
  it('completes integration handoff at wave 47 baseline', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(richArchiveBundleInput());
    assert.equal(bundle.replayScaleWaveWave47IntegrationHandoff.handoffComplete, true);
    assert.equal(bundle.replayScaleWaveWave47IntegrationHandoff.waveRound, 47);
    assert.equal(
      bundle.replayScaleWaveWave47IntegrationHandoff.integrationBaselineSha,
      O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    );
    const direct = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
      matchId: 'm',
      archiveScaleWaveWave47ExportGate: bundle.archiveScaleWaveWave47ExportGate,
      replayScaleWaveWave46IntegrationVerification: bundle.replayScaleWaveWave46IntegrationVerification,
    });
    assert.equal(
      direct.deterministicFingerprint,
      bundle.replayScaleWaveWave47IntegrationHandoff.deterministicFingerprint,
    );
    assert.ok(runAgent24ReplayScaleWaveWave47IntegrationHandoffSelfTests().every(t => t.passed));
  });
});
`;
    c = c.replace(
      "describe('Agent 24 replay scale wave wave39 integration verification', () => {",
      newTests + "\ndescribe('Agent 24 replay scale wave wave39 integration verification', () => {",
    );
  }
  // bump stack pins 46 -> 47 except wave46 export gate block
  const parts = c.split("describe('Agent 24 archive scale wave wave46 export gate'");
  if (parts.length === 2) {
    parts[0] = parts[0]
      .replaceAll('waveRound, 46', 'waveRound, 47')
      .replaceAll('waveRound: 46', 'waveRound: 47')
      .replaceAll('accepts wave 46 when', 'accepts wave 47 when')
      .replaceAll('O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA');
    c = parts[0] + "describe('Agent 24 archive scale wave wave46 export gate'" + parts[1];
  }
  // wave46 export stays at 46
  c = c.replace(
    /describe\('Agent 24 archive scale wave wave46 export gate'[\s\S]*?assert\.equal\(bundle\.archiveScaleWaveWave46ExportGate\.waveRound, 47\)/,
    m => m.replace('waveRound, 47', 'waveRound, 46'),
  );
  // wave46 IV baseline stays WAVE46
  c = c.replace(
    /describe\('Agent 24 replay scale wave wave46 integration verification'[\s\S]*?O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA/,
    m => m.replace('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA'),
  );
  return c;
});

console.log('apply-wave47-tier done');
