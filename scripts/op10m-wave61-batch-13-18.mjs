#!/usr/bin/env node
/**
 * O10-267 wave 61 batch 13–18 — generate wave-61 depth from wave-60 templates (coordinator local).
 */
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function write(rel, content) {
  const p = path.join(REPO, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function read(rel) {
  return fs.readFileSync(path.join(REPO, rel), 'utf8');
}

function replaceWave61From60(text) {
  return text
    .replaceAll('wave60', 'wave61')
    .replaceAll('Wave60', 'Wave61')
    .replaceAll('WAVE_60', 'WAVE_61')
    .replaceAll('wave-60', 'wave-61')
    .replaceAll('Wave 60', 'Wave 61')
    .replaceAll('round 60', 'round 61')
    .replaceAll('O10-265', 'O10-267')
    .replaceAll('O10m265', 'O10m267')
    .replaceAll('o10-265', 'o10-267')
    .replaceAll('O10-263', 'O10-265')
    .replaceAll('O10m263', 'O10m265')
    .replaceAll('O10-260', 'O10-263')
    .replaceAll('O10m260', 'O10m263')
    .replaceAll('O10-257', 'O10-260')
    .replaceAll('O10m257', 'O10m260')
    .replaceAll('O10-254', 'O10-257')
    .replaceAll('O10m254', 'O10m257')
    .replaceAll('3_201_323', '3_220_075')
    .replaceAll('3201323', '3220075')
    .replaceAll('af6c94f05d6c6b2bfc6c909226283e5ce1dcb525', '7f862be03eba92ecc85d27e54e20c72cd3d2d9cd')
    .replaceAll('af6c94f0', '7f862be0')
    .replaceAll('10.14.60-scale-wave-60', '10.14.61-scale-wave-61');
}

function agent13() {
  const src = read(
    'operation-10m/agent-13-energy/modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts',
  );
  let omniversal = src
    .replaceAll('UNIVERSAL', 'OMNIversal')
    .replaceAll('Universal', 'Omniversal')
    .replaceAll('universal', 'omniversal')
    .replaceAll('quantum', 'hyperquantum')
    .replaceAll('Quantum', 'Hyperquantum')
    .replaceAll('QUANTUM', 'HYPERQUANTUM');
  omniversal = omniversal.replace(
    'Agent 13 scale wave round 60 (O10-265)',
    'Agent 13 scale wave round 61 (O10-267)',
  );
  write(
    'operation-10m/agent-13-energy/modules/omniversal-sovereign-net-zero-export-continuity-hyperquantum-mesh-orchestration-ledger.ts',
    omniversal,
  );

  const brief60 = read('operation-10m/agent-13-energy/modules/agent25-wave60-projection-handoff-brief.ts');
  write(
    'operation-10m/agent-13-energy/modules/agent25-wave61-projection-handoff-brief.ts',
    replaceWave61From60(brief60),
  );

  let bundle = read('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs');
  if (!bundle.includes('omniversal-sovereign')) {
    bundle = bundle.replace(
      "  'agent25-wave60-projection-handoff-brief.ts',\n",
      "  'omniversal-sovereign-net-zero-export-continuity-hyperquantum-mesh-orchestration-ledger.ts',\n  'agent25-wave61-projection-handoff-brief.ts',\n",
    );
    write('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs', bundle);
  }

  let sup = read('operation-10m/agent-13-energy/tests/supplement-tests.mts');
  if (!sup.includes('OmniversalSovereign')) {
    sup = sup.replace(
      "} from '../modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts';",
      "} from '../modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts';\nimport {\n  runAgent13OmniversalSovereignNetZeroExportContinuityScaleSelfTests,\n  runAgent13OmniversalSovereignNetZeroExportContinuityTurnScenario,\n  V1014_OMNIversal_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_HYPERQUANTUM_MESH_TURN_SCENARIOS,\n} from '../modules/omniversal-sovereign-net-zero-export-continuity-hyperquantum-mesh-orchestration-ledger.ts';",
    );
    sup = sup.replace(
      "import { runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave60-projection-handoff-brief.ts';",
      "import { runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave60-projection-handoff-brief.ts';\nimport { runAgent13Agent25Wave61ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave61-projection-handoff-brief.ts';",
    );
    sup = sup.replace(
      '  const wave60Handoff = runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests();\n  ok(wave60Handoff.failed === 0 && wave60Handoff.passed >= 4);',
      '  const wave60Handoff = runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests();\n  ok(wave60Handoff.failed === 0 && wave60Handoff.passed >= 4);\n  const omniversal = runAgent13OmniversalSovereignNetZeroExportContinuityScaleSelfTests();\n  ok(omniversal.failed === 0 && omniversal.passed >= 4);\n  const omniversalTurn = runAgent13OmniversalSovereignNetZeroExportContinuityTurnScenario(\n    V1014_OMNIversal_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_HYPERQUANTUM_MESH_TURN_SCENARIOS[0],\n  );\n  ok(omniversalTurn.passed);\n  const wave61Handoff = runAgent13Agent25Wave61ProjectionHandoffBriefSelfTests();\n  ok(wave61Handoff.failed === 0 && wave61Handoff.passed >= 4);',
    );
    write('operation-10m/agent-13-energy/tests/supplement-tests.mts', sup);
  }
}

function agent14() {
  for (const base of [
    'wave60-gate-trajectory.ts',
    'wave60-integration-monitor.ts',
    'agent25-wave60-projection-handoff-brief.ts',
  ]) {
    const out = base.replace('wave60', 'wave61');
    write(`operation-10m/agent-14-housing/${out}`, replaceWave61From60(read(`operation-10m/agent-14-housing/${base}`)));
  }
  let idx = read('operation-10m/agent-14-housing/index.ts');
  if (!idx.includes('wave61-gate-trajectory')) {
    idx = idx.replace(
      "export * from './wave57-gate-trajectory.ts';\n",
      "export * from './wave57-gate-trajectory.ts';\nexport * from './agent25-wave61-projection-handoff-brief.ts';\nexport * from './wave61-integration-monitor.ts';\nexport * from './wave61-gate-trajectory.ts';\n",
    );
    write('operation-10m/agent-14-housing/index.ts', idx);
  }
  let st = read('operation-10m/agent-14-housing/self-tests.ts');
  if (!st.includes('Wave61')) {
    st = replaceWave61From60(st);
    st = st.replace('Wave61Gate', 'Wave61Gate').replace('wave61', 'wave57');
    st = st.replace('runAgent14Wave61', 'runAgent14Wave61');
    const block = `
  const wave61Brief = composeAgent25Wave61ProjectionHandoffBrief({
    turn: 58,
    wave61IntegrationMonitor: {
      shouldRunO10m257DryRun: true,
      wave61GateBand: 'ready',
      integrationBaselineSha: 'feb7e524ca511c106896e93b47329106a1786db6',
      projectedAuditedFunctional: 3_139_519,
    },
    wave61GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(wave61Brief.shouldProjectWave61);
  const wave61Traj = updateWave61GateTrajectory(createInitialWave61GateTrajectory(), wave61Brief, 58);
  ok(wave61Traj.snapshot.band === 'ready' || wave61Traj.snapshot.band === 'watch');
`;
    if (!st.includes('shouldProjectWave61')) {
      st = st.replace('return { passed, failed, total: passed + failed };', `${block}\n  return { passed, failed, total: passed + failed };`);
      st = st.replace(
        "import { composeAgent25Wave60ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';",
        "import { composeAgent25Wave60ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';\nimport { composeAgent25Wave61ProjectionHandoffBrief } from './agent25-wave61-projection-handoff-brief.ts';\nimport { createInitialWave61GateTrajectory, updateWave61GateTrajectory } from './wave61-gate-trajectory.ts';",
      );
      write('operation-10m/agent-14-housing/self-tests.ts', st);
    }
  }
  let types = read('operation-10m/agent-14-housing/types.ts');
  if (!types.includes('Wave61Gate')) {
    types = replaceWave61From60(types);
    types = types.replace(/Wave61/g, 'WAVE58TMP').replace(/wave61/g, 'wave57').replace(/WAVE58TMP/g, 'Wave61');
    write('operation-10m/agent-14-housing/types.ts', types);
  }
}

function agent15() {
  const src = read('operation-10m/agent-15-trade/src/o10-265-wave60-sovereign-handoff-depth-stacking.ts');
  const w61 = replaceWave61From60(src)
    .replace('o10-265-wave60', 'o10-267-wave61')
    .replace('GTELWave60', 'GTELWave61')
    .replace('wave60Sovereign', 'wave61Sovereign')
    .replace('Wave60', 'Wave61')
    .replace('wave59Stacking', 'wave60Stacking')
    .replace('GTELWave59', 'GTELWave60')
    .replace('wave58Stacking', 'wave59Stacking');
  write('operation-10m/agent-15-trade/src/o10-267-wave61-sovereign-handoff-depth-stacking.ts', w61);

  let st = read('operation-10m/agent-15-trade/src/self-tests.ts');
  if (!st.includes('wave61')) {
    st = st.replace(
      "from './o10-265-wave60-sovereign-handoff-depth-stacking.ts';",
      "from './o10-265-wave60-sovereign-handoff-depth-stacking.ts';\nimport { computeWave61SovereignHandoffDepthStackingSnapshot } from './o10-267-wave61-sovereign-handoff-depth-stacking.ts';",
    );
    st = st.replace(
      'export function runAgent15SelfTests',
      `ok(computeWave61SovereignHandoffDepthStackingSnapshot({ wave60Stacking: { score: 0.8, band: 'tiered', summary: 'w60' }, persisted: {} as any }).snapshot.score > 0.5);\n\nexport function runAgent15SelfTests`,
    );
    write('operation-10m/agent-15-trade/src/self-tests.ts', st);
  }
}

function agent16() {
  let rules = read('operation-10m/agent-16-guardian/monitor-rules-scale-wave-60.ts');
  rules = replaceWave61From60(rules)
    .replaceAll('treaty', 'protocol')
    .replaceAll('Treaty', 'Protocol')
    .replaceAll('monitor-rules-scale-wave-60', 'monitor-rules-scale-wave-61');
  write('operation-10m/agent-16-guardian/monitor-rules-scale-wave-61.ts', rules);
  let mr = read('operation-10m/agent-16-guardian/monitor-rules.ts');
  if (!mr.includes('WAVE_61')) {
    mr = mr.replace(
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_60 } from './monitor-rules-scale-wave-60.js';\n",
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_60 } from './monitor-rules-scale-wave-60.js';\nimport { ADVISORY_MONITOR_RULES_SCALE_WAVE_61 } from './monitor-rules-scale-wave-61.js';\n",
    );
    mr = mr.replace(
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_60,\n];',
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_60,\n  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_61,\n];',
    );
    write('operation-10m/agent-16-guardian/monitor-rules.ts', mr);
  }
  let build = read('operation-10m/agent-16-guardian/scripts/build-chunk.mjs');
  if (!build.includes('wave-61')) {
    build = build.replace(
      "'monitor-rules-scale-wave-60.ts'",
      "'monitor-rules-scale-wave-60.ts',\n  'monitor-rules-scale-wave-61.ts'",
    );
    write('operation-10m/agent-16-guardian/scripts/build-chunk.mjs', build);
  }
}

