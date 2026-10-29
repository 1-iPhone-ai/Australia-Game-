import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 081 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_081_META = {
  id: 'mig_081',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 80300,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_081_COEF = {
  k0: 70.6000,
  k1: 24.9000,
  k2: 78.9000,
  k3: 33.2000,
  k4: 87.2000,
  k5: 41.5000,
  k6: 95.5000,
  k7: 49.8000,
  k8: 4.1000,
  k9: 58.1000,
  k10: 12.4000,
  k11: 66.4000,
  k12: 20.7000,
  k13: 74.7000,
  k14: 29.0000,
  k15: 83.0000,
  k16: 37.3000,
  k17: 91.3000,
  k18: 45.6000,
  k19: 99.6000,
  k20: 53.9000,
  k21: 8.2000,
  k22: 62.2000,
  k23: 16.5000,
  k24: 70.5000,
  k25: 24.8000,
  k26: 78.8000,
  k27: 33.1000,
  k28: 87.1000,
  k29: 41.4000,
  k30: 95.4000,
  k31: 49.7000,
  k32: 4.0000,
  k33: 58.0000,
  k34: 12.3000,
  k35: 66.3000,
  k36: 20.6000,
  k37: 74.6000,
  k38: 28.9000,
  k39: 82.9000,
  k40: 37.2000,
  k41: 91.2000,
  k42: 45.5000,
  k43: 99.5000,
  k44: 53.8000,
  k45: 8.1000,
  k46: 62.1000,
  k47: 16.4000,
  k48: 70.4000,
  k49: 24.7000,
  k50: 78.7000,
  k51: 33.0000,
  k52: 87.0000,
  k53: 41.3000,
  k54: 95.3000,
  k55: 49.6000,
  k56: 3.9000,
  k57: 57.9000,
  k58: 12.2000,
  k59: 66.2000,
  k60: 20.5000,
  k61: 74.5000,
  k62: 28.8000,
  k63: 82.8000,
  k64: 37.1000,
  k65: 91.1000,
  k66: 45.4000,
  k67: 99.4000,
  k68: 53.7000,
  k69: 8.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_081_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_081_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_081_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_081_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_081_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_081_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_081_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_081_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_081_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_081_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_081_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
