import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 162 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_162_META = {
  id: 'mig_162',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 160571,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_162_COEF = {
  k0: 27.0000,
  k1: 32.4000,
  k2: 37.8000,
  k3: 43.2000,
  k4: 48.6000,
  k5: 54.0000,
  k6: 59.4000,
  k7: 64.8000,
  k8: 70.2000,
  k9: 75.6000,
  k10: 81.0000,
  k11: 86.4000,
  k12: 91.8000,
  k13: 97.2000,
  k14: 2.9000,
  k15: 8.3000,
  k16: 13.7000,
  k17: 19.1000,
  k18: 24.5000,
  k19: 29.9000,
  k20: 35.3000,
  k21: 40.7000,
  k22: 46.1000,
  k23: 51.5000,
  k24: 56.9000,
  k25: 62.3000,
  k26: 67.7000,
  k27: 73.1000,
  k28: 78.5000,
  k29: 83.9000,
  k30: 89.3000,
  k31: 94.7000,
  k32: 0.4000,
  k33: 5.8000,
  k34: 11.2000,
  k35: 16.6000,
  k36: 22.0000,
  k37: 27.4000,
  k38: 32.8000,
  k39: 38.2000,
  k40: 43.6000,
  k41: 49.0000,
  k42: 54.4000,
  k43: 59.8000,
  k44: 65.2000,
  k45: 70.6000,
  k46: 76.0000,
  k47: 81.4000,
  k48: 86.8000,
  k49: 92.2000,
  k50: 97.6000,
  k51: 3.3000,
  k52: 8.7000,
  k53: 14.1000,
  k54: 19.5000,
  k55: 24.9000,
  k56: 30.3000,
  k57: 35.7000,
  k58: 41.1000,
  k59: 46.5000,
  k60: 51.9000,
  k61: 57.3000,
  k62: 62.7000,
  k63: 68.1000,
  k64: 73.5000,
  k65: 78.9000,
  k66: 84.3000,
  k67: 89.7000,
  k68: 95.1000,
  k69: 0.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_162_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_162_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_162_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_162_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_162_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_162_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_162_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_162_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_162_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_162_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_162_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
