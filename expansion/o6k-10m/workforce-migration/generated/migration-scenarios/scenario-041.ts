import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 041 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_041_META = {
  id: 'mig_041',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 40660,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_041_COEF = {
  k0: 90.9000,
  k1: 69.2000,
  k2: 47.5000,
  k3: 25.8000,
  k4: 4.1000,
  k5: 82.1000,
  k6: 60.4000,
  k7: 38.7000,
  k8: 17.0000,
  k9: 95.0000,
  k10: 73.3000,
  k11: 51.6000,
  k12: 29.9000,
  k13: 8.2000,
  k14: 86.2000,
  k15: 64.5000,
  k16: 42.8000,
  k17: 21.1000,
  k18: 99.1000,
  k19: 77.4000,
  k20: 55.7000,
  k21: 34.0000,
  k22: 12.3000,
  k23: 90.3000,
  k24: 68.6000,
  k25: 46.9000,
  k26: 25.2000,
  k27: 3.5000,
  k28: 81.5000,
  k29: 59.8000,
  k30: 38.1000,
  k31: 16.4000,
  k32: 94.4000,
  k33: 72.7000,
  k34: 51.0000,
  k35: 29.3000,
  k36: 7.6000,
  k37: 85.6000,
  k38: 63.9000,
  k39: 42.2000,
  k40: 20.5000,
  k41: 98.5000,
  k42: 76.8000,
  k43: 55.1000,
  k44: 33.4000,
  k45: 11.7000,
  k46: 89.7000,
  k47: 68.0000,
  k48: 46.3000,
  k49: 24.6000,
  k50: 2.9000,
  k51: 80.9000,
  k52: 59.2000,
  k53: 37.5000,
  k54: 15.8000,
  k55: 93.8000,
  k56: 72.1000,
  k57: 50.4000,
  k58: 28.7000,
  k59: 7.0000,
  k60: 85.0000,
  k61: 63.3000,
  k62: 41.6000,
  k63: 19.9000,
  k64: 97.9000,
  k65: 76.2000,
  k66: 54.5000,
  k67: 32.8000,
  k68: 11.1000,
  k69: 89.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_041_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_041_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_041_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_041_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_041_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_041_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_041_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_041_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_041_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_041_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_041_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
