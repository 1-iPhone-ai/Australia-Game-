import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 092 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_092_META = {
  id: 'mig_092',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 91201,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_092_COEF = {
  k0: 37.6000,
  k1: 85.0000,
  k2: 32.7000,
  k3: 80.1000,
  k4: 27.8000,
  k5: 75.2000,
  k6: 22.9000,
  k7: 70.3000,
  k8: 18.0000,
  k9: 65.4000,
  k10: 13.1000,
  k11: 60.5000,
  k12: 8.2000,
  k13: 55.6000,
  k14: 3.3000,
  k15: 50.7000,
  k16: 98.1000,
  k17: 45.8000,
  k18: 93.2000,
  k19: 40.9000,
  k20: 88.3000,
  k21: 36.0000,
  k22: 83.4000,
  k23: 31.1000,
  k24: 78.5000,
  k25: 26.2000,
  k26: 73.6000,
  k27: 21.3000,
  k28: 68.7000,
  k29: 16.4000,
  k30: 63.8000,
  k31: 11.5000,
  k32: 58.9000,
  k33: 6.6000,
  k34: 54.0000,
  k35: 1.7000,
  k36: 49.1000,
  k37: 96.5000,
  k38: 44.2000,
  k39: 91.6000,
  k40: 39.3000,
  k41: 86.7000,
  k42: 34.4000,
  k43: 81.8000,
  k44: 29.5000,
  k45: 76.9000,
  k46: 24.6000,
  k47: 72.0000,
  k48: 19.7000,
  k49: 67.1000,
  k50: 14.8000,
  k51: 62.2000,
  k52: 9.9000,
  k53: 57.3000,
  k54: 5.0000,
  k55: 52.4000,
  k56: 0.1000,
  k57: 47.5000,
  k58: 94.9000,
  k59: 42.6000,
  k60: 90.0000,
  k61: 37.7000,
  k62: 85.1000,
  k63: 32.8000,
  k64: 80.2000,
  k65: 27.9000,
  k66: 75.3000,
  k67: 23.0000,
  k68: 70.4000,
  k69: 18.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_092_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_092_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_092_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_092_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_092_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_092_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_092_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_092_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_092_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_092_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_092_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
