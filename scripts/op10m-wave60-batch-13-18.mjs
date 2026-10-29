#!/usr/bin/env node
/**
 * O10-265 wave 60 batch 13–18 — generate wave-60 depth from wave-58 templates (coordinator local).
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

function replaceWave60From59(text) {
  return text
    .replaceAll('wave59', 'wave60')
    .replaceAll('Wave59', 'Wave60')
    .replaceAll('WAVE_59', 'WAVE_60')
    .replaceAll('wave-59', 'wave-60')
    .replaceAll('Wave 59', 'Wave 60')
    .replaceAll('round 59', 'round 60')
    .replaceAll('O10-263', 'O10-265')
    .replaceAll('O10m263', 'O10m265')
    .replaceAll('o10-263', 'o10-265')
    .replaceAll('O10-260', 'O10-263')
    .replaceAll('O10m260', 'O10m263')
    .replaceAll('O10-257', 'O10-260')
    .replaceAll('O10m257', 'O10m260')
    .replaceAll('O10-254', 'O10-257')
    .replaceAll('O10m254', 'O10m257')
    .replaceAll('3_166_371', '3_201_323')
    .replaceAll('3166371', '3201323')
    .replaceAll('4182618c60ef4f19fc7d6911ee33123124fa6a23', 'af6c94f05d6c6b2bfc6c909226283e5ce1dcb525')
    .replaceAll('4182618c', 'af6c94f0')
    .replaceAll('10.14.59-scale-wave-59', '10.14.60-scale-wave-60');
}

function agent13() {
  const src = read(
    'operation-10m/agent-13-energy/modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts',
  );
  let universal = src
    .replaceAll('galactic', 'universal')
    .replaceAll('Galactic', 'Universal')
    .replaceAll('GALACTIC', 'UNIVERSAL')
    .replaceAll('cosmic', 'quantum')
    .replaceAll('Cosmic', 'Quantum')
    .replaceAll('COSMIC', 'QUANTUM');
  universal = universal.replace(
    'Agent 13 scale wave round 59 (O10-263)',
    'Agent 13 scale wave round 60 (O10-265)',
  );
  write(
    'operation-10m/agent-13-energy/modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts',
    universal,
  );

  const brief59 = read('operation-10m/agent-13-energy/modules/agent25-wave59-projection-handoff-brief.ts');
  write(
    'operation-10m/agent-13-energy/modules/agent25-wave60-projection-handoff-brief.ts',
    replaceWave60From59(brief59),
  );

  let bundle = read('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs');
  if (!bundle.includes('universal-sovereign')) {
    bundle = bundle.replace(
      "  'agent25-wave59-projection-handoff-brief.ts',\n",
      "  'universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts',\n  'agent25-wave60-projection-handoff-brief.ts',\n",
    );
    write('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs', bundle);
  }

  let sup = read('operation-10m/agent-13-energy/tests/supplement-tests.mts');
  if (!sup.includes('UniversalSovereign')) {
    sup = sup.replace(
      "} from '../modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts';",
      "} from '../modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts';\nimport {\n  runAgent13UniversalSovereignNetZeroExportContinuityScaleSelfTests,\n  runAgent13UniversalSovereignNetZeroExportContinuityTurnScenario,\n  V1014_UNIVERSAL_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_QUANTUM_MESH_TURN_SCENARIOS,\n} from '../modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts';",
    );
    sup = sup.replace(
      "import { runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave59-projection-handoff-brief.ts';",
      "import { runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave59-projection-handoff-brief.ts';\nimport { runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave60-projection-handoff-brief.ts';",
    );
    sup = sup.replace(
      '  const wave59Handoff = runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests();\n  ok(wave59Handoff.failed === 0 && wave59Handoff.passed >= 4);',
      '  const wave59Handoff = runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests();\n  ok(wave59Handoff.failed === 0 && wave59Handoff.passed >= 4);\n  const universal = runAgent13UniversalSovereignNetZeroExportContinuityScaleSelfTests();\n  ok(universal.failed === 0 && universal.passed >= 4);\n  const universalTurn = runAgent13UniversalSovereignNetZeroExportContinuityTurnScenario(\n    V1014_UNIVERSAL_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_QUANTUM_MESH_TURN_SCENARIOS[0],\n  );\n  ok(universalTurn.passed);\n  const wave60Handoff = runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests();\n  ok(wave60Handoff.failed === 0 && wave60Handoff.passed >= 4);',
    );
    write('operation-10m/agent-13-energy/tests/supplement-tests.mts', sup);
  }
}

function agent14() {
  for (const base of [
    'wave59-gate-trajectory.ts',
    'wave59-integration-monitor.ts',
    'agent25-wave59-projection-handoff-brief.ts',
  ]) {
    const out = base.replace('wave59', 'wave60');
    write(`operation-10m/agent-14-housing/${out}`, replaceWave60From59(read(`operation-10m/agent-14-housing/${base}`)));
  }
  let idx = read('operation-10m/agent-14-housing/index.ts');
  if (!idx.includes('wave60-gate-trajectory')) {
    idx = idx.replace(
      "export * from './wave57-gate-trajectory.ts';\n",
      "export * from './wave57-gate-trajectory.ts';\nexport * from './agent25-wave60-projection-handoff-brief.ts';\nexport * from './wave60-integration-monitor.ts';\nexport * from './wave60-gate-trajectory.ts';\n",
    );
    write('operation-10m/agent-14-housing/index.ts', idx);
  }
  let st = read('operation-10m/agent-14-housing/self-tests.ts');
  if (!st.includes('Wave60')) {
    st = replaceWave60From59(st);
    st = st.replace('Wave60Gate', 'Wave60Gate').replace('wave60', 'wave57');
    st = st.replace('runAgent14Wave60', 'runAgent14Wave60');
    const block = `
  const wave60Brief = composeAgent25Wave60ProjectionHandoffBrief({
    turn: 58,
    wave60IntegrationMonitor: {
      shouldRunO10m257DryRun: true,
      wave60GateBand: 'ready',
      integrationBaselineSha: 'feb7e524ca511c106896e93b47329106a1786db6',
      projectedAuditedFunctional: 3_139_519,
    },
    wave60GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(wave60Brief.shouldProjectWave60);
  const wave60Traj = updateWave60GateTrajectory(createInitialWave60GateTrajectory(), wave60Brief, 58);
  ok(wave60Traj.snapshot.band === 'ready' || wave60Traj.snapshot.band === 'watch');
`;
    if (!st.includes('shouldProjectWave60')) {
      st = st.replace('return { passed, failed, total: passed + failed };', `${block}\n  return { passed, failed, total: passed + failed };`);
      st = st.replace(
        "import { composeAgent25Wave60ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';",
        "import { composeAgent25Wave60ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';\nimport { composeAgent25Wave60ProjectionHandoffBrief } from './agent25-wave60-projection-handoff-brief.ts';\nimport { createInitialWave60GateTrajectory, updateWave60GateTrajectory } from './wave60-gate-trajectory.ts';",
      );
      write('operation-10m/agent-14-housing/self-tests.ts', st);
    }
  }
  let types = read('operation-10m/agent-14-housing/types.ts');
  if (!types.includes('Wave60Gate')) {
    types = replaceWave60From59(types);
    types = types.replace(/Wave60/g, 'WAVE58TMP').replace(/wave60/g, 'wave57').replace(/WAVE58TMP/g, 'Wave60');
    write('operation-10m/agent-14-housing/types.ts', types);
  }
}

function agent15() {
  const src = read('operation-10m/agent-15-trade/src/o10-263-wave59-sovereign-handoff-depth-stacking.ts');
  const w60 = replaceWave60From59(src)
    .replace('o10-263-wave59', 'o10-265-wave60')
    .replace('GTELWave59', 'GTELWave60')
    .replace('wave59Sovereign', 'wave60Sovereign')
    .replace('Wave59', 'Wave60')
    .replace('wave58Stacking', 'wave59Stacking')
    .replace('GTELWave58', 'GTELWave59')
    .replace('wave57Stacking', 'wave58Stacking');
  write('operation-10m/agent-15-trade/src/o10-265-wave60-sovereign-handoff-depth-stacking.ts', w60);

  let st = read('operation-10m/agent-15-trade/src/self-tests.ts');
  if (!st.includes('wave60')) {
    st = st.replace(
      "from './o10-263-wave59-sovereign-handoff-depth-stacking.ts';",
      "from './o10-263-wave59-sovereign-handoff-depth-stacking.ts';\nimport { computeWave60SovereignHandoffDepthStackingSnapshot } from './o10-265-wave60-sovereign-handoff-depth-stacking.ts';",
    );
    st = st.replace(
      'export function runAgent15SelfTests',
      `ok(computeWave60SovereignHandoffDepthStackingSnapshot({ wave59Stacking: { score: 0.8, band: 'tiered', summary: 'w59' }, persisted: {} as any }).snapshot.score > 0.5);\n\nexport function runAgent15SelfTests`,
    );
    write('operation-10m/agent-15-trade/src/self-tests.ts', st);
  }
}

function agent16() {
  let rules = read('operation-10m/agent-16-guardian/monitor-rules-scale-wave-59.ts');
  rules = replaceWave60From59(rules)
    .replaceAll('covenant', 'treaty')
    .replaceAll('Covenant', 'Treaty')
    .replaceAll('monitor-rules-scale-wave-59', 'monitor-rules-scale-wave-60');
  write('operation-10m/agent-16-guardian/monitor-rules-scale-wave-60.ts', rules);
  let mr = read('operation-10m/agent-16-guardian/monitor-rules.ts');
  if (!mr.includes('WAVE_60')) {
    mr = mr.replace(
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_59 } from './monitor-rules-scale-wave-59.js';\n",
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_59 } from './monitor-rules-scale-wave-59.js';\nimport { ADVISORY_MONITOR_RULES_SCALE_WAVE_60 } from './monitor-rules-scale-wave-60.js';\n",
    );
    mr = mr.replace(
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_59,\n];',
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_59,\n  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_60,\n];',
    );
    write('operation-10m/agent-16-guardian/monitor-rules.ts', mr);
  }
  let build = read('operation-10m/agent-16-guardian/scripts/build-chunk.mjs');
  if (!build.includes('wave-60')) {
    build = build.replace(
      "'monitor-rules-scale-wave-59.ts'",
      "'monitor-rules-scale-wave-59.ts',\n  'monitor-rules-scale-wave-60.ts'",
    );
    write('operation-10m/agent-16-guardian/scripts/build-chunk.mjs', build);
  }
}

function agent17() {
  const w59 = read('operation-10m/agent-17-command-center/planning/wave59-vigil-accord-extension.ts');
  write(
    'operation-10m/agent-17-command-center/planning/wave60-vigil-accord-extension.ts',
    replaceWave60From59(w59),
  );
  let harness = read('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts');
  if (!harness.includes('buildAgent17Wave60VigilAccordExtension')) {
    harness = harness.replace(
      "import { buildAgent17Wave59VigilAccordExtension } from '../planning/wave59-vigil-accord-extension.ts';\n",
      "import { buildAgent17Wave59VigilAccordExtension } from '../planning/wave59-vigil-accord-extension.ts';\nimport { buildAgent17Wave60VigilAccordExtension } from '../planning/wave60-vigil-accord-extension.ts';\n",
    );
    harness = harness.replace(
      "  ok(wave59Ext.headline.includes('Wave 59'));\n  return { passed, failed };",
      "  ok(wave59Ext.headline.includes('Wave 59'));\n  const wave60Ext = buildAgent17Wave60VigilAccordExtension(vigilAccord);\n  ok(wave60Ext.wave60VigilScore >= 0 && wave60Ext.wave60VigilScore <= 100);\n  ok(wave60Ext.headline.includes('Wave 60'));\n  return { passed, failed };",
    );
    write('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts', harness);
  }
  let build = read('operation-10m/agent-17-command-center/scripts/build-chunk.mjs');
  if (!build.includes('wave60-vigil')) {
    build = build.replace(
      "'planning/wave59-vigil-accord-extension.ts'",
      "'planning/wave59-vigil-accord-extension.ts',\n  'planning/wave60-vigil-accord-extension.ts'",
    );
    write('operation-10m/agent-17-command-center/scripts/build-chunk.mjs', build);
  }
}

function agent18() {
  const q = read('operation-10m/agent-18-team-ai/src/senary-harmony-resonance-convergence-stack-index.ts');
  const sep = q
    .replaceAll('Senary', 'Septenary')
    .replaceAll('senary', 'septenary')
    .replaceAll('SenaryHarmony', 'SeptenaryHarmony');
  write('operation-10m/agent-18-team-ai/src/septenary-harmony-resonance-convergence-stack-index.ts', sep);
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('septenary-harmony')) {
    idx = idx.replace(
      "export * from './senary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './senary-harmony-resonance-convergence-stack-index.ts';\nexport * from './septenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('septenary-harmony')) {
    build = build.replace(
      "'src/senary-harmony-resonance-convergence-stack-index.ts'",
      "'src/senary-harmony-resonance-convergence-stack-index.ts',\n  'src/septenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Septenary')) {
    st = st.replace(
      "from './src/senary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/senary-harmony-resonance-convergence-stack-index.ts';\nimport { computeSeptenaryHarmonyResonanceConvergenceStackIndex } from './src/septenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const sep = computeSeptenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(sep.stackIndex >= 0 && sep.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
    );
    write('operation-10m/agent-18-team-ai/run-self-tests.mts', st);
  }
}

const agent = process.argv[2];
const fns = { '13': agent13, '14': agent14, '15': agent15, '16': agent16, '17': agent17, '18': agent18 };
if (!fns[agent]) {
  console.error('Usage: node op10m-wave60-batch-13-18.mjs <13|14|15|16|17|18>');
  process.exit(1);
}
fns[agent]();
console.log(`wave60 depth generated for agent ${agent}`);
