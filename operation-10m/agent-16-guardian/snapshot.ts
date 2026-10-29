import type { BuildMonitorSnapshotInput, GuardianCoPilotMonitorSnapshot } from './types.js';
import { mergeObjectiveContextIntoSnapshot, parseObjectiveContextFromGame } from './objective-context.js';
import { enrichSnapshotGuardianDepth } from './guardian-depth.js';

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function getRemainingActionPoints(player: Record<string, unknown>, settings: Record<string, unknown>): number {
  if (settings && settings.actionLimitsEnabled === false) {
    if (typeof player?.actionPoints === 'number') return Math.max(0, player.actionPoints);
    return Number.POSITIVE_INFINITY;
  }
  const isAi = Boolean(player?.isAi || player?.kind === 'ai');
  const maxActions = isAi ? num(settings?.aiActionsPerDay, 3) : num(settings?.playerActionsPerDay, 3);
  const used = num(player?.actionsUsedThisTurn);
  const granted = num(player?.overrideActionsGranted);
  return Math.max(0, maxActions + granted - used);
}

function sanitizeGuardianAiSettings(raw: unknown): { enabled: boolean; protectionLevel: string; responseMode: string } {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    enabled: src.enabled !== false,
    protectionLevel: String(src.protectionLevel || 'major_mistakes'),
    responseMode: String(src.responseMode || 'confirm_risky'),
  };
}

function sanitizeCoPilotSettings(raw: unknown): {
  enabled: boolean;
  authorityMode: string;
  autonomousSessionActive: boolean;
  spendingCaps: { minimumCashReserve: number; maximumSpendPerAction: number };
} {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const caps = (src.spendingCaps && typeof src.spendingCaps === 'object' ? src.spendingCaps : {}) as Record<
    string,
    unknown
  >;
  return {
    enabled: Boolean(src.enabled),
    authorityMode: String(src.authorityMode || 'assist'),
    autonomousSessionActive: Boolean(src.autonomousSessionActive),
    spendingCaps: {
      minimumCashReserve: num(caps.minimumCashReserve, 250),
      maximumSpendPerAction: num(caps.maximumSpendPerAction, 2500),
    },
  };
}

function deriveCopilotHoldsControl(
  gs: Record<string, unknown>,
  settings: Record<string, unknown>,
  takeover: BuildMonitorSnapshotInput['takeoverSession']
): boolean {
  if (typeof gs.copilotHoldsControl === 'boolean') return gs.copilotHoldsControl;
  const session = takeover ?? (gs.takeoverSession as BuildMonitorSnapshotInput['takeoverSession']);
  if (session && session.status !== 'ended') return true;
  const cp = sanitizeCoPilotSettings(settings.coPilotSettings || gs.coPilotSettings);
  if (!cp.enabled) return false;
  return cp.authorityMode === 'rescue' || cp.authorityMode === 'autonomous';
}

