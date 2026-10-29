import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 127 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_127_META = {
  id: 'mig_127',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 125886,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_127_COEF = {
  k0: 32.3000,
  k1: 58.7000,
  k2: 85.1000,
  k3: 11.8000,
  k4: 38.2000,
  k5: 64.6000,
  k6: 91.0000,
  k7: 17.7000,
  k8: 44.1000,
  k9: 70.5000,
  k10: 96.9000,
  k11: 23.6000,
  k12: 50.0000,
  k13: 76.4000,
  k14: 3.1000,
  k15: 29.5000,
  k16: 55.9000,
  k17: 82.3000,
  k18: 9.0000,
  k19: 35.4000,
  k20: 61.8000,
  k21: 88.2000,
  k22: 14.9000,
  k23: 41.3000,
  k24: 67.7000,
  k25: 94.1000,
  k26: 20.8000,
  k27: 47.2000,
  k28: 73.6000,
  k29: 0.3000,
  k30: 26.7000,
  k31: 53.1000,
  k32: 79.5000,
  k33: 6.2000,
  k34: 32.6000,
  k35: 59.0000,
  k36: 85.4000,
  k37: 12.1000,
  k38: 38.5000,
  k39: 64.9000,
  k40: 91.3000,
  k41: 18.0000,
  k42: 44.4000,
  k43: 70.8000,
  k44: 97.2000,
  k45: 23.9000,
  k46: 50.3000,
  k47: 76.7000,
  k48: 3.4000,
  k49: 29.8000,
  k50: 56.2000,
  k51: 82.6000,
  k52: 9.3000,
  k53: 35.7000,
  k54: 62.1000,
  k55: 88.5000,
  k56: 15.2000,
  k57: 41.6000,
  k58: 68.0000,
  k59: 94.4000,
  k60: 21.1000,
  k61: 47.5000,
  k62: 73.9000,
  k63: 0.6000,
  k64: 27.0000,
  k65: 53.4000,
  k66: 79.8000,
  k67: 6.5000,
  k68: 32.9000,
  k69: 59.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_127_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_127_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_127_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_127_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_127_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_127_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_127_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_127_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_127_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_127_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_127_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
