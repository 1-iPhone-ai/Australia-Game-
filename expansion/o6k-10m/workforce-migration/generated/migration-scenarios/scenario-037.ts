import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 037 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_037_META = {
  id: 'mig_037',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 36696,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_037_COEF = {
  k0: 3.2000,
  k1: 83.6000,
  k2: 64.3000,
  k3: 45.0000,
  k4: 25.7000,
  k5: 6.4000,
  k6: 86.8000,
  k7: 67.5000,
  k8: 48.2000,
  k9: 28.9000,
  k10: 9.6000,
  k11: 90.0000,
  k12: 70.7000,
  k13: 51.4000,
  k14: 32.1000,
  k15: 12.8000,
  k16: 93.2000,
  k17: 73.9000,
  k18: 54.6000,
  k19: 35.3000,
  k20: 16.0000,
  k21: 96.4000,
  k22: 77.1000,
  k23: 57.8000,
  k24: 38.5000,
  k25: 19.2000,
  k26: 99.6000,
  k27: 80.3000,
  k28: 61.0000,
  k29: 41.7000,
  k30: 22.4000,
  k31: 3.1000,
  k32: 83.5000,
  k33: 64.2000,
  k34: 44.9000,
  k35: 25.6000,
  k36: 6.3000,
  k37: 86.7000,
  k38: 67.4000,
  k39: 48.1000,
  k40: 28.8000,
  k41: 9.5000,
  k42: 89.9000,
  k43: 70.6000,
  k44: 51.3000,
  k45: 32.0000,
  k46: 12.7000,
  k47: 93.1000,
  k48: 73.8000,
  k49: 54.5000,
  k50: 35.2000,
  k51: 15.9000,
  k52: 96.3000,
  k53: 77.0000,
  k54: 57.7000,
  k55: 38.4000,
  k56: 19.1000,
  k57: 99.5000,
  k58: 80.2000,
  k59: 60.9000,
  k60: 41.6000,
  k61: 22.3000,
  k62: 3.0000,
  k63: 83.4000,
  k64: 64.1000,
  k65: 44.8000,
  k66: 25.5000,
  k67: 6.2000,
  k68: 86.6000,
  k69: 67.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_037_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_037_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_037_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_037_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_037_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_037_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_037_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_037_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_037_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_037_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_037_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
