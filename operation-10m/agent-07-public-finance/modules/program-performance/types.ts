import type { BudgetEnvelopeCategory } from '../fiscal-outcomes/types';

export const PROGRAM_PERFORMANCE_SCHEMA = 'op10m-agent07-program-performance-v1';

export interface ProgramPerformanceTarget {
  appropriationLineId: string;
  category: BudgetEnvelopeCategory;
  title: string;
  deliveryKpiTarget: number;
  costEfficiencyTarget: number;
}

export interface ProgramPerformanceScore {
  appropriationLineId: string;
  deliveryScore: number;
  costEfficiencyScore: number;
  compositeScore: number;
  band: 'leading' | 'on_track' | 'at_risk' | 'failing';
  fiscalFeedbackPoints: number;
  explanation: string;
}

export interface ProgramPerformanceReview {
  schemaVersion: string;
  turn: number;
  scores: ProgramPerformanceScore[];
  aggregateFeedbackPoints: number;
  programsAtRisk: number;
  rebalanceRecommendations: string[];
}
