import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE53_SHA = '51039c5e';
const WAVE54_SHA = '5bd043ad';

function writeWave53IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave52-integration-verification.ts'), 'utf8');
  c = c
    .replaceAll('Wave52IntegrationVerification', 'Wave53IntegrationVerification')
    .replaceAll('wave52-integration-verification', 'wave53-integration-verification')
    .replaceAll('replay-scale-wave-wave52-integration-handoff', 'replay-scale-wave-wave53-integration-handoff')
    .replaceAll('archive-scale-wave-wave52-export-gate', 'archive-scale-wave-wave53-export-gate')
    .replaceAll('replay-scale-wave-wave51-integration-verification', 'replay-scale-wave-wave52-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE53_INTEGRATION_BASELINE_SHA')
    .replaceAll('rsww52iv', 'rsww53iv')
    .replaceAll('wave52_integration_handoff', 'wave53_integration_handoff')
    .replaceAll('wave52_export', 'wave53_export')
    .replaceAll('Wave52IntegrationHandoff', 'Wave53IntegrationHandoff')
    .replaceAll('Wave51IntegrationVerification', 'Wave52IntegrationVerification')
    .replaceAll('Wave52ExportGate', 'Wave53ExportGate')
    .replaceAll('verified_when_wave52_integration_stack_ready', 'verified_when_wave53_integration_stack_ready')
    .replaceAll('wave51IntegrationVerification', 'wave52IntegrationVerification')
    .replaceAll("'w51iv'", "'w52iv'")
    .replaceAll("'eg52'", "'eg53'")
    .replaceAll("'ih52'", "'ih53'")
    .replaceAll("integrationBaselineSha: 'ba97bdce'", `integrationBaselineSha: '${WAVE53_SHA}'`)
    .replaceAll('waveRound: 52', 'waveRound: 53')
    .replaceAll('report.waveRound === 52', 'report.waveRound === 53')
    .replaceAll('replayScaleWaveWave52IntegrationHandoff', 'replayScaleWaveWave53IntegrationHandoff')
    .replaceAll('archiveScaleWaveWave52ExportGate', 'archiveScaleWaveWave53ExportGate')
    .replaceAll('replayScaleWaveWave51IntegrationVerification', 'replayScaleWaveWave52IntegrationVerification')
    .replaceAll(
      'buildAgent24ReplayScaleWaveWave52IntegrationVerificationReport',
      'buildAgent24ReplayScaleWaveWave53IntegrationVerificationReport',
    )
    .replaceAll(
      'runAgent24ReplayScaleWaveWave52IntegrationVerificationSelfTests',
      'runAgent24ReplayScaleWaveWave53IntegrationVerificationSelfTests',
    );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave53-integration-verification.ts'), c);
}

function writeWave54Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave53-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave53Export', 'Wave54Export')
    .replaceAll('wave53-export-gate', 'wave54-export-gate')
    .replaceAll('Wave52IntegrationVerification', 'Wave53IntegrationVerification')
    .replaceAll('replay-scale-wave-wave52-integration-verification', 'replay-scale-wave-wave53-integration-verification')
    .replaceAll('wave52_integration_not_verified', 'wave53_integration_not_verified')
    .replaceAll('asww53', 'asww54')
    .replaceAll('wave53_stack_ready', 'wave54_stack_ready')
    .replaceAll('wave52IntegrationVerification', 'wave53IntegrationVerification')
    .replaceAll("'rsww52iv_t53'", "'rsww53iv_t54'")
    .replaceAll("'ss_t53'", "'ss_t54'")
    .replaceAll("'ss_body_t53'", "'ss_body_t54'")
    .replaceAll("'sv_t53'", "'sv_t54'")
    .replaceAll("integrationBaselineSha: '51039c5e'", `integrationBaselineSha: '${WAVE53_SHA}'`)
    .replaceAll('waveRound: 53', 'waveRound: 54')
    .replaceAll('turn: 53', 'turn: 54')
    .replaceAll('report.waveRound === 53', 'report.waveRound === 54')
    .replaceAll('replayScaleWaveWave52IntegrationVerification', 'replayScaleWaveWave53IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave53ExportGateReport', 'buildAgent24ArchiveScaleWaveWave54ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave53ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave54ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave54-export-gate.ts'), c);
}

function writeWave54Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave53-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave53IntegrationHandoff', 'Wave54IntegrationHandoff')
    .replaceAll('wave53-integration-handoff', 'wave54-integration-handoff')
    .replaceAll('archive-scale-wave-wave53-export-gate', 'archive-scale-wave-wave54-export-gate')
    .replaceAll('replay-scale-wave-wave52-integration-verification', 'replay-scale-wave-wave53-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE53_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w53_cp', 'scale_wave_w54_cp')
    .replaceAll('wave53_export', 'wave54_export')
    .replaceAll('wave53_baseline', 'wave54_baseline')
    .replaceAll('wave52IntegrationVerification', 'wave53IntegrationVerification')
    .replaceAll("'rsww52iv_t53'", "'rsww53iv_t54'")
    .replaceAll("'eg53'", "'eg54'")
    .replaceAll('asww53_t52', 'asww54_t53')
    .replaceAll("integrationBaselineSha: '51039c5e'", `integrationBaselineSha: '${WAVE54_SHA}'`)
    .replaceAll('waveRound: 53', 'waveRound: 54')
    .replaceAll('report.waveRound === 53', 'report.waveRound === 54')
    .replaceAll('replay_scale_wave_wave53_integration_handoff', 'replay_scale_wave_wave54_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave53ExportGateReport', 'Agent24ArchiveScaleWaveWave54ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave52IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave53IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave53ExportGate', 'archiveScaleWaveWave54ExportGate')
    .replaceAll('replayScaleWaveWave52IntegrationVerification', 'replayScaleWaveWave53IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave53IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave54IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave53IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave54IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave54-integration-handoff.ts'), c);
}

function patchBuildChunk() {
  const chunkPath = path.join(__dirname, 'build-chunk.mjs');
  let chunk = fs.readFileSync(chunkPath, 'utf8');
  const add = `  'replay-scale-wave-wave53-integration-verification.ts',
  'archive-scale-wave-wave54-export-gate.ts',
  'replay-scale-wave-wave54-integration-handoff.ts',
`;
  if (!chunk.includes('wave54-integration-handoff')) {
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
export * from './replay-scale-wave-wave53-integration-verification.ts';
export * from './archive-scale-wave-wave54-export-gate.ts';
export * from './replay-scale-wave-wave54-integration-handoff.ts';
`;
  if (!index.includes('wave54-integration-handoff')) {
    index = index.replace(
      "export * from './replay-scale-wave-wave52-integration-handoff.ts';",
      `export * from './replay-scale-wave-wave52-integration-handoff.ts';${block}`,
    );
    fs.writeFileSync(indexPath, index);
  }
}

if (!fs.existsSync(path.join(src, 'replay-scale-wave-wave53-integration-verification.ts'))) {
  writeWave53IV();
}
writeWave54Export();
writeWave54Handoff();
patchBuildChunk();
patchIndex();
console.log('gen-wave54 ok');
