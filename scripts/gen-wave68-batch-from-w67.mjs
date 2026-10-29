#!/usr/bin/env node
import fs from 'node:fs';

const w67 = fs.readFileSync('/tmp/w67.mjs', 'utf8');
let s = w67;

s = s.replace(/O10-283 wave 67/g, 'O10-292 wave 68');
s = s.replace(/round 67/g, 'round 68');
s = s.replace(/wave 67/g, 'wave 68');
s = s.replace(
  /369f39957d4407255eba0634dfa4c11fc9034858/g,
  'cf4d76e7bf111227486f059c1b416ad5c575e923',
);
s = s.replace(
  'merge(op10m): integrate O10-280 baseline 369f3995 for wave 67',
  'merge(op10m): integrate O10-284 baseline cf4d76e7 for wave 68',
);
s = s.replace(/O10-283/g, 'O10-292');
s = s.replace(/369f3995/g, 'cf4d76e7');
s = s.replace(/3_381_255/g, '3_408_107');
s = s.replace(/3_354_403/g, '3_381_255');
s = s.replace(/gen-wave67/g, 'gen-wave68');
s = s.replace(/gen-wave66/g, 'gen-wave67');
s = s.replace(/gen-wave-round67/g, 'gen-wave-round68');
s = s.replace(/gen-wave-round66/g, 'gen-wave-round67');
s = s.replace(/WaveRound67/g, 'WaveRound68');
s = s.replace(/WaveRound66/g, 'WaveRound67');
s = s.replace(/wave-round67-/g, 'wave-round68-');
s = s.replace(/wave-round66-/g, 'wave-round67-');
s = s.replace(/Round67/g, 'Round68');
s = s.replace(/Round66/g, 'Round67');
s = s.replace(/round67/g, 'round68');
s = s.replace(/round66/g, 'round67');
s = s.replace(/WAVE67/g, 'WAVE68');
s = s.replace(/WAVE66/g, 'WAVE67');
s = s.replace(/Wave67/g, 'Wave68');
s = s.replace(/Wave66/g, 'Wave67');
s = s.replace(/wave67/g, 'wave68');
s = s.replace(/wave66/g, 'wave67');
s = s.replace(/wave-67/g, 'wave-68');
s = s.replace(/wave-66/g, 'wave-67');
s = s.replace(/Wave 67/g, 'Wave 68');
s = s.replace(/Wave 66/g, 'Wave 67');
s = s.replace(/Round 67/g, 'Round 68');
s = s.replace(/Round 66/g, 'Round 67');
s = s.replace(/2\.59\.0/g, '2.60.0');
s = s.replace(/2\.58\.0/g, '2.59.0');
s = s.replace(/bumpGen66To67/g, 'bumpGen67To68');
s = s.replace(/ensureAgent18Wave67/g, 'ensureAgent18Wave68');
s = s.replace(/w67-agent-/g, 'w68-agent-');
s = s.replace(/op10m-wave67-batch-19-24/g, 'op10m-wave68-batch-19-24');

const ensureAgent18Wave68 = `function ensureAgent18Wave68() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const tetraPath =
    'operation-10m/agent-18-team-ai/src/tetradecenary-harmony-resonance-convergence-stack-index.ts';
  const tetra = read(tetraPath);
  const penta = tetra
    .replaceAll('Untetradecenary', 'Unpentadecenary')
    .replaceAll('Tetradecenary', 'Pentadecenary')
    .replaceAll('tetradecenary', 'pentadecenary');
  write(
    'operation-10m/agent-18-team-ai/src/pentadecenary-harmony-resonance-convergence-stack-index.ts',
    penta,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('pentadecenary-harmony')) {
    idx = idx.replace(
      "export * from './tetradecenary-harmony-resonance-convergence-stack-index.ts';\\n",
      "export * from './tetradecenary-harmony-resonance-convergence-stack-index.ts';\\nexport * from './pentadecenary-harmony-resonance-convergence-stack-index.ts';\\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('pentadecenary-harmony')) {
    build = build.replace(
      "'src/tetradecenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/tetradecenary-harmony-resonance-convergence-stack-index.ts',\\n  'src/pentadecenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Unpentadecenary')) {
    st = st.replace(
      "from './src/tetradecenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/tetradecenary-harmony-resonance-convergence-stack-index.ts';\\nimport { computeUnpentadecenaryHarmonyResonanceConvergenceStackIndex } from './src/pentadecenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      \`const penta = computeUnpentadecenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\\n  ok(penta.stackIndex >= 0 && penta.stackIndex <= 100);\\n  return { passed, failed, total: passed + failed };\`,
    );
    write('operation-10m/agent-18-team-ai/run-self-tests.mts', st);
  }
}

function ensureGen`;

s = s.replace(/function ensureAgent18Wave68\(\) \{[\s\S]*?\}\n\nfunction ensureGen/, ensureAgent18Wave68);

fs.writeFileSync(
  new URL('./op10m-wave68-batch-19-24.mjs', import.meta.url),
  s,
);
console.log('wrote op10m-wave68-batch-19-24.mjs');
