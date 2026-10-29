import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 085 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_085_META = {
  id: 'mig_085',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 84264,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_085_COEF = {
  k0: 58.6000,
  k1: 10.5000,
  k2: 62.1000,
  k3: 14.0000,
  k4: 65.6000,
  k5: 17.5000,
  k6: 69.1000,
  k7: 21.0000,
  k8: 72.6000,
  k9: 24.5000,
  k10: 76.1000,
  k11: 28.0000,
  k12: 79.6000,
  k13: 31.5000,
  k14: 83.1000,
  k15: 35.0000,
  k16: 86.6000,
  k17: 38.5000,
  k18: 90.1000,
  k19: 42.0000,
  k20: 93.6000,
  k21: 45.5000,
  k22: 97.1000,
  k23: 49.0000,
  k24: 0.9000,
  k25: 52.5000,
  k26: 4.4000,
  k27: 56.0000,
  k28: 7.9000,
  k29: 59.5000,
  k30: 11.4000,
  k31: 63.0000,
  k32: 14.9000,
  k33: 66.5000,
  k34: 18.4000,
  k35: 70.0000,
  k36: 21.9000,
  k37: 73.5000,
  k38: 25.4000,
  k39: 77.0000,
  k40: 28.9000,
  k41: 80.5000,
  k42: 32.4000,
  k43: 84.0000,
  k44: 35.9000,
  k45: 87.5000,
  k46: 39.4000,
  k47: 91.0000,
  k48: 42.9000,
  k49: 94.5000,
  k50: 46.4000,
  k51: 98.0000,
  k52: 49.9000,
  k53: 1.8000,
  k54: 53.4000,
  k55: 5.3000,
  k56: 56.9000,
  k57: 8.8000,
  k58: 60.4000,
  k59: 12.3000,
  k60: 63.9000,
  k61: 15.8000,
  k62: 67.4000,
  k63: 19.3000,
  k64: 70.9000,
  k65: 22.8000,
  k66: 74.4000,
  k67: 26.3000,
  k68: 77.9000,
  k69: 29.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_085_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_085_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_085_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_085_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_085_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_085_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_085_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_085_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_085_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_085_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_085_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
