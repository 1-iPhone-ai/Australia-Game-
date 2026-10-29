import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 137 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_137_META = {
  id: 'mig_137',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 135796,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_137_COEF = {
  k0: 2.3000,
  k1: 22.7000,
  k2: 43.1000,
  k3: 63.5000,
  k4: 83.9000,
  k5: 4.6000,
  k6: 25.0000,
  k7: 45.4000,
  k8: 65.8000,
  k9: 86.2000,
  k10: 6.9000,
  k11: 27.3000,
  k12: 47.7000,
  k13: 68.1000,
  k14: 88.5000,
  k15: 9.2000,
  k16: 29.6000,
  k17: 50.0000,
  k18: 70.4000,
  k19: 90.8000,
  k20: 11.5000,
  k21: 31.9000,
  k22: 52.3000,
  k23: 72.7000,
  k24: 93.1000,
  k25: 13.8000,
  k26: 34.2000,
  k27: 54.6000,
  k28: 75.0000,
  k29: 95.4000,
  k30: 16.1000,
  k31: 36.5000,
  k32: 56.9000,
  k33: 77.3000,
  k34: 97.7000,
  k35: 18.4000,
  k36: 38.8000,
  k37: 59.2000,
  k38: 79.6000,
  k39: 0.3000,
  k40: 20.7000,
  k41: 41.1000,
  k42: 61.5000,
  k43: 81.9000,
  k44: 2.6000,
  k45: 23.0000,
  k46: 43.4000,
  k47: 63.8000,
  k48: 84.2000,
  k49: 4.9000,
  k50: 25.3000,
  k51: 45.7000,
  k52: 66.1000,
  k53: 86.5000,
  k54: 7.2000,
  k55: 27.6000,
  k56: 48.0000,
  k57: 68.4000,
  k58: 88.8000,
  k59: 9.5000,
  k60: 29.9000,
  k61: 50.3000,
  k62: 70.7000,
  k63: 91.1000,
  k64: 11.8000,
  k65: 32.2000,
  k66: 52.6000,
  k67: 73.0000,
  k68: 93.4000,
  k69: 14.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_137_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_137_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_137_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_137_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_137_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_137_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_137_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_137_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_137_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_137_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_137_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
