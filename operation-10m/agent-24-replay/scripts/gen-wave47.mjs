import fs from 'fs';
import path from 'path';

const src = '/workspace/operation-10m/agent-24-replay/src';
const WAVE46_SHA = 'a9bb07e5';

function writeWave46IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave45-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave45IntegrationVerification', 'Wave46IntegrationVerification');
  c = c.replaceAll('wave45-integration-verification', 'wave46-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave45-integration-handoff', 'replay-scale-wave-wave46-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave45-export-gate', 'archive-scale-wave-wave46-export-gate');
  c = c.replaceAll('replay-scale-wave-wave44-integration-verification', 'replay-scale-wave-wave45-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww45iv', 'rsww46iv');
  c = c.replaceAll('wave45_integration_handoff', 'wave46_integration_handoff');
  c = c.replaceAll('wave45_export', 'wave46_export');
  c = c.replaceAll('wave39_integration_verification', 'wave40_integration_verification');
  c = c.replaceAll('Wave 39 integration', 'Wave 40 integration');
  c = c.replaceAll('Wave 40 export', 'Wave 41 export');
  c = c.replaceAll('rsww45iv_w39', 'rsww46iv_w40');
  c = c.replaceAll('Wave45IntegrationHandoff', 'Wave46IntegrationHandoff');
  c = c.replaceAll('Wave44IntegrationVerification', 'Wave45IntegrationVerification');
  c = c.replaceAll('Wave45ExportGate', 'Wave46ExportGate');
  c = c.replaceAll('verified_when_wave45_integration_stack_ready', 'verified_when_wave46_integration_stack_ready');
  c = c.replaceAll('wave44IntegrationVerification', 'wave45IntegrationVerification');
  c = c.replaceAll("'w44iv'", "'w45iv'");
  c = c.replaceAll("'eg45'", "'eg46'");
  c = c.replaceAll("'ih45'", "'ih46'");
  c = c.replaceAll('asww45_t45', 'asww46_t46');
  c = c.replaceAll('rsww45ih_t45', 'rsww46ih_t46');
  c = c.replaceAll('rsww45iv_t45', 'rsww46iv_t46');
  c = c.replaceAll("integrationBaselineSha: '98bcd652'", `integrationBaselineSha: '${WAVE46_SHA}'`);
  c = c.replaceAll('waveRound: 45', 'waveRound: 46');
  c = c.replaceAll('report.waveRound === 45', 'report.waveRound === 46');
  c = c.replaceAll('replayScaleWaveWave45IntegrationHandoff', 'replayScaleWaveWave46IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave45ExportGate', 'archiveScaleWaveWave46ExportGate');
  c = c.replaceAll('replayScaleWaveWave44IntegrationVerification', 'replayScaleWaveWave45IntegrationVerification');
  c = c.replaceAll('buildAgent24ReplayScaleWaveWave45IntegrationVerificationReport', 'buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport');
  c = c.replaceAll('runAgent24ReplayScaleWaveWave45IntegrationVerificationSelfTests', 'runAgent24ReplayScaleWaveWave46IntegrationVerificationSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave46-integration-verification.ts'), c);
}

function writeWave47Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave46-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave46Export', 'Wave47Export')
    .replaceAll('wave46-export-gate', 'wave47-export-gate')
    .replaceAll('Wave45IntegrationVerification', 'Wave46IntegrationVerification')
    .replaceAll('replay-scale-wave-wave45-integration-verification', 'replay-scale-wave-wave46-integration-verification')
    .replaceAll('wave45_integration_not_verified', 'wave46_integration_not_verified')
    .replaceAll('asww46', 'asww47')
    .replaceAll('wave46_stack_ready', 'wave47_stack_ready')
    .replaceAll('wave45IntegrationVerification', 'wave46IntegrationVerification')
    .replaceAll("'rsww45iv_t46'", "'rsww46iv_t47'")
    .replaceAll("'ss_t46'", "'ss_t47'")
    .replaceAll("'ss_body_t46'", "'ss_body_t47'")
    .replaceAll("'sv_t46'", "'sv_t47'")
    .replaceAll("integrationBaselineSha: 'a9bb07e5'", `integrationBaselineSha: '${WAVE46_SHA}'`)
    .replaceAll('waveRound: 45', 'waveRound: 46')
    .replaceAll('turn: 45', 'turn: 46')
    .replaceAll('report.waveRound === 45', 'report.waveRound === 46')
    .replaceAll('replayScaleWaveWave45IntegrationVerification', 'replayScaleWaveWave46IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave46ExportGateReport', 'buildAgent24ArchiveScaleWaveWave47ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave46ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave47ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave47-export-gate.ts'), c);
}

function writeWave47Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave46-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave46IntegrationHandoff', 'Wave47IntegrationHandoff')
    .replaceAll('wave46-integration-handoff', 'wave47-integration-handoff')
    .replaceAll('archive-scale-wave-wave46-export-gate', 'archive-scale-wave-wave47-export-gate')
    .replaceAll('replay-scale-wave-wave45-integration-verification', 'replay-scale-wave-wave46-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w46_cp', 'scale_wave_w47_cp')
    .replaceAll('wave46_export', 'wave47_export')
    .replaceAll('wave41_integration_verified', 'wave42_integration_verified')
    .replaceAll('Wave 40 integration', 'Wave 41 integration')
    .replaceAll('Wave 41 export', 'Wave 42 export')
    .replaceAll('wave46_baseline', 'wave47_baseline')
    .replaceAll('wave45IntegrationVerification', 'wave46IntegrationVerification')
    .replaceAll("'rsww45iv_t46'", "'rsww46iv_t47'")
    .replaceAll("'eg46'", "'eg47'")
    .replaceAll('asww46_t45', 'asww47_t46')
    .replaceAll("integrationBaselineSha: '98bcd652'", `integrationBaselineSha: '${WAVE46_SHA}'`)
    .replaceAll('waveRound: 45', 'waveRound: 46')
    .replaceAll('report.waveRound === 45', 'report.waveRound === 46')
    .replaceAll('replay_scale_wave_wave46_integration_handoff', 'replay_scale_wave_wave47_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave46ExportGateReport', 'Agent24ArchiveScaleWaveWave47ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave45IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave46IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave46ExportGate', 'archiveScaleWaveWave47ExportGate')
    .replaceAll('replayScaleWaveWave45IntegrationVerification', 'replayScaleWaveWave46IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave46IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave47IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave47-integration-handoff.ts'), c);
}

writeWave46IV();
writeWave47Export();
writeWave47Handoff();
console.log('ok');
