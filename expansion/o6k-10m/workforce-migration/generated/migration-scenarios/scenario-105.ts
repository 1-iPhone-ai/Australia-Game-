import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 105 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_105_META = {
  id: 'mig_105',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 104084,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_105_COEF = {
  k0: 98.3000,
  k1: 38.2000,
  k2: 77.8000,
  k3: 17.7000,
  k4: 57.3000,
  k5: 96.9000,
  k6: 36.8000,
  k7: 76.4000,
  k8: 16.3000,
  k9: 55.9000,
  k10: 95.5000,
  k11: 35.4000,
  k12: 75.0000,
  k13: 14.9000,
  k14: 54.5000,
  k15: 94.1000,
  k16: 34.0000,
  k17: 73.6000,
  k18: 13.5000,
  k19: 53.1000,
  k20: 92.7000,
  k21: 32.6000,
  k22: 72.2000,
  k23: 12.1000,
  k24: 51.7000,
  k25: 91.3000,
  k26: 31.2000,
  k27: 70.8000,
  k28: 10.7000,
  k29: 50.3000,
  k30: 89.9000,
  k31: 29.8000,
  k32: 69.4000,
  k33: 9.3000,
  k34: 48.9000,
  k35: 88.5000,
  k36: 28.4000,
  k37: 68.0000,
  k38: 7.9000,
  k39: 47.5000,
  k40: 87.1000,
  k41: 27.0000,
  k42: 66.6000,
  k43: 6.5000,
  k44: 46.1000,
  k45: 85.7000,
  k46: 25.6000,
  k47: 65.2000,
  k48: 5.1000,
  k49: 44.7000,
  k50: 84.3000,
  k51: 24.2000,
  k52: 63.8000,
  k53: 3.7000,
  k54: 43.3000,
  k55: 82.9000,
  k56: 22.8000,
  k57: 62.4000,
  k58: 2.3000,
  k59: 41.9000,
  k60: 81.5000,
  k61: 21.4000,
  k62: 61.0000,
  k63: 0.9000,
  k64: 40.5000,
  k65: 80.1000,
  k66: 20.0000,
  k67: 59.6000,
  k68: 99.2000,
  k69: 39.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_105_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_105_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_105_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_105_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_105_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_105_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_105_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_105_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_105_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_105_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_105_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
