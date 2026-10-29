import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 046 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_046_META = {
  id: 'mig_046',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 45615,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_046_COEF = {
  k0: 75.9000,
  k1: 51.2000,
  k2: 26.5000,
  k3: 1.8000,
  k4: 76.8000,
  k5: 52.1000,
  k6: 27.4000,
  k7: 2.7000,
  k8: 77.7000,
  k9: 53.0000,
  k10: 28.3000,
  k11: 3.6000,
  k12: 78.6000,
  k13: 53.9000,
  k14: 29.2000,
  k15: 4.5000,
  k16: 79.5000,
  k17: 54.8000,
  k18: 30.1000,
  k19: 5.4000,
  k20: 80.4000,
  k21: 55.7000,
  k22: 31.0000,
  k23: 6.3000,
  k24: 81.3000,
  k25: 56.6000,
  k26: 31.9000,
  k27: 7.2000,
  k28: 82.2000,
  k29: 57.5000,
  k30: 32.8000,
  k31: 8.1000,
  k32: 83.1000,
  k33: 58.4000,
  k34: 33.7000,
  k35: 9.0000,
  k36: 84.0000,
  k37: 59.3000,
  k38: 34.6000,
  k39: 9.9000,
  k40: 84.9000,
  k41: 60.2000,
  k42: 35.5000,
  k43: 10.8000,
  k44: 85.8000,
  k45: 61.1000,
  k46: 36.4000,
  k47: 11.7000,
  k48: 86.7000,
  k49: 62.0000,
  k50: 37.3000,
  k51: 12.6000,
  k52: 87.6000,
  k53: 62.9000,
  k54: 38.2000,
  k55: 13.5000,
  k56: 88.5000,
  k57: 63.8000,
  k58: 39.1000,
  k59: 14.4000,
  k60: 89.4000,
  k61: 64.7000,
  k62: 40.0000,
  k63: 15.3000,
  k64: 90.3000,
  k65: 65.6000,
  k66: 40.9000,
  k67: 16.2000,
  k68: 91.2000,
  k69: 66.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_046_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_046_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_046_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_046_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_046_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_046_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_046_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_046_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_046_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_046_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_046_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
