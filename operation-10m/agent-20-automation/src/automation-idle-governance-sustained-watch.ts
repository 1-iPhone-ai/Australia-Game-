import {
  appendIdleGovernanceAssuranceJournalEntry,
  createEmptyIdleGovernanceAssuranceJournal,
  formatIdleGovernanceAssuranceJournalDigest,
  type O10IdleGovernanceAssuranceJournal,
} from './automation-idle-governance-assurance-journal.js';
import { rollupIdleGovernanceAssuranceJournal } from './automation-idle-governance-assurance-rollup.js';
import { attestIdleGovernanceComplianceCycle } from './automation-idle-governance-cycle-attestation.js';
import { buildIdleGovernanceCopilotBriefFromCycle } from './automation-idle-governance-copilot-brief.js';
import {
  planIdleGovernanceWatchSchedule,
  type O10IdleGovernanceAssurancePassResult,
} from './automation-idle-governance-assurance-pass.js';
import { evaluateIdleGovernanceEscalationLadder } from './automation-idle-governance-escalation-ladder.js';
import {
  createEmptyIdleGovernanceAuditTrail,
  type O10IdleGovernanceAuditTrail,
} from './automation-idle-governance-audit-trail.js';
import { runIdleGovernanceComplianceCycle } from './automation-idle-governance-reconciliation.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import { analyzeIdleGovernanceAuditTrend } from './automation-idle-governance-audit-trend.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceSustainedWatchResult {
  schema: '10m.agent20.idle-governance-sustained-watch.v1';
  cyclesRun: number;
  journal: O10IdleGovernanceAssuranceJournal;
  rollup: ReturnType<typeof rollupIdleGovernanceAssuranceJournal>;
  finalTrail: O10IdleGovernanceAuditTrail;
  lastPass: O10IdleGovernanceAssurancePassResult;
  summaryLine: string;
}

function buildAssurancePassFromCycle(
  cycle: ReturnType<typeof runIdleGovernanceComplianceCycle>,
  turn: number
): O10IdleGovernanceAssurancePassResult {
  const brief = buildIdleGovernanceCopilotBriefFromCycle(cycle);
  const attestation = attestIdleGovernanceComplianceCycle(cycle, turn);
  const trend = analyzeIdleGovernanceAuditTrend(cycle.pass.auditTrail);
  const ladder = evaluateIdleGovernanceEscalationLadder(cycle.pass.auditTrail);
  const watch = planIdleGovernanceWatchSchedule(ladder.level, trend.direction);
  return {
    schema: '10m.agent20.idle-governance-assurance-pass.v1',
    cycle,
    briefMarkdown: brief.markdown,
    attestationFingerprint: attestation.fingerprint,
    trendDirection: trend.direction,
    watch,
    summaryLine: [
      'gov_assurance',
      `attest=${attestation.valid}`,
      trend.summaryLine,
      `watch_in=${watch.turnsUntilNextCycle}`,
    ].join(' '),
  };
}

/** Multi-cycle sustained watch with accumulating audit trail and assurance journal. */
export function runIdleGovernanceSustainedWatch(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  cycleCount: number
): O10IdleGovernanceSustainedWatchResult {
  let trail = createEmptyIdleGovernanceAuditTrail();
  let journal = createEmptyIdleGovernanceAssuranceJournal();
  let lastPass!: O10IdleGovernanceAssurancePassResult;
  const runs = Math.max(1, Math.min(cycleCount, 8));

  for (let i = 0; i < runs; i++) {
    const turn = startTurn + i;
    const cycle = runIdleGovernanceComplianceCycle(spec, rule, turn, trail);
    trail = cycle.pass.auditTrail;
    lastPass = buildAssurancePassFromCycle(cycle, turn);
    const attestation = attestIdleGovernanceComplianceCycle(cycle, turn);
    journal = appendIdleGovernanceAssuranceJournalEntry(journal, lastPass, turn, attestation.valid);
  }

  const rollup = rollupIdleGovernanceAssuranceJournal(journal);
  const summaryLine = [
    'gov_sustained_watch',
    `cycles=${runs}`,
    formatIdleGovernanceAssuranceJournalDigest(journal),
    rollup.summaryLine,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-sustained-watch.v1',
    cyclesRun: runs,
    journal,
    rollup,
    finalTrail: trail,
    lastPass,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceSustainedWatchSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'sw1',
    name: 'Sustained watch',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
    safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
    stats: {
      totalRuns: 0,
      totalSuccesses: 0,
      totalSkipped: 0,
      totalFailed: 0,
      lastRunDay: null,
      lastRunTurn: null,
      runsToday: 0,
      runsTodayDay: -1,
      consecutiveNoChangeCount: 0,
      lastResultSummary: '',
    },
    actionType: 'wait',
    resolvedCost: 0,
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const watch = runIdleGovernanceSustainedWatch(calmSpec, sampleRule, 1, 3);
  push(
    'gov_sustained_calm',
    'multi-cycle calm watch fills journal',
    watch.cyclesRun === 3 && watch.journal.entries.length === 3 && watch.finalTrail.entries.length === 3
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 5,
    humanCommittedEvery: 0,
    idleMsStart: 180_000,
    idleMsStep: 120_000,
    consecutiveIdleStart: 6,
  };
  const stressWatch = runIdleGovernanceSustainedWatch(stressSpec, sampleRule, 10, 2);
  push(
    'gov_sustained_stress',
    'stressed sustained watch produces rollup recommendation',
    stressWatch.rollup.entryCount === 2 && stressWatch.summaryLine.includes('gov_sustained_watch')
  );

  push('gov_sustained_schema', 'sustained watch schema marker', watch.schema === '10m.agent20.idle-governance-sustained-watch.v1');

  push(
    'gov_sustained_last',
    'last pass carries attestation fingerprint',
    watch.lastPass.attestationFingerprint.startsWith('fnv1a_')
  );

  return results;
}
