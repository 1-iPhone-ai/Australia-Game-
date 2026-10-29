import type { BudgetEnvelopeCategory } from '../fiscal-outcomes/types';

export const MULTI_YEAR_FRAMEWORK_SCHEMA = 'op10m-agent07-multi-year-framework-v1';

export interface ExpenditureCeilingRow {
  category: BudgetEnvelopeCategory;
  baselinePoints: number;
  ceilingPoints: number;
  growthCapPercent: number;
  headroomToCeiling: number;
  binding: boolean;
}

export interface ForwardEstimateBand {
  turn: number;
  label: string;
  envelopeCapacity: number;
  recurringLoad: number;
  capitalPipeline: number;
  contingencyFlex: number;
  withinCeiling: boolean;
}

export interface MultiYearExpenditureFramework {
  schemaVersion: string;
  baseTurn: number;
  horizonTurns: number;
  ceilings: ExpenditureCeilingRow[];
  forwardBands: ForwardEstimateBand[];
  aggregateCeilingBinding: boolean;
  parameterSettingsGrowth: number;
  narrative: string;
  warnings: string[];
}
