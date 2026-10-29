import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 153 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_153_META = {
  id: 'mig_153',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 151652,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_153_COEF = {
  k0: 54.0000,
  k1: 64.8000,
  k2: 75.6000,
  k3: 86.4000,
  k4: 97.2000,
  k5: 8.3000,
  k6: 19.1000,
  k7: 29.9000,
  k8: 40.7000,
  k9: 51.5000,
  k10: 62.3000,
  k11: 73.1000,
  k12: 83.9000,
  k13: 94.7000,
  k14: 5.8000,
  k15: 16.6000,
  k16: 27.4000,
  k17: 38.2000,
  k18: 49.0000,
  k19: 59.8000,
  k20: 70.6000,
  k21: 81.4000,
  k22: 92.2000,
  k23: 3.3000,
  k24: 14.1000,
  k25: 24.9000,
  k26: 35.7000,
  k27: 46.5000,
  k28: 57.3000,
  k29: 68.1000,
  k30: 78.9000,
  k31: 89.7000,
  k32: 0.8000,
  k33: 11.6000,
  k34: 22.4000,
  k35: 33.2000,
  k36: 44.0000,
  k37: 54.8000,
  k38: 65.6000,
  k39: 76.4000,
  k40: 87.2000,
  k41: 98.0000,
  k42: 9.1000,
  k43: 19.9000,
  k44: 30.7000,
  k45: 41.5000,
  k46: 52.3000,
  k47: 63.1000,
  k48: 73.9000,
  k49: 84.7000,
  k50: 95.5000,
  k51: 6.6000,
  k52: 17.4000,
  k53: 28.2000,
  k54: 39.0000,
  k55: 49.8000,
  k56: 60.6000,
  k57: 71.4000,
  k58: 82.2000,
  k59: 93.0000,
  k60: 4.1000,
  k61: 14.9000,
  k62: 25.7000,
  k63: 36.5000,
  k64: 47.3000,
  k65: 58.1000,
  k66: 68.9000,
  k67: 79.7000,
  k68: 90.5000,
  k69: 1.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_153_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_153_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_153_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_153_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_153_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_153_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_153_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_153_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_153_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_153_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_153_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
