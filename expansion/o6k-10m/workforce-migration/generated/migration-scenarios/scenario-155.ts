import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 155 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_155_META = {
  id: 'mig_155',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 153634,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_155_COEF = {
  k0: 48.0000,
  k1: 57.6000,
  k2: 67.2000,
  k3: 76.8000,
  k4: 86.4000,
  k5: 96.0000,
  k6: 5.9000,
  k7: 15.5000,
  k8: 25.1000,
  k9: 34.7000,
  k10: 44.3000,
  k11: 53.9000,
  k12: 63.5000,
  k13: 73.1000,
  k14: 82.7000,
  k15: 92.3000,
  k16: 2.2000,
  k17: 11.8000,
  k18: 21.4000,
  k19: 31.0000,
  k20: 40.6000,
  k21: 50.2000,
  k22: 59.8000,
  k23: 69.4000,
  k24: 79.0000,
  k25: 88.6000,
  k26: 98.2000,
  k27: 8.1000,
  k28: 17.7000,
  k29: 27.3000,
  k30: 36.9000,
  k31: 46.5000,
  k32: 56.1000,
  k33: 65.7000,
  k34: 75.3000,
  k35: 84.9000,
  k36: 94.5000,
  k37: 4.4000,
  k38: 14.0000,
  k39: 23.6000,
  k40: 33.2000,
  k41: 42.8000,
  k42: 52.4000,
  k43: 62.0000,
  k44: 71.6000,
  k45: 81.2000,
  k46: 90.8000,
  k47: 0.7000,
  k48: 10.3000,
  k49: 19.9000,
  k50: 29.5000,
  k51: 39.1000,
  k52: 48.7000,
  k53: 58.3000,
  k54: 67.9000,
  k55: 77.5000,
  k56: 87.1000,
  k57: 96.7000,
  k58: 6.6000,
  k59: 16.2000,
  k60: 25.8000,
  k61: 35.4000,
  k62: 45.0000,
  k63: 54.6000,
  k64: 64.2000,
  k65: 73.8000,
  k66: 83.4000,
  k67: 93.0000,
  k68: 2.9000,
  k69: 12.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_155_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_155_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_155_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_155_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_155_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_155_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_155_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_155_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_155_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_155_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_155_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
