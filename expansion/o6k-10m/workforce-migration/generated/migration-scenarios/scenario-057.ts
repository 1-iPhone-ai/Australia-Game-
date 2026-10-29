import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 057 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_057_META = {
  id: 'mig_057',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 56516,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_057_COEF = {
  k0: 42.9000,
  k1: 11.6000,
  k2: 80.0000,
  k3: 48.7000,
  k4: 17.4000,
  k5: 85.8000,
  k6: 54.5000,
  k7: 23.2000,
  k8: 91.6000,
  k9: 60.3000,
  k10: 29.0000,
  k11: 97.4000,
  k12: 66.1000,
  k13: 34.8000,
  k14: 3.5000,
  k15: 71.9000,
  k16: 40.6000,
  k17: 9.3000,
  k18: 77.7000,
  k19: 46.4000,
  k20: 15.1000,
  k21: 83.5000,
  k22: 52.2000,
  k23: 20.9000,
  k24: 89.3000,
  k25: 58.0000,
  k26: 26.7000,
  k27: 95.1000,
  k28: 63.8000,
  k29: 32.5000,
  k30: 1.2000,
  k31: 69.6000,
  k32: 38.3000,
  k33: 7.0000,
  k34: 75.4000,
  k35: 44.1000,
  k36: 12.8000,
  k37: 81.2000,
  k38: 49.9000,
  k39: 18.6000,
  k40: 87.0000,
  k41: 55.7000,
  k42: 24.4000,
  k43: 92.8000,
  k44: 61.5000,
  k45: 30.2000,
  k46: 98.6000,
  k47: 67.3000,
  k48: 36.0000,
  k49: 4.7000,
  k50: 73.1000,
  k51: 41.8000,
  k52: 10.5000,
  k53: 78.9000,
  k54: 47.6000,
  k55: 16.3000,
  k56: 84.7000,
  k57: 53.4000,
  k58: 22.1000,
  k59: 90.5000,
  k60: 59.2000,
  k61: 27.9000,
  k62: 96.3000,
  k63: 65.0000,
  k64: 33.7000,
  k65: 2.4000,
  k66: 70.8000,
  k67: 39.5000,
  k68: 8.2000,
  k69: 76.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_057_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_057_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_057_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_057_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_057_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_057_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_057_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_057_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_057_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_057_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_057_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
