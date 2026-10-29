import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 151 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_151_META = {
  id: 'mig_151',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 149670,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_151_COEF = {
  k0: 60.0000,
  k1: 72.0000,
  k2: 84.0000,
  k3: 96.0000,
  k4: 8.3000,
  k5: 20.3000,
  k6: 32.3000,
  k7: 44.3000,
  k8: 56.3000,
  k9: 68.3000,
  k10: 80.3000,
  k11: 92.3000,
  k12: 4.6000,
  k13: 16.6000,
  k14: 28.6000,
  k15: 40.6000,
  k16: 52.6000,
  k17: 64.6000,
  k18: 76.6000,
  k19: 88.6000,
  k20: 0.9000,
  k21: 12.9000,
  k22: 24.9000,
  k23: 36.9000,
  k24: 48.9000,
  k25: 60.9000,
  k26: 72.9000,
  k27: 84.9000,
  k28: 96.9000,
  k29: 9.2000,
  k30: 21.2000,
  k31: 33.2000,
  k32: 45.2000,
  k33: 57.2000,
  k34: 69.2000,
  k35: 81.2000,
  k36: 93.2000,
  k37: 5.5000,
  k38: 17.5000,
  k39: 29.5000,
  k40: 41.5000,
  k41: 53.5000,
  k42: 65.5000,
  k43: 77.5000,
  k44: 89.5000,
  k45: 1.8000,
  k46: 13.8000,
  k47: 25.8000,
  k48: 37.8000,
  k49: 49.8000,
  k50: 61.8000,
  k51: 73.8000,
  k52: 85.8000,
  k53: 97.8000,
  k54: 10.1000,
  k55: 22.1000,
  k56: 34.1000,
  k57: 46.1000,
  k58: 58.1000,
  k59: 70.1000,
  k60: 82.1000,
  k61: 94.1000,
  k62: 6.4000,
  k63: 18.4000,
  k64: 30.4000,
  k65: 42.4000,
  k66: 54.4000,
  k67: 66.4000,
  k68: 78.4000,
  k69: 90.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_151_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_151_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_151_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_151_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_151_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_151_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_151_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_151_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_151_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_151_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_151_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
