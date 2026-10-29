import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 129 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_129_META = {
  id: 'mig_129',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 127868,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_129_COEF = {
  k0: 26.3000,
  k1: 51.5000,
  k2: 76.7000,
  k3: 2.2000,
  k4: 27.4000,
  k5: 52.6000,
  k6: 77.8000,
  k7: 3.3000,
  k8: 28.5000,
  k9: 53.7000,
  k10: 78.9000,
  k11: 4.4000,
  k12: 29.6000,
  k13: 54.8000,
  k14: 80.0000,
  k15: 5.5000,
  k16: 30.7000,
  k17: 55.9000,
  k18: 81.1000,
  k19: 6.6000,
  k20: 31.8000,
  k21: 57.0000,
  k22: 82.2000,
  k23: 7.7000,
  k24: 32.9000,
  k25: 58.1000,
  k26: 83.3000,
  k27: 8.8000,
  k28: 34.0000,
  k29: 59.2000,
  k30: 84.4000,
  k31: 9.9000,
  k32: 35.1000,
  k33: 60.3000,
  k34: 85.5000,
  k35: 11.0000,
  k36: 36.2000,
  k37: 61.4000,
  k38: 86.6000,
  k39: 12.1000,
  k40: 37.3000,
  k41: 62.5000,
  k42: 87.7000,
  k43: 13.2000,
  k44: 38.4000,
  k45: 63.6000,
  k46: 88.8000,
  k47: 14.3000,
  k48: 39.5000,
  k49: 64.7000,
  k50: 89.9000,
  k51: 15.4000,
  k52: 40.6000,
  k53: 65.8000,
  k54: 91.0000,
  k55: 16.5000,
  k56: 41.7000,
  k57: 66.9000,
  k58: 92.1000,
  k59: 17.6000,
  k60: 42.8000,
  k61: 68.0000,
  k62: 93.2000,
  k63: 18.7000,
  k64: 43.9000,
  k65: 69.1000,
  k66: 94.3000,
  k67: 19.8000,
  k68: 45.0000,
  k69: 70.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_129_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_129_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_129_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_129_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_129_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_129_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_129_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_129_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_129_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_129_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_129_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
