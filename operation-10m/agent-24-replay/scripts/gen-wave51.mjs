import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE50_SHA = '8aaaf700';
const WAVE51_SHA = 'a32b2b15';

function writeWave50IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave49-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave49IntegrationVerification', 'Wave50IntegrationVerification');
  c = c.replaceAll('wave49-integration-verification', 'wave50-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave49-integration-handoff', 'replay-scale-wave-wave50-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave49-export-gate', 'archive-scale-wave-wave50-export-gate');
  c = c.replaceAll('replay-scale-wave-wave48-integration-verification', 'replay-scale-wave-wave49-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww49iv', 'rsww50iv');
  c = c.replaceAll('wave49_integration_handoff', 'wave50_integration_handoff');
  c = c.replaceAll('wave49_export', 'wave50_export');
  c = c.replaceAll('wave43_integration_verification', 'wave44_integration_verification');
  c = c.replaceAll('Wave 43 integration', 'Wave 44 integration');
  c = c.replaceAll('Wave 44 export', 'Wave 45 export');
  c = c.replaceAll('rsww49iv_w43', 'rsww50iv_w44');
  c = c.replaceAll('Wave49IntegrationHandoff', 'Wave50IntegrationHandoff');
  c = c.replaceAll('Wave48IntegrationVerification', 'Wave49IntegrationVerification');
  c = c.replaceAll('Wave49ExportGate', 'Wave50ExportGate');
  c = c.replaceAll('verified_when_wave49_integration_stack_ready', 'verified_when_wave50_integration_stack_ready');
  c = c.replaceAll('wave48IntegrationVerification', 'wave49IntegrationVerification');
  c = c.replaceAll("'w48iv'", "'w49iv'");
  c = c.replaceAll("'eg49'", "'eg50'");
  c = c.replaceAll("'ih49'", "'ih50'");
  c = c.replaceAll('asww49_t49', 'asww50_t50');
  c = c.replaceAll('rsww49ih_t49', 'rsww50ih_t50');
  c = c.replaceAll('rsww49iv_t49', 'rsww50iv_t50');
  c = c.replaceAll("integrationBaselineSha: '73e5e01e'", `integrationBaselineSha: '${WAVE50_SHA}'`);
  c = c.replaceAll('waveRound: 49', 'waveRound: 50');
  c = c.replaceAll('report.waveRound === 49', 'report.waveRound === 50');
  c = c.replaceAll('replayScaleWaveWave49IntegrationHandoff', 'replayScaleWaveWave50IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave49ExportGate', 'archiveScaleWaveWave50ExportGate');
  c = c.replaceAll('replayScaleWaveWave48IntegrationVerification', 'replayScaleWaveWave49IntegrationVerification');
  c = c.replaceAll(
    'buildAgent24ReplayScaleWaveWave49IntegrationVerificationReport',
    'buildAgent24ReplayScaleWaveWave50IntegrationVerificationReport',
  );
  c = c.replaceAll(
    'runAgent24ReplayScaleWaveWave49IntegrationVerificationSelfTests',
    'runAgent24ReplayScaleWaveWave50IntegrationVerificationSelfTests',
  );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave50-integration-verification.ts'), c);
}

function writeWave51Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave50-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave50Export', 'Wave51Export')
    .replaceAll('wave50-export-gate', 'wave51-export-gate')
    .replaceAll('Wave49IntegrationVerification', 'Wave50IntegrationVerification')
    .replaceAll('replay-scale-wave-wave49-integration-verification', 'replay-scale-wave-wave50-integration-verification')
    .replaceAll('wave49_integration_not_verified', 'wave50_integration_not_verified')
    .replaceAll('asww50', 'asww51')
    .replaceAll('wave50_stack_ready', 'wave51_stack_ready')
    .replaceAll('wave49IntegrationVerification', 'wave50IntegrationVerification')
    .replaceAll("'rsww49iv_t50'", "'rsww50iv_t51'")
    .replaceAll("'ss_t50'", "'ss_t51'")
    .replaceAll("'ss_body_t50'", "'ss_body_t51'")
    .replaceAll("'sv_t50'", "'sv_t51'")
    .replaceAll("integrationBaselineSha: '8aaaf700'", `integrationBaselineSha: '${WAVE50_SHA}'`)
    .replaceAll('waveRound: 49', 'waveRound: 50')
    .replaceAll('turn: 49', 'turn: 50')
    .replaceAll('report.waveRound === 49', 'report.waveRound === 50')
    .replaceAll('replayScaleWaveWave49IntegrationVerification', 'replayScaleWaveWave50IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave50ExportGateReport', 'buildAgent24ArchiveScaleWaveWave51ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave50ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave51ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave51-export-gate.ts'), c);
}

function writeWave51Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave50-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave50IntegrationHandoff', 'Wave51IntegrationHandoff')
    .replaceAll('wave50-integration-handoff', 'wave51-integration-handoff')
    .replaceAll('archive-scale-wave-wave50-export-gate', 'archive-scale-wave-wave51-export-gate')
    .replaceAll('replay-scale-wave-wave49-integration-verification', 'replay-scale-wave-wave50-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w50_cp', 'scale_wave_w51_cp')
    .replaceAll('wave50_export', 'wave51_export')
    .replaceAll('wave45_integration_verified', 'wave46_integration_verified')
    .replaceAll('Wave 44 integration', 'Wave 45 integration')
    .replaceAll('Wave 45 export', 'Wave 46 export')
    .replaceAll('wave50_baseline', 'wave51_baseline')
    .replaceAll('wave49IntegrationVerification', 'wave50IntegrationVerification')
    .replaceAll("'rsww49iv_t50'", "'rsww50iv_t51'")
    .replaceAll("'eg50'", "'eg51'")
    .replaceAll('asww50_t49', 'asww51_t50')
    .replaceAll("integrationBaselineSha: '8aaaf700'", `integrationBaselineSha: '${WAVE51_SHA}'`)
    .replaceAll('waveRound: 49', 'waveRound: 50')
    .replaceAll('report.waveRound === 49', 'report.waveRound === 50')
    .replaceAll('replay_scale_wave_wave50_integration_handoff', 'replay_scale_wave_wave51_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave50ExportGateReport', 'Agent24ArchiveScaleWaveWave51ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave49IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave50IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave50ExportGate', 'archiveScaleWaveWave51ExportGate')
    .replaceAll('replayScaleWaveWave49IntegrationVerification', 'replayScaleWaveWave50IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave50IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave51IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave50IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave51IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave51-integration-handoff.ts'), c);
}

writeWave50IV();
writeWave51Export();
writeWave51Handoff();
console.log('gen-wave51 ok');
