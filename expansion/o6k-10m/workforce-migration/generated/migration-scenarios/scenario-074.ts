import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 074 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_074_META = {
  id: 'mig_074',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 73363,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_074_COEF = {
  k0: 91.6000,
  k1: 50.1000,
  k2: 8.6000,
  k3: 66.8000,
  k4: 25.3000,
  k5: 83.5000,
  k6: 42.0000,
  k7: 0.5000,
  k8: 58.7000,
  k9: 17.2000,
  k10: 75.4000,
  k11: 33.9000,
  k12: 92.1000,
  k13: 50.6000,
  k14: 9.1000,
  k15: 67.3000,
  k16: 25.8000,
  k17: 84.0000,
  k18: 42.5000,
  k19: 1.0000,
  k20: 59.2000,
  k21: 17.7000,
  k22: 75.9000,
  k23: 34.4000,
  k24: 92.6000,
  k25: 51.1000,
  k26: 9.6000,
  k27: 67.8000,
  k28: 26.3000,
  k29: 84.5000,
  k30: 43.0000,
  k31: 1.5000,
  k32: 59.7000,
  k33: 18.2000,
  k34: 76.4000,
  k35: 34.9000,
  k36: 93.1000,
  k37: 51.6000,
  k38: 10.1000,
  k39: 68.3000,
  k40: 26.8000,
  k41: 85.0000,
  k42: 43.5000,
  k43: 2.0000,
  k44: 60.2000,
  k45: 18.7000,
  k46: 76.9000,
  k47: 35.4000,
  k48: 93.6000,
  k49: 52.1000,
  k50: 10.6000,
  k51: 68.8000,
  k52: 27.3000,
  k53: 85.5000,
  k54: 44.0000,
  k55: 2.5000,
  k56: 60.7000,
  k57: 19.2000,
  k58: 77.4000,
  k59: 35.9000,
  k60: 94.1000,
  k61: 52.6000,
  k62: 11.1000,
  k63: 69.3000,
  k64: 27.8000,
  k65: 86.0000,
  k66: 44.5000,
  k67: 3.0000,
  k68: 61.2000,
  k69: 19.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_074_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_074_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_074_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_074_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_074_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_074_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_074_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_074_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_074_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_074_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_074_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
