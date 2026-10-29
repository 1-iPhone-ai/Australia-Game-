export const EXPENDITURE_GROWTH_BENCHMARK_SCHEMA = 'op10m-agent07-expenditure-growth-benchmark-v1';

export interface GrowthBenchmarkRow {
  category: string;
  baselinePoints: number;
  projectedPoints: number;
  growthRatePercent: number;
  withinBenchmarkBand: boolean;
}

export interface ExpenditureGrowthBenchmarkReport {
  schemaVersion: string;
  turn: number;
  rows: GrowthBenchmarkRow[];
  aggregateGrowthRate: number;
  revenueCapacityGrowthBand: number;
  withinAggregateBenchmark: boolean;
  coherentWithForwardIntegrity: boolean;
  narrative: string;
  warnings: string[];
}
