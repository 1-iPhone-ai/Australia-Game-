import type { GuardianCoPilotMonitorSnapshot } from './types.js';

/** Mirrors canonical V9.4 guardianBlocksAutomation (advisory module copy). */
export function guardianBlocksAutomation(
  result: { allowedToProceed?: boolean; highestSeverity?: string; confirmationRequired?: boolean } | null | undefined,
  protectionLevel?: string
): boolean {
  if (!result) return false;
  if (result.allowedToProceed === false) return true;
  if (result.highestSeverity === 'critical') return true;
  if (protectionLevel === 'maximum_protection' && result.confirmationRequired) return true;
  return false;
}

export type GuardianRiskVerdictLite = {
  allowedToProceed: boolean;
  highestSeverity: 'none' | 'caution' | 'critical';
  confirmationRequired: boolean;
  summary: string;
};

export interface GuardianAdvisoryPosture {
  protectionLevel: string;
  responseMode: string;
  guardianEnabled: boolean;
  automationLikelyBlocked: boolean;
  confirmationLikelyRequired: boolean;
  advisoryReasons: string[];
}

export function inferGuardianVerdictFromSnapshot(snapshot: GuardianCoPilotMonitorSnapshot): GuardianRiskVerdictLite {
  const reasons: string[] = [];
  let highestSeverity: GuardianRiskVerdictLite['highestSeverity'] = 'none';
  let confirmationRequired = false;
  let allowedToProceed = true;

  if (!snapshot.guardianEnabled) {
    return { allowedToProceed: true, highestSeverity: 'none', confirmationRequired: false, summary: 'Guardian disabled' };
  }

  if (snapshot.cash < snapshot.minCashReserve) {
    reasons.push('cash_below_reserve');
    highestSeverity = 'caution';
    confirmationRequired = true;
  }
  if (snapshot.debt > snapshot.cash) {
    reasons.push('debt_exceeds_cash');
    highestSeverity = 'caution';
    confirmationRequired = true;
  }
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) {
    reasons.push('spend_exceeds_cash');
    highestSeverity = 'caution';
    confirmationRequired = true;
  }
  if (snapshot.copilotAutonomousActive && snapshot.guardianRequiresConfirmation) {
    reasons.push('autonomy_confirmation_tension');
    highestSeverity = 'critical';
    confirmationRequired = true;
    allowedToProceed = false;
  }
  if (snapshot.takeoverSessionActive && !snapshot.guardianEnabled) {
    reasons.push('takeover_without_guardian');
    highestSeverity = 'critical';
    allowedToProceed = false;
  }

  if (snapshot.guardianProtectionMaximum && confirmationRequired) {
    allowedToProceed = false;
  }

  return {
    allowedToProceed,
    highestSeverity,
    confirmationRequired,
    summary: reasons.length ? reasons.join(',') : 'clear',
  };
}

export function deriveGuardianAdvisoryPosture(snapshot: GuardianCoPilotMonitorSnapshot): GuardianAdvisoryPosture {
  const verdict = inferGuardianVerdictFromSnapshot(snapshot);
  const automationLikelyBlocked = guardianBlocksAutomation(verdict, snapshot.guardianProtectionLevel);
  const advisoryReasons: string[] = [];
  if (automationLikelyBlocked) advisoryReasons.push('Guardian posture may block Co-Pilot automation on the next risky action');
  if (verdict.confirmationRequired && snapshot.guardianRequiresConfirmation) {
    advisoryReasons.push('Confirmation likely required before spend or travel');
  }
  if (!snapshot.guardianEnabled && snapshot.copilotHoldsControl) {
    advisoryReasons.push('Co-Pilot holds control without Guardian safety net');
  }
  return {
    protectionLevel: snapshot.guardianProtectionLevel,
    responseMode: snapshot.guardianResponseMode,
    guardianEnabled: snapshot.guardianEnabled,
    automationLikelyBlocked,
    confirmationLikelyRequired: verdict.confirmationRequired,
    advisoryReasons,
  };
}

export function buildGuardianDepthAdviceLines(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const posture = deriveGuardianAdvisoryPosture(snapshot);
  const lines = [...posture.advisoryReasons];
  const verdict = inferGuardianVerdictFromSnapshot(snapshot);
  if (verdict.summary !== 'clear') {
    lines.push(`Guardian heuristic flags: ${verdict.summary.replace(/,/g, ' · ')}`);
  }
  return lines.slice(0, 4);
}

export function computeCopilotSpendingHeadroom(snapshot: GuardianCoPilotMonitorSnapshot): number {
  return Math.max(0, snapshot.cash - snapshot.minCashReserve);
}

export function computeObjectiveBehindSchedule(snapshot: GuardianCoPilotMonitorSnapshot): boolean {
  if (!snapshot.objectiveActive || snapshot.objectiveProgressPct === null || snapshot.objectiveTurnsRemaining === null) {
    return false;
  }
  if (snapshot.objectiveProgressPct >= 100) return false;
  const turns = Math.max(1, snapshot.objectiveTurnsRemaining);
  const paceRequired = (100 - snapshot.objectiveProgressPct) / turns;
  return paceRequired > 22;
}

export function computeGuardianRiskScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  if (!snapshot.guardianEnabled) return 0;
  let score = 0;
  if (snapshot.cash < snapshot.minCashReserve) score += 25;
  if (snapshot.debt > snapshot.cash) score += 20;
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) score += 15;
  if (snapshot.guardianAutomationLikelyBlocked) score += 20;
  if (snapshot.copilotAutonomousActive && snapshot.guardianRequiresConfirmation) score += 15;
  if (snapshot.takeoverSessionActive && snapshot.takeoverSessionAgeTurns >= 3) score += 10;
  if (snapshot.blockedContinueCount >= 1) score += 10;
  if (snapshot.objectiveBehindSchedule) score += 15;
  if (snapshot.rivalVictoryProgressPct !== null && snapshot.rivalVictoryProgressPct >= snapshot.victoryThresholdPct * 0.75) {
    score += 15;
  }
  return Math.min(100, score);
}

export function classifyGuardianRiskBand(score: number): GuardianCoPilotMonitorSnapshot['guardianRiskBand'] {
  if (score >= 70) return 'critical';
  if (score >= 40) return 'elevated';
  return 'low';
}

export function computeObjectivePacePct(snapshot: GuardianCoPilotMonitorSnapshot): number | null {
  if (!snapshot.objectiveActive || snapshot.objectiveProgressPct === null || snapshot.objectiveTurnsRemaining === null) {
    return null;
  }
  if (snapshot.objectiveTurnsRemaining <= 0) return snapshot.objectiveProgressPct >= 100 ? 0 : 100;
  return Math.round((100 - snapshot.objectiveProgressPct) / Math.max(1, snapshot.objectiveTurnsRemaining));
}

export function computeLiquidityStressIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let stress = 0;
  if (snapshot.cash <= 0) stress += 35;
  else if (snapshot.cash < snapshot.minCashReserve) stress += 25;
  if (snapshot.debt > snapshot.cash) stress += 25;
  if (snapshot.copilotSpendingHeadroom <= 0) stress += 20;
  else if (snapshot.copilotSpendingHeadroom < snapshot.maxSpendPerAction * 0.5) stress += 10;
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) stress += 15;
  return Math.min(100, stress);
}

export function computeCopilotTrustGapScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  if (!snapshot.copilotEnabled && !snapshot.copilotAutonomousActive) return 0;
  let gap = 0;
  if (snapshot.guardianRequiresConfirmation) gap += 25;
  if (snapshot.guardianProtectionMaximum) gap += 20;
  if (snapshot.copilotAutonomousActive) gap += 25;
  if (snapshot.copilotHoldsControl) gap += 15;
  if (!snapshot.guardianEnabled) gap += 30;
  if (snapshot.guardianAutomationLikelyBlocked) gap += 15;
  return Math.min(100, gap);
}

export function buildGuardianDepthCouplingReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.liquidityStressIndex >= 60) {
    lines.push(`Liquidity stress index ${snapshot.liquidityStressIndex} — discretionary Co-Pilot spend is constrained`);
  }
  if (snapshot.copilotTrustGapScore >= 50) {
    lines.push(`Co-Pilot / Guardian trust gap ${snapshot.copilotTrustGapScore} — align authority and protection before automation`);
  }
  if (snapshot.objectivePacePct !== null && snapshot.objectivePacePct > 30) {
    lines.push(`Objective needs ~${snapshot.objectivePacePct}% progress per remaining turn (advisory estimate)`);
  }
  return lines.slice(0, 3);
}

export function computeCompositePressureIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  const blended =
    snapshot.liquidityStressIndex * 0.35 +
    snapshot.guardianRiskScore * 0.35 +
    snapshot.copilotTrustGapScore * 0.3;
  return Math.min(100, Math.round(blended));
}

export function computeAutomationReadinessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  if (!snapshot.copilotEnabled && !snapshot.guardianEnabled) return 100;
  let score = 100;
  if (snapshot.guardianAutomationLikelyBlocked) score -= 25;
  if (snapshot.copilotTrustGapScore >= 40) score -= Math.min(35, Math.round(snapshot.copilotTrustGapScore * 0.35));
  if (snapshot.guardianConfirmationLikelyRequired) score -= 15;
  if (!snapshot.guardianEnabled && snapshot.copilotHoldsControl) score -= 30;
  if (snapshot.blockedContinueCount >= 1) score -= 10;
  if (snapshot.liquidityStressIndex >= 50) score -= 15;
  if (snapshot.compositePressureIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeActionBurnPressure(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let pressure = 0;
  if (snapshot.apRemaining <= 1 && snapshot.apPerDay >= 2) pressure += 30;
  if (snapshot.apPerDay > 0 && snapshot.actionsUsedThisTurn >= snapshot.apPerDay - 1) pressure += 20;
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) pressure += 20;
  if (snapshot.objectiveBehindSchedule && snapshot.objectiveActive) pressure += 25;
  if (snapshot.apRemaining > 0 && snapshot.copilotSpendingHeadroom <= 0) pressure += 15;
  return Math.min(100, pressure);
}

export function buildGuardianDepthInterlockReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.compositePressureIndex >= 60) {
    lines.push(
      `Composite advisory pressure ${snapshot.compositePressureIndex} — liquidity, Guardian risk, and trust gap align`
    );
  }
  if (snapshot.automationReadinessScore < 40 && snapshot.copilotEnabled) {
    lines.push(
      `Automation readiness ${snapshot.automationReadinessScore} — defer Co-Pilot auto-actions until posture improves`
    );
  }
  if (snapshot.actionBurnPressure >= 50) {
    lines.push(`Action burn pressure ${snapshot.actionBurnPressure} — remaining AP may not cover discretionary spend`);
  }
  return lines.slice(0, 3);
}

export function computeAdvisorySaturationIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let saturation = 0;
  if (snapshot.compositePressureIndex >= 45) saturation += 25;
  if (snapshot.compositePressureIndex >= 65) saturation += 10;
  if (snapshot.automationReadinessScore < 55) saturation += 20;
  if (snapshot.automationReadinessScore < 35) saturation += 10;
  if (snapshot.actionBurnPressure >= 40) saturation += 20;
  if (snapshot.actionBurnPressure >= 60) saturation += 10;
  if (snapshot.guardianRiskBand === 'elevated') saturation += 15;
  if (snapshot.guardianRiskBand === 'critical') saturation += 25;
  if (snapshot.liquidityStressIndex >= 50) saturation += 10;
  return Math.min(100, saturation);
}

export function computeEscalationLatchScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let latch = 0;
  if (snapshot.guardianConfirmationLikelyRequired) latch += 20;
  if (snapshot.guardianAutomationLikelyBlocked) latch += 15;
  if (snapshot.takeoverSessionActive && snapshot.automationReadinessScore < 45) latch += 25;
  if (snapshot.copilotAutonomousActive && snapshot.automationReadinessScore < 40) latch += 20;
  if (snapshot.blockedContinueCount >= 1) latch += 15;
  if (snapshot.compositePressureIndex >= 60) latch += 15;
  if (snapshot.advisorySaturationIndex >= 55) latch += 10;
  if (snapshot.guardianRiskBand === 'critical') latch += 20;
  if (snapshot.copilotHoldsControl && snapshot.governanceCoherenceScore < 40) latch += 15;
  return Math.min(100, latch);
}

export function computeGovernanceCoherenceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.copilotTrustGapScore >= 40) score -= Math.min(35, Math.round(snapshot.copilotTrustGapScore * 0.4));
  if (!snapshot.guardianEnabled && snapshot.copilotEnabled) score -= 25;
  if (snapshot.guardianProtectionMaximum && snapshot.copilotAutonomousActive) score -= 15;
  if (snapshot.guardianRequiresConfirmation && snapshot.copilotAuthorityMode === 'autonomous') score -= 10;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 15;
  if (snapshot.compositePressureIndex >= 55) score -= 10;
  if (snapshot.advisorySaturationIndex >= 60) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthStabilityReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.advisorySaturationIndex >= 55) {
    lines.push(
      `Advisory saturation ${snapshot.advisorySaturationIndex} — overlapping Guardian and Co-Pilot warnings likely`
    );
  }
  if (snapshot.escalationLatchScore >= 50) {
    lines.push(`Escalation latch ${snapshot.escalationLatchScore} — human confirmation path may engage repeatedly`);
  }
  if (snapshot.governanceCoherenceScore < 45) {
    lines.push(
      `Governance coherence ${snapshot.governanceCoherenceScore} — align protection level and Co-Pilot authority`
    );
  }
  return lines.slice(0, 3);
}

