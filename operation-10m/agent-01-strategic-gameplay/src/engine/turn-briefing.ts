import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type { NationalPriorityRankingContext } from '../types/national-priority.ts';
import type { TurnStrategicBriefing } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { computeCommitmentPressure } from './commitment-journal.ts';
import { pendingTradeOffCount } from './commitment-journal.ts';
import { summarizeMandateProgress } from './strategic-mandate.ts';
import { classifyMandateDriftRisk } from './mandate-idle-drift.ts';
import { computeCoalitionBalanceIndex } from './coalition-balance.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import { isProlongedCoalitionCrisis } from './coalition-crisis-pressure.ts';
import { isSustainedCoalitionRecovery } from './coalition-recovery-pressure.ts';
import { isElevatedCoalitionVolatility } from './coalition-volatility-pressure.ts';
import { isPostStabilizationLockIn } from './coalition-lock-in.ts';
import { isIntegratedCoalitionMaturity } from './coalition-integrated-maturity.ts';
import { isSustainedIntegratedCoalitionStewardship } from './coalition-stewardship.ts';
import { isAnchoredCoalitionGovernance } from './coalition-anchored-governance.ts';
import { isInstitutionalCoalitionPermanence } from './coalition-institutional-permanence.ts';
import { isGenerationalCoalitionContinuity } from './coalition-generational-continuity.ts';
import { isCivilizationalCoalitionEndurance } from './coalition-civilizational-endurance.ts';
import { isTranscendentCoalitionLegacy } from './coalition-transcendent-legacy.ts';
import { isSovereignCoalitionContinuum } from './coalition-sovereign-continuum.ts';
import { isEternalCoalitionAscendance } from './coalition-eternal-ascendance.ts';
import { isInfiniteCoalitionPersistence } from './coalition-infinite-persistence.ts';
import { isPrimordialCoalitionContinuity } from './coalition-primordial-continuity.ts';
import { isAbsoluteCoalitionSanctity } from './coalition-absolute-sanctity.ts';
import { isUniversalCoalitionImmortality } from './coalition-universal-immortality.ts';
import { isCosmicCoalitionPerpetuity } from './coalition-cosmic-perpetuity.ts';
import { isGalacticCoalitionInfinity } from './coalition-galactic-infinity.ts';
import { isStellarCoalitionTranscendence } from './coalition-stellar-transcendence.ts';
import { isQuantumCoalitionOmnipresence } from './coalition-quantum-omnipresence.ts';
import { isMultiversalCoalitionPersistence } from './coalition-multiversal-persistence.ts';
import { isMetaversalCoalitionContinuity } from './coalition-metaversal-continuity.ts';
import { isOmniversalCoalitionSynthesis } from './coalition-omniversal-synthesis.ts';
import { isHyperversalCoalitionHarmonization } from './coalition-hyperversal-harmonization.ts';
import { isTranscendentCoalitionOmnium } from './coalition-transcendent-omnium.ts';
import { isSupremeCoalitionConvergence } from './coalition-supreme-convergence.ts';
import { isApexCoalitionTranscendence } from './coalition-apex-transcendence.ts';
import { listStakeholderWarnings } from './stakeholder-coalition.ts';
import { rankStrategicActions } from './strategic-recommendations.ts';
import { listStrategicActions } from '../catalog/strategic-action-catalog.ts';

