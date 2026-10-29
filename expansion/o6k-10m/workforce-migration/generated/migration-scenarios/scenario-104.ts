import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 104 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_104_META = {
  id: 'mig_104',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 103093,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_104_COEF = {
  k0: 1.6000,
  k1: 41.8000,
  k2: 82.0000,
  k3: 22.5000,
  k4: 62.7000,
  k5: 3.2000,
  k6: 43.4000,
  k7: 83.6000,
  k8: 24.1000,
  k9: 64.3000,
  k10: 4.8000,
  k11: 45.0000,
  k12: 85.2000,
  k13: 25.7000,
  k14: 65.9000,
  k15: 6.4000,
  k16: 46.6000,
  k17: 86.8000,
  k18: 27.3000,
  k19: 67.5000,
  k20: 8.0000,
  k21: 48.2000,
  k22: 88.4000,
  k23: 28.9000,
  k24: 69.1000,
  k25: 9.6000,
  k26: 49.8000,
  k27: 90.0000,
  k28: 30.5000,
  k29: 70.7000,
  k30: 11.2000,
  k31: 51.4000,
  k32: 91.6000,
  k33: 32.1000,
  k34: 72.3000,
  k35: 12.8000,
  k36: 53.0000,
  k37: 93.2000,
  k38: 33.7000,
  k39: 73.9000,
  k40: 14.4000,
  k41: 54.6000,
  k42: 94.8000,
  k43: 35.3000,
  k44: 75.5000,
  k45: 16.0000,
  k46: 56.2000,
  k47: 96.4000,
  k48: 36.9000,
  k49: 77.1000,
  k50: 17.6000,
  k51: 57.8000,
  k52: 98.0000,
  k53: 38.5000,
  k54: 78.7000,
  k55: 19.2000,
  k56: 59.4000,
  k57: 99.6000,
  k58: 40.1000,
  k59: 80.3000,
  k60: 20.8000,
  k61: 61.0000,
  k62: 1.5000,
  k63: 41.7000,
  k64: 81.9000,
  k65: 22.4000,
  k66: 62.6000,
  k67: 3.1000,
  k68: 43.3000,
  k69: 83.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_104_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_104_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_104_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_104_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_104_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_104_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_104_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_104_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_104_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_104_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_104_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
