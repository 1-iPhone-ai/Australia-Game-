export * from './types.js';
export * from './conditional-actions.js';
export * from './limits.js';
export * from './logs.js';
export * from './safe-time-advance.js';
export * from './national-steward.js';
export * from './bridge-hooks.js';
export * from './idle-automation-depth.js';
export * from './turn-compute-engine.js';
export * from './turn-hooks.js';
export * from './idle-automation-simulation.js';
export * from './automation-intent-queue.js';
export * from './day-boundary-compute.js';
export * from './scenario-runner.js';
export * from './automation-soak-projection.js';
export * from './automation-replay-tape.js';
export * from './intent-schedule-coordinator.js';
export * from './automation-idle-escalation.js';
export * from './automation-soak-replay-attestation.js';
export * from './automation-intent-backpressure.js';
export * from './automation-idle-deescalation.js';
export * from './automation-backpressure-telemetry.js';
export * from './automation-idle-ops-pipeline.js';
export * from './automation-idle-ops-window.js';
export * from './automation-backpressure-alerts.js';
export * from './automation-steward-idle-coordination.js';
export * from './automation-backpressure-remediation.js';
export * from './automation-idle-ops-governance.js';
export * from './automation-idle-governance-report.js';
export * from './automation-governance-remediation-runner.js';
export * from './automation-idle-governance-audit-trail.js';
export * from './automation-idle-governance-stabilization.js';
export * from './automation-idle-governance-reconciliation.js';
export * from './automation-idle-governance-escalation-ladder.js';
export * from './automation-idle-governance-copilot-brief.js';
export * from './automation-idle-governance-audit-trend.js';
export * from './automation-idle-governance-cycle-attestation.js';
export * from './automation-idle-governance-assurance-pass.js';
export * from './automation-idle-governance-assurance-journal.js';
export * from './automation-idle-governance-assurance-rollup.js';
export * from './automation-idle-governance-sustained-watch.js';
export * from './automation-idle-governance-watch-replay-tape.js';
export * from './automation-idle-governance-program-charter.js';
export * from './automation-idle-governance-program-pass.js';
export * from './automation-idle-governance-program-attestation.js';
export * from './automation-idle-governance-program-registry.js';
export * from './automation-idle-governance-program-operations.js';

import type { O10SelfTestResult } from './types.js';
import { runO10Agent20NationalStewardSelfTests } from './national-steward.js';
import { createDefaultNationalStewardBridgeHooks } from './bridge-hooks.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';
import { runO10Agent20IdleDepthSelfTests } from './idle-automation-depth.js';
import { runO10Agent20TurnComputeSelfTests } from './turn-compute-engine.js';
import { runO10Agent20TurnHooksSelfTests } from './turn-hooks.js';
import { runO10Agent20SimulationSelfTests } from './idle-automation-simulation.js';
import { runO10Agent20IntentQueueSelfTests } from './automation-intent-queue.js';
import { runO10Agent20DayBoundarySelfTests } from './day-boundary-compute.js';
import { runO10Agent20ScenarioSelfTests } from './scenario-runner.js';
import { runO10Agent20SoakProjectionSelfTests } from './automation-soak-projection.js';
import { runO10Agent20ReplayTapeSelfTests } from './automation-replay-tape.js';
import { runO10Agent20IntentScheduleSelfTests } from './intent-schedule-coordinator.js';
import { runO10Agent20IdleEscalationSelfTests } from './automation-idle-escalation.js';
import { runO10Agent20SoakReplayAttestationSelfTests } from './automation-soak-replay-attestation.js';
import { runO10Agent20IntentBackpressureSelfTests } from './automation-intent-backpressure.js';
import { runO10Agent20IdleDeescalationSelfTests } from './automation-idle-deescalation.js';
import { runO10Agent20BackpressureTelemetrySelfTests } from './automation-backpressure-telemetry.js';
import { runO10Agent20IdleOpsPipelineSelfTests } from './automation-idle-ops-pipeline.js';
import { runO10Agent20IdleOpsWindowSelfTests } from './automation-idle-ops-window.js';
import { runO10Agent20BackpressureAlertsSelfTests } from './automation-backpressure-alerts.js';
import { runO10Agent20StewardIdleCoordinationSelfTests } from './automation-steward-idle-coordination.js';
import { runO10Agent20BackpressureRemediationSelfTests } from './automation-backpressure-remediation.js';
import { runO10Agent20IdleOpsGovernanceSelfTests } from './automation-idle-ops-governance.js';
import { runO10Agent20IdleGovernanceReportSelfTests } from './automation-idle-governance-report.js';
import { runO10Agent20GovernanceRemediationRunnerSelfTests } from './automation-governance-remediation-runner.js';
import { runO10Agent20IdleGovernanceAuditTrailSelfTests } from './automation-idle-governance-audit-trail.js';
import { runO10Agent20IdleGovernanceStabilizationSelfTests } from './automation-idle-governance-stabilization.js';
import { runO10Agent20IdleGovernanceReconciliationSelfTests } from './automation-idle-governance-reconciliation.js';
import { runO10Agent20IdleGovernanceEscalationLadderSelfTests } from './automation-idle-governance-escalation-ladder.js';
import { runO10Agent20IdleGovernanceCopilotBriefSelfTests } from './automation-idle-governance-copilot-brief.js';
import { runO10Agent20IdleGovernanceAuditTrendSelfTests } from './automation-idle-governance-audit-trend.js';
import { runO10Agent20IdleGovernanceCycleAttestationSelfTests } from './automation-idle-governance-cycle-attestation.js';
import { runO10Agent20IdleGovernanceAssurancePassSelfTests } from './automation-idle-governance-assurance-pass.js';
import { runO10Agent20IdleGovernanceAssuranceJournalSelfTests } from './automation-idle-governance-assurance-journal.js';
import { runO10Agent20IdleGovernanceAssuranceRollupSelfTests } from './automation-idle-governance-assurance-rollup.js';
import { runO10Agent20IdleGovernanceSustainedWatchSelfTests } from './automation-idle-governance-sustained-watch.js';
import { runO10Agent20IdleGovernanceWatchReplayTapeSelfTests } from './automation-idle-governance-watch-replay-tape.js';
import { runO10Agent20IdleGovernanceProgramCharterSelfTests } from './automation-idle-governance-program-charter.js';
import { runO10Agent20IdleGovernanceProgramPassSelfTests } from './automation-idle-governance-program-pass.js';
import { runO10Agent20IdleGovernanceProgramAttestationSelfTests } from './automation-idle-governance-program-attestation.js';
import { runO10Agent20IdleGovernanceProgramRegistrySelfTests } from './automation-idle-governance-program-registry.js';
import { runO10Agent20IdleGovernanceProgramOperationsSelfTests } from './automation-idle-governance-program-operations.js';

