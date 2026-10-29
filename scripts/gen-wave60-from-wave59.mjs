#!/usr/bin/env node
import fs from 'node:fs';
let t = fs.readFileSync(new URL('./op10m-wave59-batch-13-18.mjs', import.meta.url), 'utf8');
t = t.replace(/O10-263 wave 59/g, 'O10-265 wave 60');
t = t.replace(/wave-59 depth/g, 'wave-60 depth');
t = t.replace(/wave59 depth/g, 'wave60 depth');
t = t.replace(/op10m-wave59-batch-13-18/g, 'op10m-wave60-batch-13-18');
t = t.replace(/replaceWave59From58/g, 'replaceWave60From59');
t = t.replace(
  /function replaceWave60From59\(text\) \{[\s\S]*?\n\}/,
  `function replaceWave60From59(text) {
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
}`,
);
t = t.replace(
  /function agent13\(\) \{[\s\S]*?\n\}/,
  `function agent13() {
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
      "  'agent25-wave59-projection-handoff-brief.ts',\\n",
      "  'universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts',\\n  'agent25-wave60-projection-handoff-brief.ts',\\n",
    );
    write('operation-10m/agent-13-energy/scripts/bundle-chunk.mjs', bundle);
  }

  let sup = read('operation-10m/agent-13-energy/tests/supplement-tests.mts');
  if (!sup.includes('UniversalSovereign')) {
    sup = sup.replace(
      "} from '../modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts';",
      "} from '../modules/galactic-sovereign-net-zero-export-continuity-cosmic-mesh-orchestration-ledger.ts';\\nimport {\\n  runAgent13UniversalSovereignNetZeroExportContinuityScaleSelfTests,\\n  runAgent13UniversalSovereignNetZeroExportContinuityTurnScenario,\\n  V1014_UNIVERSAL_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_QUANTUM_MESH_TURN_SCENARIOS,\\n} from '../modules/universal-sovereign-net-zero-export-continuity-quantum-mesh-orchestration-ledger.ts';",
    );
    sup = sup.replace(
      "import { runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave59-projection-handoff-brief.ts';",
      "import { runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave59-projection-handoff-brief.ts';\\nimport { runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests } from '../modules/agent25-wave60-projection-handoff-brief.ts';",
    );
    sup = sup.replace(
      '  const wave59Handoff = runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests();\\n  ok(wave59Handoff.failed === 0 && wave59Handoff.passed >= 4);',
      '  const wave59Handoff = runAgent13Agent25Wave59ProjectionHandoffBriefSelfTests();\\n  ok(wave59Handoff.failed === 0 && wave59Handoff.passed >= 4);\\n  const universal = runAgent13UniversalSovereignNetZeroExportContinuityScaleSelfTests();\\n  ok(universal.failed === 0 && universal.passed >= 4);\\n  const universalTurn = runAgent13UniversalSovereignNetZeroExportContinuityTurnScenario(\\n    V1014_UNIVERSAL_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_QUANTUM_MESH_TURN_SCENARIOS[0],\\n  );\\n  ok(universalTurn.passed);\\n  const wave60Handoff = runAgent13Agent25Wave60ProjectionHandoffBriefSelfTests();\\n  ok(wave60Handoff.failed === 0 && wave60Handoff.passed >= 4);',
    );
    write('operation-10m/agent-13-energy/tests/supplement-tests.mts', sup);
  }
}`,
);
t = t.replace(/wave58-gate-trajectory/g, 'WAVE59GT').replace(/wave58-integration-monitor/g, 'WAVE59IM').replace(/agent25-wave58-projection-handoff-brief/g, 'WAVE59BRIEF');
t = t.replace(/WAVE59GT/g, 'wave59-gate-trajectory').replace(/WAVE59IM/g, 'wave59-integration-monitor').replace(/WAVE59BRIEF/g, 'agent25-wave59-projection-handoff-brief');
t = t.replace(/base\.replace\('wave58', 'wave59'\)/g, "base.replace('wave59', 'wave60')");
t = t.replace(/!idx\.includes\('wave59-gate-trajectory'\)/g, "!idx.includes('wave60-gate-trajectory')");
t = t.replace(/wave59-gate-trajectory/g, 'wave60-gate-trajectory');
t = t.replace(/wave59-integration-monitor/g, 'wave60-integration-monitor');
t = t.replace(/agent25-wave59-projection-handoff-brief/g, 'agent25-wave60-projection-handoff-brief');
t = t.replace(/Wave59/g, 'Wave60');
t = t.replace(/wave59/g, 'wave60');
t = t.replace(/shouldProjectWave60/g, 'shouldProjectWave60');
t = t.replace(/o10-260-wave58-sovereign-handoff-depth-stacking/g, 'o10-263-wave59-sovereign-handoff-depth-stacking');
t = t.replace(/o10-263-wave59-sovereign-handoff-depth-stacking/g, 'o10-265-wave60-sovereign-handoff-depth-stacking');
t = t.replace(/monitor-rules-scale-wave-58\.ts/g, 'monitor-rules-scale-wave-59.ts');
t = t.replace(/monitor-rules-scale-wave-59\.ts/g, 'monitor-rules-scale-wave-60.ts');
t = t.replace(/\.replaceAll\('charter', 'covenant'\)/g, ".replaceAll('covenant', 'treaty')");
t = t.replace(/\.replaceAll\('Charter', 'Covenant'\)/g, ".replaceAll('Covenant', 'Treaty')");
t = t.replace(/WAVE_58/g, 'WAVE_59');
t = t.replace(/WAVE_59/g, 'WAVE_60');
t = t.replace(/wave58-vigil-accord-extension/g, 'wave59-vigil-accord-extension');
t = t.replace(/wave59-vigil-accord-extension/g, 'wave60-vigil-accord-extension');
t = t.replace(/buildAgent17Wave58VigilAccordExtension/g, 'buildAgent17Wave59VigilAccordExtension');
t = t.replace(/buildAgent17Wave59VigilAccordExtension/g, 'buildAgent17Wave60VigilAccordExtension');
t = t.replace(/wave58Ext/g, 'wave59Ext');
t = t.replace(/wave59Ext/g, 'wave60Ext');
t = t.replace(/wave59VigilScore/g, 'wave60VigilScore');
t = t.replace(/quinary-harmony-resonance-convergence-stack-index/g, 'senary-harmony-resonance-convergence-stack-index');
t = t.replace(/senary-harmony-resonance-convergence-stack-index/g, 'septenary-harmony-resonance-convergence-stack-index');
t = t.replace(/QuinaryHarmony/g, 'SenaryHarmony');
t = t.replace(/Quinary/g, 'Senary');
t = t.replace(/quinary/g, 'senary');
t = t.replace(/SenaryHarmony/g, 'SeptenaryHarmony');
t = t.replace(/Senary/g, 'Septenary');
t = t.replace(/senary/g, 'septenary');
t = t.replace(/computeSenaryHarmony/g, 'computeSeptenaryHarmony');
fs.writeFileSync(new URL('./op10m-wave60-batch-13-18.mjs', import.meta.url), t);
console.log('generated op10m-wave60-batch-13-18.mjs');
