import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE49_SHA = '73e5e01e';
const WAVE50_SHA = '8aaaf700';

function writeWave49IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave48-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave48IntegrationVerification', 'Wave49IntegrationVerification');
  c = c.replaceAll('wave48-integration-verification', 'wave49-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave48-integration-handoff', 'replay-scale-wave-wave49-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave48-export-gate', 'archive-scale-wave-wave49-export-gate');
  c = c.replaceAll('replay-scale-wave-wave47-integration-verification', 'replay-scale-wave-wave48-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww48iv', 'rsww49iv');
  c = c.replaceAll('wave48_integration_handoff', 'wave49_integration_handoff');
  c = c.replaceAll('wave48_export', 'wave49_export');
  c = c.replaceAll('wave42_integration_verification', 'wave43_integration_verification');
  c = c.replaceAll('Wave 42 integration', 'Wave 43 integration');
  c = c.replaceAll('Wave 43 export', 'Wave 44 export');
  c = c.replaceAll('rsww48iv_w42', 'rsww49iv_w43');
  c = c.replaceAll('Wave48IntegrationHandoff', 'Wave49IntegrationHandoff');
  c = c.replaceAll('Wave47IntegrationVerification', 'Wave48IntegrationVerification');
  c = c.replaceAll('Wave48ExportGate', 'Wave49ExportGate');
  c = c.replaceAll('verified_when_wave48_integration_stack_ready', 'verified_when_wave49_integration_stack_ready');
  c = c.replaceAll('wave47IntegrationVerification', 'wave48IntegrationVerification');
  c = c.replaceAll("'w47iv'", "'w48iv'");
  c = c.replaceAll("'eg48'", "'eg49'");
  c = c.replaceAll("'ih48'", "'ih49'");
  c = c.replaceAll('asww48_t48', 'asww49_t49');
  c = c.replaceAll('rsww48ih_t48', 'rsww49ih_t49');
  c = c.replaceAll('rsww48iv_t48', 'rsww49iv_t49');
  c = c.replaceAll("integrationBaselineSha: '4404bf0f'", `integrationBaselineSha: '${WAVE49_SHA}'`);
  c = c.replaceAll('waveRound: 48', 'waveRound: 49');
  c = c.replaceAll('report.waveRound === 48', 'report.waveRound === 49');
  c = c.replaceAll('replayScaleWaveWave48IntegrationHandoff', 'replayScaleWaveWave49IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave48ExportGate', 'archiveScaleWaveWave49ExportGate');
  c = c.replaceAll('replayScaleWaveWave47IntegrationVerification', 'replayScaleWaveWave48IntegrationVerification');
  c = c.replaceAll(
    'buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport',
    'buildAgent24ReplayScaleWaveWave49IntegrationVerificationReport',
  );
  c = c.replaceAll(
    'runAgent24ReplayScaleWaveWave48IntegrationVerificationSelfTests',
    'runAgent24ReplayScaleWaveWave49IntegrationVerificationSelfTests',
  );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave49-integration-verification.ts'), c);
}

function writeWave50Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave49-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave49Export', 'Wave50Export')
    .replaceAll('wave49-export-gate', 'wave50-export-gate')
    .replaceAll('Wave48IntegrationVerification', 'Wave49IntegrationVerification')
    .replaceAll('replay-scale-wave-wave48-integration-verification', 'replay-scale-wave-wave49-integration-verification')
    .replaceAll('wave48_integration_not_verified', 'wave49_integration_not_verified')
    .replaceAll('asww49', 'asww50')
    .replaceAll('wave49_stack_ready', 'wave50_stack_ready')
    .replaceAll('wave48IntegrationVerification', 'wave49IntegrationVerification')
    .replaceAll("'rsww48iv_t49'", "'rsww49iv_t50'")
    .replaceAll("'ss_t49'", "'ss_t50'")
    .replaceAll("'ss_body_t49'", "'ss_body_t50'")
    .replaceAll("'sv_t49'", "'sv_t50'")
    .replaceAll("integrationBaselineSha: '73e5e01e'", `integrationBaselineSha: '${WAVE49_SHA}'`)
    .replaceAll('waveRound: 48', 'waveRound: 49')
    .replaceAll('turn: 48', 'turn: 49')
    .replaceAll('report.waveRound === 48', 'report.waveRound === 49')
    .replaceAll('replayScaleWaveWave48IntegrationVerification', 'replayScaleWaveWave49IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave49ExportGateReport', 'buildAgent24ArchiveScaleWaveWave50ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave49ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave50ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave50-export-gate.ts'), c);
}

function writeWave50Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave49-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave49IntegrationHandoff', 'Wave50IntegrationHandoff')
    .replaceAll('wave49-integration-handoff', 'wave50-integration-handoff')
    .replaceAll('archive-scale-wave-wave49-export-gate', 'archive-scale-wave-wave50-export-gate')
    .replaceAll('replay-scale-wave-wave48-integration-verification', 'replay-scale-wave-wave49-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w49_cp', 'scale_wave_w50_cp')
    .replaceAll('wave49_export', 'wave50_export')
    .replaceAll('wave44_integration_verified', 'wave45_integration_verified')
    .replaceAll('Wave 43 integration', 'Wave 44 integration')
    .replaceAll('Wave 44 export', 'Wave 45 export')
    .replaceAll('wave49_baseline', 'wave50_baseline')
    .replaceAll('wave48IntegrationVerification', 'wave49IntegrationVerification')
    .replaceAll("'rsww48iv_t49'", "'rsww49iv_t50'")
    .replaceAll("'eg49'", "'eg50'")
    .replaceAll('asww49_t48', 'asww50_t49')
    .replaceAll("integrationBaselineSha: '73e5e01e'", `integrationBaselineSha: '${WAVE50_SHA}'`)
    .replaceAll('waveRound: 48', 'waveRound: 49')
    .replaceAll('report.waveRound === 48', 'report.waveRound === 49')
    .replaceAll('replay_scale_wave_wave49_integration_handoff', 'replay_scale_wave_wave50_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave49ExportGateReport', 'Agent24ArchiveScaleWaveWave50ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave48IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave49IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave49ExportGate', 'archiveScaleWaveWave50ExportGate')
    .replaceAll('replayScaleWaveWave48IntegrationVerification', 'replayScaleWaveWave49IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave50IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave49IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave50IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave50-integration-handoff.ts'), c);
}

writeWave49IV();
writeWave50Export();
writeWave50Handoff();
console.log('gen-wave50 ok');
