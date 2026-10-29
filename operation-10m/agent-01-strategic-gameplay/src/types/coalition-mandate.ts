import type { NationalPriorityId } from './national-priority.ts';

export type StakeholderGroupId =
  | 'industry'
  | 'households'
  | 'regions'
  | 'public_services';

export type MandateMilestoneId =
  | 'mandate_priority_engaged'
  | 'mandate_priority_momentum'
  | 'mandate_priority_leadership';

export interface PriorityMandateTrack {
  priorityId: NationalPriorityId;
  points: number;
  milestonesUnlocked: MandateMilestoneId[];
}

export type MandateProgress = Partial<Record<NationalPriorityId, PriorityMandateTrack>>;

export type StakeholderSentiment = Record<StakeholderGroupId, number>;

export type CoalitionCrisisLevel = 'stable' | 'strained' | 'acute';

export interface TurnStrategicBriefing {
  day: number;
  commitmentPressure: number;
  pendingTradeOffCount: number;
  mandateHeadline: string;
  stakeholderWarnings: string[];
  completedActionCount: number;
  activeChoiceId: string | null;
  coalitionBalanceIndex: number;
  coalitionCrisisLevel: CoalitionCrisisLevel;
  coalitionCrisisStreakDays: number;
  coalitionRecoveryStreakDays: number;
  prolongedCoalitionCrisis: boolean;
  sustainedCoalitionRecovery: boolean;
  coalitionVolatilityEvents: number;
  elevatedCoalitionVolatility: boolean;
  coalitionStabilizationStreakDays: number;
  postStabilizationLockIn: boolean;
  coalitionLockInStreakDays: number;
  crossModuleSyncStreakDays: number;
  integratedCoalitionMaturity: boolean;
  integratedCoalitionMaturityStreakDays: number;
  sustainedIntegratedCoalitionStewardship: boolean;
  coalitionStewardshipStreakDays: number;
  anchoredCoalitionGovernance: boolean;
  coalitionAnchoredGovernanceStreakDays: number;
  institutionalCoalitionPermanence: boolean;
  coalitionInstitutionalPermanenceStreakDays: number;
  generationalCoalitionContinuity: boolean;
  coalitionGenerationalContinuityStreakDays: number;
  civilizationalCoalitionEndurance: boolean;
  coalitionCivilizationalEnduranceStreakDays: number;
  transcendentCoalitionLegacy: boolean;
  coalitionTranscendentLegacyStreakDays: number;
  sovereignCoalitionContinuum: boolean;
  coalitionSovereignContinuumStreakDays: number;
  eternalCoalitionAscendance: boolean;
  coalitionEternalAscendanceStreakDays: number;
  infiniteCoalitionPersistence: boolean;
  coalitionInfinitePersistenceStreakDays: number;
  mandateDriftRisk: 'low' | 'elevated' | 'critical';
  topRecommendationActionId?: string;
  topRecommendationTitle?: string;
}