export function computeContainmentBurdenIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let burden = 0;
  if (snapshot.advisorySaturationIndex >= 50) burden += 25;
  if (snapshot.advisorySaturationIndex >= 70) burden += 15;
  if (snapshot.escalationLatchScore >= 45) burden += 20;
  if (snapshot.escalationLatchScore >= 65) burden += 10;
  if (snapshot.governanceCoherenceScore < 50) burden += 15;
  if (snapshot.governanceCoherenceScore < 35) burden += 10;
  if (snapshot.compositePressureIndex >= 55) burden += 15;
  if (snapshot.guardianRiskBand === 'critical') burden += 20;
  if (snapshot.takeoverSessionActive) burden += 10;
  return Math.min(100, burden);
}

export function computeHumanRelayPressure(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let pressure = 0;
  if (snapshot.guardianConfirmationLikelyRequired) pressure += 20;
  if (snapshot.takeoverSessionActive) pressure += 25;
  if (snapshot.copilotHoldsControl && snapshot.automationReadinessScore < 45) pressure += 20;
  if (snapshot.blockedContinueCount >= 1) pressure += 15;
  if (snapshot.escalationLatchScore >= 50) pressure += 15;
  if (snapshot.containmentBurdenIndex >= 55) pressure += 10;
  if (snapshot.teamPlanPending) pressure += 10;
  if (snapshot.guardianReplayCount >= 2) pressure += 10;
  return Math.min(100, pressure);
}

export function computeRecoveryHeadroomScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.containmentBurdenIndex >= 45) score -= Math.min(30, Math.round(snapshot.containmentBurdenIndex * 0.35));
  if (snapshot.humanRelayPressure >= 40) score -= Math.min(25, Math.round(snapshot.humanRelayPressure * 0.3));
  if (snapshot.liquidityStressIndex >= 50) score -= 15;
  if (snapshot.automationReadinessScore < 40) score -= 15;
  if (snapshot.governanceCoherenceScore < 40) score -= 10;
  if (snapshot.actionBurnPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthResilienceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.containmentBurdenIndex >= 55) {
    lines.push(
      `Containment burden ${snapshot.containmentBurdenIndex} — advisory envelope may need manual triage before automation`
    );
  }
  if (snapshot.humanRelayPressure >= 50) {
    lines.push(`Human relay pressure ${snapshot.humanRelayPressure} — expect repeated Guardian or Co-Pilot handoffs`);
  }
  if (snapshot.recoveryHeadroomScore < 40) {
    lines.push(
      `Recovery headroom ${snapshot.recoveryHeadroomScore} — limited slack to absorb another advisory shock`
    );
  }
  return lines.slice(0, 3);
}

export function computeAdvisoryDepletionIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let depletion = 0;
  if (snapshot.recoveryHeadroomScore < 50) depletion += Math.min(25, 50 - snapshot.recoveryHeadroomScore);
  if (snapshot.recoveryHeadroomScore < 35) depletion += 10;
  if (snapshot.containmentBurdenIndex >= 50) depletion += 20;
  if (snapshot.containmentBurdenIndex >= 70) depletion += 10;
  if (snapshot.humanRelayPressure >= 45) depletion += 15;
  if (snapshot.advisorySaturationIndex >= 55) depletion += 15;
  if (snapshot.guardianReplayCount >= 2) depletion += 10;
  if (snapshot.blockedContinueCount >= 1) depletion += 10;
  if (snapshot.actionBurnPressure >= 50) depletion += 10;
  return Math.min(100, depletion);
}

export function computeOperatorBandwidthScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.humanRelayPressure >= 40) score -= Math.min(30, Math.round(snapshot.humanRelayPressure * 0.35));
  if (snapshot.advisoryDepletionIndex >= 45) score -= Math.min(25, Math.round(snapshot.advisoryDepletionIndex * 0.3));
  if (snapshot.takeoverSessionActive) score -= 15;
  if (snapshot.teamPlanPending) score -= 10;
  if (snapshot.guardianConfirmationLikelyRequired) score -= 10;
  if (snapshot.copilotHoldsControl && snapshot.automationReadinessScore < 40) score -= 15;
  return Math.max(0, Math.min(100, score));
}

export function computeContinuityMarginScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.advisoryDepletionIndex >= 40) score -= Math.min(30, Math.round(snapshot.advisoryDepletionIndex * 0.35));
  if (snapshot.operatorBandwidthScore < 50) score -= Math.min(25, 50 - snapshot.operatorBandwidthScore);
  if (snapshot.recoveryHeadroomScore < 45) score -= 15;
  if (snapshot.governanceCoherenceScore < 45) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthContinuityReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.advisoryDepletionIndex >= 55) {
    lines.push(
      `Advisory depletion ${snapshot.advisoryDepletionIndex} — sustained advisory load may exhaust operator attention`
    );
  }
  if (snapshot.operatorBandwidthScore < 45) {
    lines.push(
      `Operator bandwidth ${snapshot.operatorBandwidthScore} — reduce parallel Guardian and Co-Pilot demands`
    );
  }
  if (snapshot.continuityMarginScore < 40) {
    lines.push(
      `Continuity margin ${snapshot.continuityMarginScore} — fragile margin to maintain advisory coverage across turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeStewardshipLoadIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.continuityMarginScore < 50) load += Math.min(25, 50 - snapshot.continuityMarginScore);
  if (snapshot.continuityMarginScore < 35) load += 10;
  if (snapshot.advisoryDepletionIndex >= 45) load += 20;
  if (snapshot.advisoryDepletionIndex >= 65) load += 10;
  if (snapshot.operatorBandwidthScore < 45) load += 20;
  if (snapshot.governanceCoherenceScore < 45) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.humanRelayPressure >= 50) load += 10;
  return Math.min(100, load);
}

export function computeOversightCommitmentScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.stewardshipLoadIndex >= 45) score -= Math.min(30, Math.round(snapshot.stewardshipLoadIndex * 0.35));
  if (snapshot.continuityMarginScore < 40) score -= 15;
  if (!snapshot.guardianEnabled && snapshot.copilotEnabled) score -= 20;
  if (snapshot.guardianConfirmationLikelyRequired && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  if (snapshot.governanceCoherenceScore < 40) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeSustainabilityMarginScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.stewardshipLoadIndex >= 40) score -= Math.min(30, Math.round(snapshot.stewardshipLoadIndex * 0.32));
  if (snapshot.oversightCommitmentScore < 50) score -= Math.min(25, 50 - snapshot.oversightCommitmentScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  if (snapshot.continuityMarginScore < 35) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthStewardshipReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.stewardshipLoadIndex >= 55) {
    lines.push(
      `Stewardship load ${snapshot.stewardshipLoadIndex} — operator stewardship may not scale with advisory volume`
    );
  }
  if (snapshot.oversightCommitmentScore < 45) {
    lines.push(
      `Oversight commitment ${snapshot.oversightCommitmentScore} — align Guardian oversight with Co-Pilot autonomy`
    );
  }
  if (snapshot.sustainabilityMarginScore < 40) {
    lines.push(
      `Sustainability margin ${snapshot.sustainabilityMarginScore} — little margin to sustain warn-only governance across turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAccountabilityLoadIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.sustainabilityMarginScore < 50) load += Math.min(25, 50 - snapshot.sustainabilityMarginScore);
  if (snapshot.sustainabilityMarginScore < 35) load += 10;
  if (snapshot.oversightCommitmentScore < 45) load += 20;
  if (snapshot.oversightCommitmentScore < 35) load += 10;
  if (snapshot.stewardshipLoadIndex >= 55) load += 20;
  if (snapshot.stewardshipLoadIndex >= 70) load += 10;
  if (snapshot.copilotTrustGapScore >= 50) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.governanceCoherenceScore < 45) load += 10;
  return Math.min(100, load);
}

export function computeDelegationFidelityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accountabilityLoadIndex >= 45) score -= Math.min(30, Math.round(snapshot.accountabilityLoadIndex * 0.35));
  if (snapshot.copilotTrustGapScore >= 45) score -= Math.min(25, Math.round(snapshot.copilotTrustGapScore * 0.35));
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianConfirmationLikelyRequired && snapshot.copilotHoldsControl) score -= 10;
  if (snapshot.oversightCommitmentScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceEnduranceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accountabilityLoadIndex >= 40) score -= Math.min(30, Math.round(snapshot.accountabilityLoadIndex * 0.32));
  if (snapshot.delegationFidelityScore < 50) score -= Math.min(25, 50 - snapshot.delegationFidelityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.continuityMarginScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAccountabilityReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.accountabilityLoadIndex >= 55) {
    lines.push(
      `Accountability load ${snapshot.accountabilityLoadIndex} — stacked warn-only obligations may exceed operator review capacity`
    );
  }
  if (snapshot.delegationFidelityScore < 45) {
    lines.push(
      `Delegation fidelity ${snapshot.delegationFidelityScore} — align Co-Pilot delegation with Guardian accountability posture`
    );
  }
  if (snapshot.governanceEnduranceScore < 40) {
    lines.push(
      `Governance endurance ${snapshot.governanceEnduranceScore} — little endurance to sustain oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeFiduciaryBurdenIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceEnduranceScore < 50) load += Math.min(25, 50 - snapshot.governanceEnduranceScore);
  if (snapshot.governanceEnduranceScore < 35) load += 10;
  if (snapshot.delegationFidelityScore < 45) load += 20;
  if (snapshot.delegationFidelityScore < 35) load += 10;
  if (snapshot.accountabilityLoadIndex >= 55) load += 20;
  if (snapshot.accountabilityLoadIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.escalationLatchScore >= 55) load += 10;
  return Math.min(100, load);
}

export function computeTrustAssuranceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.fiduciaryBurdenIndex >= 45) score -= Math.min(30, Math.round(snapshot.fiduciaryBurdenIndex * 0.35));
  if (snapshot.delegationFidelityScore < 50) score -= Math.min(25, 50 - snapshot.delegationFidelityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotHoldsControl) score -= 10;
  if (snapshot.governanceEnduranceScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceDurabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.fiduciaryBurdenIndex >= 40) score -= Math.min(30, Math.round(snapshot.fiduciaryBurdenIndex * 0.32));
  if (snapshot.trustAssuranceScore < 50) score -= Math.min(25, 50 - snapshot.trustAssuranceScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.sustainabilityMarginScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthFiduciaryReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.fiduciaryBurdenIndex >= 55) {
    lines.push(
      `Fiduciary burden ${snapshot.fiduciaryBurdenIndex} — stacked fiduciary review may exceed operator assurance capacity`
    );
  }
  if (snapshot.trustAssuranceScore < 45) {
    lines.push(
      `Trust assurance ${snapshot.trustAssuranceScore} — align Co-Pilot autonomy with Guardian fiduciary posture`
    );
  }
  if (snapshot.governanceDurabilityScore < 40) {
    lines.push(
      `Governance durability ${snapshot.governanceDurabilityScore} — little durability to sustain fiduciary oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeCovenantStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceDurabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceDurabilityScore);
  if (snapshot.governanceDurabilityScore < 35) load += 10;
  if (snapshot.trustAssuranceScore < 45) load += 20;
  if (snapshot.trustAssuranceScore < 35) load += 10;
  if (snapshot.fiduciaryBurdenIndex >= 55) load += 20;
  if (snapshot.fiduciaryBurdenIndex >= 70) load += 10;
  if (snapshot.compositePressureIndex >= 58) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.governanceCoherenceScore < 45) load += 10;
  return Math.min(100, load);
}

