#!/usr/bin/env node
/**
 * Batch coordinator: O10-343 wave 74 / round 74 for agents 13–17.
 * NO V9.4 · push-first feat before chore bundle.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '72a7aee640c9981cae6d846e21def1eaea33c35a';
const FEAT_SUBJ = 'feat(op10m): O10-343 · wave 74 · round 74';
const MERGE_MSG =
  'merge(op10m): integrate O10-336 baseline 72a7aee6 for wave 74';
const ROUND = 73;
const TICKET = 'O10-343';

const AGENTS = [
  {
    n: 13,
    branch: 'op10m/agent-13-energy-environment',
    dir: 'operation-10m/agent-13-energy',
    constName: 'AGENT13_OP10M_WAVE74_GATE',
    test: 'npm run test:agent-13',
  },
  {
    n: 14,
    branch: 'op10m/agent-14-housing-wellbeing',
    dir: 'operation-10m/agent-14-housing',
    constName: 'AGENT14_OP10M_WAVE74_GATE',
    test: 'npm run test:agent-14-housing',
  },
  {
    n: 15,
    branch: 'op10m/agent-15-trade',
    dir: 'operation-10m/agent-15-trade',
    constName: 'AGENT15_OP10M_WAVE74_GATE',
    test: 'npm run test:agent15',
  },
  {
    n: 16,
    branch: 'op10m/agent-16-guardian',
    dir: 'operation-10m/agent-16-guardian',
    constName: 'AGENT16_OP10M_WAVE74_GATE',
    test: 'npm run test:agent16',
  },
  {
    n: 17,
    branch: 'op10m/agent-17-command-center',
    dir: 'operation-10m/agent-17-command-center',
    constName: 'AGENT17_OP10M_WAVE74_GATE',
    test: 'npm run test:agent17',
  },
];

const ONLY = process.env.OP10M_AGENTS
  ? new Set(process.env.OP10M_AGENTS.split(',').map((s) => Number(s.trim())))
  : null;

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function writeLatch(agent) {
  const latchRel = `${agent.dir}/scale-wave-round${ROUND}-origin-gate-latch.ts`;
  const mdRel = `${agent.dir}/agent-${agent.n}-scale-wave-round${ROUND}.md`;
  const latch = `export const ${agent.constName} = {
  ticket: '${TICKET}',
  wave: ${ROUND},
  round: ${ROUND},
  integrationBaseline: '${BASE}',
} as const;
`;
  const md = `# Agent ${agent.n} scale wave — round ${ROUND} (${TICKET})

| Item | Value |
| --- | --- |
| Branch | \`${agent.branch}\` |
| Integration merge | **\`${BASE}\`** |
| Gate subject | \`${FEAT_SUBJ}\` |
| Latch | \`scale-wave-round${ROUND}-origin-gate-latch.ts\` |

Policy: NO V9.4 · NO promote-tranche · NO PR triage.
`;
  for (const [rel, content] of [
    [latchRel, latch],
    [mdRel, md],
  ]) {
    const p = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  }
}

function gatePass(branch) {
  try {
    sh(`git merge-base --is-ancestor ${BASE} origin/${branch}`);
  } catch {
    return false;
  }
  const subs = sh(`git log origin/${branch} -8 --format=%s`).split('\n');
  const ok = (re) => subs.some((s) => re.test(s));
  return ok(/O10-343/i) && ok(/wave 74/i) && ok(/round 74/i);
}

function processAgent(agent) {
  console.log(`\n======== AGENT ${agent.n} ========`);
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  sh(`git fetch origin ${BASE}`);
  if (gatePass(agent.branch)) {
    const tip = sh(`git rev-parse origin/${agent.branch}`).slice(0, 8);
    console.log(`already PASS origin/${agent.branch} @ ${tip}`);
    return { agent: agent.n, status: 'skip', tip };
  }
  sh(`git fetch origin ${agent.branch}:${agent.branch}`);
  sh(`git checkout -B w74-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge-base --is-ancestor ${BASE} HEAD`);
    console.log('merge baseline already present');
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
  const mergeSha = sh('git rev-parse HEAD').slice(0, 8);
  writeLatch(agent);
  sh('git add -A');
  sh(`git commit -m ${JSON.stringify(FEAT_SUBJ)}`);
  const featSha = sh('git rev-parse HEAD').slice(0, 8);
  console.log(`MERGE=${mergeSha} FEAT=${featSha}`);
  const testRun = spawnSync(agent.test, { cwd: ROOT, shell: true, stdio: 'inherit' });
  if (testRun.status !== 0) {
    throw new Error(`tests failed agent ${agent.n}`);
  }
  const st2 = sh('git status --porcelain');
  if (st2) {
    sh(
      `git commit -m ${JSON.stringify(
        `chore(op10m): O10-343 · wave 74 · round 74 Agent ${agent.n} bundle chunk`,
      )}`,
    );
  }
  sh(`git merge-base --is-ancestor ${BASE} HEAD`) && console.log('MERGE_ANCESTOR_PASS');
  sh(`git push origin HEAD:${agent.branch}`);
  sh(`git fetch origin ${agent.branch}`);
  const tip = sh(`git rev-parse origin/${agent.branch}`).slice(0, 8);
  const pass = gatePass(agent.branch);
  console.log(`ORIGIN_TIP=${tip}`);
  sh(`git log -1 --oneline origin/${agent.branch}`);
  return { agent: agent.n, status: pass ? 'pass' : 'fail', tip, feat: featSha, merge: mergeSha };
}

function main() {
  sh('git fetch origin "refs/heads/op10m/*:refs/remotes/origin/op10m/*"');
  sh(`git fetch origin ${BASE}`);
  if (!fs.existsSync(path.join(ROOT, 'node_modules'))) {
    console.log('npm install (missing node_modules)');
    spawnSync('npm', ['install'], { cwd: ROOT, stdio: 'inherit' });
  }
  const results = [];
  for (const a of AGENTS) {
    if (ONLY && !ONLY.has(a.n)) continue;
    try {
      results.push(processAgent(a));
    } catch (e) {
      console.error(e);
      results.push({ agent: a.n, status: 'error', error: e.message });
      break;
    }
  }
  console.log('\nSUMMARY', JSON.stringify(results, null, 2));
}

main();
