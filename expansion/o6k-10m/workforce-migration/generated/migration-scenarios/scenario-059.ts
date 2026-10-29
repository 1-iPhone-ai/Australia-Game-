import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 059 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_059_META = {
  id: 'mig_059',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 58498,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_059_COEF = {
  k0: 36.9000,
  k1: 4.4000,
  k2: 71.6000,
  k3: 39.1000,
  k4: 6.6000,
  k5: 73.8000,
  k6: 41.3000,
  k7: 8.8000,
  k8: 76.0000,
  k9: 43.5000,
  k10: 11.0000,
  k11: 78.2000,
  k12: 45.7000,
  k13: 13.2000,
  k14: 80.4000,
  k15: 47.9000,
  k16: 15.4000,
  k17: 82.6000,
  k18: 50.1000,
  k19: 17.6000,
  k20: 84.8000,
  k21: 52.3000,
  k22: 19.8000,
  k23: 87.0000,
  k24: 54.5000,
  k25: 22.0000,
  k26: 89.2000,
  k27: 56.7000,
  k28: 24.2000,
  k29: 91.4000,
  k30: 58.9000,
  k31: 26.4000,
  k32: 93.6000,
  k33: 61.1000,
  k34: 28.6000,
  k35: 95.8000,
  k36: 63.3000,
  k37: 30.8000,
  k38: 98.0000,
  k39: 65.5000,
  k40: 33.0000,
  k41: 0.5000,
  k42: 67.7000,
  k43: 35.2000,
  k44: 2.7000,
  k45: 69.9000,
  k46: 37.4000,
  k47: 4.9000,
  k48: 72.1000,
  k49: 39.6000,
  k50: 7.1000,
  k51: 74.3000,
  k52: 41.8000,
  k53: 9.3000,
  k54: 76.5000,
  k55: 44.0000,
  k56: 11.5000,
  k57: 78.7000,
  k58: 46.2000,
  k59: 13.7000,
  k60: 80.9000,
  k61: 48.4000,
  k62: 15.9000,
  k63: 83.1000,
  k64: 50.6000,
  k65: 18.1000,
  k66: 85.3000,
  k67: 52.8000,
  k68: 20.3000,
  k69: 87.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_059_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_059_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_059_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_059_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_059_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_059_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_059_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_059_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_059_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_059_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_059_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
