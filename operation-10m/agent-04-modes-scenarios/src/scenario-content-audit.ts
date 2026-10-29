import { O10M_CHALLENGE_MODES } from './challenge-modes.js';
import { O10M_SCENARIO_CHAINS } from './scenario-chains.js';
import { O10M_OPERATION_SCENARIOS, findO10mScenario } from './scenarios/o10m-presets.js';
import type { PresetScenario } from './types.js';

const VALID_REGION_CODES = new Set(['NSW', 'QLD', 'VIC', 'SA', 'WA', 'TAS', 'NT', 'ACT']);

export type O10mContentAuditSeverity = 'error' | 'warning';

export interface O10mContentAuditIssue {
  id: string;
  severity: O10mContentAuditSeverity;
  problem: string;
  detail: string;
}

export interface O10mContentAuditReport {
  issues: O10mContentAuditIssue[];
  checked: {
    scenarios: number;
    chains: number;
    challengeModes: number;
  };
  isClean: boolean;
}

function auditScenario(sc: PresetScenario): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  if (!sc.id.startsWith('o10m_')) {
    issues.push({
      id: sc.id,
      severity: 'warning',
      problem: 'id_prefix',
      detail: 'O10M preset ids should start with o10m_',
    });
  }
  if (sc.objectives.length === 0) {
    issues.push({ id: sc.id, severity: 'error', problem: 'no_objectives', detail: 'Scenario has zero objectives' });
  }
  const primary = sc.objectives.filter(o => o.isPrimary !== false);
  if (primary.length === 0) {
    issues.push({ id: sc.id, severity: 'error', problem: 'no_primary', detail: 'No primary objectives defined' });
  }
  for (const r of sc.startingRegions) {
    if (!VALID_REGION_CODES.has(r)) {
      issues.push({
        id: sc.id,
        severity: 'error',
        problem: 'bad_region',
        detail: `Invalid starting region code: ${r}`,
      });
    }
  }
  const objIds = new Set<string>();
  for (const o of sc.objectives) {
    if (objIds.has(o.id)) {
      issues.push({ id: sc.id, severity: 'error', problem: 'dup_objective', detail: `Duplicate objective id ${o.id}` });
    }
    objIds.add(o.id);
    if (o.targetType === 'specific_region_controlled' && o.targetRegionId && !VALID_REGION_CODES.has(o.targetRegionId)) {
      issues.push({
        id: sc.id,
        severity: 'error',
        problem: 'bad_target_region',
        detail: `Objective ${o.id} targets unknown region ${o.targetRegionId}`,
      });
    }
  }
  if (typeof sc.startingMoney !== 'number' || sc.startingMoney < 0) {
    issues.push({ id: sc.id, severity: 'error', problem: 'bad_money', detail: 'startingMoney must be non-negative' });
  }
  return issues;
}

export function auditO10mScenarioCatalog(scenarios: PresetScenario[] = O10M_OPERATION_SCENARIOS): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  const ids = new Set<string>();
  for (const sc of scenarios) {
    if (ids.has(sc.id)) {
      issues.push({ id: sc.id, severity: 'error', problem: 'dup_scenario', detail: 'Duplicate scenario id' });
    }
    ids.add(sc.id);
    issues.push(...auditScenario(sc));
  }
  return issues;
}

export function auditO10mScenarioChains(): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  for (const chain of O10M_SCENARIO_CHAINS) {
    const stepIndexes = new Set<number>();
    for (const step of chain.steps) {
      if (stepIndexes.has(step.stepIndex)) {
        issues.push({
          id: chain.id,
          severity: 'error',
          problem: 'dup_step_index',
          detail: `Duplicate step index ${step.stepIndex}`,
        });
      }
      stepIndexes.add(step.stepIndex);
      if (!findO10mScenario(step.scenarioId)) {
        issues.push({
          id: chain.id,
          severity: 'error',
          problem: 'missing_scenario',
          detail: `Step ${step.stepIndex} references unknown scenario ${step.scenarioId}`,
        });
      }
    }
    if (chain.steps.length < 2) {
      issues.push({
        id: chain.id,
        severity: 'warning',
        problem: 'short_chain',
        detail: 'Chains should have at least 2 steps',
      });
    }
  }
  return issues;
}

export function auditO10mChallengeModes(): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  for (const mode of O10M_CHALLENGE_MODES) {
    if (mode.compatibleBaseModes.some(m => mode.incompatibleBaseModes.includes(m))) {
      issues.push({
        id: mode.id,
        severity: 'error',
        problem: 'mode_overlap',
        detail: 'Challenge mode lists the same base mode as compatible and incompatible',
      });
    }
  }
  return issues;
}

export function runO10mContentAudit(): O10mContentAuditReport {
  const issues = [
    ...auditO10mScenarioCatalog(),
    ...auditO10mScenarioChains(),
    ...auditO10mChallengeModes(),
  ];
  const isClean = issues.every(i => i.severity !== 'error');
  return {
    issues,
    checked: {
      scenarios: O10M_OPERATION_SCENARIOS.length,
      chains: O10M_SCENARIO_CHAINS.length,
      challengeModes: O10M_CHALLENGE_MODES.length,
    },
    isClean,
  };
}

export function summarizeContentAudit(report: O10mContentAuditReport): string {
  const err = report.issues.filter(i => i.severity === 'error').length;
  const warn = report.issues.filter(i => i.severity === 'warning').length;
  return `scenarios=${report.checked.scenarios} chains=${report.checked.chains} challenges=${report.checked.challengeModes} errors=${err} warnings=${warn}`;
}
