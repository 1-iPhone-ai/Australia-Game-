import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 147 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_147_META = {
  id: 'mig_147',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 145706,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_147_COEF = {
  k0: 72.0000,
  k1: 86.4000,
  k2: 1.1000,
  k3: 15.5000,
  k4: 29.9000,
  k5: 44.3000,
  k6: 58.7000,
  k7: 73.1000,
  k8: 87.5000,
  k9: 2.2000,
  k10: 16.6000,
  k11: 31.0000,
  k12: 45.4000,
  k13: 59.8000,
  k14: 74.2000,
  k15: 88.6000,
  k16: 3.3000,
  k17: 17.7000,
  k18: 32.1000,
  k19: 46.5000,
  k20: 60.9000,
  k21: 75.3000,
  k22: 89.7000,
  k23: 4.4000,
  k24: 18.8000,
  k25: 33.2000,
  k26: 47.6000,
  k27: 62.0000,
  k28: 76.4000,
  k29: 90.8000,
  k30: 5.5000,
  k31: 19.9000,
  k32: 34.3000,
  k33: 48.7000,
  k34: 63.1000,
  k35: 77.5000,
  k36: 91.9000,
  k37: 6.6000,
  k38: 21.0000,
  k39: 35.4000,
  k40: 49.8000,
  k41: 64.2000,
  k42: 78.6000,
  k43: 93.0000,
  k44: 7.7000,
  k45: 22.1000,
  k46: 36.5000,
  k47: 50.9000,
  k48: 65.3000,
  k49: 79.7000,
  k50: 94.1000,
  k51: 8.8000,
  k52: 23.2000,
  k53: 37.6000,
  k54: 52.0000,
  k55: 66.4000,
  k56: 80.8000,
  k57: 95.2000,
  k58: 9.9000,
  k59: 24.3000,
  k60: 38.7000,
  k61: 53.1000,
  k62: 67.5000,
  k63: 81.9000,
  k64: 96.3000,
  k65: 11.0000,
  k66: 25.4000,
  k67: 39.8000,
  k68: 54.2000,
  k69: 68.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_147_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_147_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_147_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_147_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_147_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_147_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_147_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_147_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_147_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_147_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_147_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
