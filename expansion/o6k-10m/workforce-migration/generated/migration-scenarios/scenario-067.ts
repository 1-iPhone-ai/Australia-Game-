import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 067 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_067_META = {
  id: 'mig_067',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 66426,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_067_COEF = {
  k0: 12.9000,
  k1: 75.3000,
  k2: 38.0000,
  k3: 0.7000,
  k4: 63.1000,
  k5: 25.8000,
  k6: 88.2000,
  k7: 50.9000,
  k8: 13.6000,
  k9: 76.0000,
  k10: 38.7000,
  k11: 1.4000,
  k12: 63.8000,
  k13: 26.5000,
  k14: 88.9000,
  k15: 51.6000,
  k16: 14.3000,
  k17: 76.7000,
  k18: 39.4000,
  k19: 2.1000,
  k20: 64.5000,
  k21: 27.2000,
  k22: 89.6000,
  k23: 52.3000,
  k24: 15.0000,
  k25: 77.4000,
  k26: 40.1000,
  k27: 2.8000,
  k28: 65.2000,
  k29: 27.9000,
  k30: 90.3000,
  k31: 53.0000,
  k32: 15.7000,
  k33: 78.1000,
  k34: 40.8000,
  k35: 3.5000,
  k36: 65.9000,
  k37: 28.6000,
  k38: 91.0000,
  k39: 53.7000,
  k40: 16.4000,
  k41: 78.8000,
  k42: 41.5000,
  k43: 4.2000,
  k44: 66.6000,
  k45: 29.3000,
  k46: 91.7000,
  k47: 54.4000,
  k48: 17.1000,
  k49: 79.5000,
  k50: 42.2000,
  k51: 4.9000,
  k52: 67.3000,
  k53: 30.0000,
  k54: 92.4000,
  k55: 55.1000,
  k56: 17.8000,
  k57: 80.2000,
  k58: 42.9000,
  k59: 5.6000,
  k60: 68.0000,
  k61: 30.7000,
  k62: 93.1000,
  k63: 55.8000,
  k64: 18.5000,
  k65: 80.9000,
  k66: 43.6000,
  k67: 6.3000,
  k68: 68.7000,
  k69: 31.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_067_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_067_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_067_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_067_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_067_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_067_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_067_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_067_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_067_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_067_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_067_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
