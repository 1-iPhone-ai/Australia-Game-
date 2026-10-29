import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 099 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_099_META = {
  id: 'mig_099',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 98138,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_099_COEF = {
  k0: 16.6000,
  k1: 59.8000,
  k2: 3.3000,
  k3: 46.5000,
  k4: 89.7000,
  k5: 33.2000,
  k6: 76.4000,
  k7: 19.9000,
  k8: 63.1000,
  k9: 6.6000,
  k10: 49.8000,
  k11: 93.0000,
  k12: 36.5000,
  k13: 79.7000,
  k14: 23.2000,
  k15: 66.4000,
  k16: 9.9000,
  k17: 53.1000,
  k18: 96.3000,
  k19: 39.8000,
  k20: 83.0000,
  k21: 26.5000,
  k22: 69.7000,
  k23: 13.2000,
  k24: 56.4000,
  k25: 99.6000,
  k26: 43.1000,
  k27: 86.3000,
  k28: 29.8000,
  k29: 73.0000,
  k30: 16.5000,
  k31: 59.7000,
  k32: 3.2000,
  k33: 46.4000,
  k34: 89.6000,
  k35: 33.1000,
  k36: 76.3000,
  k37: 19.8000,
  k38: 63.0000,
  k39: 6.5000,
  k40: 49.7000,
  k41: 92.9000,
  k42: 36.4000,
  k43: 79.6000,
  k44: 23.1000,
  k45: 66.3000,
  k46: 9.8000,
  k47: 53.0000,
  k48: 96.2000,
  k49: 39.7000,
  k50: 82.9000,
  k51: 26.4000,
  k52: 69.6000,
  k53: 13.1000,
  k54: 56.3000,
  k55: 99.5000,
  k56: 43.0000,
  k57: 86.2000,
  k58: 29.7000,
  k59: 72.9000,
  k60: 16.4000,
  k61: 59.6000,
  k62: 3.1000,
  k63: 46.3000,
  k64: 89.5000,
  k65: 33.0000,
  k66: 76.2000,
  k67: 19.7000,
  k68: 62.9000,
  k69: 6.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_099_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_099_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_099_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_099_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_099_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_099_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_099_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_099_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_099_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_099_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_099_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
