import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const WAVE51_SHA = 'a32b2b15';
const WAVE52_SHA = 'ba97bdce';

function writeWave51IV() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave50-integration-verification.ts'), 'utf8');
  c = c.replaceAll('Wave50IntegrationVerification', 'Wave51IntegrationVerification');
  c = c.replaceAll('wave50-integration-verification', 'wave51-integration-verification');
  c = c.replaceAll('replay-scale-wave-wave50-integration-handoff', 'replay-scale-wave-wave51-integration-handoff');
  c = c.replaceAll('archive-scale-wave-wave50-export-gate', 'archive-scale-wave-wave51-export-gate');
  c = c.replaceAll('replay-scale-wave-wave49-integration-verification', 'replay-scale-wave-wave50-integration-verification');
  c = c.replaceAll('O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA');
  c = c.replaceAll('rsww50iv', 'rsww51iv');
  c = c.replaceAll('wave50_integration_handoff', 'wave51_integration_handoff');
  c = c.replaceAll('wave50_export', 'wave51_export');
  c = c.replaceAll('wave44_integration_verification', 'wave45_integration_verification');
  c = c.replaceAll('Wave 44 integration', 'Wave 45 integration');
  c = c.replaceAll('Wave 45 export', 'Wave 46 export');
  c = c.replaceAll('rsww50iv_w44', 'rsww51iv_w45');
  c = c.replaceAll('Wave50IntegrationHandoff', 'Wave51IntegrationHandoff');
  c = c.replaceAll('Wave49IntegrationVerification', 'Wave50IntegrationVerification');
  c = c.replaceAll('Wave50ExportGate', 'Wave51ExportGate');
  c = c.replaceAll('verified_when_wave50_integration_stack_ready', 'verified_when_wave51_integration_stack_ready');
  c = c.replaceAll('wave49IntegrationVerification', 'wave50IntegrationVerification');
  c = c.replaceAll("'w49iv'", "'w50iv'");
  c = c.replaceAll("'eg50'", "'eg51'");
  c = c.replaceAll("'ih50'", "'ih51'");
  c = c.replaceAll('asww50_t50', 'asww51_t51');
  c = c.replaceAll('rsww50ih_t50', 'rsww51ih_t51');
  c = c.replaceAll('rsww50iv_t50', 'rsww51iv_t51');
  c = c.replaceAll("integrationBaselineSha: '8aaaf700'", `integrationBaselineSha: '${WAVE51_SHA}'`);
  c = c.replaceAll('waveRound: 50', 'waveRound: 51');
  c = c.replaceAll('report.waveRound === 50', 'report.waveRound === 51');
  c = c.replaceAll('replayScaleWaveWave50IntegrationHandoff', 'replayScaleWaveWave51IntegrationHandoff');
  c = c.replaceAll('archiveScaleWaveWave50ExportGate', 'archiveScaleWaveWave51ExportGate');
  c = c.replaceAll('replayScaleWaveWave49IntegrationVerification', 'replayScaleWaveWave50IntegrationVerification');
  c = c.replaceAll(
    'buildAgent24ReplayScaleWaveWave50IntegrationVerificationReport',
    'buildAgent24ReplayScaleWaveWave51IntegrationVerificationReport',
  );
  c = c.replaceAll(
    'runAgent24ReplayScaleWaveWave50IntegrationVerificationSelfTests',
    'runAgent24ReplayScaleWaveWave51IntegrationVerificationSelfTests',
  );
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave51-integration-verification.ts'), c);
}

