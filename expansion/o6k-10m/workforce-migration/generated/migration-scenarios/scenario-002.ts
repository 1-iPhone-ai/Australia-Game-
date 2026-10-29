import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 002 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_002_META = {
  id: 'mig_002',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 2011,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_002_COEF = {
  k0: 8.5000,
  k1: 10.2000,
  k2: 11.9000,
  k3: 13.6000,
  k4: 15.3000,
  k5: 17.0000,
  k6: 18.7000,
  k7: 20.4000,
  k8: 22.1000,
  k9: 23.8000,
  k10: 25.5000,
  k11: 27.2000,
  k12: 28.9000,
  k13: 30.6000,
  k14: 32.3000,
  k15: 34.0000,
  k16: 35.7000,
  k17: 37.4000,
  k18: 39.1000,
  k19: 40.8000,
  k20: 42.5000,
  k21: 44.2000,
  k22: 45.9000,
  k23: 47.6000,
  k24: 49.3000,
  k25: 51.0000,
  k26: 52.7000,
  k27: 54.4000,
  k28: 56.1000,
  k29: 57.8000,
  k30: 59.5000,
  k31: 61.2000,
  k32: 62.9000,
  k33: 64.6000,
  k34: 66.3000,
  k35: 68.0000,
  k36: 69.7000,
  k37: 71.4000,
  k38: 73.1000,
  k39: 74.8000,
  k40: 76.5000,
  k41: 78.2000,
  k42: 79.9000,
  k43: 81.6000,
  k44: 83.3000,
  k45: 85.0000,
  k46: 86.7000,
  k47: 88.4000,
  k48: 90.1000,
  k49: 91.8000,
  k50: 93.5000,
  k51: 95.2000,
  k52: 96.9000,
  k53: 98.6000,
  k54: 0.6000,
  k55: 2.3000,
  k56: 4.0000,
  k57: 5.7000,
  k58: 7.4000,
  k59: 9.1000,
  k60: 10.8000,
  k61: 12.5000,
  k62: 14.2000,
  k63: 15.9000,
  k64: 17.6000,
  k65: 19.3000,
  k66: 21.0000,
  k67: 22.7000,
  k68: 24.4000,
  k69: 26.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_002_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_002_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_002_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_002_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_002_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_002_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_002_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_002_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_002_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_002_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_002_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
