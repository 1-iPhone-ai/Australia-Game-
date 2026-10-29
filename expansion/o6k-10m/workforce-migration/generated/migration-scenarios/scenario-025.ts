import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 025 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_025_META = {
  id: 'mig_025',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 24804,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_025_COEF = {
  k0: 39.2000,
  k1: 27.1000,
  k2: 15.0000,
  k3: 2.9000,
  k4: 90.5000,
  k5: 78.4000,
  k6: 66.3000,
  k7: 54.2000,
  k8: 42.1000,
  k9: 30.0000,
  k10: 17.9000,
  k11: 5.8000,
  k12: 93.4000,
  k13: 81.3000,
  k14: 69.2000,
  k15: 57.1000,
  k16: 45.0000,
  k17: 32.9000,
  k18: 20.8000,
  k19: 8.7000,
  k20: 96.3000,
  k21: 84.2000,
  k22: 72.1000,
  k23: 60.0000,
  k24: 47.9000,
  k25: 35.8000,
  k26: 23.7000,
  k27: 11.6000,
  k28: 99.2000,
  k29: 87.1000,
  k30: 75.0000,
  k31: 62.9000,
  k32: 50.8000,
  k33: 38.7000,
  k34: 26.6000,
  k35: 14.5000,
  k36: 2.4000,
  k37: 90.0000,
  k38: 77.9000,
  k39: 65.8000,
  k40: 53.7000,
  k41: 41.6000,
  k42: 29.5000,
  k43: 17.4000,
  k44: 5.3000,
  k45: 92.9000,
  k46: 80.8000,
  k47: 68.7000,
  k48: 56.6000,
  k49: 44.5000,
  k50: 32.4000,
  k51: 20.3000,
  k52: 8.2000,
  k53: 95.8000,
  k54: 83.7000,
  k55: 71.6000,
  k56: 59.5000,
  k57: 47.4000,
  k58: 35.3000,
  k59: 23.2000,
  k60: 11.1000,
  k61: 98.7000,
  k62: 86.6000,
  k63: 74.5000,
  k64: 62.4000,
  k65: 50.3000,
  k66: 38.2000,
  k67: 26.1000,
  k68: 14.0000,
  k69: 1.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_025_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_025_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_025_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_025_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_025_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_025_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_025_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_025_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_025_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_025_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_025_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
