/**
 * Operation 111 · Agent 103 — static baseline locks for counterfactual / What-If architecture.
 * Fails if integrators remove ownership comments or core exports without updating this contract.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const monolith = path.join(root, '(V9.4) australia-game-with-ai.tsx');

if (!fs.existsSync(monolith)) {
  console.error('[counterfactual-contract] Missing monolith:', monolith);
  process.exit(1);
}

const src = fs.readFileSync(monolith, 'utf8');

/** @type {{ id: string; pattern: RegExp }[]} */
const locks = [
  { id: 'v106_section', pattern: /SECTION 20Y: V10\.6 RESILIENCE, DEPENDENCIES & SYSTEMIC RISK/ },
  {
    id: 'v106_stress_never_live',
    pattern: /Stress tests are What-If: they never touch live state\./,
  },
  {
    id: 'stress_assumption_deterministic',
    pattern: /Deterministic counterfactual on the current structure — no probabilities, no live changes\./,
  },
  { id: 'export_runSystemicStressTest', pattern: /export function runSystemicStressTest\(/ },
  { id: 'export_computeCounterfactualEvaluations', pattern: /export const computeCounterfactualEvaluations\s*=/ },
  { id: 'whatif_timeline_type', pattern: /export interface WhatIfTimeline/ },
  { id: 'persist_ctx_isWhatIf', pattern: /isWhatIf\?: boolean/ },
  { id: 'replay_preset_whatif_lab', pattern: /id: 'whatif_lab'/ },
  { id: 'selftest_registry_v106', pattern: /id: 'v106', label: 'V10\.6 Resilience & Systemic Risk'/ },
  {
    id: 'gi3_strategy_isolated_comment',
    pattern: /Strategy What-If \(isolated; never mutates the live strategy or game state\)/,
  },
];

const failures = [];
for (const lock of locks) {
  if (!lock.pattern.test(src)) {
    failures.push(lock.id);
  }
}

if (failures.length) {
  console.error('[counterfactual-contract] FAILED locks:', failures.join(', '));
  process.exit(1);
}

console.log(`[counterfactual-contract] OK — ${locks.length} baseline anchors verified`);
