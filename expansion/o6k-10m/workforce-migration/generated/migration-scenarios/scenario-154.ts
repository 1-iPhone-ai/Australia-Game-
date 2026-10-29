import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 154 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_154_META = {
  id: 'mig_154',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 152643,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_154_COEF = {
  k0: 51.0000,
  k1: 61.2000,
  k2: 71.4000,
  k3: 81.6000,
  k4: 91.8000,
  k5: 2.3000,
  k6: 12.5000,
  k7: 22.7000,
  k8: 32.9000,
  k9: 43.1000,
  k10: 53.3000,
  k11: 63.5000,
  k12: 73.7000,
  k13: 83.9000,
  k14: 94.1000,
  k15: 4.6000,
  k16: 14.8000,
  k17: 25.0000,
  k18: 35.2000,
  k19: 45.4000,
  k20: 55.6000,
  k21: 65.8000,
  k22: 76.0000,
  k23: 86.2000,
  k24: 96.4000,
  k25: 6.9000,
  k26: 17.1000,
  k27: 27.3000,
  k28: 37.5000,
  k29: 47.7000,
  k30: 57.9000,
  k31: 68.1000,
  k32: 78.3000,
  k33: 88.5000,
  k34: 98.7000,
  k35: 9.2000,
  k36: 19.4000,
  k37: 29.6000,
  k38: 39.8000,
  k39: 50.0000,
  k40: 60.2000,
  k41: 70.4000,
  k42: 80.6000,
  k43: 90.8000,
  k44: 1.3000,
  k45: 11.5000,
  k46: 21.7000,
  k47: 31.9000,
  k48: 42.1000,
  k49: 52.3000,
  k50: 62.5000,
  k51: 72.7000,
  k52: 82.9000,
  k53: 93.1000,
  k54: 3.6000,
  k55: 13.8000,
  k56: 24.0000,
  k57: 34.2000,
  k58: 44.4000,
  k59: 54.6000,
  k60: 64.8000,
  k61: 75.0000,
  k62: 85.2000,
  k63: 95.4000,
  k64: 5.9000,
  k65: 16.1000,
  k66: 26.3000,
  k67: 36.5000,
  k68: 46.7000,
  k69: 56.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_154_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_154_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_154_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_154_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_154_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_154_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_154_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_154_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_154_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_154_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_154_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
