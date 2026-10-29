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

export interface TurnStrategicBriefing {
  day: number;
  commitmentPressure: number;
  pendingTradeOffCount: number;
  mandateHeadline: string;
  stakeholderWarnings: string[];
  completedActionCount: number;
  activeChoiceId: string | null;
  coalitionBalanceIndex: number;
  mandateDriftRisk: 'low' | 'elevated' | 'critical';
  topRecommendationActionId?: string;
  topRecommendationTitle?: string;
}
