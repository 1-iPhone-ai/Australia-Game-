#!/usr/bin/env node
/**
 * Local batch coordinator: O10-257 wave 57 / round 57 for agents 19–24.
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '93c42b3d82e3700a0f14db0b66522b05bb1d6aec';
const FEAT_SUBJ =
  'feat(op10m): O10-257 · wave 57 · round 57 — scale depth, origin gate latch';

const AGENTS = [
  {
    n: 19,
    branch: 'op10m/agent-19-ai-memory',
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave57.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave56.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round57.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round56.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave57.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave56.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave57.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave56.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave57.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave56.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave57.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave56.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen56To57(src) {
  return src
    .replaceAll('gen-wave-round56', 'gen-wave-round57')
    .replaceAll('gen-wave56', 'gen-wave57')
    .replaceAll('WaveRound56', 'WaveRound57')
    .replaceAll('wave-round56-', 'wave-round57-')
    .replaceAll('Round56', 'Round57')
    .replaceAll('round56', 'round57')
    .replaceAll('WAVE56', 'WAVE57')
    .replaceAll('Wave56', 'Wave57')
    .replaceAll('wave56', 'wave57')
    .replaceAll('wave 56', 'wave 57')
    .replaceAll('wave-56', 'wave-57')
    .replaceAll('Wave 56', 'Wave 57')
    .replaceAll('Round 56', 'Round 57')
    .replaceAll('round 56', 'round 57')
    .replaceAll('O10-254', 'O10-257')
    .replaceAll('O10-255', 'O10-257')
    .replaceAll('8e2366bb', '93c42b3d')
    .replaceAll('3_084_921', '3_112_667')
    .replaceAll('3_054_213', '3_084_921')
    .replaceAll('2.48.0', '2.49.0')
    .replaceAll('2.47.0', '2.48.0');
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
  fs.writeFileSync(genPath, bumpGen56To57(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-257/i) && ok(/wave 57/i) && ok(/round 57/i);
}

function processAgent(agent) {
  console.log(`\n=== Agent ${agent.n} ${agent.branch} ===`);
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  if (gatePass(agent.branch)) {
    console.log('  already PASS on origin — skip');
    return { agent: agent.n, status: 'skip', tip: sh(`git rev-parse origin/${agent.branch}`).slice(0, 8) };
  }
  sh(`git fetch origin ${agent.branch}:${agent.branch}`);
  sh(`git checkout -B w57-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    const merge = spawnSync(
      'git',
      ['merge', BASE, '-m', `merge(op10m): integrate O10-255 baseline 93c42b3d for wave 57`],
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-257 · wave 57 · round 57 Agent ${agent.n} bundle chunk`)}`,
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
