/** Agent 01 — population / household contract slice. */

export interface PopulationSnapshot {
  day: number;
  totalPopulation: number;
  migrationBalance: number;
  essentialAccessIndex: number;
  affordabilityStress: number;
  publicStability: number;
}

export interface PopulationPatch {
  populationDelta?: number;
  migrationDelta?: number;
  essentialAccessDelta?: number;
  affordabilityStressDelta?: number;
  publicStabilityDelta?: number;
  ledgerNote?: string;
}

export interface PopulationContract {
  readonly moduleId: 'agent-01-population';
  snapshot(): PopulationSnapshot;
  applyPatch(patch: PopulationPatch): PopulationSnapshot;
  stressBand(): 'stable' | 'strained' | 'critical';
}
