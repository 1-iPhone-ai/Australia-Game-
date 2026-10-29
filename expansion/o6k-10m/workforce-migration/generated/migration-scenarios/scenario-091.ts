import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 091 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_091_META = {
  id: 'mig_091',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 90210,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_091_COEF = {
  k0: 40.6000,
  k1: 88.6000,
  k2: 36.9000,
  k3: 84.9000,
  k4: 33.2000,
  k5: 81.2000,
  k6: 29.5000,
  k7: 77.5000,
  k8: 25.8000,
  k9: 73.8000,
  k10: 22.1000,
  k11: 70.1000,
  k12: 18.4000,
  k13: 66.4000,
  k14: 14.7000,
  k15: 62.7000,
  k16: 11.0000,
  k17: 59.0000,
  k18: 7.3000,
  k19: 55.3000,
  k20: 3.6000,
  k21: 51.6000,
  k22: 99.6000,
  k23: 47.9000,
  k24: 95.9000,
  k25: 44.2000,
  k26: 92.2000,
  k27: 40.5000,
  k28: 88.5000,
  k29: 36.8000,
  k30: 84.8000,
  k31: 33.1000,
  k32: 81.1000,
  k33: 29.4000,
  k34: 77.4000,
  k35: 25.7000,
  k36: 73.7000,
  k37: 22.0000,
  k38: 70.0000,
  k39: 18.3000,
  k40: 66.3000,
  k41: 14.6000,
  k42: 62.6000,
  k43: 10.9000,
  k44: 58.9000,
  k45: 7.2000,
  k46: 55.2000,
  k47: 3.5000,
  k48: 51.5000,
  k49: 99.5000,
  k50: 47.8000,
  k51: 95.8000,
  k52: 44.1000,
  k53: 92.1000,
  k54: 40.4000,
  k55: 88.4000,
  k56: 36.7000,
  k57: 84.7000,
  k58: 33.0000,
  k59: 81.0000,
  k60: 29.3000,
  k61: 77.3000,
  k62: 25.6000,
  k63: 73.6000,
  k64: 21.9000,
  k65: 69.9000,
  k66: 18.2000,
  k67: 66.2000,
  k68: 14.5000,
  k69: 62.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_091_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_091_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_091_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_091_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_091_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_091_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_091_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_091_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_091_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_091_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_091_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
