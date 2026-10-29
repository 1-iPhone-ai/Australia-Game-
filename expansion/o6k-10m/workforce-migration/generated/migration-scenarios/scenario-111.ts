import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 111 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_111_META = {
  id: 'mig_111',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 110030,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_111_COEF = {
  k0: 80.3000,
  k1: 16.6000,
  k2: 52.6000,
  k3: 88.6000,
  k4: 24.9000,
  k5: 60.9000,
  k6: 96.9000,
  k7: 33.2000,
  k8: 69.2000,
  k9: 5.5000,
  k10: 41.5000,
  k11: 77.5000,
  k12: 13.8000,
  k13: 49.8000,
  k14: 85.8000,
  k15: 22.1000,
  k16: 58.1000,
  k17: 94.1000,
  k18: 30.4000,
  k19: 66.4000,
  k20: 2.7000,
  k21: 38.7000,
  k22: 74.7000,
  k23: 11.0000,
  k24: 47.0000,
  k25: 83.0000,
  k26: 19.3000,
  k27: 55.3000,
  k28: 91.3000,
  k29: 27.6000,
  k30: 63.6000,
  k31: 99.6000,
  k32: 35.9000,
  k33: 71.9000,
  k34: 8.2000,
  k35: 44.2000,
  k36: 80.2000,
  k37: 16.5000,
  k38: 52.5000,
  k39: 88.5000,
  k40: 24.8000,
  k41: 60.8000,
  k42: 96.8000,
  k43: 33.1000,
  k44: 69.1000,
  k45: 5.4000,
  k46: 41.4000,
  k47: 77.4000,
  k48: 13.7000,
  k49: 49.7000,
  k50: 85.7000,
  k51: 22.0000,
  k52: 58.0000,
  k53: 94.0000,
  k54: 30.3000,
  k55: 66.3000,
  k56: 2.6000,
  k57: 38.6000,
  k58: 74.6000,
  k59: 10.9000,
  k60: 46.9000,
  k61: 82.9000,
  k62: 19.2000,
  k63: 55.2000,
  k64: 91.2000,
  k65: 27.5000,
  k66: 63.5000,
  k67: 99.5000,
  k68: 35.8000,
  k69: 71.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_111_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_111_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_111_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_111_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_111_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_111_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_111_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_111_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_111_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_111_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_111_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
