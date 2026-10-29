import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 116 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_116_META = {
  id: 'mig_116',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 114985,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_116_COEF = {
  k0: 65.3000,
  k1: 98.3000,
  k2: 31.6000,
  k3: 64.6000,
  k4: 97.6000,
  k5: 30.9000,
  k6: 63.9000,
  k7: 96.9000,
  k8: 30.2000,
  k9: 63.2000,
  k10: 96.2000,
  k11: 29.5000,
  k12: 62.5000,
  k13: 95.5000,
  k14: 28.8000,
  k15: 61.8000,
  k16: 94.8000,
  k17: 28.1000,
  k18: 61.1000,
  k19: 94.1000,
  k20: 27.4000,
  k21: 60.4000,
  k22: 93.4000,
  k23: 26.7000,
  k24: 59.7000,
  k25: 92.7000,
  k26: 26.0000,
  k27: 59.0000,
  k28: 92.0000,
  k29: 25.3000,
  k30: 58.3000,
  k31: 91.3000,
  k32: 24.6000,
  k33: 57.6000,
  k34: 90.6000,
  k35: 23.9000,
  k36: 56.9000,
  k37: 89.9000,
  k38: 23.2000,
  k39: 56.2000,
  k40: 89.2000,
  k41: 22.5000,
  k42: 55.5000,
  k43: 88.5000,
  k44: 21.8000,
  k45: 54.8000,
  k46: 87.8000,
  k47: 21.1000,
  k48: 54.1000,
  k49: 87.1000,
  k50: 20.4000,
  k51: 53.4000,
  k52: 86.4000,
  k53: 19.7000,
  k54: 52.7000,
  k55: 85.7000,
  k56: 19.0000,
  k57: 52.0000,
  k58: 85.0000,
  k59: 18.3000,
  k60: 51.3000,
  k61: 84.3000,
  k62: 17.6000,
  k63: 50.6000,
  k64: 83.6000,
  k65: 16.9000,
  k66: 49.9000,
  k67: 82.9000,
  k68: 16.2000,
  k69: 49.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_116_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_116_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_116_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_116_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_116_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_116_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_116_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_116_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_116_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_116_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_116_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
