import type { BudgetEnvelopeCategory } from '../fiscal-outcomes/types';

export const BUDGET_LINES_SCHEMA = 'op10m-agent07-budget-lines-v2';

export type AppropriationTier = 'department' | 'program' | 'measure';

export interface AppropriationLineItem {
  id: string;
  category: BudgetEnvelopeCategory;
  tier: AppropriationTier;
  code: string;
  title: string;
  description: string;
  /** Share of parent category allocation (0..1). */
  weight: number;
  recurring: boolean;
  capital: boolean;
}

export interface BudgetSubLine {
  lineId: string;
  code: string;
  title: string;
  allocatedPoints: number;
  committedPoints: number;
  forwardEstimateY1: number;
  forwardEstimateY2: number;
  varianceBand: 'under' | 'on_track' | 'pressure' | 'blown';
  explanation: string;
}

export interface CategoryBudgetBreakdown {
  category: BudgetEnvelopeCategory;
  envelopeAllocated: number;
  subLines: BudgetSubLine[];
  subtotalAllocated: number;
  subtotalCommitted: number;
  linesBalanced: boolean;
}

export interface DetailedBudgetPaper {
  schemaVersion: string;
  fiscalYearLabel: string;
  turn: number;
  categories: CategoryBudgetBreakdown[];
  totalSubLines: number;
  aggregateVarianceWarnings: string[];
}
