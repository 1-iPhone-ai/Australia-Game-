/**
 * Operation 111 · Agent 73 — static objectives architecture contracts.
 * Reads `(V9.4) australia-game-with-ai.tsx` without executing the monolith.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const monolithPath = path.join(root, '(V9.4) australia-game-with-ai.tsx');

if (!fs.existsSync(monolithPath)) {
  console.error(`Missing monolith: ${monolithPath}`);
  process.exit(2);
}

const src = fs.readFileSync(monolithPath, 'utf8');
const checks = [];

function assert(name, fn) {
  try {
    fn();
    checks.push({ name, ok: true });
  } catch (err) {
    checks.push({ name, ok: false, detail: err instanceof Error ? err.message : String(err) });
  }
}

function mustInclude(substr, label = substr.slice(0, 60)) {
  if (!src.includes(substr)) throw new Error(`Missing: ${label}`);
}

assert('monolith exports evaluateScenarioObjective', () => {
  mustInclude('export function evaluateScenarioObjective(');
});

assert('monolith exports evaluateScenarioOutcome', () => {
  mustInclude('export function evaluateScenarioOutcome(');
});

assert('monolith exports resolveCurrentObjective', () => {
  mustInclude('export function resolveCurrentObjective(');
});

assert('monolith exports deliverContractObjectives', () => {
  mustInclude('export function deliverContractObjectives(');
});

assert('monolith exports projectGI3CurrentObjective', () => {
  mustInclude('export function projectGI3CurrentObjective(');
});

assert('ObjectiveSourceType includes scenario and campaign', () => {
  mustInclude("export type ObjectiveSourceType =");
  mustInclude("| 'scenario'");
  mustInclude("| 'campaign'");
  mustInclude("| 'contract'");
});

assert('V9.1 contract objectives correctness banner', () => {
  mustInclude('V9.1 correctness: contract objectives progress only through real deliverables');
});

assert('PRESET_GAME_SCENARIOS defines objectives arrays', () => {
  mustInclude('export const PRESET_GAME_SCENARIOS');
  const block = src.slice(src.indexOf('export const PRESET_GAME_SCENARIOS'), src.indexOf('export const GAME_SCENARIOS'));
  if (!/objectives:\s*\[/.test(block)) throw new Error('PRESET_GAME_SCENARIOS block has no objectives arrays');
});

assert('PRESET_CAMPAIGN_CHAPTERS defines chapterObjectives', () => {
  mustInclude('export const PRESET_CAMPAIGN_CHAPTERS');
  const start = src.indexOf('export const PRESET_CAMPAIGN_CHAPTERS');
  const end = src.indexOf('export const DEFAULT_CAREER_ACHIEVEMENTS', start);
  const block = src.slice(start, end);
  if (!/chapterObjectives:\s*\[/.test(block)) throw new Error('Campaign chapters missing chapterObjectives');
});

assert('resolveCurrentObjective priority stack mentions scenario before win', () => {
  const fnStart = src.indexOf('export function resolveCurrentObjective');
  const fnEnd = src.indexOf('export function deriveObjectiveRequirements', fnStart);
  const block = src.slice(fnStart, fnEnd);
  const scenarioIdx = block.indexOf('buildScenarioObjective');
  const winIdx = block.indexOf('buildWinConditionObjective');
  if (scenarioIdx < 0 || winIdx < 0) throw new Error('Missing builders in resolver');
  if (scenarioIdx > winIdx) throw new Error('Expected scenario candidate before win in stack');
});

assert('buildScenarioObjective uses priority 90', () => {
  const start = src.indexOf('function buildScenarioObjective');
  const end = src.indexOf('function buildCampaignObjective', start);
  if (!src.slice(start, end).includes('priority: 90')) throw new Error('scenario priority not 90');
});

assert('buildCampaignObjective uses priority 85', () => {
  const start = src.indexOf('function buildCampaignObjective');
  const end = src.indexOf('function buildContractObjective', start);
  if (!src.slice(start, end).includes('priority: 85')) throw new Error('campaign priority not 85');
});

assert('scenario day-limit regression test present', () => {
  mustInclude("check('ru_scenario_day_limit'");
  mustInclude('evaluateScenarioOutcome(sc as any');
});

assert('scenario outcome victory copy references primary objectives', () => {
  mustInclude('Scenario Victory! All primary objectives completed');
});

assert('GAME_MENTAL_MODEL win group lists scenario and campaign', () => {
  mustInclude("'Scenario objectives', 'Campaign objectives'");
});

const failed = checks.filter((c) => !c.ok);
for (const c of checks) {
  if (c.ok) console.log(`  ok  ${c.name}`);
  else console.error(` FAIL ${c.name}: ${c.detail}`);
}

if (failed.length) {
  console.error(`\n${failed.length}/${checks.length} objective contract checks failed`);
  process.exit(1);
}

console.log(`\n${checks.length}/${checks.length} objective contract checks passed`);
