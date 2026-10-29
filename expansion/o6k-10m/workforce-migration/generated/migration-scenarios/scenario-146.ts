import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 146 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_146_META = {
  id: 'mig_146',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 144715,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_146_COEF = {
  k0: 75.0000,
  k1: 90.0000,
  k2: 5.3000,
  k3: 20.3000,
  k4: 35.3000,
  k5: 50.3000,
  k6: 65.3000,
  k7: 80.3000,
  k8: 95.3000,
  k9: 10.6000,
  k10: 25.6000,
  k11: 40.6000,
  k12: 55.6000,
  k13: 70.6000,
  k14: 85.6000,
  k15: 0.9000,
  k16: 15.9000,
  k17: 30.9000,
  k18: 45.9000,
  k19: 60.9000,
  k20: 75.9000,
  k21: 90.9000,
  k22: 6.2000,
  k23: 21.2000,
  k24: 36.2000,
  k25: 51.2000,
  k26: 66.2000,
  k27: 81.2000,
  k28: 96.2000,
  k29: 11.5000,
  k30: 26.5000,
  k31: 41.5000,
  k32: 56.5000,
  k33: 71.5000,
  k34: 86.5000,
  k35: 1.8000,
  k36: 16.8000,
  k37: 31.8000,
  k38: 46.8000,
  k39: 61.8000,
  k40: 76.8000,
  k41: 91.8000,
  k42: 7.1000,
  k43: 22.1000,
  k44: 37.1000,
  k45: 52.1000,
  k46: 67.1000,
  k47: 82.1000,
  k48: 97.1000,
  k49: 12.4000,
  k50: 27.4000,
  k51: 42.4000,
  k52: 57.4000,
  k53: 72.4000,
  k54: 87.4000,
  k55: 2.7000,
  k56: 17.7000,
  k57: 32.7000,
  k58: 47.7000,
  k59: 62.7000,
  k60: 77.7000,
  k61: 92.7000,
  k62: 8.0000,
  k63: 23.0000,
  k64: 38.0000,
  k65: 53.0000,
  k66: 68.0000,
  k67: 83.0000,
  k68: 98.0000,
  k69: 13.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_146_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_146_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_146_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_146_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_146_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_146_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_146_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_146_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_146_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_146_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_146_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
