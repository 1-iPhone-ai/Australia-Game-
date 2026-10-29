import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 058 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_058_META = {
  id: 'mig_058',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 57507,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_058_COEF = {
  k0: 39.9000,
  k1: 8.0000,
  k2: 75.8000,
  k3: 43.9000,
  k4: 12.0000,
  k5: 79.8000,
  k6: 47.9000,
  k7: 16.0000,
  k8: 83.8000,
  k9: 51.9000,
  k10: 20.0000,
  k11: 87.8000,
  k12: 55.9000,
  k13: 24.0000,
  k14: 91.8000,
  k15: 59.9000,
  k16: 28.0000,
  k17: 95.8000,
  k18: 63.9000,
  k19: 32.0000,
  k20: 0.1000,
  k21: 67.9000,
  k22: 36.0000,
  k23: 4.1000,
  k24: 71.9000,
  k25: 40.0000,
  k26: 8.1000,
  k27: 75.9000,
  k28: 44.0000,
  k29: 12.1000,
  k30: 79.9000,
  k31: 48.0000,
  k32: 16.1000,
  k33: 83.9000,
  k34: 52.0000,
  k35: 20.1000,
  k36: 87.9000,
  k37: 56.0000,
  k38: 24.1000,
  k39: 91.9000,
  k40: 60.0000,
  k41: 28.1000,
  k42: 95.9000,
  k43: 64.0000,
  k44: 32.1000,
  k45: 0.2000,
  k46: 68.0000,
  k47: 36.1000,
  k48: 4.2000,
  k49: 72.0000,
  k50: 40.1000,
  k51: 8.2000,
  k52: 76.0000,
  k53: 44.1000,
  k54: 12.2000,
  k55: 80.0000,
  k56: 48.1000,
  k57: 16.2000,
  k58: 84.0000,
  k59: 52.1000,
  k60: 20.2000,
  k61: 88.0000,
  k62: 56.1000,
  k63: 24.2000,
  k64: 92.0000,
  k65: 60.1000,
  k66: 28.2000,
  k67: 96.0000,
  k68: 64.1000,
  k69: 32.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_058_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_058_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_058_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_058_COEF[keys[j]] * ((turn + j) % 11);
  }
  const netInflow = V1014_WORKFORCE_clamp(-12 + (acc % 48) + turn * 0.04, -40, 55);
  const skillMismatchIndex = V1014_WORKFORCE_clamp(
    28 + (acc % 52) + Math.abs(netInflow) * 0.35,
    0,
    100,
  );
  const stable = V1014_WORKFORCE_readinessFromScore(100 - skillMismatchIndex) !== 'blocking';
  return { netInflow, skillMismatchIndex, stable };
}

export function V1014_WORKFORCE_MIG_SCENARIO_058_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_058_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_058_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_058_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_058_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_058_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_058_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
