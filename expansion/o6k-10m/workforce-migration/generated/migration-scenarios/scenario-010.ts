import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 010 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_010_META = {
  id: 'mig_010',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 9939,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_010_COEF = {
  k0: 84.2000,
  k1: 81.1000,
  k2: 78.0000,
  k3: 74.9000,
  k4: 71.8000,
  k5: 68.7000,
  k6: 65.6000,
  k7: 62.5000,
  k8: 59.4000,
  k9: 56.3000,
  k10: 53.2000,
  k11: 50.1000,
  k12: 47.0000,
  k13: 43.9000,
  k14: 40.8000,
  k15: 37.7000,
  k16: 34.6000,
  k17: 31.5000,
  k18: 28.4000,
  k19: 25.3000,
  k20: 22.2000,
  k21: 19.1000,
  k22: 16.0000,
  k23: 12.9000,
  k24: 9.8000,
  k25: 6.7000,
  k26: 3.6000,
  k27: 0.5000,
  k28: 97.1000,
  k29: 94.0000,
  k30: 90.9000,
  k31: 87.8000,
  k32: 84.7000,
  k33: 81.6000,
  k34: 78.5000,
  k35: 75.4000,
  k36: 72.3000,
  k37: 69.2000,
  k38: 66.1000,
  k39: 63.0000,
  k40: 59.9000,
  k41: 56.8000,
  k42: 53.7000,
  k43: 50.6000,
  k44: 47.5000,
  k45: 44.4000,
  k46: 41.3000,
  k47: 38.2000,
  k48: 35.1000,
  k49: 32.0000,
  k50: 28.9000,
  k51: 25.8000,
  k52: 22.7000,
  k53: 19.6000,
  k54: 16.5000,
  k55: 13.4000,
  k56: 10.3000,
  k57: 7.2000,
  k58: 4.1000,
  k59: 1.0000,
  k60: 97.6000,
  k61: 94.5000,
  k62: 91.4000,
  k63: 88.3000,
  k64: 85.2000,
  k65: 82.1000,
  k66: 79.0000,
  k67: 75.9000,
  k68: 72.8000,
  k69: 69.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_010_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_010_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_010_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_010_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_010_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_010_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_010_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_010_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_010_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_010_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_010_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
