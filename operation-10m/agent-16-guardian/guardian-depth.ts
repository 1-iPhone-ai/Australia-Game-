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
  return {
    ...withGovernance,
    escalationLatchScore: computeEscalationLatchScore(withGovernance),
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
  return out;
}