export function computeMandateIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.covenantStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.covenantStrainIndex * 0.35));
  if (snapshot.trustAssuranceScore < 50) score -= Math.min(25, 50 - snapshot.trustAssuranceScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianRequiresConfirmation && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceDurabilityScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceTenacityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.covenantStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.covenantStrainIndex * 0.32));
  if (snapshot.mandateIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.mandateIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceEnduranceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthCovenantReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.covenantStrainIndex >= 55) {
    lines.push(
      `Covenant strain ${snapshot.covenantStrainIndex} — stacked mandate review may exceed operator covenant capacity`
    );
  }
  if (snapshot.mandateIntegrityScore < 45) {
    lines.push(
      `Mandate integrity ${snapshot.mandateIntegrityScore} — align Co-Pilot mandate with Guardian covenant posture`
    );
  }
  if (snapshot.governanceTenacityScore < 40) {
    lines.push(
      `Governance tenacity ${snapshot.governanceTenacityScore} — little tenacity to sustain covenant oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeCharterStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceTenacityScore < 50) load += Math.min(25, 50 - snapshot.governanceTenacityScore);
  if (snapshot.governanceTenacityScore < 35) load += 10;
  if (snapshot.mandateIntegrityScore < 45) load += 20;
  if (snapshot.mandateIntegrityScore < 35) load += 10;
  if (snapshot.covenantStrainIndex >= 55) load += 20;
  if (snapshot.covenantStrainIndex >= 70) load += 10;
  if (snapshot.actionBurnPressure >= 50) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.advisoryDepletionIndex >= 55) load += 10;
  return Math.min(100, load);
}

export function computeAuthorityIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.charterStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.charterStrainIndex * 0.35));
  if (snapshot.mandateIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.mandateIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.copilotAuthorityMode === 'autonomous' && snapshot.guardianProtectionMaximum) score -= 10;
  if (snapshot.governanceTenacityScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernancePersistenceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.charterStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.charterStrainIndex * 0.32));
  if (snapshot.authorityIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorityIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceDurabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthCharterReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.charterStrainIndex >= 55) {
    lines.push(
      `Charter strain ${snapshot.charterStrainIndex} — stacked charter review may exceed operator authority capacity`
    );
  }
  if (snapshot.authorityIntegrityScore < 45) {
    lines.push(
      `Authority integrity ${snapshot.authorityIntegrityScore} — align Co-Pilot authority with Guardian charter posture`
    );
  }
  if (snapshot.governancePersistenceScore < 40) {
    lines.push(
      `Governance persistence ${snapshot.governancePersistenceScore} — little persistence to sustain charter oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeLegitimacyStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governancePersistenceScore < 50) load += Math.min(25, 50 - snapshot.governancePersistenceScore);
  if (snapshot.governancePersistenceScore < 35) load += 10;
  if (snapshot.authorityIntegrityScore < 45) load += 20;
  if (snapshot.authorityIntegrityScore < 35) load += 10;
  if (snapshot.charterStrainIndex >= 55) load += 20;
  if (snapshot.charterStrainIndex >= 70) load += 10;
  if (snapshot.escalationLatchScore >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.containmentBurdenIndex >= 55) load += 10;
  return Math.min(100, load);
}

