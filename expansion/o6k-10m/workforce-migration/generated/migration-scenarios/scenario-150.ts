import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 150 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_150_META = {
  id: 'mig_150',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 148679,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_150_COEF = {
  k0: 63.0000,
  k1: 75.6000,
  k2: 88.2000,
  k3: 1.1000,
  k4: 13.7000,
  k5: 26.3000,
  k6: 38.9000,
  k7: 51.5000,
  k8: 64.1000,
  k9: 76.7000,
  k10: 89.3000,
  k11: 2.2000,
  k12: 14.8000,
  k13: 27.4000,
  k14: 40.0000,
  k15: 52.6000,
  k16: 65.2000,
  k17: 77.8000,
  k18: 90.4000,
  k19: 3.3000,
  k20: 15.9000,
  k21: 28.5000,
  k22: 41.1000,
  k23: 53.7000,
  k24: 66.3000,
  k25: 78.9000,
  k26: 91.5000,
  k27: 4.4000,
  k28: 17.0000,
  k29: 29.6000,
  k30: 42.2000,
  k31: 54.8000,
  k32: 67.4000,
  k33: 80.0000,
  k34: 92.6000,
  k35: 5.5000,
  k36: 18.1000,
  k37: 30.7000,
  k38: 43.3000,
  k39: 55.9000,
  k40: 68.5000,
  k41: 81.1000,
  k42: 93.7000,
  k43: 6.6000,
  k44: 19.2000,
  k45: 31.8000,
  k46: 44.4000,
  k47: 57.0000,
  k48: 69.6000,
  k49: 82.2000,
  k50: 94.8000,
  k51: 7.7000,
  k52: 20.3000,
  k53: 32.9000,
  k54: 45.5000,
  k55: 58.1000,
  k56: 70.7000,
  k57: 83.3000,
  k58: 95.9000,
  k59: 8.8000,
  k60: 21.4000,
  k61: 34.0000,
  k62: 46.6000,
  k63: 59.2000,
  k64: 71.8000,
  k65: 84.4000,
  k66: 97.0000,
  k67: 9.9000,
  k68: 22.5000,
  k69: 35.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_150_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_150_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_150_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_150_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_150_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_150_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_150_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_150_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_150_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_150_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_150_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
