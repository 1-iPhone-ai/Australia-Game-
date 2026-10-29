import fs from 'fs';
import path from 'path';

const src = '/workspace/operation-10m/agent-24-replay/src';
const WAVE45_SHA = '98bcd652';

function writeWave45IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave44-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave44IntegrationVerification', 'Wave45IntegrationVerification');
  c = c.replaceAll('wave44-integration-verification', 'wave45-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave44-integration-handoff', 'replay-scale-wave-wave45-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave44-export-gate', 'archive-scale-wave-wave45-export-gate');
  c = c.replaceAll('replay-scale-wave-wave43-integration-verification', 'replay-scale-wave-wave44-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww44iv', 'rsww45iv');
  c = c.replaceAll('wave44_integration_handoff', 'wave45_integration_handoff');
  c = c.replaceAll('wave44_export', 'wave45_export');
  c = c.replaceAll('wave38_integration_verification', 'wave39_integration_verification');
  c = c.replaceAll('Wave 38 integration', 'Wave 39 integration');
  c = c.replaceAll('Wave 39 export', 'Wave 40 export');
  c = c.replaceAll('rsww44iv_w38', 'rsww45iv_w39');
  c = c.replaceAll('Wave44IntegrationHandoff', 'Wave45IntegrationHandoff');
  c = c.replaceAll('Wave43IntegrationVerification', 'Wave44IntegrationVerification');
  c = c.replaceAll('Wave44ExportGate', 'Wave45ExportGate');
  c = c.replaceAll('verified_when_wave44_integration_stack_ready', 'verified_when_wave45_integration_stack_ready');
  c = c.replaceAll('wave43IntegrationVerification', 'wave44IntegrationVerification');
  c = c.replaceAll("'w43iv'", "'w44iv'");
  c = c.replaceAll("'eg44'", "'eg45'");
  c = c.replaceAll("'ih44'", "'ih45'");
  c = c.replaceAll('asww44_t44', 'asww45_t45');
  c = c.replaceAll('rsww44ih_t44', 'rsww45ih_t45');
  c = c.replaceAll('rsww44iv_t44', 'rsww45iv_t45');
  c = c.replaceAll("integrationBaselineSha: 'bca7e0a3'", `integrationBaselineSha: '${WAVE45_SHA}'`);
  c = c.replaceAll('waveRound: 44', 'waveRound: 45');
  c = c.replaceAll('report.waveRound === 44', 'report.waveRound === 45');
  c = c.replaceAll('replayScaleWaveWave44IntegrationHandoff', 'replayScaleWaveWave45IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave44ExportGate', 'archiveScaleWaveWave45ExportGate');
  c = c.replaceAll('replayScaleWaveWave43IntegrationVerification', 'replayScaleWaveWave44IntegrationVerification');
  c = c.replaceAll('buildAgent24ReplayScaleWaveWave44IntegrationVerificationReport', 'buildAgent24ReplayScaleWaveWave45IntegrationVerificationReport');
  c = c.replaceAll('runAgent24ReplayScaleWaveWave44IntegrationVerificationSelfTests', 'runAgent24ReplayScaleWaveWave45IntegrationVerificationSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave45-integration-verification.ts'), c);
}

function writeWave46Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave45-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave45Export', 'Wave46Export')
    .replaceAll('wave45-export-gate', 'wave46-export-gate')
    .replaceAll('Wave44IntegrationVerification', 'Wave45IntegrationVerification')
    .replaceAll('replay-scale-wave-wave44-integration-verification', 'replay-scale-wave-wave45-integration-verification')
    .replaceAll('wave44_integration_not_verified', 'wave45_integration_not_verified')
    .replaceAll('asww45', 'asww46')
    .replaceAll('wave45_stack_ready', 'wave46_stack_ready')
    .replaceAll('wave44IntegrationVerification', 'wave45IntegrationVerification')
    .replaceAll("'rsww44iv_t45'", "'rsww45iv_t46'")
    .replaceAll("'ss_t45'", "'ss_t46'")
    .replaceAll("'ss_body_t45'", "'ss_body_t46'")
    .replaceAll("'sv_t45'", "'sv_t46'")
    .replaceAll("integrationBaselineSha: '98bcd652'", `integrationBaselineSha: '${WAVE45_SHA}'`)
    .replaceAll('waveRound: 44', 'waveRound: 45')
    .replaceAll('turn: 44', 'turn: 45')
    .replaceAll('report.waveRound === 44', 'report.waveRound === 45')
    .replaceAll('replayScaleWaveWave44IntegrationVerification', 'replayScaleWaveWave45IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave45ExportGateReport', 'buildAgent24ArchiveScaleWaveWave46ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave45ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave46ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave46-export-gate.ts'), c);
}

function writeWave46Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave45-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave45IntegrationHandoff', 'Wave46IntegrationHandoff')
    .replaceAll('wave45-integration-handoff', 'wave46-integration-handoff')
    .replaceAll('archive-scale-wave-wave45-export-gate', 'archive-scale-wave-wave46-export-gate')
    .replaceAll('replay-scale-wave-wave44-integration-verification', 'replay-scale-wave-wave45-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w45_cp', 'scale_wave_w46_cp')
    .replaceAll('wave45_export', 'wave46_export')
    .replaceAll('wave40_integration_verified', 'wave41_integration_verified')
    .replaceAll('Wave 39 integration', 'Wave 40 integration')
    .replaceAll('Wave 40 export', 'Wave 41 export')
    .replaceAll('wave45_baseline', 'wave46_baseline')
    .replaceAll('wave44IntegrationVerification', 'wave45IntegrationVerification')
    .replaceAll("'rsww44iv_t45'", "'rsww45iv_t46'")
    .replaceAll("'eg45'", "'eg46'")
    .replaceAll('asww45_t44', 'asww46_t45')
    .replaceAll("integrationBaselineSha: 'bca7e0a3'", `integrationBaselineSha: '${WAVE45_SHA}'`)
    .replaceAll('waveRound: 44', 'waveRound: 45')
    .replaceAll('report.waveRound === 44', 'report.waveRound === 45')
    .replaceAll('replay_scale_wave_wave45_integration_handoff', 'replay_scale_wave_wave46_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave45ExportGateReport', 'Agent24ArchiveScaleWaveWave46ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave44IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave45IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave45ExportGate', 'archiveScaleWaveWave46ExportGate')
    .replaceAll('replayScaleWaveWave44IntegrationVerification', 'replayScaleWaveWave45IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave45IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave45IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave46IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave46-integration-handoff.ts'), c);
}

writeWave45IV();
writeWave46Export();
writeWave46Handoff();
console.log('ok');
