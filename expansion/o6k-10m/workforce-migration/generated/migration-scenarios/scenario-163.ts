import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 163 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_163_META = {
  id: 'mig_163',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 161562,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_163_COEF = {
  k0: 24.0000,
  k1: 28.8000,
  k2: 33.6000,
  k3: 38.4000,
  k4: 43.2000,
  k5: 48.0000,
  k6: 52.8000,
  k7: 57.6000,
  k8: 62.4000,
  k9: 67.2000,
  k10: 72.0000,
  k11: 76.8000,
  k12: 81.6000,
  k13: 86.4000,
  k14: 91.2000,
  k15: 96.0000,
  k16: 1.1000,
  k17: 5.9000,
  k18: 10.7000,
  k19: 15.5000,
  k20: 20.3000,
  k21: 25.1000,
  k22: 29.9000,
  k23: 34.7000,
  k24: 39.5000,
  k25: 44.3000,
  k26: 49.1000,
  k27: 53.9000,
  k28: 58.7000,
  k29: 63.5000,
  k30: 68.3000,
  k31: 73.1000,
  k32: 77.9000,
  k33: 82.7000,
  k34: 87.5000,
  k35: 92.3000,
  k36: 97.1000,
  k37: 2.2000,
  k38: 7.0000,
  k39: 11.8000,
  k40: 16.6000,
  k41: 21.4000,
  k42: 26.2000,
  k43: 31.0000,
  k44: 35.8000,
  k45: 40.6000,
  k46: 45.4000,
  k47: 50.2000,
  k48: 55.0000,
  k49: 59.8000,
  k50: 64.6000,
  k51: 69.4000,
  k52: 74.2000,
  k53: 79.0000,
  k54: 83.8000,
  k55: 88.6000,
  k56: 93.4000,
  k57: 98.2000,
  k58: 3.3000,
  k59: 8.1000,
  k60: 12.9000,
  k61: 17.7000,
  k62: 22.5000,
  k63: 27.3000,
  k64: 32.1000,
  k65: 36.9000,
  k66: 41.7000,
  k67: 46.5000,
  k68: 51.3000,
  k69: 56.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_163_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_163_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_163_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_163_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_163_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_163_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_163_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_163_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_163_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_163_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_163_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
