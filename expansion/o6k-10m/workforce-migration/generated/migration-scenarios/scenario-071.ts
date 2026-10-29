import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 071 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_071_META = {
  id: 'mig_071',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 70390,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_071_COEF = {
  k0: 0.9000,
  k1: 60.9000,
  k2: 21.2000,
  k3: 81.2000,
  k4: 41.5000,
  k5: 1.8000,
  k6: 61.8000,
  k7: 22.1000,
  k8: 82.1000,
  k9: 42.4000,
  k10: 2.7000,
  k11: 62.7000,
  k12: 23.0000,
  k13: 83.0000,
  k14: 43.3000,
  k15: 3.6000,
  k16: 63.6000,
  k17: 23.9000,
  k18: 83.9000,
  k19: 44.2000,
  k20: 4.5000,
  k21: 64.5000,
  k22: 24.8000,
  k23: 84.8000,
  k24: 45.1000,
  k25: 5.4000,
  k26: 65.4000,
  k27: 25.7000,
  k28: 85.7000,
  k29: 46.0000,
  k30: 6.3000,
  k31: 66.3000,
  k32: 26.6000,
  k33: 86.6000,
  k34: 46.9000,
  k35: 7.2000,
  k36: 67.2000,
  k37: 27.5000,
  k38: 87.5000,
  k39: 47.8000,
  k40: 8.1000,
  k41: 68.1000,
  k42: 28.4000,
  k43: 88.4000,
  k44: 48.7000,
  k45: 9.0000,
  k46: 69.0000,
  k47: 29.3000,
  k48: 89.3000,
  k49: 49.6000,
  k50: 9.9000,
  k51: 69.9000,
  k52: 30.2000,
  k53: 90.2000,
  k54: 50.5000,
  k55: 10.8000,
  k56: 70.8000,
  k57: 31.1000,
  k58: 91.1000,
  k59: 51.4000,
  k60: 11.7000,
  k61: 71.7000,
  k62: 32.0000,
  k63: 92.0000,
  k64: 52.3000,
  k65: 12.6000,
  k66: 72.6000,
  k67: 32.9000,
  k68: 92.9000,
  k69: 53.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_071_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_071_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_071_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_071_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_071_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_071_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_071_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_071_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_071_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_071_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_071_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
