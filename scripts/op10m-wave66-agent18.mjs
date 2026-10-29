#!/usr/bin/env node
/**
 * O10-279 wave 66 / round 66 — agent 18 scale depth latch (batch 13–18).
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'dc433dc222d9fc5442008b3ea6e06348a80fdf00';
const FEAT_SUBJ =
  'feat(op10m): O10-279 · wave 66 · round 66 — scale depth, origin gate latch';
const MERGE_MSG =
  'merge(op10m): integrate O10-278 baseline dc433dc2 for wave 66';
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
  return ok(/O10-279/i) && ok(/wave 66/i) && ok(/round 66/i);
}

function ensureAgent18Wave66() {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, content) => {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };
  const duoPath =
    'operation-10m/agent-18-team-ai/src/duodenary-harmony-resonance-convergence-stack-index.ts';
  const duo = read(duoPath);
  const tre = duo
    .replaceAll('Unduodenary', 'Untredecenary')
    .replaceAll('Duodenary', 'Tredecenary')
    .replaceAll('duodenary', 'tredecenary');
  write(
    'operation-10m/agent-18-team-ai/src/tredecenary-harmony-resonance-convergence-stack-index.ts',
    tre,
  );
  let idx = read('operation-10m/agent-18-team-ai/src/index.ts');
  if (!idx.includes('tredecenary-harmony')) {
    idx = idx.replace(
      "export * from './duodenary-harmony-resonance-convergence-stack-index.ts';\n",
      "export * from './duodenary-harmony-resonance-convergence-stack-index.ts';\nexport * from './tredecenary-harmony-resonance-convergence-stack-index.ts';\n",
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
  sh(`git checkout -B w66-agent-18 origin/${BRANCH}`);
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
  ensureAgent18Wave66();
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
        'chore(op10m): O10-279 · wave 66 · round 66 Agent 18 bundle chunk',
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
