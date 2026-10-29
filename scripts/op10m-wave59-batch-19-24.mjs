#!/usr/bin/env node
/**
 * Local batch coordinator: O10-263 wave 59 / round 59 for agents 19–24.
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '4182618c60ef4f19fc7d6911ee33123124fa6a23';
const FEAT_SUBJ =
  'feat(op10m): O10-263 · wave 59 · round 59 — scale depth, origin gate latch';

const AGENTS = [
  {
    n: 19,
    branch: 'op10m/agent-19-ai-memory',
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave59.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave58.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round59.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round58.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave59.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave58.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave59.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave58.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave59.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave58.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave59.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave58.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen58To59(src) {
  return src
    .replaceAll('gen-wave-round58', 'gen-wave-round59')
    .replaceAll('gen-wave58', 'gen-wave59')
    .replaceAll('WaveRound58', 'WaveRound59')
    .replaceAll('wave-round58-', 'wave-round59-')
    .replaceAll('Round58', 'Round59')
    .replaceAll('round58', 'round59')
    .replaceAll('WAVE58', 'WAVE59')
    .replaceAll('Wave58', 'Wave59')
    .replaceAll('wave58', 'wave59')
    .replaceAll('wave 58', 'wave 59')
    .replaceAll('wave-58', 'wave-59')
    .replaceAll('Wave 58', 'Wave 59')
    .replaceAll('Round 58', 'Round 59')
    .replaceAll('round 58', 'round 59')
    .replaceAll('O10-260', 'O10-263')
    .replaceAll('O10-261', 'O10-263')
    .replaceAll('feb7e524', '4182618c')
    .replaceAll('3_139_519', '3_166_371')
    .replaceAll('3_112_667', '3_139_519')
    .replaceAll('2.50.0', '2.51.0')
    .replaceAll('2.49.0', '2.50.0');
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
  fs.writeFileSync(genPath, bumpGen58To59(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-263/i) && ok(/wave 59/i) && ok(/round 59/i);
}

function processAgent(agent) {
  console.log(`\n=== Agent ${agent.n} ${agent.branch} ===`);
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  if (gatePass(agent.branch)) {
    console.log('  already PASS on origin — skip');
    return { agent: agent.n, status: 'skip', tip: sh(`git rev-parse origin/${agent.branch}`).slice(0, 8) };
  }
  sh(`git fetch origin ${agent.branch}:${agent.branch}`);
  sh(`git checkout -B w59-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    const merge = spawnSync(
      'git',
      ['merge', BASE, '-m', `merge(op10m): integrate O10-261 baseline 4182618c for wave 59`],
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-263 · wave 59 · round 59 Agent ${agent.n} bundle chunk`)}`,
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
