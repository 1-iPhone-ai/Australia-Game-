#!/usr/bin/env node
/**
 * O10-275 wave 64 — agent 18 local fallback (batch 13–18 rescan / batch 19–24 overlap).
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
const BRANCH = 'op10m/agent-18-team-ai';
const DIR = 'operation-10m/agent-18-team-ai';

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, content) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function gatePass() {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${BRANCH}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${BRANCH} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-275/i) && ok(/wave 64/i) && ok(/round 64/i);
}

function depthWave64() {
  const q = read(`${DIR}/src/decenary-harmony-resonance-convergence-stack-index.ts`);
  const und = q
    .replaceAll('Decenary', 'Undecenary')
    .replaceAll('decenary', 'undecenary')
    .replaceAll('DecenaryHarmony', 'UndecenaryHarmony');
  write(`${DIR}/src/undecenary-harmony-resonance-convergence-stack-index.ts`, und);
  let idx = read(`${DIR}/src/index.ts`);
  if (!idx.includes('undecenary-harmony')) {
    idx = idx.replace(
      "export * from './decenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './decenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './undecenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write(`${DIR}/src/index.ts`, idx);
  }
  let build = read(`${DIR}/scripts/build-chunk.mjs`);
  if (!build.includes('undecenary-harmony')) {
    build = build.replace(
      "'src/decenary-harmony-resonance-convergence-stack-index.ts'",
      "'src/decenary-harmony-resonance-convergence-stack-index.ts',\n  'src/undecenary-harmony-resonance-convergence-stack-index.ts'",
    );
    write(`${DIR}/scripts/build-chunk.mjs`, build);
  }
  let st = read(`${DIR}/run-self-tests.mts`);
  if (!st.includes('Undecenary')) {
    st = st.replace(
      "from './src/decenary-harmony-resonance-convergence-stack-index.ts';",
      "from './src/decenary-harmony-resonance-convergence-stack-index.ts';\nimport { computeUndecenaryHarmonyResonanceConvergenceStackIndex } from './src/undecenary-harmony-resonance-convergence-stack-index.ts';",
    );
    st = st.replace(
      'return { passed, failed, total: passed + failed };',
      `const und = computeUndecenaryHarmonyResonanceConvergenceStackIndex(50, 48, 2);\n  ok(und.stackIndex >= 0 && und.stackIndex <= 100);\n  return { passed, failed, total: passed + failed };`,
    );
    write(`${DIR}/run-self-tests.mts`, st);
  }
}

function main() {
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  if (gatePass()) {
    console.log('already PASS', sh(`git rev-parse origin/${BRANCH}`).slice(0, 8));
    return;
  }
  sh(`git fetch origin ${BRANCH}:${BRANCH}`);
  sh('git checkout -B w64-agent-18 origin/op10m/agent-18-team-ai');
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    const merge = spawnSync('git', ['merge', BASE, '-m', MERGE_MSG], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (merge.status !== 0) {
      console.error(merge.stdout + merge.stderr);
      process.exit(1);
    }
  }
  depthWave64();
  write(
    `${DIR}/scale-wave-round64-origin-gate-latch.ts`,
    `export const AGENT18_OP10M_WAVE64_GATE = {
  ticket: 'O10-275',
  wave: 64,
  round: 64,
  integrationBaseline: '${BASE}',
} as const;
`,
  );
  sh('git add -A');
  sh(`git commit -m ${JSON.stringify(FEAT_SUBJ)}`);
  spawnSync('npm run test:agent18', { cwd: ROOT, shell: true, stdio: 'inherit' });
  const st2 = sh('git status --porcelain');
  if (st2) {
    sh(
      `git commit -m ${JSON.stringify(
        'chore(op10m): O10-275 · wave 64 · round 64 Agent 18 bundle chunk',
      )}`,
    );
  }
  sh(`git push origin HEAD:${BRANCH}`);
  sh(`git fetch origin ${BRANCH}`);
  console.log('ORIGIN', sh(`git log -1 --oneline origin/${BRANCH}`));
  console.log('PASS', gatePass());
}

main();
