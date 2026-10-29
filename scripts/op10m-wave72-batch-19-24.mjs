#!/usr/bin/env node
/**
 * Local batch coordinator: O10-326 wave 72 / round 72 for agents 18–24 (batch 19–24 slice).
 * NO V9.4 · push-first feat before chore bundle · NO O10-327 dry-run.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '926f46b0fd9ef0fbd9b1a4d0b41a91c2d21132f9';
const FEAT_SUBJ =
  'feat(op10m): O10-326 · wave 72 · round 72 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-318 baseline 926f46b0 for wave 72';

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
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave72.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave71.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round72.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round71.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave72.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave71.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave72.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave71.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave72.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave71.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave72.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave71.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen71To72(src) {
  return src
    .replaceAll('gen-wave-round71', 'gen-wave-round72')
    .replaceAll('gen-wave71', 'gen-wave72')
    .replaceAll('WaveRound71', 'WaveRound72')
    .replaceAll('wave-round71-', 'wave-round72-')
    .replaceAll('Round71', 'Round72')
    .replaceAll('round71', 'round72')
    .replaceAll('WAVE71', 'WAVE72')
    .replaceAll('Wave71', 'Wave72')
    .replaceAll('wave71', 'wave72')
    .replaceAll('wave 71', 'wave 72')
    .replaceAll('wave-71', 'wave-72')
    .replaceAll('Wave 71', 'Wave 72')
    .replaceAll('Round 71', 'Round 72')
    .replaceAll('round 71', 'round 72')
    .replaceAll('O10-317', 'O10-326')
    .replaceAll('O10-318', 'O10-326')
    .replaceAll('cdc2ae16', '926f46b0')
    .replaceAll('3_488_663', '3_515_515')
    .replaceAll('3_461_811', '3_488_663')
    .replaceAll('2.63.0', '2.64.0')
    .replaceAll('2.62.0', '2.63.0');
}

function ensureAgent18Wave72() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const heptaPath =
    'operation-10m/agent-18-team-ai/src/heptadecenary-harmony-resonance-convergence-stack-index.ts';
  const hepta = read(heptaPath);
  const octa = hepta
    .replaceAll('Unheptadecenary', 'Unoctadecenary')
    .replaceAll('Heptadecenary', 'Octadecenary')
    .replaceAll('heptadecenary', 'octadecenary');
  write(
    'operation-10m/agent-18-team-ai/src/octadecenary-harmony-resonance-convergence-stack-index.ts',
    octa,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('octadecenary-harmony')) {
    idx = idx.replace(
      "export * from './heptadecenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './heptadecenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './octadecenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('octadecenary-harmony')) {
    build = build.replace(
      "'src/heptadecenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/heptadecenary-harmony-resonance-convergence-stack-index.ts',\n  'src/octadecenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Unoctadecenary')) {
    st = st.replace(
      "from './src/heptadecenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/heptadecenary-harmony-resonance-convergence-stack-index.ts';\nimport { computeUnoctadecenaryHarmonyResonanceConvergenceStackIndex } from './src/octadecenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const octa = computeUnoctadecenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(octa.stackIndex >= 0 && octa.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
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
  fs.writeFileSync(genPath, bumpGen71To72(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-326/i) && ok(/wave 72/i) && ok(/round 72/i);
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
  sh('git reset --hard');
  sh('git clean -fd -e node_modules -e scripts/op10m-wave72-batch-19-24.mjs');
  sh(`git checkout -f -B w72-agent-${agent.n} origin/${agent.branch}`);
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
    ensureAgent18Wave72();
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-326 · wave 72 · round 72 Agent ${agent.n} bundle chunk`)}`,
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
