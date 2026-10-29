import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 144 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_144_META = {
  id: 'mig_144',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 142733,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_144_COEF = {
  k0: 81.0000,
  k1: 97.2000,
  k2: 13.7000,
  k3: 29.9000,
  k4: 46.1000,
  k5: 62.3000,
  k6: 78.5000,
  k7: 94.7000,
  k8: 11.2000,
  k9: 27.4000,
  k10: 43.6000,
  k11: 59.8000,
  k12: 76.0000,
  k13: 92.2000,
  k14: 8.7000,
  k15: 24.9000,
  k16: 41.1000,
  k17: 57.3000,
  k18: 73.5000,
  k19: 89.7000,
  k20: 6.2000,
  k21: 22.4000,
  k22: 38.6000,
  k23: 54.8000,
  k24: 71.0000,
  k25: 87.2000,
  k26: 3.7000,
  k27: 19.9000,
  k28: 36.1000,
  k29: 52.3000,
  k30: 68.5000,
  k31: 84.7000,
  k32: 1.2000,
  k33: 17.4000,
  k34: 33.6000,
  k35: 49.8000,
  k36: 66.0000,
  k37: 82.2000,
  k38: 98.4000,
  k39: 14.9000,
  k40: 31.1000,
  k41: 47.3000,
  k42: 63.5000,
  k43: 79.7000,
  k44: 95.9000,
  k45: 12.4000,
  k46: 28.6000,
  k47: 44.8000,
  k48: 61.0000,
  k49: 77.2000,
  k50: 93.4000,
  k51: 9.9000,
  k52: 26.1000,
  k53: 42.3000,
  k54: 58.5000,
  k55: 74.7000,
  k56: 90.9000,
  k57: 7.4000,
  k58: 23.6000,
  k59: 39.8000,
  k60: 56.0000,
  k61: 72.2000,
  k62: 88.4000,
  k63: 4.9000,
  k64: 21.1000,
  k65: 37.3000,
  k66: 53.5000,
  k67: 69.7000,
  k68: 85.9000,
  k69: 2.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_144_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_144_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_144_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_144_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_144_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_144_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_144_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_144_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_144_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_144_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_144_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
