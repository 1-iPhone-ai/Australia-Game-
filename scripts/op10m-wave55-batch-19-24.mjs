#!/usr/bin/env node
/**
 * Local batch coordinator: O10-247 wave 55 / round 55 for agents 19–24.
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'c4bbec67';
const FEAT_SUBJ =
  'feat(op10m): O10-247 · wave 55 · round 55 — scale depth, origin gate latch';

const AGENTS = [
  {
    n: 19,
    branch: 'op10m/agent-19-ai-memory',
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave55.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave54.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round55.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round54.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave55.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave54.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave55.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave54.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave55.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave54.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave55.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave54.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen54To55(src) {
  let s = src
    .replaceAll('gen-wave-round54', 'gen-wave-round55')
    .replaceAll('gen-wave54', 'gen-wave55')
    .replaceAll('WaveRound54', 'WaveRound55')
    .replaceAll('wave-round54-', 'wave-round55-')
    .replaceAll('Round54', 'Round55')
    .replaceAll('round54', 'round55')
    .replaceAll('WAVE54', 'WAVE55')
    .replaceAll('Wave54', 'Wave55')
    .replaceAll('wave54', 'wave55')
    .replaceAll('wave 54', 'wave 55')
    .replaceAll('wave-54', 'wave-55')
    .replaceAll('Wave 54', 'Wave 55')
    .replaceAll('Round 54', 'Round 55')
    .replaceAll('round 54', 'round 55')
    .replaceAll('O10-240', 'O10-247')
    .replaceAll('O10-241', 'O10-247')
    .replaceAll('5bd043ad', 'c4bbec67')
    .replaceAll('3_022_056', '3_054_213')
    .replaceAll('2_979_928', '3_022_056')
    .replaceAll('wave53', 'wave54')
    .replaceAll('wave54', 'wave55')
    .replaceAll('Wave53', 'Wave54')
    .replaceAll('Wave54', 'Wave55')
    .replaceAll('round53', 'round54')
    .replaceAll('round54', 'round55')
    .replaceAll('Round53', 'Round54')
    .replaceAll('Round54', 'Round55')
    .replaceAll('O10-237', 'O10-240')
    .replaceAll('O10-240', 'O10-247');
  return s;
}

function ensureGen(agent) {
  const genPath = path.join(ROOT, agent.gen);
  if (fs.existsSync(genPath)) return;
  if (agent.n === 19 && fs.existsSync('/tmp/gen-wave55-agent19.mjs')) {
    fs.mkdirSync(path.dirname(genPath), { recursive: true });
    fs.writeFileSync(genPath, fs.readFileSync('/tmp/gen-wave55-agent19.mjs', 'utf8'));
    return;
  }
  if (agent.n === 21 && fs.existsSync('/tmp/gen-wave55-agent21.mjs')) {
    fs.mkdirSync(path.dirname(genPath), { recursive: true });
    fs.writeFileSync(genPath, fs.readFileSync('/tmp/gen-wave55-agent21.mjs', 'utf8'));
    return;
  }
  if (agent.n === 19 || agent.n === 21) {
    throw new Error(`missing ${agent.gen} — add manually before batch`);
  }
  const fromPath = path.join(ROOT, agent.genFrom);
  let src;
  if (fs.existsSync(fromPath)) {
    src = fs.readFileSync(fromPath, 'utf8');
  } else {
    src = sh(`git show origin/${agent.branch}:${agent.genFrom}`);
  }
  const out = bumpGen54To55(src);
  fs.mkdirSync(path.dirname(genPath), { recursive: true });
  fs.writeFileSync(genPath, out);
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-247/i) && ok(/wave 55/i) && ok(/round 55/i);
}

function processAgent(agent) {
  console.log(`\n=== Agent ${agent.n} ${agent.branch} ===`);
  if (gatePass(agent.branch)) {
    console.log('  already PASS on origin — skip');
    return { agent: agent.n, status: 'skip', tip: sh(`git rev-parse origin/${agent.branch}`).slice(0, 8) };
  }
  sh(`git fetch origin ${agent.branch}:${agent.branch}`);
  sh(`git checkout -B w55-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    const merge = spawnSync('git', ['merge', BASE, '-m', `merge(op10m): integrate O10-241 baseline ${BASE} for wave 55`], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (merge.status !== 0) {
      console.error(merge.stdout + merge.stderr);
      throw new Error(`merge failed agent ${agent.n}`);
    }
  }
  ensureGen(agent);
  sh(`node ${agent.gen}`);
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-247 · wave 55 · round 55 Agent ${agent.n} bundle chunk`)}`,
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