export function computeOversightIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.legitimacyStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.legitimacyStrainIndex * 0.35));
  if (snapshot.authorityIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorityIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.oversightCommitmentScore < 40) score -= 10;
  if (snapshot.governancePersistenceScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceContinuityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.legitimacyStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.legitimacyStrainIndex * 0.32));
  if (snapshot.oversightIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.oversightIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceTenacityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthLegitimacyReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.legitimacyStrainIndex >= 55) {
    lines.push(
      `Legitimacy strain ${snapshot.legitimacyStrainIndex} — stacked legitimacy review may exceed operator oversight capacity`
    );
  }
  if (snapshot.oversightIntegrityScore < 45) {
    lines.push(
      `Oversight integrity ${snapshot.oversightIntegrityScore} — align Co-Pilot oversight with Guardian legitimacy posture`
    );
  }
  if (snapshot.governanceContinuityScore < 40) {
    lines.push(
      `Governance continuity ${snapshot.governanceContinuityScore} — little continuity to sustain legitimacy oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeComplianceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceContinuityScore < 50) load += Math.min(25, 50 - snapshot.governanceContinuityScore);
  if (snapshot.governanceContinuityScore < 35) load += 10;
  if (snapshot.oversightIntegrityScore < 45) load += 20;
  if (snapshot.oversightIntegrityScore < 35) load += 10;
  if (snapshot.legitimacyStrainIndex >= 55) load += 20;
  if (snapshot.legitimacyStrainIndex >= 70) load += 10;
  if (snapshot.governanceCoherenceScore < 45) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.humanRelayPressure >= 50) load += 10;
  return Math.min(100, load);
}

export function computePolicyIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.complianceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.complianceStrainIndex * 0.35));
  if (snapshot.oversightIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.oversightIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianRequiresConfirmation && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceContinuityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceResilienceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.complianceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.complianceStrainIndex * 0.32));
  if (snapshot.policyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.policyIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governancePersistenceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthComplianceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.complianceStrainIndex >= 55) {
    lines.push(
      `Compliance strain ${snapshot.complianceStrainIndex} — stacked policy review may exceed operator compliance capacity`
    );
  }
  if (snapshot.policyIntegrityScore < 45) {
    lines.push(
      `Policy integrity ${snapshot.policyIntegrityScore} — align Co-Pilot policy with Guardian compliance posture`
    );
  }
  if (snapshot.governanceResilienceScore < 40) {
    lines.push(
      `Governance resilience ${snapshot.governanceResilienceScore} — little resilience to sustain compliance oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAuditStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceResilienceScore < 50) load += Math.min(25, 50 - snapshot.governanceResilienceScore);
  if (snapshot.governanceResilienceScore < 35) load += 10;
  if (snapshot.policyIntegrityScore < 45) load += 20;
  if (snapshot.policyIntegrityScore < 35) load += 10;
  if (snapshot.complianceStrainIndex >= 55) load += 20;
  if (snapshot.complianceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeControlIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.auditStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.auditStrainIndex * 0.35));
  if (snapshot.policyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.policyIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceResilienceScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceStabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.auditStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.auditStrainIndex * 0.32));
  if (snapshot.controlIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.controlIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceContinuityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAuditReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.auditStrainIndex >= 55) {
    lines.push(
      `Audit strain ${snapshot.auditStrainIndex} — stacked control review may exceed operator audit capacity`
    );
  }
  if (snapshot.controlIntegrityScore < 45) {
    lines.push(
      `Control integrity ${snapshot.controlIntegrityScore} — align Co-Pilot controls with Guardian audit posture`
    );
  }
  if (snapshot.governanceStabilityScore < 40) {
    lines.push(
      `Governance stability ${snapshot.governanceStabilityScore} — little stability to sustain audit oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAssuranceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceStabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceStabilityScore);
  if (snapshot.governanceStabilityScore < 35) load += 10;
  if (snapshot.controlIntegrityScore < 45) load += 20;
  if (snapshot.controlIntegrityScore < 35) load += 10;
  if (snapshot.auditStrainIndex >= 55) load += 20;
  if (snapshot.auditStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeEvidenceIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.assuranceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.assuranceStrainIndex * 0.35));
  if (snapshot.controlIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.controlIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceStabilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceConfidenceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.assuranceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.assuranceStrainIndex * 0.32));
  if (snapshot.evidenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.evidenceIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceResilienceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAssuranceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.assuranceStrainIndex >= 55) {
    lines.push(
      `Assurance strain ${snapshot.assuranceStrainIndex} — stacked evidence review may exceed operator assurance capacity`
    );
  }
  if (snapshot.evidenceIntegrityScore < 45) {
    lines.push(
      `Evidence integrity ${snapshot.evidenceIntegrityScore} — align Co-Pilot evidence with Guardian assurance posture`
    );
  }
  if (snapshot.governanceConfidenceScore < 40) {
    lines.push(
      `Governance confidence ${snapshot.governanceConfidenceScore} — little confidence to sustain assurance oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAttestationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceConfidenceScore < 50) load += Math.min(25, 50 - snapshot.governanceConfidenceScore);
  if (snapshot.governanceConfidenceScore < 35) load += 10;
  if (snapshot.evidenceIntegrityScore < 45) load += 20;
  if (snapshot.evidenceIntegrityScore < 35) load += 10;
  if (snapshot.assuranceStrainIndex >= 55) load += 20;
  if (snapshot.assuranceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAttestationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.attestationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.attestationStrainIndex * 0.35));
  if (snapshot.evidenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.evidenceIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceConfidenceScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceReliabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.attestationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.attestationStrainIndex * 0.32));
  if (snapshot.attestationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.attestationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceStabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAttestationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.attestationStrainIndex >= 55) {
    lines.push(
      `Attestation strain ${snapshot.attestationStrainIndex} — stacked attestation review may exceed operator attestation capacity`
    );
  }
  if (snapshot.attestationIntegrityScore < 45) {
    lines.push(
      `Attestation integrity ${snapshot.attestationIntegrityScore} — align Co-Pilot attestations with Guardian attestation posture`
    );
  }
  if (snapshot.governanceReliabilityScore < 40) {
    lines.push(
      `Governance reliability ${snapshot.governanceReliabilityScore} — little reliability to sustain attestation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeVerificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceReliabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceReliabilityScore);
  if (snapshot.governanceReliabilityScore < 35) load += 10;
  if (snapshot.attestationIntegrityScore < 45) load += 20;
  if (snapshot.attestationIntegrityScore < 35) load += 10;
  if (snapshot.attestationStrainIndex >= 55) load += 20;
  if (snapshot.attestationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeVerificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.verificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.verificationStrainIndex * 0.35));
  if (snapshot.attestationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.attestationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceReliabilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceValidityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.verificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.verificationStrainIndex * 0.32));
  if (snapshot.verificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.verificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceReliabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthVerificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.verificationStrainIndex >= 55) {
    lines.push(
      `Verification strain ${snapshot.verificationStrainIndex} — stacked verification review may exceed operator verification capacity`
    );
  }
  if (snapshot.verificationIntegrityScore < 45) {
    lines.push(
      `Verification integrity ${snapshot.verificationIntegrityScore} — align Co-Pilot verifications with Guardian verification posture`
    );
  }
  if (snapshot.governanceValidityScore < 40) {
    lines.push(
      `Governance validity ${snapshot.governanceValidityScore} — little validity to sustain verification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeValidationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceValidityScore < 50) load += Math.min(25, 50 - snapshot.governanceValidityScore);
  if (snapshot.governanceValidityScore < 35) load += 10;
  if (snapshot.verificationIntegrityScore < 45) load += 20;
  if (snapshot.verificationIntegrityScore < 35) load += 10;
  if (snapshot.verificationStrainIndex >= 55) load += 20;
  if (snapshot.verificationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeValidationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.validationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.validationStrainIndex * 0.35));
  if (snapshot.verificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.verificationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceValidityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceSoundnessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.validationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.validationStrainIndex * 0.32));
  if (snapshot.validationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.validationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceValidityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthValidationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.validationStrainIndex >= 55) {
    lines.push(
      `Validation strain ${snapshot.validationStrainIndex} — stacked validation review may exceed operator validation capacity`
    );
  }
  if (snapshot.validationIntegrityScore < 45) {
    lines.push(
      `Validation integrity ${snapshot.validationIntegrityScore} — align Co-Pilot validations with Guardian validation posture`
    );
  }
  if (snapshot.governanceSoundnessScore < 40) {
    lines.push(
      `Governance soundness ${snapshot.governanceSoundnessScore} — little soundness to sustain validation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeCertificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceSoundnessScore < 50) load += Math.min(25, 50 - snapshot.governanceSoundnessScore);
  if (snapshot.governanceSoundnessScore < 35) load += 10;
  if (snapshot.validationIntegrityScore < 45) load += 20;
  if (snapshot.validationIntegrityScore < 35) load += 10;
  if (snapshot.validationStrainIndex >= 55) load += 20;
  if (snapshot.validationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeCertificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.certificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.certificationStrainIndex * 0.35));
  if (snapshot.validationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.validationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceSoundnessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceAuthenticityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.certificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.certificationStrainIndex * 0.32));
  if (snapshot.certificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.certificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceSoundnessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthCertificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.certificationStrainIndex >= 55) {
    lines.push(
      `Certification strain ${snapshot.certificationStrainIndex} — stacked certification review may exceed operator certification capacity`
    );
  }
  if (snapshot.certificationIntegrityScore < 45) {
    lines.push(
      `Certification integrity ${snapshot.certificationIntegrityScore} — align Co-Pilot certifications with Guardian certification posture`
    );
  }
  if (snapshot.governanceAuthenticityScore < 40) {
    lines.push(
      `Governance authenticity ${snapshot.governanceAuthenticityScore} — little authenticity to sustain certification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAccreditationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceAuthenticityScore < 50) load += Math.min(25, 50 - snapshot.governanceAuthenticityScore);
  if (snapshot.governanceAuthenticityScore < 35) load += 10;
  if (snapshot.certificationIntegrityScore < 45) load += 20;
  if (snapshot.certificationIntegrityScore < 35) load += 10;
  if (snapshot.certificationStrainIndex >= 55) load += 20;
  if (snapshot.certificationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAccreditationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accreditationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.accreditationStrainIndex * 0.35));
  if (snapshot.certificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.certificationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceAuthenticityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceCredibilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accreditationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.accreditationStrainIndex * 0.32));
  if (snapshot.accreditationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.accreditationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceAuthenticityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAccreditationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.accreditationStrainIndex >= 55) {
    lines.push(
      `Accreditation strain ${snapshot.accreditationStrainIndex} — stacked accreditation review may exceed operator accreditation capacity`
    );
  }
  if (snapshot.accreditationIntegrityScore < 45) {
    lines.push(
      `Accreditation integrity ${snapshot.accreditationIntegrityScore} — align Co-Pilot accreditations with Guardian accreditation posture`
    );
  }
  if (snapshot.governanceCredibilityScore < 40) {
    lines.push(
      `Governance credibility ${snapshot.governanceCredibilityScore} — little credibility to sustain accreditation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeEndorsementStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceCredibilityScore < 50) load += Math.min(25, 50 - snapshot.governanceCredibilityScore);
  if (snapshot.governanceCredibilityScore < 35) load += 10;
  if (snapshot.accreditationIntegrityScore < 45) load += 20;
  if (snapshot.accreditationIntegrityScore < 35) load += 10;
  if (snapshot.accreditationStrainIndex >= 55) load += 20;
  if (snapshot.accreditationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeEndorsementIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.endorsementStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.endorsementStrainIndex * 0.35));
  if (snapshot.accreditationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.accreditationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceCredibilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceTrustworthinessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.endorsementStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.endorsementStrainIndex * 0.32));
  if (snapshot.endorsementIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.endorsementIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceCredibilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthEndorsementReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.endorsementStrainIndex >= 55) {
    lines.push(
      `Endorsement strain ${snapshot.endorsementStrainIndex} — stacked endorsement review may exceed operator endorsement capacity`
    );
  }
  if (snapshot.endorsementIntegrityScore < 45) {
    lines.push(
      `Endorsement integrity ${snapshot.endorsementIntegrityScore} — align Co-Pilot endorsements with Guardian endorsement posture`
    );
  }
  if (snapshot.governanceTrustworthinessScore < 40) {
    lines.push(
      `Governance trustworthiness ${snapshot.governanceTrustworthinessScore} — little trustworthiness to sustain endorsement oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeRatificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceTrustworthinessScore < 50) load += Math.min(25, 50 - snapshot.governanceTrustworthinessScore);
  if (snapshot.governanceTrustworthinessScore < 35) load += 10;
  if (snapshot.endorsementIntegrityScore < 45) load += 20;
  if (snapshot.endorsementIntegrityScore < 35) load += 10;
  if (snapshot.endorsementStrainIndex >= 55) load += 20;
  if (snapshot.endorsementStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeRatificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.ratificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.ratificationStrainIndex * 0.35));
  if (snapshot.endorsementIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.endorsementIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceTrustworthinessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceDependabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.ratificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.ratificationStrainIndex * 0.32));
  if (snapshot.ratificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.ratificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceTrustworthinessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthRatificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.ratificationStrainIndex >= 55) {
    lines.push(
      `Ratification strain ${snapshot.ratificationStrainIndex} — stacked ratification review may exceed operator ratification capacity`
    );
  }
  if (snapshot.ratificationIntegrityScore < 45) {
    lines.push(
      `Ratification integrity ${snapshot.ratificationIntegrityScore} — align Co-Pilot ratifications with Guardian ratification posture`
    );
  }
  if (snapshot.governanceDependabilityScore < 40) {
    lines.push(
      `Governance dependability ${snapshot.governanceDependabilityScore} — little dependability to sustain ratification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAuthorizationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceDependabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceDependabilityScore);
  if (snapshot.governanceDependabilityScore < 35) load += 10;
  if (snapshot.ratificationIntegrityScore < 45) load += 20;
  if (snapshot.ratificationIntegrityScore < 35) load += 10;
  if (snapshot.ratificationStrainIndex >= 55) load += 20;
  if (snapshot.ratificationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAuthorizationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.authorizationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.authorizationStrainIndex * 0.35));
  if (snapshot.ratificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.ratificationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceDependabilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceSteadfastnessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.authorizationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.authorizationStrainIndex * 0.32));
  if (snapshot.authorizationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorizationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceDependabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAuthorizationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.authorizationStrainIndex >= 55) {
    lines.push(
      `Authorization strain ${snapshot.authorizationStrainIndex} — stacked authorization review may exceed operator authorization capacity`
    );
  }
  if (snapshot.authorizationIntegrityScore < 45) {
    lines.push(
      `Authorization integrity ${snapshot.authorizationIntegrityScore} — align Co-Pilot authorizations with Guardian authorization posture`
    );
  }
  if (snapshot.governanceSteadfastnessScore < 40) {
    lines.push(
      `Governance steadfastness ${snapshot.governanceSteadfastnessScore} — little steadfastness to sustain authorization oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAffirmationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceSteadfastnessScore < 50) load += Math.min(25, 50 - snapshot.governanceSteadfastnessScore);
  if (snapshot.governanceSteadfastnessScore < 35) load += 10;
  if (snapshot.authorizationIntegrityScore < 45) load += 20;
  if (snapshot.authorizationIntegrityScore < 35) load += 10;
  if (snapshot.authorizationStrainIndex >= 55) load += 20;
  if (snapshot.authorizationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAffirmationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.affirmationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.affirmationStrainIndex * 0.35));
  if (snapshot.authorizationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorizationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceSteadfastnessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceResolutenessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.affirmationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.affirmationStrainIndex * 0.32));
  if (snapshot.affirmationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.affirmationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceSteadfastnessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAffirmationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.affirmationStrainIndex >= 55) {
    lines.push(
      `Affirmation strain ${snapshot.affirmationStrainIndex} — stacked affirmation review may exceed operator affirmation capacity`
    );
  }
  if (snapshot.affirmationIntegrityScore < 45) {
    lines.push(
      `Affirmation integrity ${snapshot.affirmationIntegrityScore} — align Co-Pilot affirmations with Guardian affirmation posture`
    );
  }
  if (snapshot.governanceResolutenessScore < 40) {
    lines.push(
      `Governance resoluteness ${snapshot.governanceResolutenessScore} — little resoluteness to sustain affirmation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeSanctionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceResolutenessScore < 50) load += Math.min(25, 50 - snapshot.governanceResolutenessScore);
  if (snapshot.governanceResolutenessScore < 35) load += 10;
  if (snapshot.affirmationIntegrityScore < 45) load += 20;
  if (snapshot.affirmationIntegrityScore < 35) load += 10;
  if (snapshot.affirmationStrainIndex >= 55) load += 20;
  if (snapshot.affirmationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeSanctionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.sanctionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.sanctionStrainIndex * 0.35));
  if (snapshot.affirmationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.affirmationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceResolutenessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceFirmnessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.sanctionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.sanctionStrainIndex * 0.32));
  if (snapshot.sanctionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.sanctionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceResolutenessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthSanctionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.sanctionStrainIndex >= 55) {
    lines.push(
      `Sanction strain ${snapshot.sanctionStrainIndex} — stacked sanction review may exceed operator sanction capacity`
    );
  }
  if (snapshot.sanctionIntegrityScore < 45) {
    lines.push(
      `Sanction integrity ${snapshot.sanctionIntegrityScore} — align Co-Pilot sanctions with Guardian sanction posture`
    );
  }
  if (snapshot.governanceFirmnessScore < 40) {
    lines.push(
      `Governance firmness ${snapshot.governanceFirmnessScore} — little firmness to sustain sanction oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeWarrantStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceFirmnessScore < 50) load += Math.min(25, 50 - snapshot.governanceFirmnessScore);
  if (snapshot.governanceFirmnessScore < 35) load += 10;
  if (snapshot.sanctionIntegrityScore < 45) load += 20;
  if (snapshot.sanctionIntegrityScore < 35) load += 10;
  if (snapshot.sanctionStrainIndex >= 55) load += 20;
  if (snapshot.sanctionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeWarrantIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.warrantStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.warrantStrainIndex * 0.35));
  if (snapshot.sanctionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.sanctionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceFirmnessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceConstancyScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.warrantStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.warrantStrainIndex * 0.32));
  if (snapshot.warrantIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.warrantIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceFirmnessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthWarrantReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.warrantStrainIndex >= 55) {
    lines.push(
      `Warrant strain ${snapshot.warrantStrainIndex} — stacked warrant review may exceed operator warrant capacity`
    );
  }
  if (snapshot.warrantIntegrityScore < 45) {
    lines.push(
      `Warrant integrity ${snapshot.warrantIntegrityScore} — align Co-Pilot warrants with Guardian warrant posture`
    );
  }
  if (snapshot.governanceConstancyScore < 40) {
    lines.push(
      `Governance constancy ${snapshot.governanceConstancyScore} — little constancy to sustain warrant oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeClearanceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceConstancyScore < 50) load += Math.min(25, 50 - snapshot.governanceConstancyScore);
  if (snapshot.governanceConstancyScore < 35) load += 10;
  if (snapshot.warrantIntegrityScore < 45) load += 20;
  if (snapshot.warrantIntegrityScore < 35) load += 10;
  if (snapshot.warrantStrainIndex >= 55) load += 20;
  if (snapshot.warrantStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeClearanceIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.clearanceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.clearanceStrainIndex * 0.35));
  if (snapshot.warrantIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.warrantIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceConstancyScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernancePerseveranceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.clearanceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.clearanceStrainIndex * 0.32));
  if (snapshot.clearanceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.clearanceIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceConstancyScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthClearanceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.clearanceStrainIndex >= 55) {
    lines.push(
      `Clearance strain ${snapshot.clearanceStrainIndex} — stacked clearance review may exceed operator clearance capacity`
    );
  }
  if (snapshot.clearanceIntegrityScore < 45) {
    lines.push(
      `Clearance integrity ${snapshot.clearanceIntegrityScore} — align Co-Pilot clearances with Guardian clearance posture`
    );
  }
  if (snapshot.governancePerseveranceScore < 40) {
    lines.push(
      `Governance perseverance ${snapshot.governancePerseveranceScore} — little perseverance to sustain clearance oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeDispensationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governancePerseveranceScore < 50) load += Math.min(25, 50 - snapshot.governancePerseveranceScore);
  if (snapshot.governancePerseveranceScore < 35) load += 10;
  if (snapshot.clearanceIntegrityScore < 45) load += 20;
  if (snapshot.clearanceIntegrityScore < 35) load += 10;
  if (snapshot.clearanceStrainIndex >= 55) load += 20;
  if (snapshot.clearanceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeDispensationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.dispensationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.dispensationStrainIndex * 0.35));
  if (snapshot.clearanceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.clearanceIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governancePerseveranceScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceFortitudeScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.dispensationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.dispensationStrainIndex * 0.32));
  if (snapshot.dispensationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.dispensationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governancePerseveranceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthDispensationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.dispensationStrainIndex >= 55) {
    lines.push(
      `Dispensation strain ${snapshot.dispensationStrainIndex} — stacked dispensation review may exceed operator dispensation capacity`
    );
  }
  if (snapshot.dispensationIntegrityScore < 45) {
    lines.push(
      `Dispensation integrity ${snapshot.dispensationIntegrityScore} — align Co-Pilot dispensations with Guardian dispensation posture`
    );
  }
  if (snapshot.governanceFortitudeScore < 40) {
    lines.push(
      `Governance fortitude ${snapshot.governanceFortitudeScore} — little fortitude to sustain dispensation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeIndulgenceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceFortitudeScore < 50) load += Math.min(25, 50 - snapshot.governanceFortitudeScore);
  if (snapshot.governanceFortitudeScore < 35) load += 10;
  if (snapshot.dispensationIntegrityScore < 45) load += 20;
  if (snapshot.dispensationIntegrityScore < 35) load += 10;
  if (snapshot.dispensationStrainIndex >= 55) load += 20;
  if (snapshot.dispensationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeIndulgenceIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.indulgenceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.indulgenceStrainIndex * 0.35));
  if (snapshot.dispensationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.dispensationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceFortitudeScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceVigorScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.indulgenceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.indulgenceStrainIndex * 0.32));
  if (snapshot.indulgenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.indulgenceIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceFortitudeScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthIndulgenceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.indulgenceStrainIndex >= 55) {
    lines.push(
      `Indulgence strain ${snapshot.indulgenceStrainIndex} — stacked indulgence review may exceed operator indulgence capacity`
    );
  }
  if (snapshot.indulgenceIntegrityScore < 45) {
    lines.push(
      `Indulgence integrity ${snapshot.indulgenceIntegrityScore} — align Co-Pilot indulgences with Guardian indulgence posture`
    );
  }
  if (snapshot.governanceVigorScore < 40) {
    lines.push(
      `Governance vigor ${snapshot.governanceVigorScore} — little vigor to sustain indulgence oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeExemptionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceVigorScore < 50) load += Math.min(25, 50 - snapshot.governanceVigorScore);
  if (snapshot.governanceVigorScore < 35) load += 10;
  if (snapshot.indulgenceIntegrityScore < 45) load += 20;
  if (snapshot.indulgenceIntegrityScore < 35) load += 10;
  if (snapshot.indulgenceStrainIndex >= 55) load += 20;
  if (snapshot.indulgenceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeExemptionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.exemptionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.exemptionStrainIndex * 0.35));
  if (snapshot.indulgenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.indulgenceIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceVigorScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceStaminaScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.exemptionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.exemptionStrainIndex * 0.32));
  if (snapshot.exemptionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.exemptionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceVigorScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthExemptionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.exemptionStrainIndex >= 55) {
    lines.push(
      `Exemption strain ${snapshot.exemptionStrainIndex} — stacked exemption review may exceed operator exemption capacity`
    );
  }
  if (snapshot.exemptionIntegrityScore < 45) {
    lines.push(
      `Exemption integrity ${snapshot.exemptionIntegrityScore} — align Co-Pilot exemptions with Guardian exemption posture`
    );
  }
  if (snapshot.governanceStaminaScore < 40) {
    lines.push(
      `Governance stamina ${snapshot.governanceStaminaScore} — little stamina to sustain exemption oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeRemissionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceStaminaScore < 50) load += Math.min(25, 50 - snapshot.governanceStaminaScore);
  if (snapshot.governanceStaminaScore < 35) load += 10;
  if (snapshot.exemptionIntegrityScore < 45) load += 20;
  if (snapshot.exemptionIntegrityScore < 35) load += 10;
  if (snapshot.exemptionStrainIndex >= 55) load += 20;
  if (snapshot.exemptionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeRemissionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.remissionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.remissionStrainIndex * 0.35));
  if (snapshot.exemptionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.exemptionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceStaminaScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceMettleScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.remissionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.remissionStrainIndex * 0.32));
  if (snapshot.remissionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.remissionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceStaminaScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthRemissionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.remissionStrainIndex >= 55) {
    lines.push(
      `Remission strain ${snapshot.remissionStrainIndex} — stacked remission review may exceed operator remission capacity`
    );
  }
  if (snapshot.remissionIntegrityScore < 45) {
    lines.push(
      `Remission integrity ${snapshot.remissionIntegrityScore} — align Co-Pilot remissions with Guardian remission posture`
    );
  }
  if (snapshot.governanceMettleScore < 40) {
    lines.push(
      `Governance mettle ${snapshot.governanceMettleScore} — little mettle to sustain remission oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAbsolutionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceMettleScore < 50) load += Math.min(25, 50 - snapshot.governanceMettleScore);
  if (snapshot.governanceMettleScore < 35) load += 10;
  if (snapshot.remissionIntegrityScore < 45) load += 20;
  if (snapshot.remissionIntegrityScore < 35) load += 10;
  if (snapshot.remissionStrainIndex >= 55) load += 20;
  if (snapshot.remissionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAbsolutionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.absolutionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.absolutionStrainIndex * 0.35));
  if (snapshot.remissionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.remissionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceMettleScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceGritScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.absolutionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.absolutionStrainIndex * 0.32));
  if (snapshot.absolutionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.absolutionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceMettleScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAbsolutionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.absolutionStrainIndex >= 55) {
    lines.push(
      `Absolution strain ${snapshot.absolutionStrainIndex} — stacked absolution review may exceed operator absolution capacity`
    );
  }
  if (snapshot.absolutionIntegrityScore < 45) {
    lines.push(
      `Absolution integrity ${snapshot.absolutionIntegrityScore} — align Co-Pilot absolutions with Guardian absolution posture`
    );
  }
  if (snapshot.governanceGritScore < 40) {
    lines.push(
      `Governance grit ${snapshot.governanceGritScore} — little grit to sustain absolution oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAmnestyStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceGritScore < 50) load += Math.min(25, 50 - snapshot.governanceGritScore);
  if (snapshot.governanceGritScore < 35) load += 10;
  if (snapshot.absolutionIntegrityScore < 45) load += 20;
  if (snapshot.absolutionIntegrityScore < 35) load += 10;
  if (snapshot.absolutionStrainIndex >= 55) load += 20;
  if (snapshot.absolutionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAmnestyIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.amnestyStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.amnestyStrainIndex * 0.35));
  if (snapshot.absolutionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.absolutionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceGritScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceResolveScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.amnestyStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.amnestyStrainIndex * 0.32));
  if (snapshot.amnestyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.amnestyIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceGritScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAmnestyReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.amnestyStrainIndex >= 55) {
    lines.push(
      `Amnesty strain ${snapshot.amnestyStrainIndex} — stacked amnesty review may exceed operator amnesty capacity`
    );
  }
  if (snapshot.amnestyIntegrityScore < 45) {
    lines.push(
      `Amnesty integrity ${snapshot.amnestyIntegrityScore} — align Co-Pilot amnesties with Guardian amnesty posture`
    );
  }
  if (snapshot.governanceResolveScore < 40) {
    lines.push(
      `Governance resolve ${snapshot.governanceResolveScore} — little resolve to sustain amnesty oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function enrichSnapshotGuardianDepth(snapshot: GuardianCoPilotMonitorSnapshot): GuardianCoPilotMonitorSnapshot {
  const posture = deriveGuardianAdvisoryPosture(snapshot);
  const objectiveBehindSchedule = computeObjectiveBehindSchedule(snapshot);
  const copilotSpendingHeadroom = computeCopilotSpendingHeadroom(snapshot);
  const merged: GuardianCoPilotMonitorSnapshot = {
    ...snapshot,
    guardianAutomationLikelyBlocked: posture.automationLikelyBlocked,
    guardianConfirmationLikelyRequired: posture.confirmationLikelyRequired,
    objectiveBehindSchedule,
    copilotSpendingHeadroom,
  };
  const guardianRiskScore = computeGuardianRiskScore(merged);
  const withRisk: GuardianCoPilotMonitorSnapshot = {
    ...merged,
    guardianRiskScore,
    guardianRiskBand: classifyGuardianRiskBand(guardianRiskScore),
  };
  const withCoupling: GuardianCoPilotMonitorSnapshot = {
    ...withRisk,
    liquidityStressIndex: computeLiquidityStressIndex(withRisk),
    copilotTrustGapScore: computeCopilotTrustGapScore(withRisk),
    objectivePacePct: computeObjectivePacePct(withRisk),
    compositePressureIndex: 0,
    automationReadinessScore: 100,
    actionBurnPressure: 0,
  };
  const compositePressureIndex = computeCompositePressureIndex(withCoupling);
  const withPressure: GuardianCoPilotMonitorSnapshot = { ...withCoupling, compositePressureIndex };
  const withInterlock: GuardianCoPilotMonitorSnapshot = {
    ...withPressure,
    automationReadinessScore: computeAutomationReadinessScore(withPressure),
    actionBurnPressure: computeActionBurnPressure(withPressure),
    advisorySaturationIndex: 0,
    escalationLatchScore: 0,
    governanceCoherenceScore: 100,
  };
  const advisorySaturationIndex = computeAdvisorySaturationIndex(withInterlock);
  const withSaturation: GuardianCoPilotMonitorSnapshot = { ...withInterlock, advisorySaturationIndex };
  const governanceCoherenceScore = computeGovernanceCoherenceScore(withSaturation);
  const withGovernance: GuardianCoPilotMonitorSnapshot = { ...withSaturation, governanceCoherenceScore };
  const withLatch: GuardianCoPilotMonitorSnapshot = {
    ...withGovernance,
    escalationLatchScore: computeEscalationLatchScore(withGovernance),
    containmentBurdenIndex: 0,
    humanRelayPressure: 0,
    recoveryHeadroomScore: 100,
  };
  const containmentBurdenIndex = computeContainmentBurdenIndex(withLatch);
  const withBurden: GuardianCoPilotMonitorSnapshot = { ...withLatch, containmentBurdenIndex };
  const humanRelayPressure = computeHumanRelayPressure(withBurden);
  const withRelay: GuardianCoPilotMonitorSnapshot = { ...withBurden, humanRelayPressure };
  const withRecovery: GuardianCoPilotMonitorSnapshot = {
    ...withRelay,
    recoveryHeadroomScore: computeRecoveryHeadroomScore(withRelay),
    advisoryDepletionIndex: 0,
    operatorBandwidthScore: 100,
    continuityMarginScore: 100,
  };
  const advisoryDepletionIndex = computeAdvisoryDepletionIndex(withRecovery);
  const withDepletion: GuardianCoPilotMonitorSnapshot = { ...withRecovery, advisoryDepletionIndex };
  const operatorBandwidthScore = computeOperatorBandwidthScore(withDepletion);
  const withBandwidth: GuardianCoPilotMonitorSnapshot = { ...withDepletion, operatorBandwidthScore };
  const withContinuity: GuardianCoPilotMonitorSnapshot = {
    ...withBandwidth,
    continuityMarginScore: computeContinuityMarginScore(withBandwidth),
    stewardshipLoadIndex: 0,
    oversightCommitmentScore: 100,
    sustainabilityMarginScore: 100,
  };
  const stewardshipLoadIndex = computeStewardshipLoadIndex(withContinuity);
  const withLoad: GuardianCoPilotMonitorSnapshot = { ...withContinuity, stewardshipLoadIndex };
  const oversightCommitmentScore = computeOversightCommitmentScore(withLoad);
  const withOversight: GuardianCoPilotMonitorSnapshot = { ...withLoad, oversightCommitmentScore };
  const withSustainability: GuardianCoPilotMonitorSnapshot = {
    ...withOversight,
    sustainabilityMarginScore: computeSustainabilityMarginScore(withOversight),
    accountabilityLoadIndex: 0,
    delegationFidelityScore: 100,
    governanceEnduranceScore: 100,
  };
  const accountabilityLoadIndex = computeAccountabilityLoadIndex(withSustainability);
  const withAccountability: GuardianCoPilotMonitorSnapshot = { ...withSustainability, accountabilityLoadIndex };
  const delegationFidelityScore = computeDelegationFidelityScore(withAccountability);
  const withFidelity: GuardianCoPilotMonitorSnapshot = { ...withAccountability, delegationFidelityScore };
  const withEndurance: GuardianCoPilotMonitorSnapshot = {
    ...withFidelity,
    governanceEnduranceScore: computeGovernanceEnduranceScore(withFidelity),
    fiduciaryBurdenIndex: 0,
    trustAssuranceScore: 100,
    governanceDurabilityScore: 100,
  };
  const fiduciaryBurdenIndex = computeFiduciaryBurdenIndex(withEndurance);
  const withFiduciaryBurden: GuardianCoPilotMonitorSnapshot = { ...withEndurance, fiduciaryBurdenIndex };
  const trustAssuranceScore = computeTrustAssuranceScore(withFiduciaryBurden);
  const withAssurance: GuardianCoPilotMonitorSnapshot = { ...withFiduciaryBurden, trustAssuranceScore };
  const withDurability: GuardianCoPilotMonitorSnapshot = {
    ...withAssurance,
    governanceDurabilityScore: computeGovernanceDurabilityScore(withAssurance),
    covenantStrainIndex: 0,
    mandateIntegrityScore: 100,
    governanceTenacityScore: 100,
  };
  const covenantStrainIndex = computeCovenantStrainIndex(withDurability);
  const withCovenantStrain: GuardianCoPilotMonitorSnapshot = { ...withDurability, covenantStrainIndex };
  const mandateIntegrityScore = computeMandateIntegrityScore(withCovenantStrain);
  const withMandate: GuardianCoPilotMonitorSnapshot = { ...withCovenantStrain, mandateIntegrityScore };
  const withTenacity: GuardianCoPilotMonitorSnapshot = {
    ...withMandate,
    governanceTenacityScore: computeGovernanceTenacityScore(withMandate),
    charterStrainIndex: 0,
    authorityIntegrityScore: 100,
    governancePersistenceScore: 100,
  };
  const charterStrainIndex = computeCharterStrainIndex(withTenacity);
  const withCharterStrain: GuardianCoPilotMonitorSnapshot = { ...withTenacity, charterStrainIndex };
  const authorityIntegrityScore = computeAuthorityIntegrityScore(withCharterStrain);
  const withAuthority: GuardianCoPilotMonitorSnapshot = { ...withCharterStrain, authorityIntegrityScore };
  const withPersistence: GuardianCoPilotMonitorSnapshot = {
    ...withAuthority,
    governancePersistenceScore: computeGovernancePersistenceScore(withAuthority),
    legitimacyStrainIndex: 0,
    oversightIntegrityScore: 100,
    governanceContinuityScore: 100,
  };
  const legitimacyStrainIndex = computeLegitimacyStrainIndex(withPersistence);
  const withLegitimacyStrain: GuardianCoPilotMonitorSnapshot = { ...withPersistence, legitimacyStrainIndex };
  const oversightIntegrityScore = computeOversightIntegrityScore(withLegitimacyStrain);
  const withOversightIntegrity: GuardianCoPilotMonitorSnapshot = { ...withLegitimacyStrain, oversightIntegrityScore };
  const withGovernanceContinuity: GuardianCoPilotMonitorSnapshot = {
    ...withOversightIntegrity,
    governanceContinuityScore: computeGovernanceContinuityScore(withOversightIntegrity),
    complianceStrainIndex: 0,
    policyIntegrityScore: 100,
    governanceResilienceScore: 100,
  };
  const complianceStrainIndex = computeComplianceStrainIndex(withGovernanceContinuity);
  const withComplianceStrain: GuardianCoPilotMonitorSnapshot = { ...withGovernanceContinuity, complianceStrainIndex };
  const policyIntegrityScore = computePolicyIntegrityScore(withComplianceStrain);
  const withPolicy: GuardianCoPilotMonitorSnapshot = { ...withComplianceStrain, policyIntegrityScore };
  const withResilience: GuardianCoPilotMonitorSnapshot = {
    ...withPolicy,
    governanceResilienceScore: computeGovernanceResilienceScore(withPolicy),
    auditStrainIndex: 0,
    controlIntegrityScore: 100,
    governanceStabilityScore: 100,
  };
  const auditStrainIndex = computeAuditStrainIndex(withResilience);
  const withAuditStrain: GuardianCoPilotMonitorSnapshot = { ...withResilience, auditStrainIndex };
  const controlIntegrityScore = computeControlIntegrityScore(withAuditStrain);
  const withControl: GuardianCoPilotMonitorSnapshot = { ...withAuditStrain, controlIntegrityScore };
  const withStability: GuardianCoPilotMonitorSnapshot = {
    ...withControl,
    governanceStabilityScore: computeGovernanceStabilityScore(withControl),
    assuranceStrainIndex: 0,
    evidenceIntegrityScore: 100,
    governanceConfidenceScore: 100,
  };
  const assuranceStrainIndex = computeAssuranceStrainIndex(withStability);
  const withAssuranceStrain: GuardianCoPilotMonitorSnapshot = { ...withStability, assuranceStrainIndex };
  const evidenceIntegrityScore = computeEvidenceIntegrityScore(withAssuranceStrain);
  const withEvidence: GuardianCoPilotMonitorSnapshot = { ...withAssuranceStrain, evidenceIntegrityScore };
  const withConfidence: GuardianCoPilotMonitorSnapshot = {
    ...withEvidence,
    governanceConfidenceScore: computeGovernanceConfidenceScore(withEvidence),
    attestationStrainIndex: 0,
    attestationIntegrityScore: 100,
    governanceReliabilityScore: 100,
  };
  const attestationStrainIndex = computeAttestationStrainIndex(withConfidence);
  const withAttestationStrain: GuardianCoPilotMonitorSnapshot = { ...withConfidence, attestationStrainIndex };
  const attestationIntegrityScore = computeAttestationIntegrityScore(withAttestationStrain);
  const withAttestation: GuardianCoPilotMonitorSnapshot = { ...withAttestationStrain, attestationIntegrityScore };
  const withReliability: GuardianCoPilotMonitorSnapshot = {
    ...withAttestation,
    governanceReliabilityScore: computeGovernanceReliabilityScore(withAttestation),
    verificationStrainIndex: 0,
    verificationIntegrityScore: 100,
    governanceValidityScore: 100,
  };
  const verificationStrainIndex = computeVerificationStrainIndex(withReliability);
  const withVerificationStrain: GuardianCoPilotMonitorSnapshot = { ...withReliability, verificationStrainIndex };
  const verificationIntegrityScore = computeVerificationIntegrityScore(withVerificationStrain);
  const withVerification: GuardianCoPilotMonitorSnapshot = { ...withVerificationStrain, verificationIntegrityScore };
  const withValidity: GuardianCoPilotMonitorSnapshot = {
    ...withVerification,
    governanceValidityScore: computeGovernanceValidityScore(withVerification),
    validationStrainIndex: 0,
    validationIntegrityScore: 100,
    governanceSoundnessScore: 100,
  };
  const validationStrainIndex = computeValidationStrainIndex(withValidity);
  const withValidationStrain: GuardianCoPilotMonitorSnapshot = { ...withValidity, validationStrainIndex };
  const validationIntegrityScore = computeValidationIntegrityScore(withValidationStrain);
  const withValidation: GuardianCoPilotMonitorSnapshot = { ...withValidationStrain, validationIntegrityScore };
  const withSoundness: GuardianCoPilotMonitorSnapshot = {
    ...withValidation,
    governanceSoundnessScore: computeGovernanceSoundnessScore(withValidation),
    certificationStrainIndex: 0,
    certificationIntegrityScore: 100,
    governanceAuthenticityScore: 100,
  };
  const certificationStrainIndex = computeCertificationStrainIndex(withSoundness);
  const withCertificationStrain: GuardianCoPilotMonitorSnapshot = { ...withSoundness, certificationStrainIndex };
  const certificationIntegrityScore = computeCertificationIntegrityScore(withCertificationStrain);
  const withCertification: GuardianCoPilotMonitorSnapshot = { ...withCertificationStrain, certificationIntegrityScore };
  const withAuthenticity: GuardianCoPilotMonitorSnapshot = {
    ...withCertification,
    governanceAuthenticityScore: computeGovernanceAuthenticityScore(withCertification),
    accreditationStrainIndex: 0,
    accreditationIntegrityScore: 100,
    governanceCredibilityScore: 100,
  };
  const accreditationStrainIndex = computeAccreditationStrainIndex(withAuthenticity);
  const withAccreditationStrain: GuardianCoPilotMonitorSnapshot = { ...withAuthenticity, accreditationStrainIndex };
  const accreditationIntegrityScore = computeAccreditationIntegrityScore(withAccreditationStrain);
  const withAccreditation: GuardianCoPilotMonitorSnapshot = { ...withAccreditationStrain, accreditationIntegrityScore };
  const withCredibility: GuardianCoPilotMonitorSnapshot = {
    ...withAccreditation,
    governanceCredibilityScore: computeGovernanceCredibilityScore(withAccreditation),
    endorsementStrainIndex: 0,
    endorsementIntegrityScore: 100,
    governanceTrustworthinessScore: 100,
  };
  const endorsementStrainIndex = computeEndorsementStrainIndex(withCredibility);
  const withEndorsementStrain: GuardianCoPilotMonitorSnapshot = { ...withCredibility, endorsementStrainIndex };
  const endorsementIntegrityScore = computeEndorsementIntegrityScore(withEndorsementStrain);
  const withEndorsement: GuardianCoPilotMonitorSnapshot = { ...withEndorsementStrain, endorsementIntegrityScore };
  const withTrustworthiness: GuardianCoPilotMonitorSnapshot = {
    ...withEndorsement,
    governanceTrustworthinessScore: computeGovernanceTrustworthinessScore(withEndorsement),
    ratificationStrainIndex: 0,
    ratificationIntegrityScore: 100,
    governanceDependabilityScore: 100,
  };
  const ratificationStrainIndex = computeRatificationStrainIndex(withTrustworthiness);
  const withRatificationStrain: GuardianCoPilotMonitorSnapshot = { ...withTrustworthiness, ratificationStrainIndex };
  const ratificationIntegrityScore = computeRatificationIntegrityScore(withRatificationStrain);
  const withRatification: GuardianCoPilotMonitorSnapshot = { ...withRatificationStrain, ratificationIntegrityScore };
  const withDependability: GuardianCoPilotMonitorSnapshot = {
    ...withRatification,
    governanceDependabilityScore: computeGovernanceDependabilityScore(withRatification),
    authorizationStrainIndex: 0,
    authorizationIntegrityScore: 100,
    governanceSteadfastnessScore: 100,
  };
  const authorizationStrainIndex = computeAuthorizationStrainIndex(withDependability);
  const withAuthorizationStrain: GuardianCoPilotMonitorSnapshot = { ...withDependability, authorizationStrainIndex };
  const authorizationIntegrityScore = computeAuthorizationIntegrityScore(withAuthorizationStrain);
  const withAuthorization: GuardianCoPilotMonitorSnapshot = { ...withAuthorizationStrain, authorizationIntegrityScore };
  const withSteadfastness: GuardianCoPilotMonitorSnapshot = {
    ...withAuthorization,
    governanceSteadfastnessScore: computeGovernanceSteadfastnessScore(withAuthorization),
    affirmationStrainIndex: 0,
    affirmationIntegrityScore: 100,
    governanceResolutenessScore: 100,
  };
  const affirmationStrainIndex = computeAffirmationStrainIndex(withSteadfastness);
  const withAffirmationStrain: GuardianCoPilotMonitorSnapshot = { ...withSteadfastness, affirmationStrainIndex };
  const affirmationIntegrityScore = computeAffirmationIntegrityScore(withAffirmationStrain);
  const withAffirmation: GuardianCoPilotMonitorSnapshot = { ...withAffirmationStrain, affirmationIntegrityScore };
  const withResoluteness: GuardianCoPilotMonitorSnapshot = {
    ...withAffirmation,
    governanceResolutenessScore: computeGovernanceResolutenessScore(withAffirmation),
    sanctionStrainIndex: 0,
    sanctionIntegrityScore: 100,
    governanceFirmnessScore: 100,
  };
  const sanctionStrainIndex = computeSanctionStrainIndex(withResoluteness);
  const withSanctionStrain: GuardianCoPilotMonitorSnapshot = { ...withResoluteness, sanctionStrainIndex };
  const sanctionIntegrityScore = computeSanctionIntegrityScore(withSanctionStrain);
  const withSanction: GuardianCoPilotMonitorSnapshot = { ...withSanctionStrain, sanctionIntegrityScore };
  const withFirmness: GuardianCoPilotMonitorSnapshot = {
    ...withSanction,
    governanceFirmnessScore: computeGovernanceFirmnessScore(withSanction),
    warrantStrainIndex: 0,
    warrantIntegrityScore: 100,
    governanceConstancyScore: 100,
  };
  const warrantStrainIndex = computeWarrantStrainIndex(withFirmness);
  const withWarrantStrain: GuardianCoPilotMonitorSnapshot = { ...withFirmness, warrantStrainIndex };
  const warrantIntegrityScore = computeWarrantIntegrityScore(withWarrantStrain);
  const withWarrant: GuardianCoPilotMonitorSnapshot = { ...withWarrantStrain, warrantIntegrityScore };
  const withConstancy: GuardianCoPilotMonitorSnapshot = {
    ...withWarrant,
    governanceConstancyScore: computeGovernanceConstancyScore(withWarrant),
    clearanceStrainIndex: 0,
    clearanceIntegrityScore: 100,
    governancePerseveranceScore: 100,
  };
  const clearanceStrainIndex = computeClearanceStrainIndex(withConstancy);
  const withClearanceStrain: GuardianCoPilotMonitorSnapshot = { ...withConstancy, clearanceStrainIndex };
  const clearanceIntegrityScore = computeClearanceIntegrityScore(withClearanceStrain);
  const withClearance: GuardianCoPilotMonitorSnapshot = { ...withClearanceStrain, clearanceIntegrityScore };
  const withPerseverance: GuardianCoPilotMonitorSnapshot = {
    ...withClearance,
    governancePerseveranceScore: computeGovernancePerseveranceScore(withClearance),
    dispensationStrainIndex: 0,
    dispensationIntegrityScore: 100,
    governanceFortitudeScore: 100,
  };
  const dispensationStrainIndex = computeDispensationStrainIndex(withPerseverance);
  const withDispensationStrain: GuardianCoPilotMonitorSnapshot = { ...withPerseverance, dispensationStrainIndex };
  const dispensationIntegrityScore = computeDispensationIntegrityScore(withDispensationStrain);
  const withDispensation: GuardianCoPilotMonitorSnapshot = { ...withDispensationStrain, dispensationIntegrityScore };
  const withFortitude: GuardianCoPilotMonitorSnapshot = {
    ...withDispensation,
    governanceFortitudeScore: computeGovernanceFortitudeScore(withDispensation),
    indulgenceStrainIndex: 0,
    indulgenceIntegrityScore: 100,
    governanceVigorScore: 100,
  };
  const indulgenceStrainIndex = computeIndulgenceStrainIndex(withFortitude);
  const withIndulgenceStrain: GuardianCoPilotMonitorSnapshot = { ...withFortitude, indulgenceStrainIndex };
  const indulgenceIntegrityScore = computeIndulgenceIntegrityScore(withIndulgenceStrain);
  const withIndulgence: GuardianCoPilotMonitorSnapshot = { ...withIndulgenceStrain, indulgenceIntegrityScore };
  const withVigor: GuardianCoPilotMonitorSnapshot = {
    ...withIndulgence,
    governanceVigorScore: computeGovernanceVigorScore(withIndulgence),
    exemptionStrainIndex: 0,
    exemptionIntegrityScore: 100,
    governanceStaminaScore: 100,
  };
  const exemptionStrainIndex = computeExemptionStrainIndex(withVigor);
  const withExemptionStrain: GuardianCoPilotMonitorSnapshot = { ...withVigor, exemptionStrainIndex };
  const exemptionIntegrityScore = computeExemptionIntegrityScore(withExemptionStrain);
  const withExemption: GuardianCoPilotMonitorSnapshot = { ...withExemptionStrain, exemptionIntegrityScore };
  const withStamina: GuardianCoPilotMonitorSnapshot = {
    ...withExemption,
    governanceStaminaScore: computeGovernanceStaminaScore(withExemption),
    remissionStrainIndex: 0,
    remissionIntegrityScore: 100,
    governanceMettleScore: 100,
  };
  const remissionStrainIndex = computeRemissionStrainIndex(withStamina);
  const withRemissionStrain: GuardianCoPilotMonitorSnapshot = { ...withStamina, remissionStrainIndex };
  const remissionIntegrityScore = computeRemissionIntegrityScore(withRemissionStrain);
  const withRemission: GuardianCoPilotMonitorSnapshot = { ...withRemissionStrain, remissionIntegrityScore };
  const withMettle: GuardianCoPilotMonitorSnapshot = {
    ...withRemission,
    governanceMettleScore: computeGovernanceMettleScore(withRemission),
    absolutionStrainIndex: 0,
    absolutionIntegrityScore: 100,
    governanceGritScore: 100,
  };
  const absolutionStrainIndex = computeAbsolutionStrainIndex(withMettle);
  const withAbsolutionStrain: GuardianCoPilotMonitorSnapshot = { ...withMettle, absolutionStrainIndex };
  const absolutionIntegrityScore = computeAbsolutionIntegrityScore(withAbsolutionStrain);
  const withAbsolution: GuardianCoPilotMonitorSnapshot = { ...withAbsolutionStrain, absolutionIntegrityScore };
  const withGrit: GuardianCoPilotMonitorSnapshot = {
    ...withAbsolution,
    governanceGritScore: computeGovernanceGritScore(withAbsolution),
    amnestyStrainIndex: 0,
    amnestyIntegrityScore: 100,
    governanceResolveScore: 100,
  };
  const amnestyStrainIndex = computeAmnestyStrainIndex(withGrit);
  const withAmnestyStrain: GuardianCoPilotMonitorSnapshot = { ...withGrit, amnestyStrainIndex };
  const amnestyIntegrityScore = computeAmnestyIntegrityScore(withAmnestyStrain);
  const withAmnesty: GuardianCoPilotMonitorSnapshot = { ...withAmnestyStrain, amnestyIntegrityScore };
  return {
    ...withAmnesty,
    governanceResolveScore: computeGovernanceResolveScore(withAmnesty),
  };
}

export function runGuardianDepthUnitSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const out: Array<{ id: string; passed: boolean; detail: string }> = [];
  const ok = (id: string, fn: () => boolean) => {
    try {
      const passed = fn();
      out.push({ id, passed, detail: passed ? 'ok' : 'failed' });
    } catch (e) {
      out.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };
  ok('gd_blocks_critical', () =>
    guardianBlocksAutomation({ allowedToProceed: true, highestSeverity: 'critical', confirmationRequired: false }, 'major_mistakes')
  );
  ok('gd_max_confirm', () =>
    guardianBlocksAutomation({ allowedToProceed: true, highestSeverity: 'caution', confirmationRequired: true }, 'maximum_protection')
  );
  ok('gd_clear', () =>
    !guardianBlocksAutomation({ allowedToProceed: true, highestSeverity: 'none', confirmationRequired: false }, 'major_mistakes')
  );
  ok('gd_risk_score_band', () => {
    const snap = {
      guardianEnabled: true,
      cash: 10,
      minCashReserve: 500,
      debt: 0,
      maxSpendPerAction: 2500,
      guardianAutomationLikelyBlocked: true,
      guardianRequiresConfirmation: true,
      copilotAutonomousActive: true,
      takeoverSessionActive: false,
      takeoverSessionAgeTurns: 0,
      blockedContinueCount: 0,
      objectiveBehindSchedule: true,
      rivalVictoryProgressPct: 70,
      victoryThresholdPct: 80,
    } as GuardianCoPilotMonitorSnapshot;
    const score = computeGuardianRiskScore(snap);
    return score >= 70 && classifyGuardianRiskBand(score) === 'critical';
  });
  ok('gd_objective_behind', () => {
    const snap = {
      objectiveActive: true,
      objectiveProgressPct: 20,
      objectiveTurnsRemaining: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeObjectiveBehindSchedule(snap);
  });
  ok('gd_liquidity_stress', () => {
    const snap = {
      cash: 50,
      minCashReserve: 500,
      debt: 800,
      maxSpendPerAction: 2000,
      copilotSpendingHeadroom: 0,
    } as GuardianCoPilotMonitorSnapshot;
    return computeLiquidityStressIndex(snap) >= 60;
  });
  ok('gd_trust_gap', () => {
    const snap = {
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianEnabled: true,
      guardianAutomationLikelyBlocked: true,
      copilotHoldsControl: false,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCopilotTrustGapScore(snap) >= 50;
  });
  ok('gd_composite_pressure', () => {
    const snap = {
      liquidityStressIndex: 70,
      guardianRiskScore: 65,
      copilotTrustGapScore: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCompositePressureIndex(snap) >= 60;
  });
  ok('gd_automation_readiness', () => {
    const snap = {
      copilotEnabled: true,
      guardianEnabled: true,
      guardianAutomationLikelyBlocked: true,
      copilotTrustGapScore: 60,
      guardianConfirmationLikelyRequired: true,
      copilotHoldsControl: false,
      blockedContinueCount: 2,
      liquidityStressIndex: 55,
      compositePressureIndex: 58,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAutomationReadinessScore(snap) < 40;
  });
  ok('gd_action_burn', () => {
    const snap = {
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      maxSpendPerAction: 5000,
      cash: 400,
      objectiveBehindSchedule: true,
      objectiveActive: true,
      copilotSpendingHeadroom: 0,
    } as GuardianCoPilotMonitorSnapshot;
    return computeActionBurnPressure(snap) >= 50;
  });
  ok('gd_advisory_saturation', () => {
    const snap = {
      compositePressureIndex: 68,
      automationReadinessScore: 30,
      actionBurnPressure: 55,
      guardianRiskBand: 'critical' as const,
      liquidityStressIndex: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAdvisorySaturationIndex(snap) >= 70;
  });
  ok('gd_escalation_latch', () => {
    const snap = {
      guardianConfirmationLikelyRequired: true,
      guardianAutomationLikelyBlocked: true,
      takeoverSessionActive: true,
      automationReadinessScore: 30,
      blockedContinueCount: 2,
      compositePressureIndex: 65,
      advisorySaturationIndex: 60,
      guardianRiskBand: 'critical' as const,
      copilotHoldsControl: false,
      governanceCoherenceScore: 30,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEscalationLatchScore(snap) >= 65;
  });
  ok('gd_governance_coherence', () => {
    const snap = {
      copilotTrustGapScore: 70,
      guardianEnabled: false,
      copilotEnabled: true,
      guardianProtectionMaximum: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      copilotAuthorityMode: 'autonomous',
      guardianAutomationLikelyBlocked: true,
      compositePressureIndex: 60,
      advisorySaturationIndex: 65,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceCoherenceScore(snap) < 35;
  });
  ok('gd_containment_burden', () => {
    const snap = {
      advisorySaturationIndex: 72,
      escalationLatchScore: 68,
      governanceCoherenceScore: 30,
      compositePressureIndex: 62,
      guardianRiskBand: 'critical' as const,
      takeoverSessionActive: true,
    } as GuardianCoPilotMonitorSnapshot;
    return computeContainmentBurdenIndex(snap) >= 70;
  });
  ok('gd_human_relay', () => {
    const snap = {
      guardianConfirmationLikelyRequired: true,
      takeoverSessionActive: true,
      copilotHoldsControl: true,
      automationReadinessScore: 30,
      blockedContinueCount: 2,
      escalationLatchScore: 55,
      containmentBurdenIndex: 60,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeHumanRelayPressure(snap) >= 65;
  });
  ok('gd_recovery_headroom', () => {
    const snap = {
      containmentBurdenIndex: 75,
      humanRelayPressure: 70,
      liquidityStressIndex: 60,
      automationReadinessScore: 25,
      governanceCoherenceScore: 30,
      actionBurnPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRecoveryHeadroomScore(snap) < 35;
  });
  ok('gd_advisory_depletion', () => {
    const snap = {
      recoveryHeadroomScore: 30,
      containmentBurdenIndex: 72,
      humanRelayPressure: 55,
      advisorySaturationIndex: 60,
      guardianReplayCount: 3,
      blockedContinueCount: 2,
      actionBurnPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAdvisoryDepletionIndex(snap) >= 70;
  });
  ok('gd_operator_bandwidth', () => {
    const snap = {
      humanRelayPressure: 70,
      advisoryDepletionIndex: 65,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianConfirmationLikelyRequired: true,
      copilotHoldsControl: true,
      automationReadinessScore: 30,
    } as GuardianCoPilotMonitorSnapshot;
    return computeOperatorBandwidthScore(snap) < 40;
  });
  ok('gd_continuity_margin', () => {
    const snap = {
      advisoryDepletionIndex: 70,
      operatorBandwidthScore: 35,
      recoveryHeadroomScore: 30,
      governanceCoherenceScore: 35,
      liquidityStressIndex: 60,
    } as GuardianCoPilotMonitorSnapshot;
    return computeContinuityMarginScore(snap) < 35;
  });
  ok('gd_stewardship_load', () => {
    const snap = {
      continuityMarginScore: 30,
      advisoryDepletionIndex: 68,
      operatorBandwidthScore: 38,
      governanceCoherenceScore: 35,
      takeoverSessionActive: true,
      teamPlanPending: true,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeStewardshipLoadIndex(snap) >= 70;
  });
  ok('gd_oversight_commitment', () => {
    const snap = {
      stewardshipLoadIndex: 72,
      continuityMarginScore: 32,
      guardianEnabled: false,
      copilotEnabled: true,
      guardianConfirmationLikelyRequired: true,
      copilotAutonomousActive: true,
      humanRelayPressure: 55,
      governanceCoherenceScore: 35,
    } as GuardianCoPilotMonitorSnapshot;
    return computeOversightCommitmentScore(snap) < 40;
  });
  ok('gd_sustainability_margin', () => {
    const snap = {
      stewardshipLoadIndex: 78,
      oversightCommitmentScore: 32,
      recoveryHeadroomScore: 28,
      liquidityStressIndex: 62,
      continuityMarginScore: 28,
    } as GuardianCoPilotMonitorSnapshot;
    return computeSustainabilityMarginScore(snap) < 35;
  });
  ok('gd_accountability_load', () => {
    const snap = {
      sustainabilityMarginScore: 30,
      oversightCommitmentScore: 32,
      stewardshipLoadIndex: 72,
      copilotTrustGapScore: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      governanceCoherenceScore: 35,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAccountabilityLoadIndex(snap) >= 70;
  });
  ok('gd_delegation_fidelity', () => {
    const snap = {
      accountabilityLoadIndex: 72,
      copilotTrustGapScore: 65,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianConfirmationLikelyRequired: true,
      copilotHoldsControl: true,
      oversightCommitmentScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeDelegationFidelityScore(snap) < 40;
  });
  ok('gd_governance_endurance', () => {
    const snap = {
      accountabilityLoadIndex: 78,
      delegationFidelityScore: 32,
      recoveryHeadroomScore: 28,
      continuityMarginScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceEnduranceScore(snap) < 35;
  });
  ok('gd_fiduciary_burden', () => {
    const snap = {
      governanceEnduranceScore: 30,
      delegationFidelityScore: 32,
      accountabilityLoadIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      escalationLatchScore: 60,
    } as GuardianCoPilotMonitorSnapshot;
    return computeFiduciaryBurdenIndex(snap) >= 70;
  });
  ok('gd_trust_assurance', () => {
    const snap = {
      fiduciaryBurdenIndex: 72,
      delegationFidelityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      copilotHoldsControl: true,
      governanceEnduranceScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeTrustAssuranceScore(snap) < 40;
  });
  ok('gd_governance_durability', () => {
    const snap = {
      fiduciaryBurdenIndex: 78,
      trustAssuranceScore: 32,
      recoveryHeadroomScore: 28,
      sustainabilityMarginScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceDurabilityScore(snap) < 35;
  });
  ok('gd_covenant_strain', () => {
    const snap = {
      governanceDurabilityScore: 30,
      trustAssuranceScore: 32,
      fiduciaryBurdenIndex: 72,
      compositePressureIndex: 62,
      takeoverSessionActive: true,
      teamPlanPending: true,
      governanceCoherenceScore: 35,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCovenantStrainIndex(snap) >= 70;
  });
  ok('gd_mandate_integrity', () => {
    const snap = {
      covenantStrainIndex: 72,
      trustAssuranceScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      governanceDurabilityScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeMandateIntegrityScore(snap) < 40;
  });
  ok('gd_governance_tenacity', () => {
    const snap = {
      covenantStrainIndex: 78,
      mandateIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceEnduranceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceTenacityScore(snap) < 35;
  });
  ok('gd_charter_strain', () => {
    const snap = {
      governanceTenacityScore: 30,
      mandateIntegrityScore: 32,
      covenantStrainIndex: 72,
      actionBurnPressure: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      advisoryDepletionIndex: 58,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCharterStrainIndex(snap) >= 70;
  });
  ok('gd_authority_integrity', () => {
    const snap = {
      charterStrainIndex: 72,
      mandateIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      copilotAuthorityMode: 'autonomous',
      guardianProtectionMaximum: true,
      governanceTenacityScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuthorityIntegrityScore(snap) < 40;
  });
  ok('gd_governance_persistence', () => {
    const snap = {
      charterStrainIndex: 78,
      authorityIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceDurabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernancePersistenceScore(snap) < 35;
  });
  ok('gd_legitimacy_strain', () => {
    const snap = {
      governancePersistenceScore: 30,
      authorityIntegrityScore: 32,
      charterStrainIndex: 72,
      escalationLatchScore: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      containmentBurdenIndex: 58,
    } as GuardianCoPilotMonitorSnapshot;
    return computeLegitimacyStrainIndex(snap) >= 70;
  });
  ok('gd_oversight_integrity', () => {
    const snap = {
      legitimacyStrainIndex: 72,
      authorityIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      oversightCommitmentScore: 32,
      governancePersistenceScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeOversightIntegrityScore(snap) < 40;
  });
  ok('gd_governance_continuity', () => {
    const snap = {
      legitimacyStrainIndex: 78,
      oversightIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceTenacityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceContinuityScore(snap) < 35;
  });
  ok('gd_compliance_strain', () => {
    const snap = {
      governanceContinuityScore: 30,
      oversightIntegrityScore: 32,
      legitimacyStrainIndex: 72,
      governanceCoherenceScore: 35,
      takeoverSessionActive: true,
      teamPlanPending: true,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeComplianceStrainIndex(snap) >= 70;
  });
  ok('gd_policy_integrity', () => {
    const snap = {
      complianceStrainIndex: 72,
      oversightIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      governanceContinuityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computePolicyIntegrityScore(snap) < 40;
  });
  ok('gd_governance_resilience', () => {
    const snap = {
      complianceStrainIndex: 78,
      policyIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governancePersistenceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceResilienceScore(snap) < 35;
  });
  ok('gd_audit_strain', () => {
    const snap = {
      governanceResilienceScore: 30,
      policyIntegrityScore: 32,
      complianceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuditStrainIndex(snap) >= 70;
  });
  ok('gd_control_integrity', () => {
    const snap = {
      auditStrainIndex: 72,
      policyIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceResilienceScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeControlIntegrityScore(snap) < 40;
  });
  ok('gd_governance_stability', () => {
    const snap = {
      auditStrainIndex: 78,
      controlIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceContinuityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceStabilityScore(snap) < 35;
  });
  ok('gd_assurance_strain', () => {
    const snap = {
      governanceStabilityScore: 30,
      controlIntegrityScore: 32,
      auditStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAssuranceStrainIndex(snap) >= 70;
  });
  ok('gd_evidence_integrity', () => {
    const snap = {
      assuranceStrainIndex: 72,
      controlIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceStabilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEvidenceIntegrityScore(snap) < 40;
  });
  ok('gd_governance_confidence', () => {
    const snap = {
      assuranceStrainIndex: 78,
      evidenceIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceResilienceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceConfidenceScore(snap) < 35;
  });
  ok('gd_attestation_strain', () => {
    const snap = {
      governanceConfidenceScore: 30,
      evidenceIntegrityScore: 32,
      assuranceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAttestationStrainIndex(snap) >= 70;
  });
  ok('gd_attestation_integrity', () => {
    const snap = {
      attestationStrainIndex: 72,
      evidenceIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceConfidenceScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAttestationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_reliability', () => {
    const snap = {
      attestationStrainIndex: 78,
      attestationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceStabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceReliabilityScore(snap) < 35;
  });
  ok('gd_verification_strain', () => {
    const snap = {
      governanceReliabilityScore: 30,
      attestationIntegrityScore: 32,
      attestationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeVerificationStrainIndex(snap) >= 70;
  });
  ok('gd_verification_integrity', () => {
    const snap = {
      verificationStrainIndex: 72,
      attestationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceReliabilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeVerificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_validity', () => {
    const snap = {
      verificationStrainIndex: 78,
      verificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceReliabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceValidityScore(snap) < 35;
  });
  ok('gd_validation_strain', () => {
    const snap = {
      governanceValidityScore: 30,
      verificationIntegrityScore: 32,
      verificationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeValidationStrainIndex(snap) >= 70;
  });
  ok('gd_validation_integrity', () => {
    const snap = {
      validationStrainIndex: 72,
      verificationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceValidityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeValidationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_soundness', () => {
    const snap = {
      validationStrainIndex: 78,
      validationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceValidityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceSoundnessScore(snap) < 35;
  });
  ok('gd_certification_strain', () => {
    const snap = {
      governanceSoundnessScore: 30,
      validationIntegrityScore: 32,
      validationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCertificationStrainIndex(snap) >= 70;
  });
  ok('gd_certification_integrity', () => {
    const snap = {
      certificationStrainIndex: 72,
      validationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceSoundnessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCertificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_authenticity', () => {
    const snap = {
      certificationStrainIndex: 78,
      certificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceSoundnessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceAuthenticityScore(snap) < 35;
  });
  ok('gd_accreditation_strain', () => {
    const snap = {
      governanceAuthenticityScore: 30,
      certificationIntegrityScore: 32,
      certificationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAccreditationStrainIndex(snap) >= 70;
  });
  ok('gd_accreditation_integrity', () => {
    const snap = {
      accreditationStrainIndex: 72,
      certificationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceAuthenticityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAccreditationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_credibility', () => {
    const snap = {
      accreditationStrainIndex: 78,
      accreditationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceAuthenticityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceCredibilityScore(snap) < 35;
  });
  ok('gd_endorsement_strain', () => {
    const snap = {
      governanceCredibilityScore: 30,
      accreditationIntegrityScore: 32,
      accreditationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEndorsementStrainIndex(snap) >= 70;
  });
  ok('gd_endorsement_integrity', () => {
    const snap = {
      endorsementStrainIndex: 72,
      accreditationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceCredibilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEndorsementIntegrityScore(snap) < 40;
  });
  ok('gd_governance_trustworthiness', () => {
    const snap = {
      endorsementStrainIndex: 78,
      endorsementIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceCredibilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceTrustworthinessScore(snap) < 35;
  });
  ok('gd_ratification_strain', () => {
    const snap = {
      governanceTrustworthinessScore: 30,
      endorsementIntegrityScore: 32,
      endorsementStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRatificationStrainIndex(snap) >= 70;
  });
  ok('gd_ratification_integrity', () => {
    const snap = {
      ratificationStrainIndex: 72,
      endorsementIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceTrustworthinessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRatificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_dependability', () => {
    const snap = {
      ratificationStrainIndex: 78,
      ratificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceTrustworthinessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceDependabilityScore(snap) < 35;
  });
  ok('gd_authorization_strain', () => {
    const snap = {
      governanceDependabilityScore: 30,
      ratificationIntegrityScore: 32,
      ratificationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuthorizationStrainIndex(snap) >= 70;
  });
  ok('gd_authorization_integrity', () => {
    const snap = {
      authorizationStrainIndex: 72,
      ratificationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceDependabilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuthorizationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_steadfastness', () => {
    const snap = {
      authorizationStrainIndex: 78,
      authorizationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceDependabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceSteadfastnessScore(snap) < 35;
  });
  ok('gd_affirmation_strain', () => {
    const snap = {
      governanceSteadfastnessScore: 30,
      authorizationIntegrityScore: 32,
      authorizationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAffirmationStrainIndex(snap) >= 70;
  });
  ok('gd_affirmation_integrity', () => {
    const snap = {
      affirmationStrainIndex: 72,
      authorizationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceSteadfastnessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAffirmationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_resoluteness', () => {
    const snap = {
      affirmationStrainIndex: 78,
      affirmationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceSteadfastnessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceResolutenessScore(snap) < 35;
  });
  ok('gd_sanction_strain', () => {
    const snap = {
      governanceResolutenessScore: 30,
      affirmationIntegrityScore: 32,
      affirmationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeSanctionStrainIndex(snap) >= 70;
  });
  ok('gd_sanction_integrity', () => {
    const snap = {
      sanctionStrainIndex: 72,
      affirmationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceResolutenessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeSanctionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_firmness', () => {
    const snap = {
      sanctionStrainIndex: 78,
      sanctionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceResolutenessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceFirmnessScore(snap) < 35;
  });
  ok('gd_warrant_strain', () => {
    const snap = {
      governanceFirmnessScore: 30,
      sanctionIntegrityScore: 32,
      sanctionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeWarrantStrainIndex(snap) >= 70;
  });
  ok('gd_warrant_integrity', () => {
    const snap = {
      warrantStrainIndex: 72,
      sanctionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceFirmnessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeWarrantIntegrityScore(snap) < 40;
  });
  ok('gd_governance_constancy', () => {
    const snap = {
      warrantStrainIndex: 78,
      warrantIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceFirmnessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceConstancyScore(snap) < 35;
  });
  ok('gd_clearance_strain', () => {
    const snap = {
      governanceConstancyScore: 30,
      warrantIntegrityScore: 32,
      warrantStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeClearanceStrainIndex(snap) >= 70;
  });
  ok('gd_clearance_integrity', () => {
    const snap = {
      clearanceStrainIndex: 72,
      warrantIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceConstancyScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeClearanceIntegrityScore(snap) < 40;
  });
  ok('gd_governance_perseverance', () => {
    const snap = {
      clearanceStrainIndex: 78,
      clearanceIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceConstancyScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernancePerseveranceScore(snap) < 35;
  });
  ok('gd_dispensation_strain', () => {
    const snap = {
      governancePerseveranceScore: 30,
      clearanceIntegrityScore: 32,
      clearanceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeDispensationStrainIndex(snap) >= 70;
  });
  ok('gd_dispensation_integrity', () => {
    const snap = {
      dispensationStrainIndex: 72,
      clearanceIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governancePerseveranceScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeDispensationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_fortitude', () => {
    const snap = {
      dispensationStrainIndex: 78,
      dispensationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governancePerseveranceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceFortitudeScore(snap) < 35;
  });
  ok('gd_indulgence_strain', () => {
    const snap = {
      governanceFortitudeScore: 30,
      dispensationIntegrityScore: 32,
      dispensationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeIndulgenceStrainIndex(snap) >= 70;
  });
  ok('gd_indulgence_integrity', () => {
    const snap = {
      indulgenceStrainIndex: 72,
      dispensationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceFortitudeScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeIndulgenceIntegrityScore(snap) < 40;
  });
  ok('gd_governance_vigor', () => {
    const snap = {
      indulgenceStrainIndex: 78,
      indulgenceIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceFortitudeScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceVigorScore(snap) < 35;
  });
  ok('gd_exemption_strain', () => {
    const snap = {
      governanceVigorScore: 30,
      indulgenceIntegrityScore: 32,
      indulgenceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeExemptionStrainIndex(snap) >= 70;
  });
  ok('gd_exemption_integrity', () => {
    const snap = {
      exemptionStrainIndex: 72,
      indulgenceIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceVigorScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeExemptionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_stamina', () => {
    const snap = {
      exemptionStrainIndex: 78,
      exemptionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceVigorScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceStaminaScore(snap) < 35;
  });
  ok('gd_remission_strain', () => {
    const snap = {
      governanceStaminaScore: 30,
      exemptionIntegrityScore: 32,
      exemptionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRemissionStrainIndex(snap) >= 70;
  });
  ok('gd_remission_integrity', () => {
    const snap = {
      remissionStrainIndex: 72,
      exemptionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceStaminaScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRemissionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_mettle', () => {
    const snap = {
      remissionStrainIndex: 78,
      remissionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceStaminaScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceMettleScore(snap) < 35;
  });
  ok('gd_absolution_strain', () => {
    const snap = {
      governanceMettleScore: 30,
      remissionIntegrityScore: 32,
      remissionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAbsolutionStrainIndex(snap) >= 70;
  });
  ok('gd_absolution_integrity', () => {
    const snap = {
      absolutionStrainIndex: 72,
      remissionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceMettleScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAbsolutionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_grit', () => {
    const snap = {
      absolutionStrainIndex: 78,
      absolutionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceMettleScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceGritScore(snap) < 35;
  });
  ok('gd_amnesty_strain', () => {
    const snap = {
      governanceGritScore: 30,
      absolutionIntegrityScore: 32,
      absolutionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAmnestyStrainIndex(snap) >= 70;
  });
  ok('gd_amnesty_integrity', () => {
    const snap = {
      amnestyStrainIndex: 72,
      absolutionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceGritScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAmnestyIntegrityScore(snap) < 40;
  });
  ok('gd_governance_resolve', () => {
    const snap = {
      amnestyStrainIndex: 78,
      amnestyIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceGritScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceResolveScore(snap) < 35;
  });
  return out;
}
