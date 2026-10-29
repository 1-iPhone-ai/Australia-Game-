import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE47_SHA = '456efb92';

function writeWave47IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave46-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave46IntegrationVerification', 'Wave47IntegrationVerification');
  c = c.replaceAll('wave46-integration-verification', 'wave47-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave46-integration-handoff', 'replay-scale-wave-wave47-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave46-export-gate', 'archive-scale-wave-wave47-export-gate');
  c = c.replaceAll('replay-scale-wave-wave45-integration-verification', 'replay-scale-wave-wave46-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww46iv', 'rsww47iv');
  c = c.replaceAll('wave46_integration_handoff', 'wave47_integration_handoff');
  c = c.replaceAll('wave46_export', 'wave47_export');
  c = c.replaceAll('wave40_integration_verification', 'wave41_integration_verification');
  c = c.replaceAll('Wave 40 integration', 'Wave 41 integration');
  c = c.replaceAll('Wave 41 export', 'Wave 42 export');
  c = c.replaceAll('rsww46iv_w40', 'rsww47iv_w41');
  c = c.replaceAll('Wave46IntegrationHandoff', 'Wave47IntegrationHandoff');
  c = c.replaceAll('Wave45IntegrationVerification', 'Wave46IntegrationVerification');
  c = c.replaceAll('Wave46ExportGate', 'Wave47ExportGate');
  c = c.replaceAll('verified_when_wave46_integration_stack_ready', 'verified_when_wave47_integration_stack_ready');
  c = c.replaceAll('wave45IntegrationVerification', 'wave46IntegrationVerification');
  c = c.replaceAll("'w45iv'", "'w46iv'");
  c = c.replaceAll("'eg46'", "'eg47'");
  c = c.replaceAll("'ih46'", "'ih47'");
  c = c.replaceAll('asww46_t46', 'asww47_t47');
  c = c.replaceAll('rsww46ih_t46', 'rsww47ih_t47');
  c = c.replaceAll('rsww46iv_t46', 'rsww47iv_t47');
  c = c.replaceAll("integrationBaselineSha: 'a9bb07e5'", `integrationBaselineSha: '${WAVE47_SHA}'`);
  c = c.replaceAll('waveRound: 46', 'waveRound: 47');
  c = c.replaceAll('report.waveRound === 46', 'report.waveRound === 47');
  c = c.replaceAll('replayScaleWaveWave46IntegrationHandoff', 'replayScaleWaveWave47IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave46ExportGate', 'archiveScaleWaveWave47ExportGate');
  c = c.replaceAll('replayScaleWaveWave45IntegrationVerification', 'replayScaleWaveWave46IntegrationVerification');
  c = c.replaceAll(
    'buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport',
    'buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport',
  );
  c = c.replaceAll(
    'runAgent24ReplayScaleWaveWave46IntegrationVerificationSelfTests',
    'runAgent24ReplayScaleWaveWave47IntegrationVerificationSelfTests',
  );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave47-integration-verification.ts'), c);
}

function writeWave48Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave47-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave47Export', 'Wave48Export')
    .replaceAll('wave47-export-gate', 'wave48-export-gate')
    .replaceAll('Wave46IntegrationVerification', 'Wave47IntegrationVerification')
    .replaceAll('replay-scale-wave-wave46-integration-verification', 'replay-scale-wave-wave47-integration-verification')
    .replaceAll('wave46_integration_not_verified', 'wave47_integration_not_verified')
    .replaceAll('asww47', 'asww48')
    .replaceAll('wave47_stack_ready', 'wave48_stack_ready')
    .replaceAll('wave46IntegrationVerification', 'wave47IntegrationVerification')
    .replaceAll("'rsww46iv_t47'", "'rsww47iv_t48'")
    .replaceAll("'ss_t47'", "'ss_t48'")
    .replaceAll("'ss_body_t47'", "'ss_body_t48'")
    .replaceAll("'sv_t47'", "'sv_t48'")
    .replaceAll("integrationBaselineSha: '456efb92'", `integrationBaselineSha: '${WAVE47_SHA}'`)
    .replaceAll('waveRound: 46', 'waveRound: 47')
    .replaceAll('turn: 46', 'turn: 47')
    .replaceAll('report.waveRound === 46', 'report.waveRound === 47')
    .replaceAll('replayScaleWaveWave46IntegrationVerification', 'replayScaleWaveWave47IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave47ExportGateReport', 'buildAgent24ArchiveScaleWaveWave48ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave47ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave48ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave48-export-gate.ts'), c);
}

function writeWave48Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave47-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave47IntegrationHandoff', 'Wave48IntegrationHandoff')
    .replaceAll('wave47-integration-handoff', 'wave48-integration-handoff')
    .replaceAll('archive-scale-wave-wave47-export-gate', 'archive-scale-wave-wave48-export-gate')
    .replaceAll('replay-scale-wave-wave46-integration-verification', 'replay-scale-wave-wave47-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w47_cp', 'scale_wave_w48_cp')
    .replaceAll('wave47_export', 'wave48_export')
    .replaceAll('wave42_integration_verified', 'wave43_integration_verified')
    .replaceAll('Wave 41 integration', 'Wave 42 integration')
    .replaceAll('Wave 42 export', 'Wave 43 export')
    .replaceAll('wave47_baseline', 'wave48_baseline')
    .replaceAll('wave46IntegrationVerification', 'wave47IntegrationVerification')
    .replaceAll("'rsww46iv_t47'", "'rsww47iv_t48'")
    .replaceAll("'eg47'", "'eg48'")
    .replaceAll('asww47_t46', 'asww48_t47')
    .replaceAll("integrationBaselineSha: '456efb92'", `integrationBaselineSha: '${WAVE47_SHA}'`)
    .replaceAll('waveRound: 46', 'waveRound: 47')
    .replaceAll('report.waveRound === 46', 'report.waveRound === 47')
    .replaceAll('replay_scale_wave_wave47_integration_handoff', 'replay_scale_wave_wave48_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave47ExportGateReport', 'Agent24ArchiveScaleWaveWave48ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave46IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave47IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave47ExportGate', 'archiveScaleWaveWave48ExportGate')
    .replaceAll('replayScaleWaveWave46IntegrationVerification', 'replayScaleWaveWave47IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave47IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave48IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave48-integration-handoff.ts'), c);
}

writeWave47IV();
writeWave48Export();
writeWave48Handoff();
console.log('gen-wave48 ok');
