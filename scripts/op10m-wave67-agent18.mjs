#!/usr/bin/env node
/**
 * O10-283 wave 67 / round 67 — agent 18 scale depth latch (batch 13–18).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '369f39957d4407255eba0634dfa4c11fc9034858';
const FEAT_SUBJ =
  'feat(op10m): O10-283 · wave 67 · round 67 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-280 baseline 369f3995 for wave 67';
const BRANCH = 'op10m/agent-18-team-ai';

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function gatePass() {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${BRANCH}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${BRANCH} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-283/i) && ok(/wave 67/i) && ok(/round 67/i);
}

function ensureAgent18Wave67() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const trePath =
    'operation-10m/agent-18-team-ai/src/tredecenary-harmony-resonance-convergence-stack-index.ts';
  const tre = read(trePath);
  const quat = tre
    .replaceAll('Untredecenary', 'Unquattuordecenary')
    .replaceAll('Tredecenary', 'Quattuordecenary')
    .replaceAll('tredecenary', 'quattuordecenary');
  write(
    'operation-10m/agent-18-team-ai/src/quattuordecenary-harmony-resonance-convergence-stack-index.ts',
    quat,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('quattuordecenary-harmony')) {
    idx = idx.replace(
      "export * from './tredecenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './tredecenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './quattuordecenary-harmony-resonance-convergence-stack-index.ts';\n",
    );
    write('operation-10m/agent-18-team-ai/src/index.ts', idx);
  }
}

function main() {
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  sh(`git fetch origin ${BASE}`);
  if (gatePass()) {
    console.log('already PASS', sh(`git rev-parse origin/${BRANCH}`).slice(0, 8));
    return;
  }
  sh(`git fetch origin ${BRANCH}:${BRANCH}`);
  sh(`git checkout -B w67-agent-18 origin/${BRANCH}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
  } catch {
    const merge = spawnSync('git', ['merge', BASE, '-m', MERGE_MSG], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (merge.status !== 0) {
      console.error(merge.stdout + merge.stderr);
      throw new Error('merge failed agent 18');
    }
  }
  ensureAgent18Wave67();
  sh('git add -A');
  sh(`git commit -m ${JSON.stringify(FEAT_SUBJ)}`);
  const testRun = spawnSync('npm run test:agent18', {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit',
  });
  if (testRun.status !== 0) {
    throw new Error('agent 18 tests failed');
  }
  const st2 = sh('git status --porcelain');
  if (st2) {
    sh(
      `git commit -m ${JSON.stringify(
        'chore(op10m): O10-283 · wave 67 · round 67 Agent 18 bundle chunk',
      )}`,
    );
  }
  sh(`git merge-base --is-ancestor ${BASE} HEAD`) && console.log('MERGE_ANCESTOR_PASS');
  sh(`git push origin HEAD:${BRANCH}`);
  sh(`git fetch origin ${BRANCH}`);
  console.log('ORIGIN_TIP', sh(`git rev-parse origin/${BRANCH}`).slice(0, 8));
  console.log('gate', gatePass() ? 'PASS' : 'FAIL');
  sh(`git log -1 --oneline origin/${BRANCH}`);
}

main();
