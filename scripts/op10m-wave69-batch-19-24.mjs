#!/usr/bin/env node
/**
 * Local batch coordinator: O10-301 wave 69 / round 69 for agents 18–24 (batch 19–24 slice).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'ef6c062519eb04b37d223c270d042fb8b47114a0';
const FEAT_SUBJ =
  'feat(op10m): O10-301 · wave 69 · round 69 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-293 baseline ef6c0625 for wave 69';

const AGENTS = [
  {
    n: 18,
    branch: 'op10m/agent-18-team-ai',
    kind: 'agent18',
    bundle: 'node operation-10m/agent-18-team-ai/scripts/build-chunk.mjs',
  },
  {
    n: 19,
    branch: 'op10m/agent-19-ai-memory',
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave69.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave68.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round69.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round68.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave69.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave68.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave69.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave68.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave69.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave68.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave69.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave68.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen68To69(src) {
  return src
    .replaceAll('gen-wave-round68', 'gen-wave-round69')
    .replaceAll('gen-wave68', 'gen-wave69')
    .replaceAll('WaveRound68', 'WaveRound69')
    .replaceAll('wave-round68-', 'wave-round69-')
    .replaceAll('Round68', 'Round69')
    .replaceAll('round68', 'round69')
    .replaceAll('WAVE68', 'WAVE69')
    .replaceAll('Wave68', 'Wave69')
    .replaceAll('wave68', 'wave69')
    .replaceAll('wave 68', 'wave 69')
    .replaceAll('wave-68', 'wave-69')
    .replaceAll('Wave 68', 'Wave 69')
    .replaceAll('Round 68', 'Round 69')
    .replaceAll('round 68', 'round 69')
    .replaceAll('O10-292', 'O10-301')
    .replaceAll('O10-293', 'O10-301')
    .replaceAll('cf4d76e7', 'ef6c0625')
    .replaceAll('3_408_107', '3_434_959')
    .replaceAll('3_381_255', '3_408_107')
    .replaceAll('2.60.0', '2.61.0')
    .replaceAll('2.59.0', '2.60.0');
}

function ensureAgent18Wave69() {
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
      "export * from './tetradecenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './tetradecenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './pentadecenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('pentadecenary-harmony')) {
    build = build.replace(
      "'src/tetradecenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/tetradecenary-harmony-resonance-convergence-stack-index.ts',\n  'src/pentadecenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Unpentadecenary')) {
    st = st.replace(
      "from './src/tetradecenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/tetradecenary-harmony-resonance-convergence-stack-index.ts';\nimport { computeUnpentadecenaryHarmonyResonanceConvergenceStackIndex } from './src/pentadecenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const penta = computeUnpentadecenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(penta.stackIndex >= 0 && penta.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
    );
    write('operation-10m/agent-18-team-ai/run-self-tests.mts', st);
  }
}

function ensureGen(agent) {
  const genPath = path.join(ROOT, agent.gen);
  if (fs.existsSync(genPath)) return;
  const fromPath = path.join(ROOT, agent.genFrom);
  let src;
  if (fs.existsSync(fromPath)) {
    src = fs.readFileSync(fromPath, 'utf8');
  } else {
    src = sh(`git show origin/${agent.branch}:${agent.genFrom}`);
  }
  fs.mkdirSync(path.dirname(genPath), { recursive: true });
  fs.writeFileSync(genPath, bumpGen68To69(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-301/i) && ok(/wave 69/i) && ok(/round 69/i);
}

function processAgent(agent) {
  console.log(`\n=== Agent ${agent.n} ${agent.branch} ===`);
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  if (gatePass(agent.branch)) {
    console.log('  already PASS on origin — skip');
    return {
      agent: agent.n,
      status: 'skip',
      tip: sh(`git rev-parse origin/${agent.branch}`).slice(0, 8),
    };
  }
  sh(`git fetch origin ${agent.branch}:${agent.branch}`);
  sh(`git checkout -B w68-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    sh(`git fetch origin ${BASE}`);
    const merge = spawnSync('git', ['merge', BASE, '-m', MERGE_MSG], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (merge.status !== 0) {
      console.error(merge.stdout + merge.stderr);
      throw new Error(`merge failed agent ${agent.n}`);
    }
  }
  if (agent.kind === 'agent18') {
    ensureAgent18Wave69();
  } else {
    ensureGen(agent);
    sh(`node ${agent.gen}`);
  }
  sh(agent.bundle);
  sh('git add -A');
  const st = sh('git status --porcelain');
  if (st) {
    sh(`git commit -m ${JSON.stringify(FEAT_SUBJ)}`);
  }
  sh(agent.bundle);
  const st2 = sh('git status --porcelain');
  if (st2) {
    sh(
      `git commit -m ${JSON.stringify(`chore(op10m): O10-301 · wave 69 · round 69 Agent ${agent.n} bundle chunk`)}`,
    );
  }
  sh(`git push origin HEAD:${agent.branch}`);
  sh(`git fetch origin ${agent.branch}`);
  const tip = sh(`git rev-parse origin/${agent.branch}`).slice(0, 8);
  const pass = gatePass(agent.branch);
  console.log(`  pushed ${tip} gate=${pass ? 'PASS' : 'FAIL'}`);
  return { agent: agent.n, status: pass ? 'pass' : 'fail', tip };
}

function main() {
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  sh(`git fetch origin ${BASE}`);
  const results = [];
  for (const a of AGENTS) {
    if (ONLY && !ONLY.has(a.n)) continue;
    try {
      results.push(processAgent(a));
    } catch (e) {
      console.error(`Agent ${a.n} error:`, e.message);
      results.push({ agent: a.n, status: 'error', error: e.message });
    }
  }
  console.log('\nSummary:', JSON.stringify(results, null, 2));
}

main();
