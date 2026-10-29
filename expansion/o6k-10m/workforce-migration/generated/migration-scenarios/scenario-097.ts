import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 097 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_097_META = {
  id: 'mig_097',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 96156,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_097_COEF = {
  k0: 22.6000,
  k1: 67.0000,
  k2: 11.7000,
  k3: 56.1000,
  k4: 0.8000,
  k5: 45.2000,
  k6: 89.6000,
  k7: 34.3000,
  k8: 78.7000,
  k9: 23.4000,
  k10: 67.8000,
  k11: 12.5000,
  k12: 56.9000,
  k13: 1.6000,
  k14: 46.0000,
  k15: 90.4000,
  k16: 35.1000,
  k17: 79.5000,
  k18: 24.2000,
  k19: 68.6000,
  k20: 13.3000,
  k21: 57.7000,
  k22: 2.4000,
  k23: 46.8000,
  k24: 91.2000,
  k25: 35.9000,
  k26: 80.3000,
  k27: 25.0000,
  k28: 69.4000,
  k29: 14.1000,
  k30: 58.5000,
  k31: 3.2000,
  k32: 47.6000,
  k33: 92.0000,
  k34: 36.7000,
  k35: 81.1000,
  k36: 25.8000,
  k37: 70.2000,
  k38: 14.9000,
  k39: 59.3000,
  k40: 4.0000,
  k41: 48.4000,
  k42: 92.8000,
  k43: 37.5000,
  k44: 81.9000,
  k45: 26.6000,
  k46: 71.0000,
  k47: 15.7000,
  k48: 60.1000,
  k49: 4.8000,
  k50: 49.2000,
  k51: 93.6000,
  k52: 38.3000,
  k53: 82.7000,
  k54: 27.4000,
  k55: 71.8000,
  k56: 16.5000,
  k57: 60.9000,
  k58: 5.6000,
  k59: 50.0000,
  k60: 94.4000,
  k61: 39.1000,
  k62: 83.5000,
  k63: 28.2000,
  k64: 72.6000,
  k65: 17.3000,
  k66: 61.7000,
  k67: 6.4000,
  k68: 50.8000,
  k69: 95.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_097_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_097_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_097_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_097_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_097_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_097_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_097_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_097_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_097_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_097_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_097_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
