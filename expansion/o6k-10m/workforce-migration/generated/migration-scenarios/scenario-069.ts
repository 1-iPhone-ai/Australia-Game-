import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 069 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_069_META = {
  id: 'mig_069',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 68408,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_069_COEF = {
  k0: 6.9000,
  k1: 68.1000,
  k2: 29.6000,
  k3: 90.8000,
  k4: 52.3000,
  k5: 13.8000,
  k6: 75.0000,
  k7: 36.5000,
  k8: 97.7000,
  k9: 59.2000,
  k10: 20.7000,
  k11: 81.9000,
  k12: 43.4000,
  k13: 4.9000,
  k14: 66.1000,
  k15: 27.6000,
  k16: 88.8000,
  k17: 50.3000,
  k18: 11.8000,
  k19: 73.0000,
  k20: 34.5000,
  k21: 95.7000,
  k22: 57.2000,
  k23: 18.7000,
  k24: 79.9000,
  k25: 41.4000,
  k26: 2.9000,
  k27: 64.1000,
  k28: 25.6000,
  k29: 86.8000,
  k30: 48.3000,
  k31: 9.8000,
  k32: 71.0000,
  k33: 32.5000,
  k34: 93.7000,
  k35: 55.2000,
  k36: 16.7000,
  k37: 77.9000,
  k38: 39.4000,
  k39: 0.9000,
  k40: 62.1000,
  k41: 23.6000,
  k42: 84.8000,
  k43: 46.3000,
  k44: 7.8000,
  k45: 69.0000,
  k46: 30.5000,
  k47: 91.7000,
  k48: 53.2000,
  k49: 14.7000,
  k50: 75.9000,
  k51: 37.4000,
  k52: 98.6000,
  k53: 60.1000,
  k54: 21.6000,
  k55: 82.8000,
  k56: 44.3000,
  k57: 5.8000,
  k58: 67.0000,
  k59: 28.5000,
  k60: 89.7000,
  k61: 51.2000,
  k62: 12.7000,
  k63: 73.9000,
  k64: 35.4000,
  k65: 96.6000,
  k66: 58.1000,
  k67: 19.6000,
  k68: 80.8000,
  k69: 42.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_069_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_069_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_069_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_069_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_069_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_069_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_069_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_069_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_069_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_069_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_069_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
