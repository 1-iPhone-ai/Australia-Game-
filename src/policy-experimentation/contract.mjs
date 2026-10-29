#!/usr/bin/env node
/**
 * Operation 111 · Agent 102 — static policy experimentation contracts against the V9.4 monolith.
 * Verifies replay what-if, isolated preview, and V10.6 stress-test wiring remain present.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const monolith = join(root, '(V9.4) australia-game-with-ai.tsx');

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function check(name, ok) {
  if (ok) console.log(`OK  ${name}`);
  else fail(name);
}

let src;
try {
  src = readFileSync(monolith, 'utf8');
} catch {
  fail(`missing monolith at ${monolith}`);
  process.exit(1);
}

const mustInclude = [
  ['PersistCtx includes isWhatIf', /interface PersistCtx[^}]*isWhatIf\?: boolean/s],
  ['persistence blocks what-if timelines', /!ctx\.isWhatIf && isPersistenceConsentActive/],
  ['isolated replay silences live comms', /!ctx\.isolatedReplayRuntime/],
  ['REPLAY_STUDIO_PRESETS whatif_lab', /id: 'whatif_lab'[\s\S]*whatIfTimelinesEnabled: true[\s\S]*replayWhatIfBranchingEnabled: true/],
  ['whatIfTimelinesEnabled setting registered', /whatIfTimelinesEnabled:\s*\{\s*key: 'whatIfTimelinesEnabled'/],
  ['createWhatIfTimeline action', /case 'createWhatIfTimeline'/],
  ['buildReplayBranchExperiment exported', /export function buildReplayBranchExperiment\(/],
  ['WhatIfTimeline type exported', /export interface WhatIfTimeline/],
  ['runSystemicStressTest exported', /export function runSystemicStressTest\(/],
  ['compareStressTests exported', /export function compareStressTests\(/],
  ['stress test deterministic assumption', /Deterministic counterfactual on the current structure/],
  ['nationalDevelopmentWhatIfProjects exported', /export function nationalDevelopmentWhatIfProjects\(/],
  ['simulateGI3Alternative exported', /export function simulateGI3Alternative\(/],
  ['simulateTeamStrategyAlternative exported', /export function simulateTeamStrategyAlternative\(/],
  ['V10.6 self-test suite hook', /runV106ResilienceSystemicRiskSelfTests/],
  ['release quick tier includes v106', /id: 'v106'[\s\S]*runV106ResilienceSystemicRiskSelfTests/],
];

for (const [name, re] of mustInclude) {
  check(name, re.test(src));
}

if (process.exitCode) {
  console.error('\nPolicy experimentation contract: FAILED');
  process.exit(process.exitCode);
}
console.log('\nPolicy experimentation contract: PASSED');
