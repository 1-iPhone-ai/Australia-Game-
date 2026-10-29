import { createInitialLaborDemographicsPersisted } from './persistence';
import { computeNationalLaborDemographics } from './compute';
import type {
  LaborDemographicsInputs,
  LaborDemographicsPersisted,
  NationalLaborDemographicsState
} from './types';

export interface LaborTurnProjectionStep {
  turn: number;
  employmentLinkageScore: number;
  wagePressureScore: number;
  migrationFlowScore: number;
  nationalEmploymentLinkage: string;
  nationalWagePressure: string;
  nationalMigrationFlow: string;
}

export interface LaborTurnProjectionBundle {
  horizonTurns: number;
  steps: LaborTurnProjectionStep[];
  summary: string;
}

/** Read-only multi-turn replay projection (does not mutate caller persisted state). */
export function projectLaborDemographicsTurns(
  baseInputs: LaborDemographicsInputs,
  horizonTurns: number,
  seedPersisted?: LaborDemographicsPersisted | null
): LaborTurnProjectionBundle {
  const steps: LaborTurnProjectionStep[] = [];
  const persistedClone = seedPersisted
    ? (JSON.parse(JSON.stringify(seedPersisted)) as LaborDemographicsPersisted)
    : undefined;
  let pers: LaborDemographicsPersisted | undefined = persistedClone ?? createInitialLaborDemographicsPersisted(start);
  let prev: NationalLaborDemographicsState | null = null;
  const start = Math.max(1, Math.floor(baseInputs.turn || 1));
  const end = start + Math.max(1, Math.min(8, horizonTurns));

  for (let t = start; t <= end; t++) {
    const stepInputs = { ...baseInputs, turn: t };
    const res = computeNationalLaborDemographics(stepInputs, pers ?? null, prev);
    pers = res.persisted;
    prev = res.state;
    steps.push({
      turn: t,
      employmentLinkageScore: res.state.employmentLinkageScore,
      wagePressureScore: res.state.wagePressureScore,
      migrationFlowScore: res.state.migrationFlowScore,
      nationalEmploymentLinkage: res.state.nationalEmploymentLinkage,
      nationalWagePressure: res.state.nationalWagePressure,
      nationalMigrationFlow: res.state.nationalMigrationFlow
    });
  }

  const last = steps[steps.length - 1];
  return {
    horizonTurns: steps.length,
    steps,
    summary: last
      ? `Projected to turn ${last.turn}: emp=${last.nationalEmploymentLinkage}, wage=${last.nationalWagePressure}, mig=${last.nationalMigrationFlow}.`
      : 'Empty projection.'
  };
}
