import fs from 'fs';
import path from 'path';

const src = '/workspace/operation-10m/agent-24-replay/src';
const WAVE43_SHA = '641d7d16';

function writeWave43IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave42-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave42IntegrationVerification', 'Wave43IntegrationVerification');
  c = c.replaceAll('wave42-integration-verification', 'wave43-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave42-integration-handoff', 'replay-scale-wave-wave43-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave42-export-gate', 'archive-scale-wave-wave43-export-gate');
  c = c.replaceAll('replay-scale-wave-wave41-integration-verification', 'replay-scale-wave-wave42-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww42iv', 'rsww43iv');
  c = c.replaceAll('wave42_integration_handoff', 'wave43_integration_handoff');
  c = c.replaceAll('wave42_export', 'wave43_export');
  c = c.replaceAll('wave36_integration_verification', 'wave37_integration_verification');
  c = c.replaceAll('Wave 36 integration', 'Wave 37 integration');
  c = c.replaceAll('Wave 37 export', 'Wave 38 export');
  c = c.replaceAll('rsww42iv_w36', 'rsww43iv_w37');
  c = c.replaceAll('Wave42IntegrationHandoff', 'Wave43IntegrationHandoff');
  c = c.replaceAll('Wave41IntegrationVerification', 'Wave42IntegrationVerification');
  c = c.replaceAll('Wave42ExportGate', 'Wave43ExportGate');
  c = c.replaceAll('verified_when_wave42_integration_stack_ready', 'verified_when_wave43_integration_stack_ready');
  c = c.replaceAll('wave41IntegrationVerification', 'wave42IntegrationVerification');
  c = c.replaceAll("'w41iv'", "'w42iv'");
  c = c.replaceAll("'eg42'", "'eg43'");
  c = c.replaceAll("'ih42'", "'ih43'");
  c = c.replaceAll('asww42_t42', 'asww43_t43');
  c = c.replaceAll('rsww42ih_t42', 'rsww43ih_t43');
  c = c.replaceAll('rsww42iv_t42', 'rsww43iv_t43');
  c = c.replaceAll("integrationBaselineSha: '431df5de'", `integrationBaselineSha: '${WAVE43_SHA}'`);
  c = c.replaceAll('waveRound: 42', 'waveRound: 43');
  c = c.replaceAll('report.waveRound === 42', 'report.waveRound === 43');
  c = c.replaceAll('replayScaleWaveWave42IntegrationHandoff', 'replayScaleWaveWave43IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave42ExportGate', 'archiveScaleWaveWave43ExportGate');
  c = c.replaceAll('replayScaleWaveWave41IntegrationVerification', 'replayScaleWaveWave42IntegrationVerification');
  c = c.replaceAll('buildAgent24ReplayScaleWaveWave42IntegrationVerificationReport', 'buildAgent24ReplayScaleWaveWave43IntegrationVerificationReport');
  c = c.replaceAll('runAgent24ReplayScaleWaveWave42IntegrationVerificationSelfTests', 'runAgent24ReplayScaleWaveWave43IntegrationVerificationSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave43-integration-verification.ts'), c);
}

function writeWave44Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave43-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave43Export', 'Wave44Export')
    .replaceAll('wave43-export-gate', 'wave44-export-gate')
    .replaceAll('Wave42IntegrationVerification', 'Wave43IntegrationVerification')
    .replaceAll('replay-scale-wave-wave42-integration-verification', 'replay-scale-wave-wave43-integration-verification')
    .replaceAll('wave42_integration_not_verified', 'wave43_integration_not_verified')
    .replaceAll('asww43', 'asww44')
    .replaceAll('wave43_stack_ready', 'wave44_stack_ready')
    .replaceAll('wave42IntegrationVerification', 'wave43IntegrationVerification')
    .replaceAll("'rsww42iv_t43'", "'rsww43iv_t44'")
    .replaceAll("'ss_t43'", "'ss_t44'")
    .replaceAll("'ss_body_t43'", "'ss_body_t44'")
    .replaceAll("'sv_t43'", "'sv_t44'")
    .replaceAll("integrationBaselineSha: '641d7d16'", `integrationBaselineSha: '${WAVE43_SHA}'`)
    .replaceAll('waveRound: 42', 'waveRound: 43')
    .replaceAll('turn: 42', 'turn: 43')
    .replaceAll('report.waveRound === 42', 'report.waveRound === 43')
    .replaceAll('replayScaleWaveWave42IntegrationVerification', 'replayScaleWaveWave43IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave43ExportGateReport', 'buildAgent24ArchiveScaleWaveWave44ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave43ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave44ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave44-export-gate.ts'), c);
}

function writeWave44Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave43-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave43IntegrationHandoff', 'Wave44IntegrationHandoff')
    .replaceAll('wave43-integration-handoff', 'wave44-integration-handoff')
    .replaceAll('archive-scale-wave-wave43-export-gate', 'archive-scale-wave-wave44-export-gate')
    .replaceAll('replay-scale-wave-wave42-integration-verification', 'replay-scale-wave-wave43-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w43_cp', 'scale_wave_w44_cp')
    .replaceAll('wave43_export', 'wave44_export')
    .replaceAll('wave38_integration_verified', 'wave39_integration_verified')
    .replaceAll('Wave 37 integration', 'Wave 38 integration')
    .replaceAll('Wave 38 export', 'Wave 39 export')
    .replaceAll('wave43_baseline', 'wave44_baseline')
    .replaceAll('wave42IntegrationVerification', 'wave43IntegrationVerification')
    .replaceAll("'rsww42iv_t43'", "'rsww43iv_t44'")
    .replaceAll("'eg43'", "'eg44'")
    .replaceAll('asww43_t42', 'asww44_t43')
    .replaceAll("integrationBaselineSha: '431df5de'", `integrationBaselineSha: '${WAVE43_SHA}'`)
    .replaceAll('waveRound: 42', 'waveRound: 43')
    .replaceAll('report.waveRound === 42', 'report.waveRound === 43')
    .replaceAll('replay_scale_wave_wave43_integration_handoff', 'replay_scale_wave_wave44_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave43ExportGateReport', 'Agent24ArchiveScaleWaveWave44ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave42IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave43IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave43ExportGate', 'archiveScaleWaveWave44ExportGate')
    .replaceAll('replayScaleWaveWave42IntegrationVerification', 'replayScaleWaveWave43IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave43IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave44IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave43IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave44IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave44-integration-handoff.ts'), c);
}

writeWave43IV();
writeWave44Export();
writeWave44Handoff();
console.log('ok');
