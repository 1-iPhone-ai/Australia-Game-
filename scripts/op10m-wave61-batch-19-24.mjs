#!/usr/bin/env node
/**
 * Local batch coordinator: O10-267 wave 61 / round 61 for agents 18–24 (batch 19–24 slice).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '7f862be03eba92ecc85d27e54e20c72cd3d2d9cd';
const FEAT_SUBJ =
  'feat(op10m): O10-267 · wave 61 · round 61 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-266 baseline 7f862be0 for wave 61';

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
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave61.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave60.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round61.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round60.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave61.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave60.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave61.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave60.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave61.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave60.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave61.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave60.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen60To61(src) {
  return src
    .replaceAll('gen-wave-round60', 'gen-wave-round61')
    .replaceAll('gen-wave60', 'gen-wave61')
    .replaceAll('WaveRound60', 'WaveRound61')
    .replaceAll('wave-round60-', 'wave-round61-')
    .replaceAll('Round60', 'Round61')
    .replaceAll('round60', 'round61')
    .replaceAll('WAVE60', 'WAVE61')
    .replaceAll('Wave60', 'Wave61')
    .replaceAll('wave60', 'wave61')
    .replaceAll('wave 60', 'wave 61')
    .replaceAll('wave-60', 'wave-61')
    .replaceAll('Wave 60', 'Wave 61')
    .replaceAll('Round 60', 'Round 61')
    .replaceAll('round 60', 'round 61')
    .replaceAll('O10-265', 'O10-267')
    .replaceAll('O10-266', 'O10-267')
    .replaceAll('af6c94f0', '7f862be0')
    .replaceAll('3_201_323', '3_220_075')
    .replaceAll('3_166_371', '3_201_323')
    .replaceAll('2.52.0', '2.53.0')
    .replaceAll('2.51.0', '2.52.0');
}

function ensureAgent18Wave61() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const sep = read(
    'operation-10m/agent-18-team-ai/src/septenary-harmony-resonance-convergence-stack-index.ts',
  );
  const oct = sep
    .replaceAll('Septenary', 'Octonary')
    .replaceAll('septenary', 'octonary')
    .replaceAll('SeptenaryHarmony', 'OctonaryHarmony');
  write(
    'operation-10m/agent-18-team-ai/src/octonary-harmony-resonance-convergence-stack-index.ts',
    oct,
  );
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
  fs.writeFileSync(genPath, bumpGen60To61(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-267/i) && ok(/wave 61/i) && ok(/round 61/i);
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
  sh(`git checkout -B w61-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
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
    ensureAgent18Wave61();
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-267 · wave 61 · round 61 Agent ${agent.n} bundle chunk`)}`,
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
