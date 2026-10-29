import { ADVISORY_OPS_POLICY } from './policy.js';
import { assertAdvisoryRecommendationOnly, verifyAdvisoryGrounding } from './grounding.js';
import { ADVISORY_MONITOR_RULES } from './monitor-rules.js';
import {
  advisoryRecommendationsFromCoPilotEvaluation,
  createAdvisoryOpsFixtureSnapshot,
  evaluateAdvisoryScenario,
  materializeAdvisoryAlerts,
  runGuardianCoPilotAdvisoryCycle,
} from './advisory-cycle.js';
import {
  evaluateSuggestedActionGate,
  markSuggestedAction,
  partitionSuggestionFromExecution,
  stripExecutionFromCoPilotCandidate,
} from './suggestion-gate.js';
import { ADVISORY_SCENARIO_CATALOG } from './scenarios.js';
import {
  buildObjectiveAwareAdviceHints,
  parseObjectiveContextFromGame,
} from './objective-context.js';
import { buildGuardianCoPilotMonitorSnapshot } from './snapshot.js';
import {
  buildGuardianDepthAdviceLines,
  buildGuardianDepthCouplingReport,
  buildGuardianDepthInterlockReport,
  buildGuardianDepthStabilityReport,
  buildGuardianDepthResilienceReport,
  buildGuardianDepthContinuityReport,
  buildGuardianDepthStewardshipReport,
  buildGuardianDepthAccountabilityReport,
  buildGuardianDepthFiduciaryReport,
  buildGuardianDepthCovenantReport,
  buildGuardianDepthCharterReport,
  buildGuardianDepthLegitimacyReport,
  buildGuardianDepthComplianceReport,
  buildGuardianDepthAuditReport,
  buildGuardianDepthAssuranceReport,
  buildGuardianDepthAttestationReport,
  buildGuardianDepthVerificationReport,
  buildGuardianDepthValidationReport,
  buildGuardianDepthCertificationReport,
  buildGuardianDepthAccreditationReport,
  buildGuardianDepthEndorsementReport,
  buildGuardianDepthRatificationReport,
  buildGuardianDepthAuthorizationReport,
  buildGuardianDepthAffirmationReport,
  buildGuardianDepthSanctionReport,
  buildGuardianDepthWarrantReport,
  buildGuardianDepthClearanceReport,
  buildGuardianDepthDispensationReport,
  buildGuardianDepthIndulgenceReport,
  buildGuardianDepthExemptionReport,
  buildGuardianDepthRemissionReport,
  buildGuardianDepthAbsolutionReport,
  buildGuardianDepthAmnestyReport,
  buildGuardianDepthPardonReport,
  buildGuardianDepthClemencyReport,
  buildGuardianDepthReprieveReport,
  buildGuardianDepthAcquittalReport,
  buildGuardianDepthExonerationReport,
  buildGuardianDepthVindicationReport,
  buildGuardianDepthJustificationReport,
  buildGuardianDepthLegitimationReport,
  buildGuardianDepthSubstantiationReport,
  buildGuardianDepthCorroborationReport,
  buildGuardianDepthAuthenticationReport,
  buildGuardianDepthIdentificationReport,
  buildGuardianDepthDelegationReport,
  buildGuardianDepthEmpowermentReport,
  buildGuardianDepthEntrustmentReport,
  buildGuardianDepthAssignmentReport,
  buildGuardianDepthCommissionReport,
  buildGuardianDepthConfermentReport,
  buildGuardianDepthBestowalReport,
  runGuardianDepthUnitSelfTests,
} from './guardian-depth.js';
import type { AdvisoryRecommendation, Agent16SelfTestResult, AiSuggestedAction } from './types.js';

function check(
  results: Agent16SelfTestResult[],
  id: string,
  name: string,
  fn: () => boolean | string
): void {
  try {
    const out = fn();
    results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
  } catch (e) {
    results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
  }
}

