import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 016 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_016_META = {
  id: 'mig_016',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 15885,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_016_COEF = {
  k0: 66.2000,
  k1: 59.5000,
  k2: 52.8000,
  k3: 46.1000,
  k4: 39.4000,
  k5: 32.7000,
  k6: 26.0000,
  k7: 19.3000,
  k8: 12.6000,
  k9: 5.9000,
  k10: 98.9000,
  k11: 92.2000,
  k12: 85.5000,
  k13: 78.8000,
  k14: 72.1000,
  k15: 65.4000,
  k16: 58.7000,
  k17: 52.0000,
  k18: 45.3000,
  k19: 38.6000,
  k20: 31.9000,
  k21: 25.2000,
  k22: 18.5000,
  k23: 11.8000,
  k24: 5.1000,
  k25: 98.1000,
  k26: 91.4000,
  k27: 84.7000,
  k28: 78.0000,
  k29: 71.3000,
  k30: 64.6000,
  k31: 57.9000,
  k32: 51.2000,
  k33: 44.5000,
  k34: 37.8000,
  k35: 31.1000,
  k36: 24.4000,
  k37: 17.7000,
  k38: 11.0000,
  k39: 4.3000,
  k40: 97.3000,
  k41: 90.6000,
  k42: 83.9000,
  k43: 77.2000,
  k44: 70.5000,
  k45: 63.8000,
  k46: 57.1000,
  k47: 50.4000,
  k48: 43.7000,
  k49: 37.0000,
  k50: 30.3000,
  k51: 23.6000,
  k52: 16.9000,
  k53: 10.2000,
  k54: 3.5000,
  k55: 96.5000,
  k56: 89.8000,
  k57: 83.1000,
  k58: 76.4000,
  k59: 69.7000,
  k60: 63.0000,
  k61: 56.3000,
  k62: 49.6000,
  k63: 42.9000,
  k64: 36.2000,
  k65: 29.5000,
  k66: 22.8000,
  k67: 16.1000,
  k68: 9.4000,
  k69: 2.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_016_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_016_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_016_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_016_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_016_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_016_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_016_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_016_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_016_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_016_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_016_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
