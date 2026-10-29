import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 051 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_051_META = {
  id: 'mig_051',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 50570,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_051_COEF = {
  k0: 60.9000,
  k1: 33.2000,
  k2: 5.5000,
  k3: 77.5000,
  k4: 49.8000,
  k5: 22.1000,
  k6: 94.1000,
  k7: 66.4000,
  k8: 38.7000,
  k9: 11.0000,
  k10: 83.0000,
  k11: 55.3000,
  k12: 27.6000,
  k13: 99.6000,
  k14: 71.9000,
  k15: 44.2000,
  k16: 16.5000,
  k17: 88.5000,
  k18: 60.8000,
  k19: 33.1000,
  k20: 5.4000,
  k21: 77.4000,
  k22: 49.7000,
  k23: 22.0000,
  k24: 94.0000,
  k25: 66.3000,
  k26: 38.6000,
  k27: 10.9000,
  k28: 82.9000,
  k29: 55.2000,
  k30: 27.5000,
  k31: 99.5000,
  k32: 71.8000,
  k33: 44.1000,
  k34: 16.4000,
  k35: 88.4000,
  k36: 60.7000,
  k37: 33.0000,
  k38: 5.3000,
  k39: 77.3000,
  k40: 49.6000,
  k41: 21.9000,
  k42: 93.9000,
  k43: 66.2000,
  k44: 38.5000,
  k45: 10.8000,
  k46: 82.8000,
  k47: 55.1000,
  k48: 27.4000,
  k49: 99.4000,
  k50: 71.7000,
  k51: 44.0000,
  k52: 16.3000,
  k53: 88.3000,
  k54: 60.6000,
  k55: 32.9000,
  k56: 5.2000,
  k57: 77.2000,
  k58: 49.5000,
  k59: 21.8000,
  k60: 93.8000,
  k61: 66.1000,
  k62: 38.4000,
  k63: 10.7000,
  k64: 82.7000,
  k65: 55.0000,
  k66: 27.3000,
  k67: 99.3000,
  k68: 71.6000,
  k69: 43.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_051_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_051_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_051_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_051_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_051_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_051_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_051_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_051_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_051_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_051_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_051_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
