#!/usr/bin/env node
/**
 * Local batch coordinator: O10-275 wave 64 / round 64 for agents 18–24 (batch 19–24 slice).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '308fd6dcb92dcaae055e702d656ee2e03e397925';
const FEAT_SUBJ =
  'feat(op10m): O10-275 · wave 64 · round 64 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-274 baseline 308fd6dc for wave 64';

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
    gen: 'operation-10m/agent-19-ai-memory/scripts/gen-wave64.mjs',
    genFrom: 'operation-10m/agent-19-ai-memory/scripts/gen-wave63.mjs',
    bundle: 'npm run build:agent19-chunk',
  },
  {
    n: 20,
    branch: 'op10m/agent-20-automation',
    gen: 'operation-10m/agent-20-automation/scripts/gen-wave-round64.mjs',
    genFrom: 'operation-10m/agent-20-automation/scripts/gen-wave-round63.mjs',
    bundle: 'node operation-10m/agent-20-automation/scripts/build-chunk.mjs',
  },
  {
    n: 21,
    branch: 'op10m/agent-21-forecasting',
    gen: 'operation-10m/agent-21-forecasting/scripts/gen-wave64.mjs',
    genFrom: 'operation-10m/agent-21-forecasting/scripts/gen-wave63.mjs',
    bundle: 'npm run bundle:agent-21-chunk',
  },
  {
    n: 22,
    branch: 'op10m/agent-22-ui',
    gen: 'operation-10m/agent-22-ui/scripts/gen-wave64.mjs',
    genFrom: 'operation-10m/agent-22-ui/scripts/gen-wave63.mjs',
    bundle: 'node operation-10m/agent-22-ui/scripts/build-chunk.mjs',
  },
  {
    n: 23,
    branch: 'op10m/agent-23-dashboards',
    gen: 'operation-10m/agent-23-dashboards/scripts/gen-wave64.mjs',
    genFrom: 'operation-10m/agent-23-dashboards/scripts/gen-wave63.mjs',
    bundle: 'npm run bundle:agent-23-chunk',
  },
  {
    n: 24,
    branch: 'op10m/agent-24-history-replay',
    gen: 'operation-10m/agent-24-replay/scripts/gen-wave64.mjs',
    genFrom: 'operation-10m/agent-24-replay/scripts/gen-wave63.mjs',
    bundle: 'node operation-10m/agent-24-replay/scripts/build-chunk.mjs',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function bumpGen63To64(src) {
  return src
    .replaceAll('gen-wave-round63', 'gen-wave-round64')
    .replaceAll('gen-wave63', 'gen-wave64')
    .replaceAll('WaveRound63', 'WaveRound64')
    .replaceAll('wave-round63-', 'wave-round64-')
    .replaceAll('Round63', 'Round64')
    .replaceAll('round63', 'round64')
    .replaceAll('WAVE63', 'WAVE64')
    .replaceAll('Wave63', 'Wave64')
    .replaceAll('wave63', 'wave64')
    .replaceAll('wave 63', 'wave 64')
    .replaceAll('wave-63', 'wave-64')
    .replaceAll('Wave 63', 'Wave 64')
    .replaceAll('Round 63', 'Round 64')
    .replaceAll('round 63', 'round 64')
    .replaceAll('O10-273', 'O10-275')
    .replaceAll('O10-274', 'O10-275')
    .replaceAll('2ccfd849', '308fd6dc')
    .replaceAll('3_273_847', '3_300_699')
    .replaceAll('3_246_995', '3_273_847')
    .replaceAll('2.55.0', '2.56.0')
    .replaceAll('2.54.0', '2.55.0');
}

function ensureAgent18Wave64() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const decPath =
    'operation-10m/agent-18-team-ai/src/decenary-harmony-resonance-convergence-stack-index.ts';
  const dec = read(decPath);
  const und = dec
    .replaceAll('Decenary', 'Undecenary')
    .replaceAll('decenary', 'undecenary')
    .replaceAll('DecenaryHarmony', 'UndecenaryHarmony');
  write(
    'operation-10m/agent-18-team-ai/src/undecenary-harmony-resonance-convergence-stack-index.ts',
    und,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('undecenary-harmony')) {
    idx = idx.replace(
      "export * from './decenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './decenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './undecenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
  let build = read('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs');
  if (!build.includes('undecenary-harmony')) {
    build = build.replace(
      "'src/decenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/decenary-harmony-resonance-convergence-stack-index.ts',\n  'src/undecenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write('operation-10m/agent-18-team-ai/scripts/build-chunk.mjs', build);
  }
  let st = read('operation-10m/agent-18-team-ai/run-self-tests.mts');
  if (!st.includes('Undecenary')) {
    st = st.replace(
      "from './src/decenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/decenary-harmony-resonance-convergence-stack-index.ts';\nimport { computeUndecenaryHarmonyResonanceConvergenceStackIndex } from './src/undecenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const und = computeUndecenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(und.stackIndex >= 0 && und.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
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
  fs.writeFileSync(genPath, bumpGen63To64(src));
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-275/i) && ok(/wave 64/i) && ok(/round 64/i);
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
  sh(`git checkout -B w64-agent-${agent.n} origin/${agent.branch}`);
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
    ensureAgent18Wave64();
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
      `git commit -m ${JSON.stringify(`chore(op10m): O10-275 · wave 64 · round 64 Agent ${agent.n} bundle chunk`)}`,
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
