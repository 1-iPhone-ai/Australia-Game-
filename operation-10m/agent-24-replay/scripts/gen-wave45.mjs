import fs from 'fs';
import path from 'path';

const src = '/workspace/operation-10m/agent-24-replay/src';
const WAVE44_SHA = 'bca7e0a3';

function writeWave44IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave43-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave43IntegrationVerification', 'Wave44IntegrationVerification');
  c = c.replaceAll('wave43-integration-verification', 'wave44-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave43-integration-handoff', 'replay-scale-wave-wave44-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave43-export-gate', 'archive-scale-wave-wave44-export-gate');
  c = c.replaceAll('replay-scale-wave-wave42-integration-verification', 'replay-scale-wave-wave43-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww43iv', 'rsww44iv');
  c = c.replaceAll('wave43_integration_handoff', 'wave44_integration_handoff');
  c = c.replaceAll('wave43_export', 'wave44_export');
  c = c.replaceAll('wave37_integration_verification', 'wave38_integration_verification');
  c = c.replaceAll('Wave 37 integration', 'Wave 38 integration');
  c = c.replaceAll('Wave 38 export', 'Wave 39 export');
  c = c.replaceAll('rsww43iv_w37', 'rsww44iv_w38');
  c = c.replaceAll('Wave43IntegrationHandoff', 'Wave44IntegrationHandoff');
  c = c.replaceAll('Wave42IntegrationVerification', 'Wave43IntegrationVerification');
  c = c.replaceAll('Wave43ExportGate', 'Wave44ExportGate');
  c = c.replaceAll('verified_when_wave43_integration_stack_ready', 'verified_when_wave44_integration_stack_ready');
  c = c.replaceAll('wave42IntegrationVerification', 'wave43IntegrationVerification');
  c = c.replaceAll("'w42iv'", "'w43iv'");
  c = c.replaceAll("'eg43'", "'eg44'");
  c = c.replaceAll("'ih43'", "'ih44'");
  c = c.replaceAll('asww43_t43', 'asww44_t44');
  c = c.replaceAll('rsww43ih_t43', 'rsww44ih_t44');
  c = c.replaceAll('rsww43iv_t43', 'rsww44iv_t44');
  c = c.replaceAll("integrationBaselineSha: '641d7d16'", `integrationBaselineSha: '${WAVE44_SHA}'`);
  c = c.replaceAll('waveRound: 43', 'waveRound: 44');
  c = c.replaceAll('report.waveRound === 43', 'report.waveRound === 44');
  c = c.replaceAll('replayScaleWaveWave43IntegrationHandoff', 'replayScaleWaveWave44IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave43ExportGate', 'archiveScaleWaveWave44ExportGate');
  c = c.replaceAll('replayScaleWaveWave42IntegrationVerification', 'replayScaleWaveWave43IntegrationVerification');
  c = c.replaceAll('buildAgent24ReplayScaleWaveWave43IntegrationVerificationReport', 'buildAgent24ReplayScaleWaveWave44IntegrationVerificationReport');
  c = c.replaceAll('runAgent24ReplayScaleWaveWave43IntegrationVerificationSelfTests', 'runAgent24ReplayScaleWaveWave44IntegrationVerificationSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave44-integration-verification.ts'), c);
}

function writeWave45Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave44-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave44Export', 'Wave45Export')
    .replaceAll('wave44-export-gate', 'wave45-export-gate')
    .replaceAll('Wave43IntegrationVerification', 'Wave44IntegrationVerification')
    .replaceAll('replay-scale-wave-wave43-integration-verification', 'replay-scale-wave-wave44-integration-verification')
    .replaceAll('wave43_integration_not_verified', 'wave44_integration_not_verified')
    .replaceAll('asww44', 'asww45')
    .replaceAll('wave44_stack_ready', 'wave45_stack_ready')
    .replaceAll('wave43IntegrationVerification', 'wave44IntegrationVerification')
    .replaceAll("'rsww43iv_t44'", "'rsww44iv_t45'")
    .replaceAll("'ss_t44'", "'ss_t45'")
    .replaceAll("'ss_body_t44'", "'ss_body_t45'")
    .replaceAll("'sv_t44'", "'sv_t45'")
    .replaceAll("integrationBaselineSha: 'bca7e0a3'", `integrationBaselineSha: '${WAVE44_SHA}'`)
    .replaceAll('waveRound: 43', 'waveRound: 44')
    .replaceAll('turn: 43', 'turn: 44')
    .replaceAll('report.waveRound === 43', 'report.waveRound === 44')
    .replaceAll('replayScaleWaveWave43IntegrationVerification', 'replayScaleWaveWave44IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave44ExportGateReport', 'buildAgent24ArchiveScaleWaveWave45ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave44ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave45ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave45-export-gate.ts'), c);
}

function writeWave45Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave44-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave44IntegrationHandoff', 'Wave45IntegrationHandoff')
    .replaceAll('wave44-integration-handoff', 'wave45-integration-handoff')
    .replaceAll('archive-scale-wave-wave44-export-gate', 'archive-scale-wave-wave45-export-gate')
    .replaceAll('replay-scale-wave-wave43-integration-verification', 'replay-scale-wave-wave44-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w44_cp', 'scale_wave_w45_cp')
    .replaceAll('wave44_export', 'wave45_export')
    .replaceAll('wave39_integration_verified', 'wave40_integration_verified')
    .replaceAll('Wave 38 integration', 'Wave 39 integration')
    .replaceAll('Wave 39 export', 'Wave 40 export')
    .replaceAll('wave44_baseline', 'wave45_baseline')
    .replaceAll('wave43IntegrationVerification', 'wave44IntegrationVerification')
    .replaceAll("'rsww43iv_t44'", "'rsww44iv_t45'")
    .replaceAll("'eg44'", "'eg45'")
    .replaceAll('asww44_t43', 'asww45_t44')
    .replaceAll("integrationBaselineSha: '641d7d16'", `integrationBaselineSha: '${WAVE44_SHA}'`)
    .replaceAll('waveRound: 43', 'waveRound: 44')
    .replaceAll('report.waveRound === 43', 'report.waveRound === 44')
    .replaceAll('replay_scale_wave_wave44_integration_handoff', 'replay_scale_wave_wave45_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave44ExportGateReport', 'Agent24ArchiveScaleWaveWave45ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave43IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave44IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave44ExportGate', 'archiveScaleWaveWave45ExportGate')
    .replaceAll('replayScaleWaveWave43IntegrationVerification', 'replayScaleWaveWave44IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave44IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave45IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave44IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave45IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave45-integration-handoff.ts'), c);
}

writeWave44IV();
writeWave45Export();
writeWave45Handoff();
console.log('ok');
