import fs from 'fs';
import path from 'path';

const src = '/workspace/operation-10m/agent-24-replay/src';
const WAVE42_SHA = '431df5de';

function writeWave42IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave41-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave41IntegrationVerification', 'Wave42IntegrationVerification');
  c = c.replaceAll('wave41-integration-verification', 'wave42-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave41-integration-handoff', 'replay-scale-wave-wave42-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave41-export-gate', 'archive-scale-wave-wave42-export-gate');
  c = c.replaceAll('replay-scale-wave-wave40-integration-verification', 'replay-scale-wave-wave41-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww41iv', 'rsww42iv');
  c = c.replaceAll('wave41_integration_handoff', 'wave42_integration_handoff');
  c = c.replaceAll('wave41_export', 'wave42_export');
  c = c.replaceAll('wave35_integration_verification', 'wave36_integration_verification');
  c = c.replaceAll('Wave 35 integration', 'Wave 36 integration');
  c = c.replaceAll('Wave 36 export', 'Wave 37 export');
  c = c.replaceAll('rsww41iv_w35', 'rsww42iv_w36');
  c = c.replaceAll('Wave41IntegrationHandoff', 'Wave42IntegrationHandoff');
  c = c.replaceAll('Wave40IntegrationVerification', 'Wave41IntegrationVerification');
  c = c.replaceAll('Wave41ExportGate', 'Wave42ExportGate');
  c = c.replaceAll('verified_when_wave41_integration_stack_ready', 'verified_when_wave42_integration_stack_ready');
  c = c.replaceAll('wave40IntegrationVerification', 'wave41IntegrationVerification');
  c = c.replaceAll("'w40iv'", "'w41iv'");
  c = c.replaceAll("'eg41'", "'eg42'");
  c = c.replaceAll("'ih41'", "'ih42'");
  c = c.replaceAll('asww41_t41', 'asww42_t42');
  c = c.replaceAll('rsww41ih_t41', 'rsww42ih_t42');
  c = c.replaceAll('rsww41iv_t41', 'rsww42iv_t42');
  c = c.replaceAll("integrationBaselineSha: '875d6f3e'", `integrationBaselineSha: '${WAVE42_SHA}'`);
  c = c.replaceAll('waveRound: 41', 'waveRound: 42');
  c = c.replaceAll('report.waveRound === 41', 'report.waveRound === 42');
  c = c.replaceAll('replayScaleWaveWave41IntegrationHandoff', 'replayScaleWaveWave42IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave41ExportGate', 'archiveScaleWaveWave42ExportGate');
  c = c.replaceAll('replayScaleWaveWave40IntegrationVerification', 'replayScaleWaveWave41IntegrationVerification');
  c = c.replaceAll('buildAgent24ReplayScaleWaveWave41IntegrationVerificationReport', 'buildAgent24ReplayScaleWaveWave42IntegrationVerificationReport');
  c = c.replaceAll('runAgent24ReplayScaleWaveWave41IntegrationVerificationSelfTests', 'runAgent24ReplayScaleWaveWave42IntegrationVerificationSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave42-integration-verification.ts'), c);
}

function writeWave43Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave42-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave42Export', 'Wave43Export')
    .replaceAll('wave42-export-gate', 'wave43-export-gate')
    .replaceAll('Wave41IntegrationVerification', 'Wave42IntegrationVerification')
    .replaceAll('replay-scale-wave-wave41-integration-verification', 'replay-scale-wave-wave42-integration-verification')
    .replaceAll('wave41_integration_not_verified', 'wave42_integration_not_verified')
    .replaceAll('asww42', 'asww43')
    .replaceAll('wave42_stack_ready', 'wave43_stack_ready')
    .replaceAll('wave41IntegrationVerification', 'wave42IntegrationVerification')
    .replaceAll("'rsww41iv_t42'", "'rsww42iv_t43'")
    .replaceAll("'ss_t42'", "'ss_t43'")
    .replaceAll("'ss_body_t42'", "'ss_body_t43'")
    .replaceAll("'sv_t42'", "'sv_t43'")
    .replaceAll("integrationBaselineSha: '431df5de'", `integrationBaselineSha: '${WAVE42_SHA}'`)
    .replaceAll('waveRound: 41', 'waveRound: 42')
    .replaceAll('turn: 41', 'turn: 42')
    .replaceAll('report.waveRound === 41', 'report.waveRound === 42')
    .replaceAll('replayScaleWaveWave41IntegrationVerification', 'replayScaleWaveWave42IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave42ExportGateReport', 'buildAgent24ArchiveScaleWaveWave43ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave42ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave43ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave43-export-gate.ts'), c);
}

function writeWave43Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave42-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave42IntegrationHandoff', 'Wave43IntegrationHandoff')
    .replaceAll('wave42-integration-handoff', 'wave43-integration-handoff')
    .replaceAll('archive-scale-wave-wave42-export-gate', 'archive-scale-wave-wave43-export-gate')
    .replaceAll('replay-scale-wave-wave41-integration-verification', 'replay-scale-wave-wave42-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w42_cp', 'scale_wave_w43_cp')
    .replaceAll('wave42_export', 'wave43_export')
    .replaceAll('wave37_integration_verified', 'wave38_integration_verified')
    .replaceAll('Wave 36 integration', 'Wave 37 integration')
    .replaceAll('Wave 37 export', 'Wave 38 export')
    .replaceAll('wave42_baseline', 'wave43_baseline')
    .replaceAll('wave41IntegrationVerification', 'wave42IntegrationVerification')
    .replaceAll("'rsww41iv_t42'", "'rsww42iv_t43'")
    .replaceAll("'eg42'", "'eg43'")
    .replaceAll('asww42_t41', 'asww43_t42')
    .replaceAll("integrationBaselineSha: '875d6f3e'", `integrationBaselineSha: '${WAVE42_SHA}'`)
    .replaceAll('waveRound: 41', 'waveRound: 42')
    .replaceAll('report.waveRound === 41', 'report.waveRound === 42')
    .replaceAll('replay_scale_wave_wave42_integration_handoff', 'replay_scale_wave_wave43_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave42ExportGateReport', 'Agent24ArchiveScaleWaveWave43ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave41IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave42IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave42ExportGate', 'archiveScaleWaveWave43ExportGate')
    .replaceAll('replayScaleWaveWave41IntegrationVerification', 'replayScaleWaveWave42IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave42IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave43IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave42IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave43IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave43-integration-handoff.ts'), c);
}

writeWave42IV();
writeWave43Export();
writeWave43Handoff();
console.log('ok');
