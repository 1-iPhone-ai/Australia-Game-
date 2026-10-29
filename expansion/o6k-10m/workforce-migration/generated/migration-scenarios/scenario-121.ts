import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 121 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_121_META = {
  id: 'mig_121',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 119940,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_121_COEF = {
  k0: 50.3000,
  k1: 80.3000,
  k2: 10.6000,
  k3: 40.6000,
  k4: 70.6000,
  k5: 0.9000,
  k6: 30.9000,
  k7: 60.9000,
  k8: 90.9000,
  k9: 21.2000,
  k10: 51.2000,
  k11: 81.2000,
  k12: 11.5000,
  k13: 41.5000,
  k14: 71.5000,
  k15: 1.8000,
  k16: 31.8000,
  k17: 61.8000,
  k18: 91.8000,
  k19: 22.1000,
  k20: 52.1000,
  k21: 82.1000,
  k22: 12.4000,
  k23: 42.4000,
  k24: 72.4000,
  k25: 2.7000,
  k26: 32.7000,
  k27: 62.7000,
  k28: 92.7000,
  k29: 23.0000,
  k30: 53.0000,
  k31: 83.0000,
  k32: 13.3000,
  k33: 43.3000,
  k34: 73.3000,
  k35: 3.6000,
  k36: 33.6000,
  k37: 63.6000,
  k38: 93.6000,
  k39: 23.9000,
  k40: 53.9000,
  k41: 83.9000,
  k42: 14.2000,
  k43: 44.2000,
  k44: 74.2000,
  k45: 4.5000,
  k46: 34.5000,
  k47: 64.5000,
  k48: 94.5000,
  k49: 24.8000,
  k50: 54.8000,
  k51: 84.8000,
  k52: 15.1000,
  k53: 45.1000,
  k54: 75.1000,
  k55: 5.4000,
  k56: 35.4000,
  k57: 65.4000,
  k58: 95.4000,
  k59: 25.7000,
  k60: 55.7000,
  k61: 85.7000,
  k62: 16.0000,
  k63: 46.0000,
  k64: 76.0000,
  k65: 6.3000,
  k66: 36.3000,
  k67: 66.3000,
  k68: 96.3000,
  k69: 26.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_121_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_121_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_121_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_121_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_121_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_121_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_121_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_121_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_121_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_121_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_121_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
