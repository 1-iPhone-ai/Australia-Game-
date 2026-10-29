#!/usr/bin/env node
/**
 * O10-343 wave 74 — latch agents 01–04, 06 (batch coordinator).
 * Policy: merge 72a7aee6 then feat gate subject; fetch before each push.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE = '72a7aee640c9981cae6d846e21def1eaea33c35a';
const MERGE_MSG = 'merge(op10m): integrate O10-336 baseline 72a7aee6 for wave 74';
const FEAT_MSG = 'feat(op10m): O10-343 · wave 74 · round 74';

const AGENTS = [
  {
    n: '01',
    branch: 'op10m/agent-01-strategic-gameplay',
    dir: 'operation-10m/agent-01-strategic-gameplay',
    constPrefix: 'AGENT01',
    branchLabel: 'op10m/agent-01-strategic-gameplay',
  },
  {
    n: '02',
    branch: 'op10m/agent-02-turns-time',
    dir: 'operation-10m/agent-02-turns-time',
    constPrefix: 'AGENT02',
    branchLabel: 'op10m/agent-02-turns-time',
  },
  {
    n: '03',
    branch: 'op10m/agent-03-research-tech',
    dir: 'operation-10m/agent-03-research-tech',
    constPrefix: 'AGENT03',
    branchLabel: 'op10m/agent-03-research-tech',
  },
  {
    n: '04',
    branch: 'op10m/agent-04-modes-scenarios',
    dir: 'operation-10m/agent-04-modes-scenarios',
    constPrefix: 'AGENT04',
    branchLabel: 'op10m/agent-04-modes-scenarios',
  },
  {
    n: '06',
    branch: 'op10m/agent-06-macroeconomy',
    dir: 'operation-10m/agent-06-macroeconomy',
    constPrefix: 'AGENT06',
    branchLabel: 'op10m/agent-06-macroeconomy',
  },
];

const repoRoot = path.resolve(import.meta.dirname, '..');

function sh(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: opts.quiet ? 'pipe' : 'inherit',
    ...opts,
  });
}

function fetchOp10m() {
  sh("git fetch origin 'refs/heads/op10m/*:refs/remotes/origin/op10m/*'");
}

function latchFiles(agent) {
  const latchPath = path.join(agent.dir, 'scale-wave-round74-origin-gate-latch.ts');
  const mdPath = path.join(agent.dir, `agent-${agent.n}-scale-wave-round74.md`);
  const latch = `export const ${agent.constPrefix}_OP10M_WAVE74_GATE = {
  ticket: 'O10-343',
  wave: 73,
  round: 73,
  integrationBaseline: '${BASE}',
} as const;
`;
  const md = `# Agent ${agent.n} scale wave — round 74 (O10-343)

| Item | Value |
| --- | --- |
| Branch | \`${agent.branchLabel}\` |
| Integration merge | **\`${BASE}\`** |
| Gate subject | \`${FEAT_MSG}\` |
| Latch | \`scale-wave-round74-origin-gate-latch.ts\` |

Policy: NO V9.4 · NO promote-tranche · NO PR triage.
`;
  fs.mkdirSync(path.join(repoRoot, agent.dir), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, latchPath), latch);
  fs.writeFileSync(path.join(repoRoot, mdPath), md);
}

const filter = process.env.OP10M_AGENTS?.split(',').map((s) => s.trim()) ?? null;
const agents = filter ? AGENTS.filter((a) => filter.includes(a.n)) : AGENTS;

const results = [];

for (const agent of agents) {
  console.log(`\n======== Agent ${agent.n} ========`);
  fetchOp10m();
  sh(`git checkout -B latch-agent-${agent.n} origin/${agent.branch}`);
  try {
    sh(`git merge ${BASE} -m "${MERGE_MSG}" --no-edit`);
  } catch {
    if (sh('git rev-parse -q --verify MERGE_HEAD', { quiet: true }).trim()) {
      sh('git merge --abort', { quiet: true });
    }
    throw new Error(`merge failed for agent ${agent.n}`);
  }
  const mergeSha = sh('git rev-parse HEAD', { quiet: true }).trim();
  latchFiles(agent);
  sh('git add -A');
  sh(`git commit -m "${FEAT_MSG}"`);
  const featSha = sh('git rev-parse HEAD', { quiet: true }).trim();
  fetchOp10m();
  sh(`git push origin HEAD:${agent.branch}`);
  const tip = sh(`git rev-parse origin/${agent.branch}`, { quiet: true }).trim();
  const mergeOk = sh(`git merge-base --is-ancestor ${BASE} origin/${agent.branch} && echo yes || echo no`, {
    quiet: true,
  }).trim();
  results.push({ agent: agent.n, branch: agent.branch, mergeSha, featSha, tip, mergeOk });
}

console.log('\n======== SUMMARY ========');
console.log(JSON.stringify(results, null, 2));