/** Full module self-test bundle for Agent 25 dev lab registration. */
export function runO10Agent20ModuleSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: O10SelfTestResult[];
} {
  const results: O10SelfTestResult[] = [...runO10Agent20NationalStewardSelfTests()];
  const hooks = createDefaultNationalStewardBridgeHooks();
  const gs = { turnCounter: 2, takeoverSession: { status: 'active' } };
  const st = {
    autoModeEnabled: true,
    autoModeSettings: { permissionMode: 'recommend_only' },
    playerControlMode: 'assistant',
  };
  const after = hooks.onAfterAutoModeEvaluation?.({
    gameState: gs,
    settings: st,
    persisted: createDefaultAutonomousIdleNationalPersisted(),
  });
  const interrupted = hooks.onPlayerInterruptTakeover?.({
    persisted: createDefaultAutonomousIdleNationalPersisted(),
    turn: 2,
  });
  results.push({
    id: 'bridge_auto',
    name: 'bridge updates path after automode (assistant pcm)',
    passed: after?.automationPath === 'v94_player_control_assistant',
  });
  results.push({
    id: 'bridge_interrupt',
    name: 'interrupt latches manual override',
    passed: interrupted?.playerOverride.latched === true,
  });
  results.push(...runO10Agent20IdleDepthSelfTests());
  results.push(...runO10Agent20TurnComputeSelfTests());
  results.push(...runO10Agent20TurnHooksSelfTests());
  results.push(...runO10Agent20SimulationSelfTests());
  results.push(...runO10Agent20IntentQueueSelfTests());
  results.push(...runO10Agent20DayBoundarySelfTests());
  results.push(...runO10Agent20ScenarioSelfTests());
  results.push(...runO10Agent20SoakProjectionSelfTests());
  results.push(...runO10Agent20ReplayTapeSelfTests());
  results.push(...runO10Agent20IntentScheduleSelfTests());
  results.push(...runO10Agent20IdleEscalationSelfTests());
  results.push(...runO10Agent20SoakReplayAttestationSelfTests());
  results.push(...runO10Agent20IntentBackpressureSelfTests());
  results.push(...runO10Agent20IdleDeescalationSelfTests());
  results.push(...runO10Agent20BackpressureTelemetrySelfTests());
  results.push(...runO10Agent20IdleOpsPipelineSelfTests());
  results.push(...runO10Agent20IdleOpsWindowSelfTests());
  results.push(...runO10Agent20BackpressureAlertsSelfTests());
  results.push(...runO10Agent20StewardIdleCoordinationSelfTests());
  results.push(...runO10Agent20BackpressureRemediationSelfTests());
  results.push(...runO10Agent20IdleOpsGovernanceSelfTests());
  results.push(...runO10Agent20IdleGovernanceReportSelfTests());
  results.push(...runO10Agent20GovernanceRemediationRunnerSelfTests());
  results.push(...runO10Agent20IdleGovernanceAuditTrailSelfTests());
  results.push(...runO10Agent20IdleGovernanceStabilizationSelfTests());
  results.push(...runO10Agent20IdleGovernanceReconciliationSelfTests());
  results.push(...runO10Agent20IdleGovernanceEscalationLadderSelfTests());
  results.push(...runO10Agent20IdleGovernanceCopilotBriefSelfTests());
  results.push(...runO10Agent20IdleGovernanceAuditTrendSelfTests());
  results.push(...runO10Agent20IdleGovernanceCycleAttestationSelfTests());
  results.push(...runO10Agent20IdleGovernanceAssurancePassSelfTests());
  results.push(...runO10Agent20IdleGovernanceAssuranceJournalSelfTests());
  results.push(...runO10Agent20IdleGovernanceAssuranceRollupSelfTests());
  results.push(...runO10Agent20IdleGovernanceSustainedWatchSelfTests());
  results.push(...runO10Agent20IdleGovernanceWatchReplayTapeSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramCharterSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramPassSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramAttestationSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramRegistrySelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramOperationsSelfTests());
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
