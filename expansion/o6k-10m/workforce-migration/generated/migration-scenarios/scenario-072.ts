import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 072 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_072_META = {
  id: 'mig_072',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 71381,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_072_COEF = {
  k0: 97.6000,
  k1: 57.3000,
  k2: 17.0000,
  k3: 76.4000,
  k4: 36.1000,
  k5: 95.5000,
  k6: 55.2000,
  k7: 14.9000,
  k8: 74.3000,
  k9: 34.0000,
  k10: 93.4000,
  k11: 53.1000,
  k12: 12.8000,
  k13: 72.2000,
  k14: 31.9000,
  k15: 91.3000,
  k16: 51.0000,
  k17: 10.7000,
  k18: 70.1000,
  k19: 29.8000,
  k20: 89.2000,
  k21: 48.9000,
  k22: 8.6000,
  k23: 68.0000,
  k24: 27.7000,
  k25: 87.1000,
  k26: 46.8000,
  k27: 6.5000,
  k28: 65.9000,
  k29: 25.6000,
  k30: 85.0000,
  k31: 44.7000,
  k32: 4.4000,
  k33: 63.8000,
  k34: 23.5000,
  k35: 82.9000,
  k36: 42.6000,
  k37: 2.3000,
  k38: 61.7000,
  k39: 21.4000,
  k40: 80.8000,
  k41: 40.5000,
  k42: 0.2000,
  k43: 59.6000,
  k44: 19.3000,
  k45: 78.7000,
  k46: 38.4000,
  k47: 97.8000,
  k48: 57.5000,
  k49: 17.2000,
  k50: 76.6000,
  k51: 36.3000,
  k52: 95.7000,
  k53: 55.4000,
  k54: 15.1000,
  k55: 74.5000,
  k56: 34.2000,
  k57: 93.6000,
  k58: 53.3000,
  k59: 13.0000,
  k60: 72.4000,
  k61: 32.1000,
  k62: 91.5000,
  k63: 51.2000,
  k64: 10.9000,
  k65: 70.3000,
  k66: 30.0000,
  k67: 89.4000,
  k68: 49.1000,
  k69: 8.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_072_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_072_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_072_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_072_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_072_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_072_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_072_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_072_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_072_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_072_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_072_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