export function runAgent16GuardianCoPilotSelfTests(): Agent16SelfTestResult[] {
  const results: Agent16SelfTestResult[] = [];
  const J = (v: unknown) => JSON.stringify(v);

  check(results, 'a16_policy', 'Advisory ops policy forbids execution and mutation', () =>
    ADVISORY_OPS_POLICY.mayExecuteActions === false &&
    ADVISORY_OPS_POLICY.mayMutateGameState === false &&
    ADVISORY_OPS_POLICY.mandate === 'recommendations_only'
  );

  check(results, 'a16_recommendation_flags', 'Every emitted recommendation is grounded and state-verified', () => {
    const cycle = runGuardianCoPilotAdvisoryCycle({
      gameState: {
        turnCounter: 4,
        day: 4,
        player: { id: 'player_1', money: 100 },
        gameSettings: { coPilotSettings: { enabled: true, spendingCaps: { minimumCashReserve: 250 } } },
      },
    });
    return (
      cycle.recommendations.length > 0 &&
      cycle.recommendations.every(r => assertAdvisoryRecommendationOnly(r) && verifyAdvisoryGrounding(r, cycle.snapshot))
    );
  });

  check(results, 'a16_deterministic', 'Same snapshot inputs → same advisory ordering', () => {
    const gs = {
      turnCounter: 7,
      day: 7,
      player: { id: 'p', money: 50, actionsUsedThisTurn: 3 },
      gameSettings: {
        playerActionsPerDay: 3,
        coPilotSettings: {
          enabled: true,
          authorityMode: 'autonomous',
          spendingCaps: { minimumCashReserve: 500, maximumSpendPerAction: 100 },
        },
      },
      coPilotBlockedContinueCount: 3,
    };
    const a = runGuardianCoPilotAdvisoryCycle({ gameState: gs });
    const b = runGuardianCoPilotAdvisoryCycle({ gameState: gs });
    return J(a.recommendations.map(r => r.id)) === J(b.recommendations.map(r => r.id));
  });

  check(results, 'a16_dedupe', 'materializeAdvisoryAlerts dedupes by dedupeKey', () => {
    const snap = createAdvisoryOpsFixtureSnapshot();
    const dup: AdvisoryRecommendation = {
      id: 'a',
      kind: 'alert',
      severity: 'high',
      category: 'x',
      title: 't',
      detail: 'd',
      recommendationOnly: true,
      mayExecute: false,
      grounding: [{ field: 'cash', label: 'Cash', value: snap.cash }],
      stateVerified: true,
      dedupeKey: 'k',
      turn: 1,
      day: 1,
      actorId: 'p',
      ruleId: 'test',
    };
    const out = materializeAdvisoryAlerts([dup, { ...dup, id: 'b', severity: 'low' }]);
    return out.length === 1 && out[0].severity === 'high';
  });

  check(results, 'a16_strip_execute', 'stripExecutionFromCoPilotCandidate removes execution hooks', () => {
    const s = stripExecutionFromCoPilotCandidate({
      label: 'Buy',
      execute: () => {},
      dispatch: () => {},
      autoApply: true,
    });
    return s.mayExecute === false && s.recommendationOnly === true && !('execute' in s) && !('dispatch' in s);
  });

  check(results, 'a16_partition', 'partitionSuggestionFromExecution never returns executable payload', () => {
    const { suggestion, executable } = partitionSuggestionFromExecution({
      label: 'Travel',
      mayExecute: true,
      execute: () => {},
    });
    return suggestion.mayExecute === false && executable === null;
  });

  check(results, 'a16_advisory_gate', 'Advisory autonomy never executes a suggestion', () => {
    const g = evaluateSuggestedActionGate({
      autonomy: 'advisory',
      copilotEnabled: true,
      action: { id: 'a', type: 'reserve_region', label: 'x', status: 'proposed' },
      alreadyCommittedIds: [],
    });
    return !g.allowed || 'advisory allowed execution';
  });

  check(results, 'a16_once', 'A suggested action executes at most once', () => {
    const a: AiSuggestedAction = { id: 'a', type: 'reserve_region', label: 'x', status: 'proposed' };
    const first = markSuggestedAction(a, 'executed', []);
    const second = markSuggestedAction(first.action, 'executed', first.committedIds);
    return first.executed && !second.executed || 'executed twice';
  });

  check(results, 'a16_copilot_advice', 'Co-Pilot evaluation maps to advisory copy only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot();
    const recs = advisoryRecommendationsFromCoPilotEvaluation(
      { topRecommendation: { id: 'c1', label: 'Travel', actionType: 'travel', execute: () => {} }, candidates: [] },
      snap
    );
    return (
      recs.length === 1 &&
      recs[0].mayExecute === false &&
      (/approval required/i.test(recs[0].title) || /without your confirmation/i.test(recs[0].detail))
    );
  });

  check(results, 'a16_objective_parse', 'Mission objectives parse into snapshot fields', () => {
    const gs = {
      turnCounter: 9,
      activeMission: {
        objectives: [
          {
            description: 'Deliver wheat to NSW',
            targetRegion: 'NSW',
            targetValue: 100,
            currentProgress: 20,
            isMandatory: true,
          },
        ],
      },
      player: { id: 'p1', money: 500, currentRegion: 'VIC' },
    };
    const snap = buildGuardianCoPilotMonitorSnapshot({ gameState: gs });
    return (
      snap.objectiveActive &&
      snap.objectiveProgressPct === 20 &&
      snap.objectiveTargetRegion === 'NSW' &&
      !snap.playerInObjectiveRegion
    );
  });

  check(results, 'a16_objective_hints', 'Objective-aware hints cite live snapshot fields only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      objectiveActive: true,
      objectivePrimaryLabel: 'Hold VIC',
      objectiveTargetRegion: 'VIC',
      region: 'NSW',
      playerInObjectiveRegion: false,
      apRemaining: 2,
      objectiveProgressPct: 15,
    });
    const hints = buildObjectiveAwareAdviceHints(snap);
    return hints.length >= 2 && hints.some(h => /VIC/.test(h)) && hints.every(h => !/execute/i.test(h));
  });

  check(results, 'a16_expansion_count', 'Round 46 scale wave brings monitor catalog to 586+ rules', () => {
    return ADVISORY_MONITOR_RULES.length >= 586;
  });

  check(results, 'a16_coupling_report', 'Guardian depth coupling report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 400,
      debt: 600,
      maxSpendPerAction: 8000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      objectiveActive: true,
      objectiveProgressPct: 12,
      objectiveTurnsRemaining: 2,
    });
    const report = buildGuardianDepthCouplingReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round4_metrics', 'Round 4 interlock metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 40,
      minCashReserve: 500,
      debt: 800,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
    });
    return snap.compositePressureIndex >= 40 && snap.automationReadinessScore <= 100 && snap.actionBurnPressure >= 0;
  });

  check(results, 'a16_stability_report', 'Guardian depth stability report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
    });
    const report = buildGuardianDepthStabilityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round5_metrics', 'Round 5 stability lattice metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 500,
      debt: 900,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
    });
    return (
      snap.advisorySaturationIndex >= 40 &&
      snap.escalationLatchScore >= 30 &&
      snap.governanceCoherenceScore <= 100
    );
  });

  check(results, 'a16_round6_metrics', 'Round 6 resilience envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    });
    return (
      snap.containmentBurdenIndex >= 40 &&
      snap.humanRelayPressure >= 35 &&
      snap.recoveryHeadroomScore <= 100
    );
  });

  check(results, 'a16_resilience_report', 'Guardian depth resilience report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    });
    const report = buildGuardianDepthResilienceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round7_metrics', 'Round 7 continuity envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 20,
      minCashReserve: 500,
      debt: 1100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.advisoryDepletionIndex >= 40 &&
      snap.operatorBandwidthScore <= 100 &&
      snap.continuityMarginScore <= 100
    );
  });

  check(results, 'a16_continuity_report', 'Guardian depth continuity report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 20,
      minCashReserve: 500,
      debt: 1100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthContinuityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round8_metrics', 'Round 8 stewardship envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.stewardshipLoadIndex >= 40 &&
      snap.oversightCommitmentScore <= 100 &&
      snap.sustainabilityMarginScore <= 100
    );
  });

  check(results, 'a16_stewardship_report', 'Guardian depth stewardship report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthStewardshipReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round9_metrics', 'Round 9 accountability envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.accountabilityLoadIndex >= 40 &&
      snap.delegationFidelityScore <= 100 &&
      snap.governanceEnduranceScore <= 100
    );
  });

  check(results, 'a16_accountability_report', 'Guardian depth accountability report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAccountabilityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round10_metrics', 'Round 10 fiduciary envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.fiduciaryBurdenIndex >= 40 &&
      snap.trustAssuranceScore <= 100 &&
      snap.governanceDurabilityScore <= 100
    );
  });

  check(results, 'a16_fiduciary_report', 'Guardian depth fiduciary report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthFiduciaryReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round11_metrics', 'Round 11 covenant envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.covenantStrainIndex >= 40 &&
      snap.mandateIntegrityScore <= 100 &&
      snap.governanceTenacityScore <= 100
    );
  });

  check(results, 'a16_covenant_report', 'Guardian depth covenant report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCovenantReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round12_metrics', 'Round 12 charter envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.charterStrainIndex >= 40 &&
      snap.authorityIntegrityScore <= 100 &&
      snap.governancePersistenceScore <= 100
    );
  });

  check(results, 'a16_charter_report', 'Guardian depth charter report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCharterReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round13_metrics', 'Round 13 legitimacy envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.legitimacyStrainIndex >= 40 &&
      snap.oversightIntegrityScore <= 100 &&
      snap.governanceContinuityScore <= 100
    );
  });

  check(results, 'a16_legitimacy_report', 'Guardian depth legitimacy report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthLegitimacyReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round14_metrics', 'Round 14 compliance envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.complianceStrainIndex >= 40 &&
      snap.policyIntegrityScore <= 100 &&
      snap.governanceResilienceScore <= 100
    );
  });

  check(results, 'a16_compliance_report', 'Guardian depth compliance report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthComplianceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round15_metrics', 'Round 15 audit envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.auditStrainIndex >= 40 &&
      snap.controlIntegrityScore <= 100 &&
      snap.governanceStabilityScore <= 100
    );
  });

  check(results, 'a16_audit_report', 'Guardian depth audit report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAuditReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round16_metrics', 'Round 16 assurance envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.assuranceStrainIndex >= 40 &&
      snap.evidenceIntegrityScore <= 100 &&
      snap.governanceConfidenceScore <= 100
    );
  });

  check(results, 'a16_assurance_report', 'Guardian depth assurance report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAssuranceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round17_metrics', 'Round 17 attestation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.attestationStrainIndex >= 40 &&
      snap.attestationIntegrityScore <= 100 &&
      snap.governanceReliabilityScore <= 100
    );
  });

  check(results, 'a16_attestation_report', 'Guardian depth attestation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAttestationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round18_metrics', 'Round 18 verification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.verificationStrainIndex >= 40 &&
      snap.verificationIntegrityScore <= 100 &&
      snap.governanceValidityScore <= 100
    );
  });

  check(results, 'a16_verification_report', 'Guardian depth verification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthVerificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round19_metrics', 'Round 19 validation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.validationStrainIndex >= 40 &&
      snap.validationIntegrityScore <= 100 &&
      snap.governanceSoundnessScore <= 100
    );
  });

  check(results, 'a16_validation_report', 'Guardian depth validation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthValidationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round20_metrics', 'Round 20 certification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.certificationStrainIndex >= 40 &&
      snap.certificationIntegrityScore <= 100 &&
      snap.governanceAuthenticityScore <= 100
    );
  });

  check(results, 'a16_certification_report', 'Guardian depth certification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCertificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round21_metrics', 'Round 21 accreditation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.accreditationStrainIndex >= 40 &&
      snap.accreditationIntegrityScore <= 100 &&
      snap.governanceCredibilityScore <= 100
    );
  });

  check(results, 'a16_accreditation_report', 'Guardian depth accreditation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAccreditationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round22_metrics', 'Round 22 endorsement envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.endorsementStrainIndex >= 40 &&
      snap.endorsementIntegrityScore <= 100 &&
      snap.governanceTrustworthinessScore <= 100
    );
  });

  check(results, 'a16_endorsement_report', 'Guardian depth endorsement report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthEndorsementReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round23_metrics', 'Round 23 ratification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.ratificationStrainIndex >= 40 &&
      snap.ratificationIntegrityScore <= 100 &&
      snap.governanceDependabilityScore <= 100
    );
  });

  check(results, 'a16_ratification_report', 'Guardian depth ratification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthRatificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round24_metrics', 'Round 24 authorization envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.authorizationStrainIndex >= 40 &&
      snap.authorizationIntegrityScore <= 100 &&
      snap.governanceSteadfastnessScore <= 100
    );
  });

  check(results, 'a16_authorization_report', 'Guardian depth authorization report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAuthorizationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round25_metrics', 'Round 25 affirmation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.affirmationStrainIndex >= 40 &&
      snap.affirmationIntegrityScore <= 100 &&
      snap.governanceResolutenessScore <= 100
    );
  });

  check(results, 'a16_affirmation_report', 'Guardian depth affirmation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAffirmationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round26_metrics', 'Round 26 sanction envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.sanctionStrainIndex >= 40 &&
      snap.sanctionIntegrityScore <= 100 &&
      snap.governanceFirmnessScore <= 100
    );
  });

  check(results, 'a16_sanction_report', 'Guardian depth sanction report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthSanctionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round27_metrics', 'Round 27 warrant envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.warrantStrainIndex >= 40 &&
      snap.warrantIntegrityScore <= 100 &&
      snap.governanceConstancyScore <= 100
    );
  });

  check(results, 'a16_warrant_report', 'Guardian depth warrant report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthWarrantReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round28_metrics', 'Round 28 clearance envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.clearanceStrainIndex >= 40 &&
      snap.clearanceIntegrityScore <= 100 &&
      snap.governancePerseveranceScore <= 100
    );
  });

  check(results, 'a16_clearance_report', 'Guardian depth clearance report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthClearanceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round29_metrics', 'Round 29 dispensation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.dispensationStrainIndex >= 40 &&
      snap.dispensationIntegrityScore <= 100 &&
      snap.governanceFortitudeScore <= 100
    );
  });

  check(results, 'a16_dispensation_report', 'Guardian depth dispensation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthDispensationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round30_metrics', 'Round 30 indulgence envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.indulgenceStrainIndex >= 40 &&
      snap.indulgenceIntegrityScore <= 100 &&
      snap.governanceVigorScore <= 100
    );
  });

  check(results, 'a16_indulgence_report', 'Guardian depth indulgence report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthIndulgenceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round31_metrics', 'Round 31 exemption envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.exemptionStrainIndex >= 40 &&
      snap.exemptionIntegrityScore <= 100 &&
      snap.governanceStaminaScore <= 100
    );
  });

  check(results, 'a16_exemption_report', 'Guardian depth exemption report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthExemptionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round32_metrics', 'Round 32 remission envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.remissionStrainIndex >= 40 &&
      snap.remissionIntegrityScore <= 100 &&
      snap.governanceMettleScore <= 100
    );
  });

  check(results, 'a16_remission_report', 'Guardian depth remission report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthRemissionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round33_metrics', 'Round 33 absolution envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.absolutionStrainIndex >= 40 &&
      snap.absolutionIntegrityScore <= 100 &&
      snap.governanceGritScore <= 100
    );
  });

  check(results, 'a16_absolution_report', 'Guardian depth absolution report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAbsolutionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round34_metrics', 'Round 34 amnesty envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.amnestyStrainIndex >= 40 &&
      snap.amnestyIntegrityScore <= 100 &&
      snap.governanceResolveScore <= 100
    );
  });

  check(results, 'a16_amnesty_report', 'Guardian depth amnesty report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAmnestyReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round35_metrics', 'Round 35 pardon envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.pardonStrainIndex >= 40 &&
      snap.pardonIntegrityScore <= 100 &&
      snap.governanceZealScore <= 100
    );
  });

  check(results, 'a16_pardon_report', 'Guardian depth pardon report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthPardonReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round36_metrics', 'Round 36 clemency envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.clemencyStrainIndex >= 40 &&
      snap.clemencyIntegrityScore <= 100 &&
      snap.governancePluckScore <= 100
    );
  });

  check(results, 'a16_clemency_report', 'Guardian depth clemency report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthClemencyReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round37_metrics', 'Round 37 reprieve envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.reprieveStrainIndex >= 40 &&
      snap.reprieveIntegrityScore <= 100 &&
      snap.governanceNerveScore <= 100
    );
  });

  check(results, 'a16_reprieve_report', 'Guardian depth reprieve report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthReprieveReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round38_metrics', 'Round 38 acquittal envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.acquittalStrainIndex >= 40 &&
      snap.acquittalIntegrityScore <= 100 &&
      snap.governanceMoxieScore <= 100
    );
  });

  check(results, 'a16_acquittal_report', 'Guardian depth acquittal report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAcquittalReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round39_metrics', 'Round 39 exoneration envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.exonerationStrainIndex >= 40 &&
      snap.exonerationIntegrityScore <= 100 &&
      snap.governanceSpunkScore <= 100
    );
  });

  check(results, 'a16_exoneration_report', 'Guardian depth exoneration report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthExonerationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round40_metrics', 'Round 40 vindication envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.vindicationStrainIndex >= 40 &&
      snap.vindicationIntegrityScore <= 100 &&
      snap.governanceDashScore <= 100
    );
  });

  check(results, 'a16_vindication_report', 'Guardian depth vindication report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthVindicationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round41_metrics', 'Round 41 justification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.justificationStrainIndex >= 40 &&
      snap.justificationIntegrityScore <= 100 &&
      snap.governanceBrioScore <= 100
    );
  });

  check(results, 'a16_justification_report', 'Guardian depth justification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthJustificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round42_metrics', 'Round 42 legitimation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.legitimationStrainIndex >= 40 &&
      snap.legitimationIntegrityScore <= 100 &&
      snap.governancePepScore <= 100
    );
  });

  check(results, 'a16_legitimation_report', 'Guardian depth legitimation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthLegitimationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round43_metrics', 'Round 43 substantiation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.substantiationStrainIndex >= 40 &&
      snap.substantiationIntegrityScore <= 100 &&
      snap.governanceZestScore <= 100
    );
  });

  check(results, 'a16_substantiation_report', 'Guardian depth substantiation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthSubstantiationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round44_metrics', 'Round 44 corroboration envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.corroborationStrainIndex >= 40 &&
      snap.corroborationIntegrityScore <= 100 &&
      snap.governanceElanScore <= 100
    );
  });

  check(results, 'a16_corroboration_report', 'Guardian depth corroboration report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCorroborationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round45_metrics', 'Round 45 authentication envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.authenticationStrainIndex >= 40 &&
      snap.authenticationIntegrityScore <= 100 &&
      snap.governanceVerveScore <= 100
    );
  });

  check(results, 'a16_authentication_report', 'Guardian depth authentication report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAuthenticationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round46_metrics', 'Round 46 identification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.identificationStrainIndex >= 40 &&
      snap.identificationIntegrityScore <= 100 &&
      snap.governancePanacheScore <= 100
    );
  });

  check(results, 'a16_identification_report', 'Guardian depth identification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthIdentificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round47_metrics', 'Round 47 delegation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.delegationStrainIndex >= 40 &&
      snap.delegationIntegrityScore <= 100 &&
      snap.governanceFlairScore <= 100
    );
  });

  check(results, 'a16_delegation_report', 'Guardian depth delegation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthDelegationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round48_metrics', 'Round 48 empowerment envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.empowermentStrainIndex >= 40 &&
      snap.empowermentIntegrityScore <= 100 &&
      snap.governanceGustoScore <= 100
    );
  });

  check(results, 'a16_empowerment_report', 'Guardian depth empowerment report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthEmpowermentReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round49_metrics', 'Round 49 entrustment envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.entrustmentStrainIndex >= 40 &&
      snap.entrustmentIntegrityScore <= 100 &&
      snap.governanceVimScore <= 100
    );
  });

  check(results, 'a16_entrustment_report', 'Guardian depth entrustment report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthEntrustmentReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round50_metrics', 'Round 50 assignment envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.assignmentStrainIndex >= 40 &&
      snap.assignmentIntegrityScore <= 100 &&
      snap.governanceVivacityScore <= 100
    );
  });

  check(results, 'a16_assignment_report', 'Guardian depth assignment report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAssignmentReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round51_metrics', 'Round 51 commission envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.commissionStrainIndex >= 40 &&
      snap.commissionIntegrityScore <= 100 &&
      snap.governanceVibrancyScore <= 100
    );
  });

  check(results, 'a16_commission_report', 'Guardian depth commission report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCommissionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round52_metrics', 'Round 52 conferment envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.confermentStrainIndex >= 40 &&
      snap.confermentIntegrityScore <= 100 &&
      snap.governanceVitalityScore <= 100
    );
  });

  check(results, 'a16_conferment_report', 'Guardian depth conferment report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthConfermentReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round54_metrics', 'Round 54 bestowal envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.bestowalStrainIndex >= 40 &&
      snap.bestowalIntegrityScore <= 100 &&
      snap.governanceAnimationScore <= 100
    );
  });

  check(results, 'a16_bestowal_report', 'Guardian depth bestowal report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthBestowalReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_interlock_report', 'Guardian depth interlock report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 500,
      debt: 900,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      copilotEnabled: true,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
    });
    const report = buildGuardianDepthInterlockReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round3_metrics', 'Round 3 depth metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({ cash: 50, minCashReserve: 400, debt: 700 });
    return snap.liquidityStressIndex >= 40 && snap.copilotSpendingHeadroom >= 0;
  });

  check(results, 'a16_depth_advice_lines', 'Guardian depth advice lines are non-executable strings', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      guardianEnabled: true,
      cash: 50,
      minCashReserve: 500,
      copilotHoldsControl: true,
    });
    const lines = buildGuardianDepthAdviceLines(snap);
    return lines.length > 0 && lines.every(l => typeof l === 'string' && !/\bexecute\b/i.test(l));
  });

  check(results, 'a16_snapshot_depth_enrich', 'Snapshot builder enriches Guardian depth flags', () => {
    const snap = buildGuardianCoPilotMonitorSnapshot({
      gameState: {
        player: { money: 50, currentRegion: 'NSW' },
        gameSettings: {
          guardianAiSettings: { enabled: true, protectionLevel: 'maximum_protection', responseMode: 'require_confirmation' },
          coPilotSettings: { enabled: true, autonomousSessionActive: true, authorityMode: 'autonomous', spendingCaps: { minimumCashReserve: 500 } },
        },
      },
    });
    return snap.guardianAutomationLikelyBlocked === true;
  });

  for (const t of runGuardianDepthUnitSelfTests()) {
    check(results, `a16_${t.id}`, `Guardian depth ${t.id}`, () => t.passed);
  }

  for (const rule of ADVISORY_MONITOR_RULES) {
    check(results, `a16_rule_${rule.id}`, `Rule ${rule.id} evaluates without throw on fixture`, () => {
      rule.evaluate(createAdvisoryOpsFixtureSnapshot());
      return true;
    });
  }

  for (const sc of ADVISORY_SCENARIO_CATALOG) {
    check(results, `a16_sc_${sc.id}`, `Scenario ${sc.id} fires expected rules`, () => {
      const out = evaluateAdvisoryScenario(sc);
      if (!out.recommendations.every(assertAdvisoryRecommendationOnly)) return 'recommendation flags';
      const missing = sc.expectRuleIds.filter(id => !out.fired.includes(id));
      if (missing.length) return `missing rules: ${missing.join(', ')}`;
      if (sc.expectRuleIds.length === 0 && out.fired.includes('cash_below_reserve')) return 'unexpected cash alert on healthy baseline';
      return true;
    });
  }

  return results;
}

export function summarizeAgent16SelfTests(results: Agent16SelfTestResult[]): { passed: number; failed: number; ok: boolean } {
  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, ok: failed === 0 };
}
