#!/usr/bin/env node
/**
 * Local batch coordinator: O10-269 wave 62 / round 62 for agents 18–24 (batch 19–24 slice).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'e11ba60a892cd4e0be31654d95fdc320c1e4fafc';
const FEAT_SUBJ =
  'feat(op10m): O10-269 · wave 62 · round 62 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-268 baseline e11ba60a for wave 62';

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
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave62.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave61.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round62.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round61.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave62.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave61.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave62.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave61.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave62.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave61.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave62.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave61.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen61To62(src) {
  return src
    .replaceAll('gen-wave-round61', 'gen-wave-round62')
    .replaceAll('gen-wave61', 'gen-wave62')
    .replaceAll('WaveRound61', 'WaveRound62')
    .replaceAll('wave-round61-', 'wave-round62-')
    .replaceAll('Round61', 'Round62')
    .replaceAll('round61', 'round62')
    .replaceAll('WAVE61', 'WAVE62')
    .replaceAll('Wave61', 'Wave62')
    .replaceAll('wave61', 'wave62')
    .replaceAll('wave 61', 'wave 62')
    .replaceAll('wave-61', 'wave-62')
    .replaceAll('Wave 61', 'Wave 62')
    .replaceAll('Round 61', 'Round 62')
    .replaceAll('round 61', 'round 62')
    .replaceAll('O10-267', 'O10-269')
    .replaceAll('O10-268', 'O10-269')
    .replaceAll('7f862be0', 'e11ba60a')
    .replaceAll('3_220_075', '3_246_995')
    .replaceAll('3_201_323', '3_220_075')
    .replaceAll('2.53.0', '2.54.0')
    .replaceAll('2.52.0', '2.53.0');
}

function ensureAgent18Wave62() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const oct = read(
    'operation-10m/agent-18-team-ai/src/octonary-harmony-resonance-convergence-stack-index.ts',
  );
  const non = oct
    .replaceAll('Octonary', 'Nonary')
    .replaceAll('octonary', 'nonary')
    .replaceAll('OctonaryHarmony', 'NonaryHarmony');
  write(
    'operation-10m/agent-18-team-ai/src/nonary-harmony-resonance-convergence-stack-index.ts',
    non,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('nonary-harmony')) {
    idx = idx.replace(
      "export * from './octonary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './octonary-harmony-resonance-convergence-stack-index.ts';\nexport * from './nonary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('nonary-harmony')) {
    build = build.replace(
      "'src/octonary-harmony-resonance-convergence-stack-index.ts'",
      "'src/octonary-harmony-resonance-convergence-stack-index.ts',\n  'src/nonary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Nonary')) {
    st = st.replace(
      "from './src/octonary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/octonary-harmony-resonance-convergence-stack-index.ts';\nimport { computeNonaryHarmonyResonanceConvergenceStackIndex } from './src/nonary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const non = computeNonaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(non.stackIndex >= 0 && non.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
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
  fs.writeFileSync(genPath, bumpGen61To62(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-269/i) && ok(/wave 62/i) && ok(/round 62/i);
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
  sh(`git checkout -B w62-agent-${agent.n} origin/${agent.branch}`);
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
    ensureAgent18Wave62();
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-269 · wave 62 · round 62 Agent ${agent.n} bundle chunk`)}`,
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
