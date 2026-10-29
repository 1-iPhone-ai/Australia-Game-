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
import { isZenithCoalitionPerpetuity } from './coalition-zenith-perpetuity.ts';
import { isParagonCoalitionInfinity } from './coalition-paragon-infinity.ts';
import { isParamountCoalitionAscendancy } from './coalition-paramount-ascendancy.ts';
import { isImperialCoalitionPerpetuity } from './coalition-imperial-perpetuity.ts';
import { isCustodialCoalitionEternity } from './coalition-custodial-eternity.ts';
import { isVanguardCoalitionSynthesis } from './coalition-vanguard-synthesis.ts';
import { isSentinelCoalitionAscendancy } from './coalition-sentinel-ascendancy.ts';
import { isOracleCoalitionPerpetuity } from './coalition-oracle-perpetuity.ts';
import { isArchonCoalitionEternity } from './coalition-archon-eternity.ts';
import { isExarchCoalitionAscendancy } from './coalition-exarch-ascendancy.ts';
import { isPrimarchCoalitionPerpetuity } from './coalition-primarch-perpetuity.ts';
import { isPatriarchCoalitionEternity } from './coalition-patriarch-eternity.ts';
import { isMatriarchCoalitionAscendancy } from './coalition-matriarch-ascendancy.ts';
import { isMatriarchCoalitionPerpetuity } from './coalition-matriarch-perpetuity.ts';
import { isMatriarchCoalitionEternity } from './coalition-matriarch-eternity.ts';
import { isMatriarchCoalitionInfinity } from './coalition-matriarch-infinity.ts';
import { isMatriarchCoalitionTranscendence } from './coalition-matriarch-transcendence.ts';
import { isMatriarchCoalitionApotheosis } from './coalition-matriarch-apotheosis.ts';
import { isMatriarchCoalitionDeification } from './coalition-matriarch-deification.ts';
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
    zenithCoalitionPerpetuity: isZenithCoalitionPerpetuity(state),
    coalitionZenithPerpetuityStreakDays: state.coalitionZenithPerpetuityStreakDays ?? 0,
    paragonCoalitionInfinity: isParagonCoalitionInfinity(state),
    coalitionParagonInfinityStreakDays: state.coalitionParagonInfinityStreakDays ?? 0,
    paramountCoalitionAscendancy: isParamountCoalitionAscendancy(state),
    coalitionParamountAscendancyStreakDays: state.coalitionParamountAscendancyStreakDays ?? 0,
    imperialCoalitionPerpetuity: isImperialCoalitionPerpetuity(state),
    coalitionImperialPerpetuityStreakDays: state.coalitionImperialPerpetuityStreakDays ?? 0,
    custodialCoalitionEternity: isCustodialCoalitionEternity(state),
    coalitionCustodialEternityStreakDays: state.coalitionCustodialEternityStreakDays ?? 0,
    vanguardCoalitionSynthesis: isVanguardCoalitionSynthesis(state),
    coalitionVanguardSynthesisStreakDays: state.coalitionVanguardSynthesisStreakDays ?? 0,
    sentinelCoalitionAscendancy: isSentinelCoalitionAscendancy(state),
    coalitionSentinelAscendancyStreakDays: state.coalitionSentinelAscendancyStreakDays ?? 0,
    oracleCoalitionPerpetuity: isOracleCoalitionPerpetuity(state),
    coalitionOraclePerpetuityStreakDays: state.coalitionOraclePerpetuityStreakDays ?? 0,
    archonCoalitionEternity: isArchonCoalitionEternity(state),
    coalitionArchonEternityStreakDays: state.coalitionArchonEternityStreakDays ?? 0,
    exarchCoalitionAscendancy: isExarchCoalitionAscendancy(state),
    coalitionExarchAscendancyStreakDays: state.coalitionExarchAscendancyStreakDays ?? 0,
    primarchCoalitionPerpetuity: isPrimarchCoalitionPerpetuity(state),
    coalitionPrimarchPerpetuityStreakDays: state.coalitionPrimarchPerpetuityStreakDays ?? 0,
    patriarchCoalitionEternity: isPatriarchCoalitionEternity(state),
    coalitionPatriarchEternityStreakDays: state.coalitionPatriarchEternityStreakDays ?? 0,
    matriarchCoalitionAscendancy: isMatriarchCoalitionAscendancy(state),
    coalitionMatriarchAscendancyStreakDays: state.coalitionMatriarchAscendancyStreakDays ?? 0,
    matriarchCoalitionPerpetuity: isMatriarchCoalitionPerpetuity(state),
    coalitionMatriarchPerpetuityStreakDays: state.coalitionMatriarchPerpetuityStreakDays ?? 0,
    matriarchCoalitionEternity: isMatriarchCoalitionEternity(state),
    coalitionMatriarchEternityStreakDays: state.coalitionMatriarchEternityStreakDays ?? 0,
    matriarchCoalitionInfinity: isMatriarchCoalitionInfinity(state),
    coalitionMatriarchInfinityStreakDays: state.coalitionMatriarchInfinityStreakDays ?? 0,
    matriarchCoalitionTranscendence: isMatriarchCoalitionTranscendence(state),
    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,
    matriarchCoalitionApotheosis: isMatriarchCoalitionApotheosis(state),
    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,
    matriarchCoalitionDeification: isMatriarchCoalitionDeification(state),
    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,
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
