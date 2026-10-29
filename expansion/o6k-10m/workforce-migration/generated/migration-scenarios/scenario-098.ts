import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 098 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_098_META = {
  id: 'mig_098',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 97147,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_098_COEF = {
  k0: 19.6000,
  k1: 63.4000,
  k2: 7.5000,
  k3: 51.3000,
  k4: 95.1000,
  k5: 39.2000,
  k6: 83.0000,
  k7: 27.1000,
  k8: 70.9000,
  k9: 15.0000,
  k10: 58.8000,
  k11: 2.9000,
  k12: 46.7000,
  k13: 90.5000,
  k14: 34.6000,
  k15: 78.4000,
  k16: 22.5000,
  k17: 66.3000,
  k18: 10.4000,
  k19: 54.2000,
  k20: 98.0000,
  k21: 42.1000,
  k22: 85.9000,
  k23: 30.0000,
  k24: 73.8000,
  k25: 17.9000,
  k26: 61.7000,
  k27: 5.8000,
  k28: 49.6000,
  k29: 93.4000,
  k30: 37.5000,
  k31: 81.3000,
  k32: 25.4000,
  k33: 69.2000,
  k34: 13.3000,
  k35: 57.1000,
  k36: 1.2000,
  k37: 45.0000,
  k38: 88.8000,
  k39: 32.9000,
  k40: 76.7000,
  k41: 20.8000,
  k42: 64.6000,
  k43: 8.7000,
  k44: 52.5000,
  k45: 96.3000,
  k46: 40.4000,
  k47: 84.2000,
  k48: 28.3000,
  k49: 72.1000,
  k50: 16.2000,
  k51: 60.0000,
  k52: 4.1000,
  k53: 47.9000,
  k54: 91.7000,
  k55: 35.8000,
  k56: 79.6000,
  k57: 23.7000,
  k58: 67.5000,
  k59: 11.6000,
  k60: 55.4000,
  k61: 99.2000,
  k62: 43.3000,
  k63: 87.1000,
  k64: 31.2000,
  k65: 75.0000,
  k66: 19.1000,
  k67: 62.9000,
  k68: 7.0000,
  k69: 50.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_098_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_098_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_098_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_098_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_098_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_098_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_098_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_098_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_098_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_098_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_098_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