function writeWave52Export() {
  let c = fs.readFileSync(path.join(src, 'archive-scale-wave-wave51-export-gate.ts'), 'utf8');
  c = c
    .replaceAll('Wave51Export', 'Wave52Export')
    .replaceAll('wave51-export-gate', 'wave52-export-gate')
    .replaceAll('Wave50IntegrationVerification', 'Wave51IntegrationVerification')
    .replaceAll('replay-scale-wave-wave50-integration-verification', 'replay-scale-wave-wave51-integration-verification')
    .replaceAll('wave50_integration_not_verified', 'wave51_integration_not_verified')
    .replaceAll('asww51', 'asww52')
    .replaceAll('wave51_stack_ready', 'wave52_stack_ready')
    .replaceAll('wave50IntegrationVerification', 'wave51IntegrationVerification')
    .replaceAll("'rsww50iv_t51'", "'rsww51iv_t52'")
    .replaceAll("'ss_t51'", "'ss_t52'")
    .replaceAll("'ss_body_t51'", "'ss_body_t52'")
    .replaceAll("'sv_t51'", "'sv_t52'")
    .replaceAll("integrationBaselineSha: 'a32b2b15'", `integrationBaselineSha: '${WAVE51_SHA}'`)
    .replaceAll('waveRound: 50', 'waveRound: 51')
    .replaceAll('turn: 50', 'turn: 51')
    .replaceAll('report.waveRound === 50', 'report.waveRound === 51')
    .replaceAll('replayScaleWaveWave50IntegrationVerification', 'replayScaleWaveWave51IntegrationVerification')
    .replaceAll('buildAgent24ArchiveScaleWaveWave51ExportGateReport', 'buildAgent24ArchiveScaleWaveWave52ExportGateReport')
    .replaceAll('runAgent24ArchiveScaleWaveWave51ExportGateSelfTests', 'runAgent24ArchiveScaleWaveWave52ExportGateSelfTests');
  fs.writeFileSync(path.join(src, 'archive-scale-wave-wave52-export-gate.ts'), c);
}

function writeWave52Handoff() {
  let c = fs.readFileSync(path.join(src, 'replay-scale-wave-wave51-integration-handoff.ts'), 'utf8');
  c = c
    .replaceAll('Wave51IntegrationHandoff', 'Wave52IntegrationHandoff')
    .replaceAll('wave51-integration-handoff', 'wave52-integration-handoff')
    .replaceAll('archive-scale-wave-wave51-export-gate', 'archive-scale-wave-wave52-export-gate')
    .replaceAll('replay-scale-wave-wave50-integration-verification', 'replay-scale-wave-wave51-integration-verification')
    .replaceAll('O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA', 'O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA')
    .replaceAll('scale_wave_w51_cp', 'scale_wave_w52_cp')
    .replaceAll('wave51_export', 'wave52_export')
    .replaceAll('wave46_integration_verified', 'wave47_integration_verified')
    .replaceAll('Wave 45 integration', 'Wave 46 integration')
    .replaceAll('Wave 46 export', 'Wave 47 export')
    .replaceAll('wave51_baseline', 'wave52_baseline')
    .replaceAll('wave50IntegrationVerification', 'wave51IntegrationVerification')
    .replaceAll("'rsww50iv_t51'", "'rsww51iv_t52'")
    .replaceAll("'eg51'", "'eg52'")
    .replaceAll('asww51_t50', 'asww52_t51')
    .replaceAll("integrationBaselineSha: 'a32b2b15'", `integrationBaselineSha: '${WAVE52_SHA}'`)
    .replaceAll('waveRound: 50', 'waveRound: 51')
    .replaceAll('report.waveRound === 50', 'report.waveRound === 51')
    .replaceAll('replay_scale_wave_wave51_integration_handoff', 'replay_scale_wave_wave52_integration_handoff')
    .replaceAll('Agent24ArchiveScaleWaveWave51ExportGateReport', 'Agent24ArchiveScaleWaveWave52ExportGateReport')
    .replaceAll('Agent24ReplayScaleWaveWave50IntegrationVerificationReport', 'Agent24ReplayScaleWaveWave51IntegrationVerificationReport')
    .replaceAll('archiveScaleWaveWave51ExportGate', 'archiveScaleWaveWave52ExportGate')
    .replaceAll('replayScaleWaveWave50IntegrationVerification', 'replayScaleWaveWave51IntegrationVerification')
    .replaceAll('buildAgent24ReplayScaleWaveWave51IntegrationHandoffReport', 'buildAgent24ReplayScaleWaveWave52IntegrationHandoffReport')
    .replaceAll('runAgent24ReplayScaleWaveWave51IntegrationHandoffSelfTests', 'runAgent24ReplayScaleWaveWave52IntegrationHandoffSelfTests');
  fs.writeFileSync(path.join(src, 'replay-scale-wave-wave52-integration-handoff.ts'), c);
}

writeWave51IV();
writeWave52Export();
writeWave52Handoff();
console.log('gen-wave52 ok');