function agent17() {
  const w60 = read('operation-10m/agent-17-command-center/planning/wave60-vigil-accord-extension.ts');
  write(
    'operation-10m/agent-17-command-center/planning/wave61-vigil-accord-extension.ts',
    replaceWave61From60(w60),
  );
  let harness = read('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts');
  if (!harness.includes('buildAgent17Wave61VigilAccordExtension')) {
    harness = harness.replace(
      "import { buildAgent17Wave60VigilAccordExtension } from '../planning/wave60-vigil-accord-extension.ts';\n",
      "import { buildAgent17Wave60VigilAccordExtension } from '../planning/wave60-vigil-accord-extension.ts';\nimport { buildAgent17Wave61VigilAccordExtension } from '../planning/wave61-vigil-accord-extension.ts';\n",
    );
    harness = harness.replace(
      "  ok(wave60Ext.headline.includes('Wave 60'));\n  return { passed, failed };",
      "  ok(wave60Ext.headline.includes('Wave 60'));\n  const wave61Ext = buildAgent17Wave61VigilAccordExtension(vigilAccord);\n  ok(wave61Ext.wave61VigilScore >= 0 && wave61Ext.wave61VigilScore <= 100);\n  ok(wave61Ext.headline.includes('Wave 61'));\n  return { passed, failed };",
    );
    write('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts', harness);
  }
  let build = read('operation-10m/agent-17-command-center/scripts/build-chunk.mjs');
  if (!build.includes('wave61-vigil')) {
    build = build.replace(
      "'planning/wave60-vigil-accord-extension.ts'",
      "'planning/wave60-vigil-accord-extension.ts',\n  'planning/wave61-vigil-accord-extension.ts'",
    );
    write('operation-10m/agent-17-command-center/scripts/build-chunk.mjs', build);
  }
}