export function buildTurnStrategicBriefing(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  priorityCtx: NationalPriorityRankingContext | null,
  budget: { actionsUsedThisTurn: number; actionsPerTurn: number },
): TurnStrategicBriefing {
  const ranked = rankStrategicActions(
    listStrategicActions(),
    contracts,
    budget,
    priorityCtx,
    state,
  );
  const topFeasible = ranked.find((r) => r.feasible);

  return {
    day: state.day,
    commitmentPressure: computeCommitmentPressure(state),
    pendingTradeOffCount: pendingTradeOffCount(state),
    mandateHeadline: summarizeMandateProgress(state),
    stakeholderWarnings: listStakeholderWarnings(state),
    coalitionBalanceIndex: computeCoalitionBalanceIndex(state.stakeholderSentiment),
    coalitionCrisisLevel: classifyCoalitionCrisisLevel(state),
    coalitionCrisisStreakDays: state.coalitionCrisisStreakDays ?? 0,
    coalitionRecoveryStreakDays: state.coalitionRecoveryStreakDays ?? 0,
    prolongedCoalitionCrisis: isProlongedCoalitionCrisis(state),
    sustainedCoalitionRecovery: isSustainedCoalitionRecovery(state),
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    elevatedCoalitionVolatility: isElevatedCoalitionVolatility(state),
    coalitionStabilizationStreakDays: state.coalitionStabilizationStreakDays ?? 0,
    postStabilizationLockIn: isPostStabilizationLockIn(state),
    coalitionLockInStreakDays: state.coalitionLockInStreakDays ?? 0,
    crossModuleSyncStreakDays: state.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturity: isIntegratedCoalitionMaturity(state),
    integratedCoalitionMaturityStreakDays: state.integratedCoalitionMaturityStreakDays ?? 0,
    sustainedIntegratedCoalitionStewardship: isSustainedIntegratedCoalitionStewardship(state),
    coalitionStewardshipStreakDays: state.coalitionStewardshipStreakDays ?? 0,
    anchoredCoalitionGovernance: isAnchoredCoalitionGovernance(state),
    coalitionAnchoredGovernanceStreakDays: state.coalitionAnchoredGovernanceStreakDays ?? 0,
    institutionalCoalitionPermanence: isInstitutionalCoalitionPermanence(state),
    coalitionInstitutionalPermanenceStreakDays: state.coalitionInstitutionalPermanenceStreakDays ?? 0,
    generationalCoalitionContinuity: isGenerationalCoalitionContinuity(state),
    coalitionGenerationalContinuityStreakDays: state.coalitionGenerationalContinuityStreakDays ?? 0,
    civilizationalCoalitionEndurance: isCivilizationalCoalitionEndurance(state),
    coalitionCivilizationalEnduranceStreakDays: state.coalitionCivilizationalEnduranceStreakDays ?? 0,
    transcendentCoalitionLegacy: isTranscendentCoalitionLegacy(state),
    coalitionTranscendentLegacyStreakDays: state.coalitionTranscendentLegacyStreakDays ?? 0,
    sovereignCoalitionContinuum: isSovereignCoalitionContinuum(state),
    coalitionSovereignContinuumStreakDays: state.coalitionSovereignContinuumStreakDays ?? 0,
    eternalCoalitionAscendance: isEternalCoalitionAscendance(state),
    coalitionEternalAscendanceStreakDays: state.coalitionEternalAscendanceStreakDays ?? 0,
    infiniteCoalitionPersistence: isInfiniteCoalitionPersistence(state),
    coalitionInfinitePersistenceStreakDays: state.coalitionInfinitePersistenceStreakDays ?? 0,
    primordialCoalitionContinuity: isPrimordialCoalitionContinuity(state),
    coalitionPrimordialContinuityStreakDays: state.coalitionPrimordialContinuityStreakDays ?? 0,
    absoluteCoalitionSanctity: isAbsoluteCoalitionSanctity(state),
    coalitionAbsoluteSanctityStreakDays: state.coalitionAbsoluteSanctityStreakDays ?? 0,
    universalCoalitionImmortality: isUniversalCoalitionImmortality(state),
    coalitionUniversalImmortalityStreakDays: state.coalitionUniversalImmortalityStreakDays ?? 0,
    cosmicCoalitionPerpetuity: isCosmicCoalitionPerpetuity(state),
    coalitionCosmicPerpetuityStreakDays: state.coalitionCosmicPerpetuityStreakDays ?? 0,
    galacticCoalitionInfinity: isGalacticCoalitionInfinity(state),
    coalitionGalacticInfinityStreakDays: state.coalitionGalacticInfinityStreakDays ?? 0,
    stellarCoalitionTranscendence: isStellarCoalitionTranscendence(state),
    coalitionStellarTranscendenceStreakDays: state.coalitionStellarTranscendenceStreakDays ?? 0,
    quantumCoalitionOmnipresence: isQuantumCoalitionOmnipresence(state),
    coalitionQuantumOmnipresenceStreakDays: state.coalitionQuantumOmnipresenceStreakDays ?? 0,
    multiversalCoalitionPersistence: isMultiversalCoalitionPersistence(state),
    coalitionMultiversalPersistenceStreakDays: state.coalitionMultiversalPersistenceStreakDays ?? 0,
    metaversalCoalitionContinuity: isMetaversalCoalitionContinuity(state),
    coalitionMetaversalContinuityStreakDays: state.coalitionMetaversalContinuityStreakDays ?? 0,
    omniversalCoalitionSynthesis: isOmniversalCoalitionSynthesis(state),
    coalitionOmniversalSynthesisStreakDays: state.coalitionOmniversalSynthesisStreakDays ?? 0,
    hyperversalCoalitionHarmonization: isHyperversalCoalitionHarmonization(state),
    coalitionHyperversalHarmonizationStreakDays:
      state.coalitionHyperversalHarmonizationStreakDays ?? 0,
    transcendentCoalitionOmnium: isTranscendentCoalitionOmnium(state),
    coalitionTranscendentOmniumStreakDays: state.coalitionTranscendentOmniumStreakDays ?? 0,
    supremeCoalitionConvergence: isSupremeCoalitionConvergence(state),
    coalitionSupremeConvergenceStreakDays: state.coalitionSupremeConvergenceStreakDays ?? 0,
    apexCoalitionTranscendence: isApexCoalitionTranscendence(state),
    coalitionApexTranscendenceStreakDays: state.coalitionApexTranscendenceStreakDays ?? 0,
    mandateDriftRisk: classifyMandateDriftRisk(state),
    completedActionCount: state.completedActionIds.length,
    activeChoiceId: state.activeChoice?.choiceId ?? null,
    ...(topFeasible
      ? {
          topRecommendationActionId: topFeasible.actionId,
          topRecommendationTitle: topFeasible.title,
        }
      : {}),
  };
}
