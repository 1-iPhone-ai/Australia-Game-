import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 049 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_049_META = {
  id: 'mig_049',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 48588,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_049_COEF = {
  k0: 66.9000,
  k1: 40.4000,
  k2: 13.9000,
  k3: 87.1000,
  k4: 60.6000,
  k5: 34.1000,
  k6: 7.6000,
  k7: 80.8000,
  k8: 54.3000,
  k9: 27.8000,
  k10: 1.3000,
  k11: 74.5000,
  k12: 48.0000,
  k13: 21.5000,
  k14: 94.7000,
  k15: 68.2000,
  k16: 41.7000,
  k17: 15.2000,
  k18: 88.4000,
  k19: 61.9000,
  k20: 35.4000,
  k21: 8.9000,
  k22: 82.1000,
  k23: 55.6000,
  k24: 29.1000,
  k25: 2.6000,
  k26: 75.8000,
  k27: 49.3000,
  k28: 22.8000,
  k29: 96.0000,
  k30: 69.5000,
  k31: 43.0000,
  k32: 16.5000,
  k33: 89.7000,
  k34: 63.2000,
  k35: 36.7000,
  k36: 10.2000,
  k37: 83.4000,
  k38: 56.9000,
  k39: 30.4000,
  k40: 3.9000,
  k41: 77.1000,
  k42: 50.6000,
  k43: 24.1000,
  k44: 97.3000,
  k45: 70.8000,
  k46: 44.3000,
  k47: 17.8000,
  k48: 91.0000,
  k49: 64.5000,
  k50: 38.0000,
  k51: 11.5000,
  k52: 84.7000,
  k53: 58.2000,
  k54: 31.7000,
  k55: 5.2000,
  k56: 78.4000,
  k57: 51.9000,
  k58: 25.4000,
  k59: 98.6000,
  k60: 72.1000,
  k61: 45.6000,
  k62: 19.1000,
  k63: 92.3000,
  k64: 65.8000,
  k65: 39.3000,
  k66: 12.8000,
  k67: 86.0000,
  k68: 59.5000,
  k69: 33.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_049_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_049_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_049_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_049_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_049_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_049_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_049_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_049_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_049_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_049_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_049_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
