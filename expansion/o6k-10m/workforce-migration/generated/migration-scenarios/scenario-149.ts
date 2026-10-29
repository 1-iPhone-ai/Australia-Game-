import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 149 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_149_META = {
  id: 'mig_149',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 147688,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_149_COEF = {
  k0: 66.0000,
  k1: 79.2000,
  k2: 92.4000,
  k3: 5.9000,
  k4: 19.1000,
  k5: 32.3000,
  k6: 45.5000,
  k7: 58.7000,
  k8: 71.9000,
  k9: 85.1000,
  k10: 98.3000,
  k11: 11.8000,
  k12: 25.0000,
  k13: 38.2000,
  k14: 51.4000,
  k15: 64.6000,
  k16: 77.8000,
  k17: 91.0000,
  k18: 4.5000,
  k19: 17.7000,
  k20: 30.9000,
  k21: 44.1000,
  k22: 57.3000,
  k23: 70.5000,
  k24: 83.7000,
  k25: 96.9000,
  k26: 10.4000,
  k27: 23.6000,
  k28: 36.8000,
  k29: 50.0000,
  k30: 63.2000,
  k31: 76.4000,
  k32: 89.6000,
  k33: 3.1000,
  k34: 16.3000,
  k35: 29.5000,
  k36: 42.7000,
  k37: 55.9000,
  k38: 69.1000,
  k39: 82.3000,
  k40: 95.5000,
  k41: 9.0000,
  k42: 22.2000,
  k43: 35.4000,
  k44: 48.6000,
  k45: 61.8000,
  k46: 75.0000,
  k47: 88.2000,
  k48: 1.7000,
  k49: 14.9000,
  k50: 28.1000,
  k51: 41.3000,
  k52: 54.5000,
  k53: 67.7000,
  k54: 80.9000,
  k55: 94.1000,
  k56: 7.6000,
  k57: 20.8000,
  k58: 34.0000,
  k59: 47.2000,
  k60: 60.4000,
  k61: 73.6000,
  k62: 86.8000,
  k63: 0.3000,
  k64: 13.5000,
  k65: 26.7000,
  k66: 39.9000,
  k67: 53.1000,
  k68: 66.3000,
  k69: 79.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_149_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_149_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_149_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_149_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_149_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_149_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_149_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_149_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_149_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_149_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_149_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
