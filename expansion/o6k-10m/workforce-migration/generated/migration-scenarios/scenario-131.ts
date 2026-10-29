import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 131 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_131_META = {
  id: 'mig_131',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 129850,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_131_COEF = {
  k0: 20.3000,
  k1: 44.3000,
  k2: 68.3000,
  k3: 92.3000,
  k4: 16.6000,
  k5: 40.6000,
  k6: 64.6000,
  k7: 88.6000,
  k8: 12.9000,
  k9: 36.9000,
  k10: 60.9000,
  k11: 84.9000,
  k12: 9.2000,
  k13: 33.2000,
  k14: 57.2000,
  k15: 81.2000,
  k16: 5.5000,
  k17: 29.5000,
  k18: 53.5000,
  k19: 77.5000,
  k20: 1.8000,
  k21: 25.8000,
  k22: 49.8000,
  k23: 73.8000,
  k24: 97.8000,
  k25: 22.1000,
  k26: 46.1000,
  k27: 70.1000,
  k28: 94.1000,
  k29: 18.4000,
  k30: 42.4000,
  k31: 66.4000,
  k32: 90.4000,
  k33: 14.7000,
  k34: 38.7000,
  k35: 62.7000,
  k36: 86.7000,
  k37: 11.0000,
  k38: 35.0000,
  k39: 59.0000,
  k40: 83.0000,
  k41: 7.3000,
  k42: 31.3000,
  k43: 55.3000,
  k44: 79.3000,
  k45: 3.6000,
  k46: 27.6000,
  k47: 51.6000,
  k48: 75.6000,
  k49: 99.6000,
  k50: 23.9000,
  k51: 47.9000,
  k52: 71.9000,
  k53: 95.9000,
  k54: 20.2000,
  k55: 44.2000,
  k56: 68.2000,
  k57: 92.2000,
  k58: 16.5000,
  k59: 40.5000,
  k60: 64.5000,
  k61: 88.5000,
  k62: 12.8000,
  k63: 36.8000,
  k64: 60.8000,
  k65: 84.8000,
  k66: 9.1000,
  k67: 33.1000,
  k68: 57.1000,
  k69: 81.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_131_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_131_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_131_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_131_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_131_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_131_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_131_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_131_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_131_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_131_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_131_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
