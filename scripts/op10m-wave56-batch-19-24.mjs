#!/usr/bin/env node
/**
 * Local batch coordinator: O10-254 wave 56 / round 56 for agents 19–24.
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '8e2366bb438a75b184f0fe47cc2b0247a32059cb';
const FEAT_SUBJ =
  'feat(op10m): O10-254 · wave 56 · round 56 — scale depth, origin gate latch';

const AGENTS = [
  {
    n: 19,
    branch: 'op10m/agent-19-ai-memory',
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave56.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave55.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round56.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round55.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave56.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave55.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave56.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave55.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave56.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave55.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave56.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave55.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen55To56(src) {
  return src
    .replaceAll('gen-wave-round55', 'gen-wave-round56')
    .replaceAll('gen-wave55', 'gen-wave56')
    .replaceAll('WaveRound55', 'WaveRound56')
    .replaceAll('wave-round55-', 'wave-round56-')
    .replaceAll('Round55', 'Round56')
    .replaceAll('round55', 'round56')
    .replaceAll('WAVE55', 'WAVE56')
    .replaceAll('Wave55', 'Wave56')
    .replaceAll('wave55', 'wave56')
    .replaceAll('wave 55', 'wave 56')
    .replaceAll('wave-55', 'wave-56')
    .replaceAll('Wave 55', 'Wave 56')
    .replaceAll('Round 55', 'Round 56')
    .replaceAll('round 55', 'round 56')
    .replaceAll('O10-247', 'O10-254')
    .replaceAll('O10-248', 'O10-254')
    .replaceAll('c4bbec67', '8e2366bb')
    .replaceAll('3_054_213', '3_084_921')
    .replaceAll('3_022_056', '3_054_213')
    .replaceAll('2.47.0', '2.48.0')
    .replaceAll('2.46.0', '2.47.0');
}

function ensureGen(agent) {
  const genPath = path.join(ROOT, agent.gen);
  if (fs.existsSync(genPath)) return;
  if (agent.n === 19) {
    throw new Error(`missing ${agent.gen} — agent 19 gen-wave56 must exist`);
  }
  const fromPath = path.join(ROOT, agent.genFrom);
  let src;
  if (fs.existsSync(fromPath)) {
    src = fs.readFileSync(fromPath, 'utf8');
  } else {
    src = sh(`git show origin/${agent.branch}:${agent.genFrom}`);
  }
  fs.mkdirSync(path.dirname(genPath), { recursive: true });
  fs.writeFileSync(genPath, bumpGen55To56(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-254/i) && ok(/wave 56/i) && ok(/round 56/i);
}

function processAgent(agent) {
  console.log(`\n=== Agent ${agent.n} ${agent.branch} ===`);
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  if (gatePass(agent.branch)) {
    console.log('  already PASS on origin — skip');
    return { agent: agent.n, status: 'skip', tip: sh(`git rev-parse origin/${agent.branch}`).slice(0, 8) };
  }
  sh(`git fetch origin ${agent.branch}:${agent.branch}`);
  sh(`git checkout -B w56-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    const merge = spawnSync(
      'git',
      ['merge', BASE, '-m', `merge(op10m): integrate O10-248 baseline 8e2366bb for wave 56`],
      { cwd: ROOT, encoding: 'utf8' },
    );
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-254 · wave 56 · round 56 Agent ${agent.n} bundle chunk`)}`,
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
