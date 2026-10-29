import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 033 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_033_META = {
  id: 'mig_033',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 32732,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_033_COEF = {
  k0: 15.2000,
  k1: 98.0000,
  k2: 81.1000,
  k3: 64.2000,
  k4: 47.3000,
  k5: 30.4000,
  k6: 13.5000,
  k7: 96.3000,
  k8: 79.4000,
  k9: 62.5000,
  k10: 45.6000,
  k11: 28.7000,
  k12: 11.8000,
  k13: 94.6000,
  k14: 77.7000,
  k15: 60.8000,
  k16: 43.9000,
  k17: 27.0000,
  k18: 10.1000,
  k19: 92.9000,
  k20: 76.0000,
  k21: 59.1000,
  k22: 42.2000,
  k23: 25.3000,
  k24: 8.4000,
  k25: 91.2000,
  k26: 74.3000,
  k27: 57.4000,
  k28: 40.5000,
  k29: 23.6000,
  k30: 6.7000,
  k31: 89.5000,
  k32: 72.6000,
  k33: 55.7000,
  k34: 38.8000,
  k35: 21.9000,
  k36: 5.0000,
  k37: 87.8000,
  k38: 70.9000,
  k39: 54.0000,
  k40: 37.1000,
  k41: 20.2000,
  k42: 3.3000,
  k43: 86.1000,
  k44: 69.2000,
  k45: 52.3000,
  k46: 35.4000,
  k47: 18.5000,
  k48: 1.6000,
  k49: 84.4000,
  k50: 67.5000,
  k51: 50.6000,
  k52: 33.7000,
  k53: 16.8000,
  k54: 99.6000,
  k55: 82.7000,
  k56: 65.8000,
  k57: 48.9000,
  k58: 32.0000,
  k59: 15.1000,
  k60: 97.9000,
  k61: 81.0000,
  k62: 64.1000,
  k63: 47.2000,
  k64: 30.3000,
  k65: 13.4000,
  k66: 96.2000,
  k67: 79.3000,
  k68: 62.4000,
  k69: 45.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_033_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_033_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_033_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_033_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_033_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_033_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_033_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_033_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_033_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_033_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_033_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
