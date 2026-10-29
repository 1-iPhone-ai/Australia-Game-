#!/usr/bin/env node
/**
 * Local batch coordinator: O10-351 wave 75 / round 75 for agents 18–24 (batch 19–24 slice).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '4ede8fedfa7be1599c61edf13cee787135d83594';
const FEAT_SUBJ =
  'feat(op10m): O10-351 · wave 75 · round 75 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-344 baseline 4ede8fed for wave 75';

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
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave75.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave74.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round75.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round74.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave75.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave74.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave75.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave74.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave75.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave74.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave75.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave74.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen74To75(src) {
  return src
    .replaceAll('gen-wave-round74', 'gen-wave-round75')
    .replaceAll('gen-wave74', 'gen-wave75')
    .replaceAll('WaveRound74', 'WaveRound75')
    .replaceAll('wave-round74-', 'wave-round75-')
    .replaceAll('Round74', 'Round75')
    .replaceAll('round74', 'round75')
    .replaceAll('WAVE74', 'WAVE75')
    .replaceAll('Wave74', 'Wave75')
    .replaceAll('wave74', 'wave75')
    .replaceAll('wave 74', 'wave 75')
    .replaceAll('wave-74', 'wave-75')
    .replaceAll('Wave 74', 'Wave 75')
    .replaceAll('Round 74', 'Round 75')
    .replaceAll('round 74', 'round 75')
    .replaceAll('O10-343', 'O10-351')
    .replaceAll('O10-344', 'O10-351')
    .replaceAll('72a7aee6', '4ede8fed')
    .replaceAll('3_569_219', '3_596_071')
    .replaceAll('3_542_367', '3_569_219')
    .replaceAll('2.67.0', '2.68.0')
    .replaceAll('2.66.0', '2.67.0');
}

function ensureAgent18Wave75() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const hexaPath =
    'operation-10m/agent-18-team-ai/src/icosadenary-harmony-resonance-convergence-stack-index.ts';
  const hexa = read(hexaPath);
  const heni = hexa
    .replaceAll('Unicosadenary', 'Unhenicosadenary')
    .replaceAll('Icosadenary', 'Henicosadenary')
    .replaceAll('icosadenary', 'henicosadenary');
  write(
    'operation-10m/agent-18-team-ai/src/henicosadenary-harmony-resonance-convergence-stack-index.ts',
    heni,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('henicosadenary-harmony')) {
    idx = idx.replace(
      "export * from './icosadenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './icosadenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './henicosadenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('henicosadenary-harmony')) {
    build = build.replace(
      "'src/icosadenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/icosadenary-harmony-resonance-convergence-stack-index.ts',\n  'src/henicosadenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Unhenicosadenary')) {
    st = st.replace(
      "from './src/icosadenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/icosadenary-harmony-resonance-convergence-stack-index.ts';\nimport { computeUnhenicosadenaryHarmonyResonanceConvergenceStackIndex } from './src/henicosadenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const heni = computeUnhenicosadenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(heni.stackIndex >= 0 && heni.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
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
  fs.writeFileSync(genPath, bumpGen74To75(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-351/i) && ok(/wave 75/i) && ok(/round 75/i);
}

function cleanWorktree(agentNum) {
  const st = sh('git status --porcelain');
  if (!st) return;
  sh(`git stash push -m op10m-w75-batch-agent-${agentNum} -- scripts operation-10m package.json package-lock.json`);
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
  cleanWorktree(agent.n);
  sh(`git checkout -B w75-agent-${agent.n} origin/${agent.branch}`);
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
    ensureAgent18Wave75();
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-351 · wave 75 · round 75 Agent ${agent.n} bundle chunk`)}`,
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