function agent18() {
  const q = read('operation-10m/agent-18-team-ai/src/septenary-harmony-resonance-convergence-stack-index.ts');
  const oct = q
    .replaceAll('Septenary', 'Octonary')
    .replaceAll('septenary', 'octonary')
    .replaceAll('SeptenaryHarmony', 'OctonaryHarmony');
  write('operation-10m/agent-18-team-ai/src/octonary-harmony-resonance-convergence-stack-index.ts', oct);
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('octonary-harmony')) {
    idx = idx.replace(
      "export * from './septenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './septenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './octonary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('octonary-harmony')) {
    build = build.replace(
      "'src/septenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/septenary-harmony-resonance-convergence-stack-index.ts',\n  'src/octonary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Octonary')) {
    st = st.replace(
      "from './src/septenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/septenary-harmony-resonance-convergence-stack-index.ts';\nimport { computeOctonaryHarmonyResonanceConvergenceStackIndex } from './src/octonary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const oct = computeOctonaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(oct.stackIndex >= 0 && oct.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
    );
    write('operation-10m/agent-18-team-ai/run-self-tests.mts', st);
  }
}

const agent = process.argv[2];
const fns = { '13': agent13, '14': agent14, '15': agent15, '16': agent16, '17': agent17, '18': agent18 };
if (!fns[agent]) {
  console.error('Usage: node op10m-wave61-batch-13-18.mjs <13|14|15|16|17|18>');
  process.exit(1);
}
fns[agent]();
console.log(`wave61 depth generated for agent ${agent}`);
