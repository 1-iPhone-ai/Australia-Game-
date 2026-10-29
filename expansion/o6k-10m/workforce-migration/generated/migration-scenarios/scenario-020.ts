import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 020 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_020_META = {
  id: 'mig_020',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 19849,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_020_COEF = {
  k0: 54.2000,
  k1: 45.1000,
  k2: 36.0000,
  k3: 26.9000,
  k4: 17.8000,
  k5: 8.7000,
  k6: 99.3000,
  k7: 90.2000,
  k8: 81.1000,
  k9: 72.0000,
  k10: 62.9000,
  k11: 53.8000,
  k12: 44.7000,
  k13: 35.6000,
  k14: 26.5000,
  k15: 17.4000,
  k16: 8.3000,
  k17: 98.9000,
  k18: 89.8000,
  k19: 80.7000,
  k20: 71.6000,
  k21: 62.5000,
  k22: 53.4000,
  k23: 44.3000,
  k24: 35.2000,
  k25: 26.1000,
  k26: 17.0000,
  k27: 7.9000,
  k28: 98.5000,
  k29: 89.4000,
  k30: 80.3000,
  k31: 71.2000,
  k32: 62.1000,
  k33: 53.0000,
  k34: 43.9000,
  k35: 34.8000,
  k36: 25.7000,
  k37: 16.6000,
  k38: 7.5000,
  k39: 98.1000,
  k40: 89.0000,
  k41: 79.9000,
  k42: 70.8000,
  k43: 61.7000,
  k44: 52.6000,
  k45: 43.5000,
  k46: 34.4000,
  k47: 25.3000,
  k48: 16.2000,
  k49: 7.1000,
  k50: 97.7000,
  k51: 88.6000,
  k52: 79.5000,
  k53: 70.4000,
  k54: 61.3000,
  k55: 52.2000,
  k56: 43.1000,
  k57: 34.0000,
  k58: 24.9000,
  k59: 15.8000,
  k60: 6.7000,
  k61: 97.3000,
  k62: 88.2000,
  k63: 79.1000,
  k64: 70.0000,
  k65: 60.9000,
  k66: 51.8000,
  k67: 42.7000,
  k68: 33.6000,
  k69: 24.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_020_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_020_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_020_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_020_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_020_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_020_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_020_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_020_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_020_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_020_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_020_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
