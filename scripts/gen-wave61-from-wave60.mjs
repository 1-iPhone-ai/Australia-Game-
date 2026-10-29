#!/usr/bin/env node
import fs from 'node:fs';
let t = fs.readFileSync(new URL('./op10m-wave60-batch-13-18.mjs', import.meta.url), 'utf8');
t = t.replace(/O10-265 wave 60/g, 'O10-267 wave 61');
t = t.replace(/wave-60 depth/g, 'wave-61 depth');
t = t.replace(/wave60 depth/g, 'wave61 depth');
t = t.replace(/op10m-wave60-batch-13-18/g, 'op10m-wave61-batch-13-18');
t = t.replace(/replaceWave60From59/g, 'replaceWave61From60');
t = t.replace(
  /function replaceWave61From60\(text\) \{[\s\S]*?\n\}/,
  `function replaceWave61From60(text) {
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
}`,
);
t = t.replace(
  /function agent13\(\) \{[\s\S]*?\n\}/,
  `function agent13() {
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
      "  'agent25-wave60-projection-handoff-brief.ts',\\n",
      "  'omniversal-sovereign-net-zero-export-continuity-hyperquantum-mesh-orchestration-ledger.ts',\\n  'agent25-wave61-projection-handoff-brief.ts',\\n",
    );
    write('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs', bundle);
  }

  let sup = read('operation-10m/agent-13-energy/tests/supplement-tests.mts');
  if (!sup.includes('OmniversalSovereign')) {
    sup = sup.replace(
      "} from '../modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts';",
      "} from '../modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts';\\nimport {\\n  runAgent13OmniversalSovereignNetZeroExportContinuityScaleSelfTests,\\n  runAgent13OmniversalSovereignNetZeroExportContinuityTurnScenario,\\n  V1014_OMNIversal_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_HYPERQUANTUM_MESH_TURN_SCENARIOS,\\n} from '../modules/omniversal-sovereign-net-zero-export-continuity-hyperquantum-mesh-orchestration-ledger.ts';",
    );
    sup = sup.replace(
      "import { runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave60-projection-handoff-brief.ts';",
      "import { runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave60-projection-handoff-brief.ts';\\nimport { runAgent13Agent25Wave61ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave61-projection-handoff-brief.ts';",
    );
    sup = sup.replace(
      '  const wave60Handoff = runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests();\\n  ok(wave60Handoff.failed === 0 && wave60Handoff.passed >= 4);',
      '  const wave60Handoff = runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests();\\n  ok(wave60Handoff.failed === 0 && wave60Handoff.passed >= 4);\\n  const omniversal = runAgent13OmniversalSovereignNetZeroExportContinuityScaleSelfTests();\\n  ok(omniversal.failed === 0 && omniversal.passed >= 4);\\n  const omniversalTurn = runAgent13OmniversalSovereignNetZeroExportContinuityTurnScenario(\\n    V1014_OMNIversal_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_HYPERQUANTUM_MESH_TURN_SCENARIOS[0],\\n  );\\n  ok(omniversalTurn.passed);\\n  const wave61Handoff = runAgent13Agent25Wave61ProjectionHandoffBriefSelfTests();\\n  ok(wave61Handoff.failed === 0 && wave61Handoff.passed >= 4);',
    );
    write('operation-10m/agent-13-energy/tests/supplement-tests.mts', sup);
  }
}`,
);
t = t.replace(/wave59-gate-trajectory/g, 'WAVE60GT').replace(/wave59-integration-monitor/g, 'WAVE60IM').replace(/agent25-wave59-projection-handoff-brief/g, 'WAVE60BRIEF');
t = t.replace(/WAVE60GT/g, 'wave60-gate-trajectory').replace(/WAVE60IM/g, 'wave60-integration-monitor').replace(/WAVE60BRIEF/g, 'agent25-wave60-projection-handoff-brief');
t = t.replace(/base\.replace\('wave59', 'wave60'\)/g, "base.replace('wave60', 'wave61')");
t = t.replace(/!idx\.includes\('wave60-gate-trajectory'\)/g, "!idx.includes('wave61-gate-trajectory')");
t = t.replace(/wave60-gate-trajectory/g, 'wave61-gate-trajectory');
t = t.replace(/wave60-integration-monitor/g, 'wave61-integration-monitor');
t = t.replace(/agent25-wave60-projection-handoff-brief/g, 'agent25-wave61-projection-handoff-brief');
t = t.replace(/Wave60/g, 'Wave61');
t = t.replace(/wave60/g, 'wave61');
t = t.replace(/shouldProjectWave61/g, 'shouldProjectWave61');
t = t.replace(/o10-263-wave59-sovereign-handoff-depth-stacking/g, 'o10-265-wave60-sovereign-handoff-depth-stacking');
t = t.replace(/o10-265-wave60-sovereign-handoff-depth-stacking/g, 'o10-267-wave61-sovereign-handoff-depth-stacking');
t = t.replace(/monitor-rules-scale-wave-59\.ts/g, 'monitor-rules-scale-wave-60.ts');
t = t.replace(/monitor-rules-scale-wave-60\.ts/g, 'monitor-rules-scale-wave-61.ts');
t = t.replace(/\.replaceAll\('covenant', 'treaty'\)/g, ".replaceAll('treaty', 'protocol')");
t = t.replace(/\.replaceAll\('Covenant', 'Treaty'\)/g, ".replaceAll('Treaty', 'Protocol')");
t = t.replace(/WAVE_59/g, 'WAVE_60');
t = t.replace(/WAVE_60/g, 'WAVE_61');
t = t.replace(/wave59-vigil-accord-extension/g, 'wave60-vigil-accord-extension');
t = t.replace(/wave60-vigil-accord-extension/g, 'wave61-vigil-accord-extension');
t = t.replace(/buildAgent17Wave59VigilAccordExtension/g, 'buildAgent17Wave60VigilAccordExtension');
t = t.replace(/buildAgent17Wave60VigilAccordExtension/g, 'buildAgent17Wave61VigilAccordExtension');
t = t.replace(/wave59Ext/g, 'wave60Ext');
t = t.replace(/wave60Ext/g, 'wave61Ext');
t = t.replace(/wave60VigilScore/g, 'wave61VigilScore');
t = t.replace(/senary-harmony-resonance-convergence-stack-index/g, 'septenary-harmony-resonance-convergence-stack-index');
t = t.replace(/septenary-harmony-resonance-convergence-stack-index/g, 'octonary-harmony-resonance-convergence-stack-index');
t = t.replace(/SenaryHarmony/g, 'SeptenaryHarmony');
t = t.replace(/SeptenaryHarmony/g, 'OctonaryHarmony');
t = t.replace(/Septenary/g, 'Octonary');
t = t.replace(/septenary/g, 'octonary');
t = t.replace(/computeSeptenaryHarmony/g, 'computeOctonaryHarmony');
fs.writeFileSync(new URL('./op10m-wave61-batch-13-18.mjs', import.meta.url), t);
console.log('generated op10m-wave61-batch-13-18.mjs');
