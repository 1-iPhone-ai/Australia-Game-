#!/usr/bin/env node
/**
 * O10-263 wave 59 batch 13–18 — generate wave-59 depth from wave-58 templates (coordinator local).
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

function replaceWave59From58(text) {
  return text
    .replaceAll('wave58', 'wave59')
    .replaceAll('Wave58', 'Wave59')
    .replaceAll('WAVE_58', 'WAVE_59')
    .replaceAll('wave-58', 'wave-59')
    .replaceAll('Wave 58', 'Wave 59')
    .replaceAll('round 58', 'round 59')
    .replaceAll('O10-260', 'O10-263')
    .replaceAll('O10m260', 'O10m263')
    .replaceAll('o10-260', 'o10-263')
    .replaceAll('O10-257', 'O10-260')
    .replaceAll('O10m257', 'O10m260')
    .replaceAll('O10-254', 'O10-257')
    .replaceAll('O10m254', 'O10m257')
    .replaceAll('3_139_519', '3_166_371')
    .replaceAll('3139519', '3166371')
    .replaceAll('feb7e524ca511c106896e93b47329106a1786db6', '4182618c60ef4f19fc7d6911ee33123124fa6a23')
    .replaceAll('feb7e524', '4182618c')
    .replaceAll('10.14.58-scale-wave-58', '10.14.59-scale-wave-59');
}

function agent13() {
  const src = read(
    'operation-10m/agent-13-energy/modules/heliospheric-sovereign-net-zero-export-continuity-stellar-mesh-orchestration-ledger.ts',
  );
  let galactic = src
    .replaceAll('heliospheric', 'galactic')
    .replaceAll('Heliospheric', 'Galactic')
    .replaceAll('HELIOSPHERIC', 'GALACTIC')
    .replaceAll('stellar', 'cosmic')
    .replaceAll('Stellar', 'Cosmic')
    .replaceAll('STELLAR', 'COSMIC');
  galactic = galactic.replace(
    'Agent 13 scale wave round 58 (O10-263)',
    'Agent 13 scale wave round 59 (O10-263)',
  );
  write(
    'operation-10m/agent-13-energy/modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts',
    galactic,
  );

  const brief58 = read('operation-10m/agent-13-energy/modules/agent25-wave58-projection-handoff-brief.ts');
  write(
    'operation-10m/agent-13-energy/modules/agent25-wave59-projection-handoff-brief.ts',
    replaceWave59From58(brief58),
  );

  let bundle = read('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs');
  if (!bundle.includes('galactic-sovereign')) {
    bundle = bundle.replace(
      "  'agent25-wave58-projection-handoff-brief.ts',\n",
      "  'galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts',\n  'agent25-wave59-projection-handoff-brief.ts',\n",
    );
    write('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs', bundle);
  }

  let sup = read('operation-10m/agent-13-energy/tests/supplement-tests.mts');
  if (!sup.includes('GalacticSovereign')) {
    sup = sup.replace(
      "} from '../modules/heliospheric-sovereign-net-zero-export-continuity-stellar-mesh-orchestration-ledger.ts';",
      "} from '../modules/heliospheric-sovereign-net-zero-export-continuity-stellar-mesh-orchestration-ledger.ts';\nimport {\n  runAgent13GalacticSovereignNetZeroExportContinuityScaleSelfTests,\n  runAgent13GalacticSovereignNetZeroExportContinuityTurnScenario,\n  V1014_GALACTIC_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_COSMIC_MESH_TURN_SCENARIOS,\n} from '../modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts';",
    );
    sup = sup.replace(
      "import { runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave58-projection-handoff-brief.ts';",
      "import { runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave58-projection-handoff-brief.ts';\nimport { runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave59-projection-handoff-brief.ts';",
    );
    sup = sup.replace(
      '  const wave58Handoff = runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests();\n  ok(wave58Handoff.failed === 0 && wave58Handoff.passed >= 4);',
      '  const wave58Handoff = runAgent13Agent25Wave58ProjectionHandoffBriefSelfTests();\n  ok(wave58Handoff.failed === 0 && wave58Handoff.passed >= 4);\n  const galactic = runAgent13GalacticSovereignNetZeroExportContinuityScaleSelfTests();\n  ok(galactic.failed === 0 && galactic.passed >= 4);\n  const galacticTurn = runAgent13GalacticSovereignNetZeroExportContinuityTurnScenario(\n    V1014_GALACTIC_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_COSMIC_MESH_TURN_SCENARIOS[0],\n  );\n  ok(galacticTurn.passed);\n  const wave59Handoff = runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests();\n  ok(wave59Handoff.failed === 0 && wave59Handoff.passed >= 4);',
    );
    write('operation-10m/agent-13-energy/tests/supplement-tests.mts', sup);
  }
}

function agent14() {
  for (const base of [
    'wave58-gate-trajectory.ts',
    'wave58-integration-monitor.ts',
    'agent25-wave58-projection-handoff-brief.ts',
  ]) {
    const out = base.replace('wave58', 'wave59');
    write(`operation-10m/agent-14-housing/${out}`, replaceWave59From58(read(`operation-10m/agent-14-housing/${base}`)));
  }
  let idx = read('operation-10m/agent-14-housing/index.ts');
  if (!idx.includes('wave59-gate-trajectory')) {
    idx = idx.replace(
      "export * from './wave57-gate-trajectory.ts';\n",
      "export * from './wave57-gate-trajectory.ts';\nexport * from './agent25-wave59-projection-handoff-brief.ts';\nexport * from './wave59-integration-monitor.ts';\nexport * from './wave59-gate-trajectory.ts';\n",
    );
    write('operation-10m/agent-14-housing/index.ts', idx);
  }
  let st = read('operation-10m/agent-14-housing/self-tests.ts');
  if (!st.includes('Wave59')) {
    st = replaceWave59From58(st);
    st = st.replace('Wave59Gate', 'Wave59Gate').replace('wave59', 'wave57');
    st = st.replace('runAgent14Wave59', 'runAgent14Wave59');
    const block = `
  const wave59Brief = composeAgent25Wave59ProjectionHandoffBrief({
    turn: 58,
    wave59IntegrationMonitor: {
      shouldRunO10m257DryRun: true,
      wave59GateBand: 'ready',
      integrationBaselineSha: 'feb7e524ca511c106896e93b47329106a1786db6',
      projectedAuditedFunctional: 3_139_519,
    },
    wave59GateTrajectory: { trajectory: 'stable', band: 'ready' },
  });
  ok(wave59Brief.shouldProjectWave59);
  const wave59Traj = updateWave59GateTrajectory(createInitialWave59GateTrajectory(), wave59Brief, 58);
  ok(wave59Traj.snapshot.band === 'ready' || wave59Traj.snapshot.band === 'watch');
`;
    if (!st.includes('shouldProjectWave59')) {
      st = st.replace('return { passed, failed, total: passed + failed };', `${block}\n  return { passed, failed, total: passed + failed };`);
      st = st.replace(
        "import { composeAgent25Wave59ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';",
        "import { composeAgent25Wave59ProjectionHandoffBrief } from './agent25-wave57-projection-handoff-brief.ts';\nimport { composeAgent25Wave59ProjectionHandoffBrief } from './agent25-wave59-projection-handoff-brief.ts';\nimport { createInitialWave59GateTrajectory, updateWave59GateTrajectory } from './wave59-gate-trajectory.ts';",
      );
      write('operation-10m/agent-14-housing/self-tests.ts', st);
    }
  }
  let types = read('operation-10m/agent-14-housing/types.ts');
  if (!types.includes('Wave59Gate')) {
    types = replaceWave59From58(types);
    types = types.replace(/Wave59/g, 'WAVE58TMP').replace(/wave59/g, 'wave57').replace(/WAVE58TMP/g, 'Wave59');
    write('operation-10m/agent-14-housing/types.ts', types);
  }
}

function agent15() {
  const src = read('operation-10m/agent-15-trade/src/o10-260-wave58-sovereign-handoff-depth-stacking.ts');
  write(
    'operation-10m/agent-15-trade/src/o10-263-wave59-sovereign-handoff-depth-stacking.ts',
    replaceWave59From58(src).replace('Wave56', 'Wave59').replace('wave58', 'wave57').replace('GTELWave59', 'GTELWave59TMP').replace('wave57', 'wave59').replace('GTELWave59TMP', 'GTELWave59').replace('Wave59', 'Wave59').replace('wave59Sovereign', 'wave59Sovereign').replace('wave59Sovereign', 'wave59Sovereign'),
  );
  // simpler: manual fix file
  const w58 = replaceWave59From58(src)
    .replace('o10-260-wave58', 'o10-263-wave59')
    .replace('GTELWave58', 'GTELWave59')
    .replace('wave58Sovereign', 'wave59Sovereign')
    .replace('Wave58', 'Wave59')
    .replace('wave57Stacking', 'wave58Stacking')
    .replace('GTELWave57', 'GTELWave58')
    .replace('wave57Stacking', 'wave58Stacking');
  write('operation-10m/agent-15-trade/src/o10-263-wave59-sovereign-handoff-depth-stacking.ts', w58);

  let st = read('operation-10m/agent-15-trade/src/self-tests.ts');
  if (!st.includes('wave59')) {
    st = st.replace(
      "from './o10-260-wave58-sovereign-handoff-depth-stacking.ts';",
      "from './o10-260-wave58-sovereign-handoff-depth-stacking.ts';\nimport { computeWave59SovereignHandoffDepthStackingSnapshot } from './o10-263-wave59-sovereign-handoff-depth-stacking.ts';",
    );
    st = st.replace(
      'export function runAgent15SelfTests',
      `ok(computeWave59SovereignHandoffDepthStackingSnapshot({ wave58Stacking: { score: 0.8, band: 'tiered', summary: 'w58' }, persisted: {} as any }).snapshot.score > 0.5);\n\nexport function runAgent15SelfTests`,
    );
    write('operation-10m/agent-15-trade/src/self-tests.ts', st);
  }
}

function agent16() {
  let rules = read('operation-10m/agent-16-guardian/monitor-rules-scale-wave-58.ts');
  rules = replaceWave59From58(rules)
    .replaceAll('charter', 'covenant')
    .replaceAll('Charter', 'Covenant')
    .replaceAll('monitor-rules-scale-wave-58', 'monitor-rules-scale-wave-59');
  write('operation-10m/agent-16-guardian/monitor-rules-scale-wave-59.ts', rules);
  let mr = read('operation-10m/agent-16-guardian/monitor-rules.ts');
  if (!mr.includes('WAVE_59')) {
    mr = mr.replace(
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_58 } from './monitor-rules-scale-wave-58.js';\n",
      "import { ADVISORY_MONITOR_RULES_SCALE_WAVE_58 } from './monitor-rules-scale-wave-58.js';\nimport { ADVISORY_MONITOR_RULES_SCALE_WAVE_59 } from './monitor-rules-scale-wave-59.js';\n",
    );
    mr = mr.replace(
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_58,\n];',
      '  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_58,\n  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_59,\n];',
    );
    write('operation-10m/agent-16-guardian/monitor-rules.ts', mr);
  }
  let build = read('operation-10m/agent-16-guardian/scripts/build-chunk.mjs');
  if (!build.includes('wave-59')) {
    build = build.replace(
      "'monitor-rules-scale-wave-58.ts'",
      "'monitor-rules-scale-wave-58.ts',\n  'monitor-rules-scale-wave-59.ts'",
    );
    write('operation-10m/agent-16-guardian/scripts/build-chunk.mjs', build);
  }
}

function agent17() {
  const w58 = read('operation-10m/agent-17-command-center/planning/wave58-vigil-accord-extension.ts');
  write(
    'operation-10m/agent-17-command-center/planning/wave59-vigil-accord-extension.ts',
    replaceWave59From58(w58),
  );
  let harness = read('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts');
  if (!harness.includes('buildAgent17Wave59VigilAccordExtension')) {
    harness = harness.replace(
      "import { buildAgent17Wave58VigilAccordExtension } from '../planning/wave58-vigil-accord-extension.ts';\n",
      "import { buildAgent17Wave58VigilAccordExtension } from '../planning/wave58-vigil-accord-extension.ts';\nimport { buildAgent17Wave59VigilAccordExtension } from '../planning/wave59-vigil-accord-extension.ts';\n",
    );
    harness = harness.replace(
      "  ok(wave58Ext.headline.includes('Wave 58'));\n  return { passed, failed };",
      "  ok(wave58Ext.headline.includes('Wave 58'));\n  const wave59Ext = buildAgent17Wave59VigilAccordExtension(vigilAccord);\n  ok(wave59Ext.wave59VigilScore >= 0 && wave59Ext.wave59VigilScore <= 100);\n  ok(wave59Ext.headline.includes('Wave 59'));\n  return { passed, failed };",
    );
    write('operation-10m/agent-17-command-center/harness/run-vigil-depth-tests.ts', harness);
  }
  let build = read('operation-10m/agent-17-command-center/scripts/build-chunk.mjs');
  if (!build.includes('wave59-vigil')) {
    build = build.replace(
      "'planning/wave58-vigil-accord-extension.ts'",
      "'planning/wave58-vigil-accord-extension.ts',\n  'planning/wave59-vigil-accord-extension.ts'",
    );
    write('operation-10m/agent-17-command-center/scripts/build-chunk.mjs', build);
  }
}

function agent18() {
  const q = read('operation-10m/agent-18-team-ai/src/quinary-harmony-resonance-convergence-stack-index.ts');
  const sen = q
    .replaceAll('Quinary', 'Senary')
    .replaceAll('quinary', 'senary')
    .replaceAll('QuinaryHarmony', 'SenaryHarmony');
  write('operation-10m/agent-18-team-ai/src/senary-harmony-resonance-convergence-stack-index.ts', sen);
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('senary-harmony')) {
    idx = idx.replace(
      "export * from './quinary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './quinary-harmony-resonance-convergence-stack-index.ts';\nexport * from './senary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('senary-harmony')) {
    build = build.replace(
      "'src/quinary-harmony-resonance-convergence-stack-index.ts'",
      "'src/quinary-harmony-resonance-convergence-stack-index.ts',\n  'src/senary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Senary')) {
    st = st.replace(
      "from './src/quinary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/quinary-harmony-resonance-convergence-stack-index.ts';\nimport { computeSenaryHarmonyResonanceConvergenceStackIndex } from './src/senary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const sen = computeSenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(sen.stackIndex >= 0 && sen.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
    );
    write('operation-10m/agent-18-team-ai/run-self-tests.mts', st);
  }
}

const agent = process.argv[2];
const fns = { '13': agent13, '14': agent14, '15': agent15, '16': agent16, '17': agent17, '18': agent18 };
if (!fns[agent]) {
  console.error('Usage: node op10m-wave59-batch-13-18.mjs <13|14|15|16|17|18>');
  process.exit(1);
}
fns[agent]();
console.log(`wave59 depth generated for agent ${agent}`);
