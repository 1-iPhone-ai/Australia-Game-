import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE48_SHA = '4404bf0f';

function writeWave48IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave47-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave47IntegrationVerification', 'Wave48IntegrationVerification');
  c = c.replaceAll('wave47-integration-verification', 'wave48-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave47-integration-handoff', 'replay-scale-wave-wave48-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave47-export-gate', 'archive-scale-wave-wave48-export-gate');
  c = c.replaceAll('replay-scale-wave-wave46-integration-verification', 'replay-scale-wave-wave47-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww47iv', 'rsww48iv');
  c = c.replaceAll('wave47_integration_handoff', 'wave48_integration_handoff');
  c = c.replaceAll('wave47_export', 'wave48_export');
  c = c.replaceAll('wave41_integration_verification', 'wave42_integration_verification');
  c = c.replaceAll('Wave 41 integration', 'Wave 42 integration');
  c = c.replaceAll('Wave 42 export', 'Wave 43 export');
  c = c.replaceAll('rsww47iv_w41', 'rsww48iv_w42');
  c = c.replaceAll('Wave47IntegrationHandoff', 'Wave48IntegrationHandoff');
  c = c.replaceAll('Wave46IntegrationVerification', 'Wave47IntegrationVerification');
  c = c.replaceAll('Wave47ExportGate', 'Wave48ExportGate');
  c = c.replaceAll('verified_when_wave47_integration_stack_ready', 'verified_when_wave48_integration_stack_ready');
  c = c.replaceAll('wave46IntegrationVerification', 'wave47IntegrationVerification');
  c = c.replaceAll("'w46iv'", "'w47iv'");
  c = c.replaceAll("'eg47'", "'eg48'");
  c = c.replaceAll("'ih47'", "'ih48'");
  c = c.replaceAll('asww47_t47', 'asww48_t48');
  c = c.replaceAll('rsww47ih_t47', 'rsww48ih_t48');
  c = c.replaceAll('rsww47iv_t47', 'rsww48iv_t48');
  c = c.replaceAll("integrationBaselineSha: '456efb92'", `integrationBaselineSha: '${WAVE48_SHA}'`);
  c = c.replaceAll('waveRound: 47', 'waveRound: 48');
  c = c.replaceAll('report.waveRound === 47', 'report.waveRound === 48');
  c = c.replaceAll('replayScaleWaveWave47IntegrationHandoff', 'replayScaleWaveWave48IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave47ExportGate', 'archiveScaleWaveWave48ExportGate');
  c = c.replaceAll('replayScaleWaveWave46IntegrationVerification', 'replayScaleWaveWave47IntegrationVerification');
  c = c.replaceAll(
    'buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport',
    'buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport',
  );
  c = c.replaceAll(
    'runAgent24ReplayScaleWaveWave47IntegrationVerificationSelfTests',
    'runAgent24ReplayScaleWaveWave48IntegrationVerificationSelfTests',
  );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave48-integration-verification.ts'), c);
}

function writeWave49Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave48-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave48Export', 'Wave49Export')
    .replaceAll('wave48-export-gate', 'wave49-export-gate')
    .replaceAll('Wave47IntegrationVerification', 'Wave48IntegrationVerification')
    .replaceAll('replay-scale-wave-wave47-integration-verification', 'replay-scale-wave-wave48-integration-verification')
    .replaceAll('wave47_integration_not_verified', 'wave48_integration_not_verified')
    .replaceAll('asww48', 'asww49')
    .replaceAll('wave48_stack_ready', 'wave49_stack_ready')
    .replaceAll('wave47IntegrationVerification', 'wave48IntegrationVerification')
    .replaceAll("'rsww47iv_t48'", "'rsww48iv_t49'")
    .replaceAll("'ss_t48'", "'ss_t49'")
    .replaceAll("'ss_body_t48'", "'ss_body_t49'")
    .replaceAll("'sv_t48'", "'sv_t49'")
    .replaceAll("integrationBaselineSha: '4404bf0f'", `integrationBaselineSha: '${WAVE48_SHA}'`)
    .replaceAll('waveRound: 47', 'waveRound: 48')
    .replaceAll('turn: 47', 'turn: 48')
    .replaceAll('report.waveRound === 47', 'report.waveRound === 48')
    .replaceAll('replayScaleWaveWave47IntegrationVerification', 'replayScaleWaveWave48IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave48ExportGateReport', 'buildAgent24ArchiveScaleWaveWave49ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave48ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave49ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave49-export-gate.ts'), c);
}

function writeWave49Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave48-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave48IntegrationHandoff', 'Wave49IntegrationHandoff')
    .replaceAll('wave48-integration-handoff', 'wave49-integration-handoff')
    .replaceAll('archive-scale-wave-wave48-export-gate', 'archive-scale-wave-wave49-export-gate')
    .replaceAll('replay-scale-wave-wave47-integration-verification', 'replay-scale-wave-wave48-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w48_cp', 'scale_wave_w49_cp')
    .replaceAll('wave48_export', 'wave49_export')
    .replaceAll('wave43_integration_verified', 'wave44_integration_verified')
    .replaceAll('Wave 42 integration', 'Wave 43 integration')
    .replaceAll('Wave 43 export', 'Wave 44 export')
    .replaceAll('wave48_baseline', 'wave49_baseline')
    .replaceAll('wave47IntegrationVerification', 'wave48IntegrationVerification')
    .replaceAll("'rsww47iv_t48'", "'rsww48iv_t49'")
    .replaceAll("'eg48'", "'eg49'")
    .replaceAll('asww48_t47', 'asww49_t48')
    .replaceAll("integrationBaselineSha: '4404bf0f'", `integrationBaselineSha: '${WAVE48_SHA}'`)
    .replaceAll('waveRound: 47', 'waveRound: 48')
    .replaceAll('report.waveRound === 47', 'report.waveRound === 48')
    .replaceAll('replay_scale_wave_wave48_integration_handoff', 'replay_scale_wave_wave49_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave48ExportGateReport', 'Agent24ArchiveScaleWaveWave49ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave47IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave48IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave48ExportGate', 'archiveScaleWaveWave49ExportGate')
    .replaceAll('replayScaleWaveWave47IntegrationVerification', 'replayScaleWaveWave48IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave48IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave49IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave49-integration-handoff.ts'), c);
}

writeWave48IV();
writeWave49Export();
writeWave49Handoff();
console.log('gen-wave49 ok');
