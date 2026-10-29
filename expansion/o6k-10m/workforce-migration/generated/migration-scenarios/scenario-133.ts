import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 133 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_133_META = {
  id: 'mig_133',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 131832,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_133_COEF = {
  k0: 14.3000,
  k1: 37.1000,
  k2: 59.9000,
  k3: 82.7000,
  k4: 5.8000,
  k5: 28.6000,
  k6: 51.4000,
  k7: 74.2000,
  k8: 97.0000,
  k9: 20.1000,
  k10: 42.9000,
  k11: 65.7000,
  k12: 88.5000,
  k13: 11.6000,
  k14: 34.4000,
  k15: 57.2000,
  k16: 80.0000,
  k17: 3.1000,
  k18: 25.9000,
  k19: 48.7000,
  k20: 71.5000,
  k21: 94.3000,
  k22: 17.4000,
  k23: 40.2000,
  k24: 63.0000,
  k25: 85.8000,
  k26: 8.9000,
  k27: 31.7000,
  k28: 54.5000,
  k29: 77.3000,
  k30: 0.4000,
  k31: 23.2000,
  k32: 46.0000,
  k33: 68.8000,
  k34: 91.6000,
  k35: 14.7000,
  k36: 37.5000,
  k37: 60.3000,
  k38: 83.1000,
  k39: 6.2000,
  k40: 29.0000,
  k41: 51.8000,
  k42: 74.6000,
  k43: 97.4000,
  k44: 20.5000,
  k45: 43.3000,
  k46: 66.1000,
  k47: 88.9000,
  k48: 12.0000,
  k49: 34.8000,
  k50: 57.6000,
  k51: 80.4000,
  k52: 3.5000,
  k53: 26.3000,
  k54: 49.1000,
  k55: 71.9000,
  k56: 94.7000,
  k57: 17.8000,
  k58: 40.6000,
  k59: 63.4000,
  k60: 86.2000,
  k61: 9.3000,
  k62: 32.1000,
  k63: 54.9000,
  k64: 77.7000,
  k65: 0.8000,
  k66: 23.6000,
  k67: 46.4000,
  k68: 69.2000,
  k69: 92.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_133_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_133_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_133_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_133_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_133_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_133_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_133_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_133_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_133_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_133_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_133_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
