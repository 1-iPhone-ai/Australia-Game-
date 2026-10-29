import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 106 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_106_META = {
  id: 'mig_106',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 105075,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_106_COEF = {
  k0: 95.3000,
  k1: 34.6000,
  k2: 73.6000,
  k3: 12.9000,
  k4: 51.9000,
  k5: 90.9000,
  k6: 30.2000,
  k7: 69.2000,
  k8: 8.5000,
  k9: 47.5000,
  k10: 86.5000,
  k11: 25.8000,
  k12: 64.8000,
  k13: 4.1000,
  k14: 43.1000,
  k15: 82.1000,
  k16: 21.4000,
  k17: 60.4000,
  k18: 99.4000,
  k19: 38.7000,
  k20: 77.7000,
  k21: 17.0000,
  k22: 56.0000,
  k23: 95.0000,
  k24: 34.3000,
  k25: 73.3000,
  k26: 12.6000,
  k27: 51.6000,
  k28: 90.6000,
  k29: 29.9000,
  k30: 68.9000,
  k31: 8.2000,
  k32: 47.2000,
  k33: 86.2000,
  k34: 25.5000,
  k35: 64.5000,
  k36: 3.8000,
  k37: 42.8000,
  k38: 81.8000,
  k39: 21.1000,
  k40: 60.1000,
  k41: 99.1000,
  k42: 38.4000,
  k43: 77.4000,
  k44: 16.7000,
  k45: 55.7000,
  k46: 94.7000,
  k47: 34.0000,
  k48: 73.0000,
  k49: 12.3000,
  k50: 51.3000,
  k51: 90.3000,
  k52: 29.6000,
  k53: 68.6000,
  k54: 7.9000,
  k55: 46.9000,
  k56: 85.9000,
  k57: 25.2000,
  k58: 64.2000,
  k59: 3.5000,
  k60: 42.5000,
  k61: 81.5000,
  k62: 20.8000,
  k63: 59.8000,
  k64: 98.8000,
  k65: 38.1000,
  k66: 77.1000,
  k67: 16.4000,
  k68: 55.4000,
  k69: 94.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_106_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_106_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_106_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_106_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_106_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_106_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_106_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_106_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_106_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_106_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_106_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
