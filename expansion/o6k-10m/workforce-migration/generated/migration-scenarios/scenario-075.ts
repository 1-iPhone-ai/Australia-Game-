import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 075 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_075_META = {
  id: 'mig_075',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 74354,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_075_COEF = {
  k0: 88.6000,
  k1: 46.5000,
  k2: 4.4000,
  k3: 62.0000,
  k4: 19.9000,
  k5: 77.5000,
  k6: 35.4000,
  k7: 93.0000,
  k8: 50.9000,
  k9: 8.8000,
  k10: 66.4000,
  k11: 24.3000,
  k12: 81.9000,
  k13: 39.8000,
  k14: 97.4000,
  k15: 55.3000,
  k16: 13.2000,
  k17: 70.8000,
  k18: 28.7000,
  k19: 86.3000,
  k20: 44.2000,
  k21: 2.1000,
  k22: 59.7000,
  k23: 17.6000,
  k24: 75.2000,
  k25: 33.1000,
  k26: 90.7000,
  k27: 48.6000,
  k28: 6.5000,
  k29: 64.1000,
  k30: 22.0000,
  k31: 79.6000,
  k32: 37.5000,
  k33: 95.1000,
  k34: 53.0000,
  k35: 10.9000,
  k36: 68.5000,
  k37: 26.4000,
  k38: 84.0000,
  k39: 41.9000,
  k40: 99.5000,
  k41: 57.4000,
  k42: 15.3000,
  k43: 72.9000,
  k44: 30.8000,
  k45: 88.4000,
  k46: 46.3000,
  k47: 4.2000,
  k48: 61.8000,
  k49: 19.7000,
  k50: 77.3000,
  k51: 35.2000,
  k52: 92.8000,
  k53: 50.7000,
  k54: 8.6000,
  k55: 66.2000,
  k56: 24.1000,
  k57: 81.7000,
  k58: 39.6000,
  k59: 97.2000,
  k60: 55.1000,
  k61: 13.0000,
  k62: 70.6000,
  k63: 28.5000,
  k64: 86.1000,
  k65: 44.0000,
  k66: 1.9000,
  k67: 59.5000,
  k68: 17.4000,
  k69: 75.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_075_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_075_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_075_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_075_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_075_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_075_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_075_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_075_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_075_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_075_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_075_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
