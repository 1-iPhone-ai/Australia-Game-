import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE52_SHA = 'ba97bdce';
const WAVE53_SHA = '51039c5e';

function writeWave52IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave51-integration-verification.ts'), 'utf8');
  c = c
    .replaceAll('Wave51IntegrationVerification', 'Wave52IntegrationVerification')
    .replaceAll('wave51-integration-verification', 'wave52-integration-verification')
    .replaceAll('replay-scale-wave-wave51-integration-handoff', 'replay-scale-wave-wave52-integration-handoff')
    .replaceAll('archive-scale-wave-wave51-export-gate', 'archive-scale-wave-wave52-export-gate')
    .replaceAll('replay-scale-wave-wave50-integration-verification', 'replay-scale-wave-wave51-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA')
    .replaceAll('rsww51iv', 'rsww52iv')
    .replaceAll('wave51_integration_handoff', 'wave52_integration_handoff')
    .replaceAll('wave51_export', 'wave52_export')
    .replaceAll('Wave51IntegrationHandoff', 'Wave52IntegrationHandoff')
    .replaceAll('Wave50IntegrationVerification', 'Wave51IntegrationVerification')
    .replaceAll('Wave51ExportGate', 'Wave52ExportGate')
    .replaceAll('verified_when_wave51_integration_stack_ready', 'verified_when_wave52_integration_stack_ready')
    .replaceAll('wave50IntegrationVerification', 'wave51IntegrationVerification')
    .replaceAll("'w50iv'", "'w51iv'")
    .replaceAll("'eg51'", "'eg52'")
    .replaceAll("'ih51'", "'ih52'")
    .replaceAll("integrationBaselineSha: 'a32b2b15'", `integrationBaselineSha: '${WAVE52_SHA}'`)
    .replaceAll('waveRound: 51', 'waveRound: 52')
    .replaceAll('report.waveRound === 51', 'report.waveRound === 52')
    .replaceAll('replayScaleWaveWave51IntegrationHandoff', 'replayScaleWaveWave52IntegrationHandoff')
    .replaceAll('archiveScaleWaveWave51ExportGate', 'archiveScaleWaveWave52ExportGate')
    .replaceAll('replayScaleWaveWave50IntegrationVerification', 'replayScaleWaveWave51IntegrationVerification')
    .replaceAll(
      'buildAgent24ReplayScaleWaveWave51IntegrationVerificationReport',
      'buildAgent24ReplayScaleWaveWave52IntegrationVerificationReport',
    )
    .replaceAll(
      'runAgent24ReplayScaleWaveWave51IntegrationVerificationSelfTests',
      'runAgent24ReplayScaleWaveWave52IntegrationVerificationSelfTests',
    );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave52-integration-verification.ts'), c);
}

function writeWave53Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave52-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave52Export', 'Wave53Export')
    .replaceAll('wave52-export-gate', 'wave53-export-gate')
    .replaceAll('Wave51IntegrationVerification', 'Wave52IntegrationVerification')
    .replaceAll('replay-scale-wave-wave51-integration-verification', 'replay-scale-wave-wave52-integration-verification')
    .replaceAll('wave51_integration_not_verified', 'wave52_integration_not_verified')
    .replaceAll('asww52', 'asww53')
    .replaceAll('wave52_stack_ready', 'wave53_stack_ready')
    .replaceAll('wave51IntegrationVerification', 'wave52IntegrationVerification')
    .replaceAll("'rsww51iv_t52'", "'rsww52iv_t53'")
    .replaceAll("'ss_t52'", "'ss_t53'")
    .replaceAll("'ss_body_t52'", "'ss_body_t53'")
    .replaceAll("'sv_t52'", "'sv_t53'")
    .replaceAll("integrationBaselineSha: 'ba97bdce'", `integrationBaselineSha: '${WAVE52_SHA}'`)
    .replaceAll('waveRound: 51', 'waveRound: 52')
    .replaceAll('turn: 51', 'turn: 52')
    .replaceAll('report.waveRound === 51', 'report.waveRound === 52')
    .replaceAll('replayScaleWaveWave51IntegrationVerification', 'replayScaleWaveWave52IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave52ExportGateReport', 'buildAgent24ArchiveScaleWaveWave53ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave52ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave53ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave53-export-gate.ts'), c);
}

function writeWave53Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave52-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave52IntegrationHandoff', 'Wave53IntegrationHandoff')
    .replaceAll('wave52-integration-handoff', 'wave53-integration-handoff')
    .replaceAll('archive-scale-wave-wave52-export-gate', 'archive-scale-wave-wave53-export-gate')
    .replaceAll('replay-scale-wave-wave51-integration-verification', 'replay-scale-wave-wave52-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE53_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w52_cp', 'scale_wave_w53_cp')
    .replaceAll('wave52_export', 'wave53_export')
    .replaceAll('wave52_baseline', 'wave53_baseline')
    .replaceAll('wave51IntegrationVerification', 'wave52IntegrationVerification')
    .replaceAll("'rsww51iv_t52'", "'rsww52iv_t53'")
    .replaceAll("'eg52'", "'eg53'")
    .replaceAll('asww52_t51', 'asww53_t52')
    .replaceAll("integrationBaselineSha: 'ba97bdce'", `integrationBaselineSha: '${WAVE53_SHA}'`)
    .replaceAll('waveRound: 51', 'waveRound: 52')
    .replaceAll('report.waveRound === 51', 'report.waveRound === 52')
    .replaceAll('replay_scale_wave_wave52_integration_handoff', 'replay_scale_wave_wave53_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave52ExportGateReport', 'Agent24ArchiveScaleWaveWave53ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave51IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave52IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave52ExportGate', 'archiveScaleWaveWave53ExportGate')
    .replaceAll('replayScaleWaveWave51IntegrationVerification', 'replayScaleWaveWave52IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave52IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave53IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave52IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave53IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave53-integration-handoff.ts'), c);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  const add = `  'replay-scale-wave-wave52-integration-verification.ts',
  'archive-scale-wave-wave53-export-gate.ts',
  'replay-scale-wave-wave53-integration-handoff.ts',
`;
  if (!chunk.includes('wave53-integration-handoff')) {
    chunk = chunk.replace(
      "  'replay-scale-wave-wave52-integration-handoff.ts',",
      `  'replay-scale-wave-wave52-integration-handoff.ts',
${add}`,
    );
    fs.writeFileSync(chunkPath, chunk);
  }
}

function patchIndex() {
  const indexPath = path.join(src, 'index.ts');
  let index = fs.readFileSync(indexPath, 'utf8');
  const block = `
export * from './replay-scale-wave-wave52-integration-verification.ts';
export * from './archive-scale-wave-wave53-export-gate.ts';
export * from './replay-scale-wave-wave53-integration-handoff.ts';
`;
  if (!index.includes('wave53-integration-handoff')) {
    index = index.replace(
      "export * from './replay-scale-wave-wave52-integration-handoff.ts';",
      `export * from './replay-scale-wave-wave52-integration-handoff.ts';${block}`,
    );
    fs.writeFileSync(indexPath, index);
  }
}

if (!fs.existsSync(path.join(src, 'replay-scale-wave-wave52-integration-verification.ts'))) {
  writeWave52IV();
}
writeWave53Export();
writeWave53Handoff();
patchBuildChunk();
patchIndex();
console.log('gen-wave53 ok');