export function buildGuardianCoPilotMonitorSnapshot(input: BuildMonitorSnapshotInput): GuardianCoPilotMonitorSnapshot {
  const gs = input.gameState || {};
  const player = (input.player || gs.player || {}) as Record<string, unknown>;
  const settings = (input.gameSettings || gs.gameSettings || {}) as Record<string, unknown>;
  const actorId = String(player.id || gs.humanPlayerId || 'player_1');
  const turn = num(gs.turnCounter, num(gs.turn, 1));
  const day = num(gs.day, turn);
  const apRemaining = getRemainingActionPoints(player, settings);
  const apPerDay = num(settings.playerActionsPerDay, 3);
  const actionsUsedThisTurn = num(player.actionsUsedThisTurn, Math.max(0, apPerDay - apRemaining));
  const cash = num(player.money);
  const debt = num(player.debt, num(player.loans));
  const region = String(player.currentRegion || player.location || 'NSW');
  const guardian = sanitizeGuardianAiSettings(settings.guardianAiSettings);
  const cp = sanitizeCoPilotSettings(settings.coPilotSettings || gs.coPilotSettings);
  const minCashReserve = cp.spendingCaps.minimumCashReserve;
  const maxSpendPerAction = cp.spendingCaps.maximumSpendPerAction;
  const takeover = input.takeoverSession ?? (gs.takeoverSession as BuildMonitorSnapshotInput['takeoverSession']);
  const takeoverSessionActive = Boolean(takeover && takeover.status !== 'ended');
  const takeoverSessionAgeTurns =
    takeoverSessionActive && typeof takeover?.startedTurn === 'number' ? Math.max(0, turn - takeover.startedTurn) : 0;
  const contracts = gs.contracts || gs.activeContracts || {};
  const contractList = Array.isArray(contracts) ? contracts : Object.values(contracts || {});
  const activeContractCount = contractList.filter(
    (c: unknown) => c && typeof c === 'object' && ((c as Record<string, unknown>).status === 'active' || (c as Record<string, unknown>).status === 'in_progress')
  ).length;
  const expiringContractCount = contractList.filter((c: unknown) => {
    if (!c || typeof c !== 'object') return false;
    const row = c as Record<string, unknown>;
    if (row.status !== 'active') return false;
    const rem =
      typeof row.turnsRemaining === 'number'
        ? row.turnsRemaining
        : typeof row.deadlineTurn === 'number'
          ? row.deadlineTurn - turn
          : 99;
    return rem <= 2;
  }).length;
  const replay = gs.guardianReplayEvents;
  const guardianReplayCount = Array.isArray(replay) ? replay.length : 0;
  const teamPlans = (gs.teamStrategicPlansByTeam || {}) as Record<string, { status?: string }>;
  const teamPlanPending = Object.values(teamPlans).some(p => p && p.status === 'pending_approval');
  const focus = (gs.currentFocus || gs.objectiveFocus) as { regionId?: string; region?: string } | null;
  const objectiveRegion = focus?.regionId || focus?.region || null;
  const objectiveCtx = parseObjectiveContextFromGame(gs, region);

  const base: GuardianCoPilotMonitorSnapshot = {
    turn,
    day,
    actorId,
    cash,
    debt,
    apRemaining,
    apPerDay,
    actionsUsedThisTurn,
    region,
    guardianEnabled: guardian.enabled,
    guardianProtectionLevel: guardian.protectionLevel,
    guardianResponseMode: guardian.responseMode,
    copilotEnabled: cp.enabled,
    copilotAuthorityMode: cp.authorityMode,
    copilotHoldsControl: deriveCopilotHoldsControl(gs, settings, takeover),
    copilotAutonomousActive: cp.autonomousSessionActive,
    takeoverSessionActive,
    takeoverSessionAgeTurns,
    minCashReserve,
    maxSpendPerAction,
    blockedContinueCount: num(gs.coPilotBlockedContinueCount),
    guardianReplayCount,
    activeContractCount,
    expiringContractCount,
    teamPlanPending,
    objectiveRegion: objectiveRegion ? String(objectiveRegion) : null,
    objectiveActive: false,
    objectivePrimaryLabel: null,
    objectiveTargetRegion: null,
    objectiveProgressPct: null,
    objectiveTurnsRemaining: null,
    playerInObjectiveRegion: true,
    rivalVictoryProgressPct: null,
    victoryThresholdPct: 80,
    guardianRequiresConfirmation: guardian.responseMode === 'require_confirmation',
    guardianProtectionMaximum: guardian.protectionLevel === 'maximum_protection',
    guardianAutomationLikelyBlocked: false,
    guardianConfirmationLikelyRequired: false,
    guardianRiskScore: 0,
    guardianRiskBand: 'low',
    copilotSpendingHeadroom: 0,
    objectiveBehindSchedule: false,
    liquidityStressIndex: 0,
    copilotTrustGapScore: 0,
    objectivePacePct: null,
    compositePressureIndex: 0,
    automationReadinessScore: 100,
    actionBurnPressure: 0,
    advisorySaturationIndex: 0,
    escalationLatchScore: 0,
    governanceCoherenceScore: 100,
    containmentBurdenIndex: 0,
    humanRelayPressure: 0,
    recoveryHeadroomScore: 100,
    advisoryDepletionIndex: 0,
    operatorBandwidthScore: 100,
    continuityMarginScore: 100,
    stewardshipLoadIndex: 0,
    oversightCommitmentScore: 100,
    sustainabilityMarginScore: 100,
    accountabilityLoadIndex: 0,
    delegationFidelityScore: 100,
    governanceEnduranceScore: 100,
    fiduciaryBurdenIndex: 0,
    trustAssuranceScore: 100,
    governanceDurabilityScore: 100,
    covenantStrainIndex: 0,
    mandateIntegrityScore: 100,
    governanceTenacityScore: 100,
    charterStrainIndex: 0,
    authorityIntegrityScore: 100,
    governancePersistenceScore: 100,
    legitimacyStrainIndex: 0,
    oversightIntegrityScore: 100,
    governanceContinuityScore: 100,
    complianceStrainIndex: 0,
    policyIntegrityScore: 100,
    governanceResilienceScore: 100,
    auditStrainIndex: 0,
    controlIntegrityScore: 100,
    governanceStabilityScore: 100,
    assuranceStrainIndex: 0,
    evidenceIntegrityScore: 100,
    governanceConfidenceScore: 100,
    attestationStrainIndex: 0,
    attestationIntegrityScore: 100,
    governanceReliabilityScore: 100,
    verificationStrainIndex: 0,
    verificationIntegrityScore: 100,
    governanceValidityScore: 100,
    validationStrainIndex: 0,
    validationIntegrityScore: 100,
    governanceSoundnessScore: 100,
    certificationStrainIndex: 0,
    certificationIntegrityScore: 100,
    governanceAuthenticityScore: 100,
    accreditationStrainIndex: 0,
    accreditationIntegrityScore: 100,
    governanceCredibilityScore: 100,
    endorsementStrainIndex: 0,
    endorsementIntegrityScore: 100,
    governanceTrustworthinessScore: 100,
    ratificationStrainIndex: 0,
    ratificationIntegrityScore: 100,
    governanceDependabilityScore: 100,
    authorizationStrainIndex: 0,
    authorizationIntegrityScore: 100,
    governanceSteadfastnessScore: 100,
    affirmationStrainIndex: 0,
    affirmationIntegrityScore: 100,
    governanceResolutenessScore: 100,
    sanctionStrainIndex: 0,
    sanctionIntegrityScore: 100,
    governanceFirmnessScore: 100,
    warrantStrainIndex: 0,
    warrantIntegrityScore: 100,
    governanceConstancyScore: 100,
    clearanceStrainIndex: 0,
    clearanceIntegrityScore: 100,
    governancePerseveranceScore: 100,
    dispensationStrainIndex: 0,
    dispensationIntegrityScore: 100,
    governanceFortitudeScore: 100,
    indulgenceStrainIndex: 0,
    indulgenceIntegrityScore: 100,
    governanceVigorScore: 100,
    exemptionStrainIndex: 0,
    exemptionIntegrityScore: 100,
    governanceStaminaScore: 100,
    remissionStrainIndex: 0,
    remissionIntegrityScore: 100,
    governanceMettleScore: 100,
    absolutionStrainIndex: 0,
    absolutionIntegrityScore: 100,
    governanceGritScore: 100,
    amnestyStrainIndex: 0,
    amnestyIntegrityScore: 100,
    governanceResolveScore: 100,
    pardonStrainIndex: 0,
    pardonIntegrityScore: 100,
    governanceZealScore: 100,
  };

  return enrichSnapshotGuardianDepth(mergeObjectiveContextIntoSnapshot(base, objectiveCtx));
}
