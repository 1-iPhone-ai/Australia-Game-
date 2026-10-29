import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 093 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_093_META = {
  id: 'mig_093',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 92192,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_093_COEF = {
  k0: 34.6000,
  k1: 81.4000,
  k2: 28.5000,
  k3: 75.3000,
  k4: 22.4000,
  k5: 69.2000,
  k6: 16.3000,
  k7: 63.1000,
  k8: 10.2000,
  k9: 57.0000,
  k10: 4.1000,
  k11: 50.9000,
  k12: 97.7000,
  k13: 44.8000,
  k14: 91.6000,
  k15: 38.7000,
  k16: 85.5000,
  k17: 32.6000,
  k18: 79.4000,
  k19: 26.5000,
  k20: 73.3000,
  k21: 20.4000,
  k22: 67.2000,
  k23: 14.3000,
  k24: 61.1000,
  k25: 8.2000,
  k26: 55.0000,
  k27: 2.1000,
  k28: 48.9000,
  k29: 95.7000,
  k30: 42.8000,
  k31: 89.6000,
  k32: 36.7000,
  k33: 83.5000,
  k34: 30.6000,
  k35: 77.4000,
  k36: 24.5000,
  k37: 71.3000,
  k38: 18.4000,
  k39: 65.2000,
  k40: 12.3000,
  k41: 59.1000,
  k42: 6.2000,
  k43: 53.0000,
  k44: 0.1000,
  k45: 46.9000,
  k46: 93.7000,
  k47: 40.8000,
  k48: 87.6000,
  k49: 34.7000,
  k50: 81.5000,
  k51: 28.6000,
  k52: 75.4000,
  k53: 22.5000,
  k54: 69.3000,
  k55: 16.4000,
  k56: 63.2000,
  k57: 10.3000,
  k58: 57.1000,
  k59: 4.2000,
  k60: 51.0000,
  k61: 97.8000,
  k62: 44.9000,
  k63: 91.7000,
  k64: 38.8000,
  k65: 85.6000,
  k66: 32.7000,
  k67: 79.5000,
  k68: 26.6000,
  k69: 73.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_093_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_093_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_093_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_093_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_093_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_093_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_093_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_093_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_093_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_093_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_093_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
