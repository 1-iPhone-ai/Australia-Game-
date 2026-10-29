import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 145 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_145_META = {
  id: 'mig_145',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 143724,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_145_COEF = {
  k0: 78.0000,
  k1: 93.6000,
  k2: 9.5000,
  k3: 25.1000,
  k4: 40.7000,
  k5: 56.3000,
  k6: 71.9000,
  k7: 87.5000,
  k8: 3.4000,
  k9: 19.0000,
  k10: 34.6000,
  k11: 50.2000,
  k12: 65.8000,
  k13: 81.4000,
  k14: 97.0000,
  k15: 12.9000,
  k16: 28.5000,
  k17: 44.1000,
  k18: 59.7000,
  k19: 75.3000,
  k20: 90.9000,
  k21: 6.8000,
  k22: 22.4000,
  k23: 38.0000,
  k24: 53.6000,
  k25: 69.2000,
  k26: 84.8000,
  k27: 0.7000,
  k28: 16.3000,
  k29: 31.9000,
  k30: 47.5000,
  k31: 63.1000,
  k32: 78.7000,
  k33: 94.3000,
  k34: 10.2000,
  k35: 25.8000,
  k36: 41.4000,
  k37: 57.0000,
  k38: 72.6000,
  k39: 88.2000,
  k40: 4.1000,
  k41: 19.7000,
  k42: 35.3000,
  k43: 50.9000,
  k44: 66.5000,
  k45: 82.1000,
  k46: 97.7000,
  k47: 13.6000,
  k48: 29.2000,
  k49: 44.8000,
  k50: 60.4000,
  k51: 76.0000,
  k52: 91.6000,
  k53: 7.5000,
  k54: 23.1000,
  k55: 38.7000,
  k56: 54.3000,
  k57: 69.9000,
  k58: 85.5000,
  k59: 1.4000,
  k60: 17.0000,
  k61: 32.6000,
  k62: 48.2000,
  k63: 63.8000,
  k64: 79.4000,
  k65: 95.0000,
  k66: 10.9000,
  k67: 26.5000,
  k68: 42.1000,
  k69: 57.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_145_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_145_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_145_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_145_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_145_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_145_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_145_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_145_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_145_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_145_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_145_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
