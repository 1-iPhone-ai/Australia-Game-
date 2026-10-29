import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 070 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_070_META = {
  id: 'mig_070',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 69399,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_070_COEF = {
  k0: 3.9000,
  k1: 64.5000,
  k2: 25.4000,
  k3: 86.0000,
  k4: 46.9000,
  k5: 7.8000,
  k6: 68.4000,
  k7: 29.3000,
  k8: 89.9000,
  k9: 50.8000,
  k10: 11.7000,
  k11: 72.3000,
  k12: 33.2000,
  k13: 93.8000,
  k14: 54.7000,
  k15: 15.6000,
  k16: 76.2000,
  k17: 37.1000,
  k18: 97.7000,
  k19: 58.6000,
  k20: 19.5000,
  k21: 80.1000,
  k22: 41.0000,
  k23: 1.9000,
  k24: 62.5000,
  k25: 23.4000,
  k26: 84.0000,
  k27: 44.9000,
  k28: 5.8000,
  k29: 66.4000,
  k30: 27.3000,
  k31: 87.9000,
  k32: 48.8000,
  k33: 9.7000,
  k34: 70.3000,
  k35: 31.2000,
  k36: 91.8000,
  k37: 52.7000,
  k38: 13.6000,
  k39: 74.2000,
  k40: 35.1000,
  k41: 95.7000,
  k42: 56.6000,
  k43: 17.5000,
  k44: 78.1000,
  k45: 39.0000,
  k46: 99.6000,
  k47: 60.5000,
  k48: 21.4000,
  k49: 82.0000,
  k50: 42.9000,
  k51: 3.8000,
  k52: 64.4000,
  k53: 25.3000,
  k54: 85.9000,
  k55: 46.8000,
  k56: 7.7000,
  k57: 68.3000,
  k58: 29.2000,
  k59: 89.8000,
  k60: 50.7000,
  k61: 11.6000,
  k62: 72.2000,
  k63: 33.1000,
  k64: 93.7000,
  k65: 54.6000,
  k66: 15.5000,
  k67: 76.1000,
  k68: 37.0000,
  k69: 97.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_070_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_070_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_070_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_070_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_070_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_070_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_070_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_070_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_070_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_070_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_070_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
