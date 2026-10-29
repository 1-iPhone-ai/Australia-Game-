import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 038 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_038_META = {
  id: 'mig_038',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 37687,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_038_COEF = {
  k0: 0.2000,
  k1: 80.0000,
  k2: 60.1000,
  k3: 40.2000,
  k4: 20.3000,
  k5: 0.4000,
  k6: 80.2000,
  k7: 60.3000,
  k8: 40.4000,
  k9: 20.5000,
  k10: 0.6000,
  k11: 80.4000,
  k12: 60.5000,
  k13: 40.6000,
  k14: 20.7000,
  k15: 0.8000,
  k16: 80.6000,
  k17: 60.7000,
  k18: 40.8000,
  k19: 20.9000,
  k20: 1.0000,
  k21: 80.8000,
  k22: 60.9000,
  k23: 41.0000,
  k24: 21.1000,
  k25: 1.2000,
  k26: 81.0000,
  k27: 61.1000,
  k28: 41.2000,
  k29: 21.3000,
  k30: 1.4000,
  k31: 81.2000,
  k32: 61.3000,
  k33: 41.4000,
  k34: 21.5000,
  k35: 1.6000,
  k36: 81.4000,
  k37: 61.5000,
  k38: 41.6000,
  k39: 21.7000,
  k40: 1.8000,
  k41: 81.6000,
  k42: 61.7000,
  k43: 41.8000,
  k44: 21.9000,
  k45: 2.0000,
  k46: 81.8000,
  k47: 61.9000,
  k48: 42.0000,
  k49: 22.1000,
  k50: 2.2000,
  k51: 82.0000,
  k52: 62.1000,
  k53: 42.2000,
  k54: 22.3000,
  k55: 2.4000,
  k56: 82.2000,
  k57: 62.3000,
  k58: 42.4000,
  k59: 22.5000,
  k60: 2.6000,
  k61: 82.4000,
  k62: 62.5000,
  k63: 42.6000,
  k64: 22.7000,
  k65: 2.8000,
  k66: 82.6000,
  k67: 62.7000,
  k68: 42.8000,
  k69: 22.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_038_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_038_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_038_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_038_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_038_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_038_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_038_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_038_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_038_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_038_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_038_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
