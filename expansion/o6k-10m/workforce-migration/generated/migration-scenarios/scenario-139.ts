import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 139 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_139_META = {
  id: 'mig_139',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 137778,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_139_COEF = {
  k0: 96.0000,
  k1: 15.5000,
  k2: 34.7000,
  k3: 53.9000,
  k4: 73.1000,
  k5: 92.3000,
  k6: 11.8000,
  k7: 31.0000,
  k8: 50.2000,
  k9: 69.4000,
  k10: 88.6000,
  k11: 8.1000,
  k12: 27.3000,
  k13: 46.5000,
  k14: 65.7000,
  k15: 84.9000,
  k16: 4.4000,
  k17: 23.6000,
  k18: 42.8000,
  k19: 62.0000,
  k20: 81.2000,
  k21: 0.7000,
  k22: 19.9000,
  k23: 39.1000,
  k24: 58.3000,
  k25: 77.5000,
  k26: 96.7000,
  k27: 16.2000,
  k28: 35.4000,
  k29: 54.6000,
  k30: 73.8000,
  k31: 93.0000,
  k32: 12.5000,
  k33: 31.7000,
  k34: 50.9000,
  k35: 70.1000,
  k36: 89.3000,
  k37: 8.8000,
  k38: 28.0000,
  k39: 47.2000,
  k40: 66.4000,
  k41: 85.6000,
  k42: 5.1000,
  k43: 24.3000,
  k44: 43.5000,
  k45: 62.7000,
  k46: 81.9000,
  k47: 1.4000,
  k48: 20.6000,
  k49: 39.8000,
  k50: 59.0000,
  k51: 78.2000,
  k52: 97.4000,
  k53: 16.9000,
  k54: 36.1000,
  k55: 55.3000,
  k56: 74.5000,
  k57: 93.7000,
  k58: 13.2000,
  k59: 32.4000,
  k60: 51.6000,
  k61: 70.8000,
  k62: 90.0000,
  k63: 9.5000,
  k64: 28.7000,
  k65: 47.9000,
  k66: 67.1000,
  k67: 86.3000,
  k68: 5.8000,
  k69: 25.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_139_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_139_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_139_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_139_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_139_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_139_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_139_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_139_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_139_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_139_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_139_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
