import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 087 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_087_META = {
  id: 'mig_087',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 86246,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_087_COEF = {
  k0: 52.6000,
  k1: 3.3000,
  k2: 53.7000,
  k3: 4.4000,
  k4: 54.8000,
  k5: 5.5000,
  k6: 55.9000,
  k7: 6.6000,
  k8: 57.0000,
  k9: 7.7000,
  k10: 58.1000,
  k11: 8.8000,
  k12: 59.2000,
  k13: 9.9000,
  k14: 60.3000,
  k15: 11.0000,
  k16: 61.4000,
  k17: 12.1000,
  k18: 62.5000,
  k19: 13.2000,
  k20: 63.6000,
  k21: 14.3000,
  k22: 64.7000,
  k23: 15.4000,
  k24: 65.8000,
  k25: 16.5000,
  k26: 66.9000,
  k27: 17.6000,
  k28: 68.0000,
  k29: 18.7000,
  k30: 69.1000,
  k31: 19.8000,
  k32: 70.2000,
  k33: 20.9000,
  k34: 71.3000,
  k35: 22.0000,
  k36: 72.4000,
  k37: 23.1000,
  k38: 73.5000,
  k39: 24.2000,
  k40: 74.6000,
  k41: 25.3000,
  k42: 75.7000,
  k43: 26.4000,
  k44: 76.8000,
  k45: 27.5000,
  k46: 77.9000,
  k47: 28.6000,
  k48: 79.0000,
  k49: 29.7000,
  k50: 80.1000,
  k51: 30.8000,
  k52: 81.2000,
  k53: 31.9000,
  k54: 82.3000,
  k55: 33.0000,
  k56: 83.4000,
  k57: 34.1000,
  k58: 84.5000,
  k59: 35.2000,
  k60: 85.6000,
  k61: 36.3000,
  k62: 86.7000,
  k63: 37.4000,
  k64: 87.8000,
  k65: 38.5000,
  k66: 88.9000,
  k67: 39.6000,
  k68: 90.0000,
  k69: 40.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_087_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_087_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_087_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_087_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_087_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_087_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_087_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_087_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_087_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_087_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_087_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
