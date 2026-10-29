#!/usr/bin/env node
/**
 * O10-260 wave 58 batch 13–18 — generate wave-58 depth from wave-57 templates (coordinator local).
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

function replaceWave58From57(text) {
  return text
    .replaceAll('wave57', 'wave58')
    .replaceAll('Wave57', 'Wave58')
    .replaceAll('WAVE_57', 'WAVE_58')
    .replaceAll('wave-57', 'wave-58')
    .replaceAll('Wave 57', 'Wave 58')
    .replaceAll('round 57', 'round 58')
    .replaceAll('O10-257', 'O10-260')
    .replaceAll('O10m257', 'O10m260')
    .replaceAll('o10-257', 'o10-260')
    .replaceAll('O10m254', 'O10m257')
    .replaceAll('O10-254', 'O10-257')
    .replaceAll('3_112_667', '3_139_519')
    .replaceAll('3112667', '3139519')
    .replaceAll('93c42b3d82e3700a0f14db0b66522b05bb1d6aec', 'feb7e524ca511c106896e93b47329106a1786db6')
    .replaceAll('93c42b3d', 'feb7e524')
    .replaceAll('10.14.57-scale-wave-57', '10.14.58-scale-wave-58');
}

function agent13() {
  const src = read(
    'operation-10m/agent-13-energy/modules/planetary-sovereign-net-zero-export-continuity-global-mesh-orchestration-ledger.ts',
  );
  let helio = src
    .replaceAll('planetary', 'heliospheric')
    .replaceAll('Planetary', 'Heliospheric')
    .replaceAll('PLANETARY', 'HELIOSPHERIC')
    .replaceAll('global', 'stellar')
    .replaceAll('Global', 'Stellar')
    .replaceAll('GLOBAL', 'STELLAR');
  helio = helio.replace(
    'Agent 13 scale wave round 56 (O10-260)',
    'Agent 13 scale wave round 58 (O10-260)',
  );
  write(
    'operation-10m/agent-13-energy/modules/heliospheric-sovereign-net-zero-export-continuity-stellar-mesh-orchestration-ledger.ts',
    helio,
  );

  const brief57 = read('operation-10m/agent-13-energy/modules/agent25-wave57-projection-handoff-brief.ts');
  write(
    'operation-10m/agent-13-energy/modules/agent25-wave58-projection-handoff-brief.ts',
    replaceWave58From57(brief57),
  );

  let bundle = read('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs');
  if (!bundle.includes('heliospheric-sovereign')) {
    bundle = bundle.replace(
      "  'agent25-wave57-projection-handoff-brief.ts',\n",
      "  'heliospheric-sovereign-net-zero-export-continuity-stellar-mesh-orchestration-ledger.ts',\n  'agent25-wave57-projection-handoff-brief.ts',\n  'agent25-wave58-projection-handoff-brief.ts',\n",
    );
    write('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs', bundle);
  }

  let sup = read('operation-10m/agent-13-energy/tests/supplement-tests.mts');
  if (!sup.includes('Heliospheric')) {
    sup = sup.replace(
      "} from '../modules/planetary-sovereign-net-zero-export-continuity-global-mesh-orchestration-ledger.ts';",
      "} from '../modules/planetary-sovereign-net-zero-export-continuity-global-mesh-orchestration-ledger.ts';\nimport {\n  runAgent13HeliosphericSovereignNetZeroExportContinuityScaleSelfTests,\n  runAgent13HeliosphericSovereignNetZeroExportContinuityTurnScenario,\n  V1014_HELIOSPHERIC_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_STELLAR_MESH_TURN_SCENARIOS,\n} from '../modules/heliospheric-sovereign-net-zero-export-continuity-stellar-mesh-orchestration-ledger.ts';",
    );
    sup = sup.replace(
      "import { runAgent13Agent25Wave57ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave57-projection-handoff-brief.ts';",
      "import { runAgent13Agent25Wave57ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave57-projection-handoff-brief.ts';\nimport { runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave58-projection-handoff-brief.ts';",
    );
    sup = sup.replace(
      '  ok(wave57Handoff.failed === 0 && wave57Handoff.passed >= 4);',
      '  ok(wave57Handoff.failed === 0 && wave57Handoff.passed >= 4);\n  const heliospheric = runAgent13HeliosphericSovereignNetZeroExportContinuityScaleSelfTests();\n  ok(heliospheric.failed === 0 && heliospheric.passed >= 4);\n  const heliosphericTurn = runAgent13HeliosphericSovereignNetZeroExportContinuityTurnScenario(\n    V1014_HELIOSPHERIC_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_STELLAR_MESH_TURN_SCENARIOS[0],\n  );\n  ok(heliosphericTurn.passed);\n  const wave58Handoff = runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests();\n  ok(wave58Handoff.failed === 0 && wave58Handoff.passed >= 4);',
    );
    write('operation-10m/agent-13-energy/tests/supplement-tests.mts', sup);
  }
}

function agent14() {
  for (const base of [
    'wave57-gate-trajectory.ts',
    'wave57-integration-monitor.ts',
    'agent25-wave57-projection-handoff-brief.ts',
  ]) {
    const out = base.replace('wave57', 'wave58').replace('wave57', 'wave58');
    write(`operation-10m/agent-14-housing/${out}`, replaceWave58From57(read(`operation-10m/agent-14-housing/${base}`)));
  }
  let idx = read('operation-10m/agent-14-housing/index.ts');
  if (!idx.includes('wave58-gate-trajectory')) {
    idx = idx.replace(
      "export * from './wave57-gate-trajectory.ts';\n",
      "export * from './wave57-gate-trajectory.ts';\nexport * from './agent25-wave58-projection-handoff-brief.ts';\nexport * from './wave58-integration-monitor.ts';\nexport * from './wave58-gate-trajectory.ts';\n",
    );
    write('operation-10m/agent-14-housing/index.ts', idx);
  }
  let st = read('operation-10m/agent-14-housing/self-tests.ts');
  if (!st.includes('Wave58')) {
    st = replaceWave58From57(st);
    st = st.replace('Wave58Gate', 'Wave57Gate').replace('wave58', 'wave57');
    st = st.replace('runAgent14Wave57', 'runAgent14Wave57');
    const block = `
  const wave58Brief = composeAgent25Wave58ProjectionHandoffBrief({
    turn: 58,
    wave58IntegrationMonitor: {
      shouldRunO10m257DryRun: true,
      wave58GateBand: 'ready',
      integrationBaselineSha: 'feb7e524ca511c106896e93b47329106a1786db6',
      projectedAuditedFunctional: 3_139_519,
    },
    wave58GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(wave58Brief.shouldProjectWave58);
  const wave58Traj = updateWave58GateTrajectory(createInitialWave58GateTrajectory(), wave58Brief, 58);
  ok(wave58Traj.snapshot.band === 'ready' || wave58Traj.snapshot.band === 'watch');
`;
    if (!st.includes('shouldProjectWave58')) {
      st = st.replace('return { passed, failed, total: passed + failed };', `${block}\n  return { passed, failed, total: passed + failed };`);
      st = st.replace(
        "import { composeAgent25Wave57ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';",
        "import { composeAgent25Wave57ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';\nimport { composeAgent25Wave58ProjectionHandoffBrief } from './agent25-wave58-projection-handoff-brief.ts';\nimport { createInitialWave58GateTrajectory, updateWave58GateTrajectory } from './wave58-gate-trajectory.ts';",
      );
      write('operation-10m/agent-14-housing/self-tests.ts', st);
    }
  }
  let types = read('operation-10m/agent-14-housing/types.ts');
  if (!types.includes('Wave58Gate')) {
    types = replaceWave58From57(types);
    types = types.replace(/Wave58/g, 'WAVE58TMP').replace(/wave58/g, 'wave57').replace(/WAVE58TMP/g, 'Wave58');
    write('operation-10m/agent-14-housing/types.ts', types);
  }
}

function agent15() {
  const src = read('operation-10m/agent-15-trade/src/o10-257-wave57-sovereign-handoff-depth-stacking.ts');
  write(
    'operation-10m/agent-15-trade/src/o10-260-wave58-sovereign-handoff-depth-stacking.ts',
    replaceWave58From57(src).replace('Wave56', 'Wave57').replace('wave56', 'wave57').replace('GTELWave57', 'GTELWave58TMP').replace('wave57', 'wave58').replace('GTELWave58TMP', 'GTELWave57').replace('Wave57', 'Wave58').replace('wave57Sovereign', 'wave58Sovereign').replace('wave57Sovereign', 'wave58Sovereign'),
  );
  // simpler: manual fix file
  const w58 = replaceWave58From57(src)
    .replace('o10-257-wave57', 'o10-260-wave58')
    .replace('GTELWave57', 'GTELWave58')
    .replace('wave57Sovereign', 'wave58Sovereign')
    .replace('Wave57', 'Wave58')
    .replace('wave56Stacking', 'wave57Stacking')
    .replace('GTELWave56', 'GTELWave57')
    .replace('wave56', 'wave57');
  write('operation-10m/agent-15-trade/src/o10-260-wave58-sovereign-handoff-depth-stacking.ts', w58);

  let st = read('operation-10m/agent-15-trade/src/self-tests.ts');
  if (!st.includes('wave58')) {
    st = st.replace(
      "from './o10-257-wave57-sovereign-handoff-depth-stacking.ts';",
      "from './o10-257-wave57-sovereign-handoff-depth-stacking.ts';\nimport { computeWave58SovereignHandoffDepthStackingSnapshot } from './o10-260-wave58-sovereign-handoff-depth-stacking.ts';",
    );
    st = st.replace(
      'export function runAgent15SelfTests',
      `ok(computeWave58SovereignHandoffDepthStackingSnapshot({ wave57Stacking: { score: 0.8, band: 'tiered', summary: 'w57' }, persisted: {} as any }).snapshot.score > 0.5);\n\nexport function runAgent15SelfTests`,
    );
    write('operation-10m/agent-15-trade/src/self-tests.ts', st);
  }
}

function agent16() {
  let rules = read('operation-10m/agent-16-guardian/monitor-rules-scale-wave-57.ts');
  rules = replaceWave58From57(rules)
    .replaceAll('endowment', 'charter')
    .replaceAll('Endowment', 'Charter')
    .replaceAll('monitor-rules-scale-wave-57', 'monitor-rules-scale-wave-58');
  write('operation-10m/agent-16-guardian/monitor-rules-scale-wave-58.ts', rules);
  let mr = read('operation-10m/agent-16-guardian/monitor-rules.ts');
  if (!mr.includes('WAVE_58')) {
    mr = mr.replace(
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_57 } from './monitor-rules-scale-wave-57.js';\n",
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_57 } from './monitor-rules-scale-wave-57.js';\nimport { ADVISORY_MONITOR_RULES_SCALE_WAVE_58 } from './monitor-rules-scale-wave-58.js';\n",
    );
    mr = mr.replace(
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_57,\n];',
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_57,\n  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_58,\n];',
    );
    write('operation-10m/agent-16-guardian/monitor-rules.ts', mr);
  }
  let build = read('operation-10m/agent-16-guardian/scripts/build-chunk.mjs');
  if (!build.includes('wave-58')) {
    build = build.replace(
      "'monitor-rules-scale-wave-57.ts'",
      "'monitor-rules-scale-wave-57.ts',\n  'monitor-rules-scale-wave-58.ts'",
    );
    write('operation-10m/agent-16-guardian/scripts/build-chunk.mjs', build);
  }
}

function agent17() {
  const w57 = read('operation-10m/agent-17-command-center/planning/wave57-vigil-accord-extension.ts');
  write(
    'operation-10m/agent-17-command-center/planning/wave58-vigil-accord-extension.ts',
    replaceWave58From57(w57),
  );
  let harness = read('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts');
  if (!harness.includes('Wave58')) {
    harness = harness.replace(
      "import { buildAgent17Wave57VigilAccordExtension } from '../planning/wave57-vigil-accord-extension.ts';\n",
      "import { buildAgent17Wave57VigilAccordExtension } from '../planning/wave57-vigil-accord-extension.ts';\nimport { buildAgent17Wave58VigilAccordExtension } from '../planning/wave58-vigil-accord-extension.ts';\n",
    );
    harness = harness.replace(
      "  ok(wave57Ext.headline.includes('Wave 57'));\n  return { passed, failed };",
      "  ok(wave57Ext.headline.includes('Wave 57'));\n  const wave58Ext = buildAgent17Wave58VigilAccordExtension(vigilAccord);\n  ok(wave58Ext.wave58VigilScore >= 0 && wave58Ext.wave58VigilScore <= 100);\n  ok(wave58Ext.headline.includes('Wave 58'));\n  return { passed, failed };",
    );
    write('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts', harness);
  }
  let build = read('operation-10m/agent-17-command-center/scripts/build-chunk.mjs');
  if (!build.includes('wave58-vigil')) {
    build = build.replace(
      "'planning/wave57-vigil-accord-extension.ts'",
      "'planning/wave57-vigil-accord-extension.ts',\n  'planning/wave58-vigil-accord-extension.ts'",
    );
    write('operation-10m/agent-17-command-center/scripts/build-chunk.mjs', build);
  }
}

function agent18() {
  const q = read('operation-10m/agent-18-team-ai/src/quaternary-harmony-resonance-convergence-stack-index.ts');
  const quin = q
    .replaceAll('Quaternary', 'Quinary')
    .replaceAll('quaternary', 'quinary')
    .replaceAll('QuaternaryHarmony', 'QuinaryHarmony');
  write('operation-10m/agent-18-team-ai/src/quinary-harmony-resonance-convergence-stack-index.ts', quin);
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('quinary-harmony')) {
    idx = idx.replace(
      "export * from './quaternary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './quaternary-harmony-resonance-convergence-stack-index.ts';\nexport * from './quinary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('quinary-harmony')) {
    build = build.replace(
      "'src/quaternary-harmony-resonance-convergence-stack-index.ts'",
      "'src/quaternary-harmony-resonance-convergence-stack-index.ts',\n  'src/quinary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Quinary')) {
    st = st.replace(
      "from './src/quaternary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/quaternary-harmony-resonance-convergence-stack-index.ts';\nimport { computeQuinaryHarmonyResonanceConvergenceStackIndex } from './src/quinary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const quin = computeQuinaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(quin.stackIndex >= 0 && quin.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
    );
    write('operation-10m/agent-18-team-ai/run-self-tests.mts', st);
  }
}

const agent = process.argv[2];
const fns = { '13': agent13, '14': agent14, '15': agent15, '16': agent16, '17': agent17, '18': agent18 };
if (!fns[agent]) {
  console.error('Usage: node op10m-wave58-batch-13-18.mjs <13|14|15|16|17|18>');
  process.exit(1);
}
fns[agent]();
console.log(`wave58 depth generated for agent ${agent}`);
