import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 160 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_160_META = {
  id: 'mig_160',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 158589,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_160_COEF = {
  k0: 33.0000,
  k1: 39.6000,
  k2: 46.2000,
  k3: 52.8000,
  k4: 59.4000,
  k5: 66.0000,
  k6: 72.6000,
  k7: 79.2000,
  k8: 85.8000,
  k9: 92.4000,
  k10: 99.0000,
  k11: 5.9000,
  k12: 12.5000,
  k13: 19.1000,
  k14: 25.7000,
  k15: 32.3000,
  k16: 38.9000,
  k17: 45.5000,
  k18: 52.1000,
  k19: 58.7000,
  k20: 65.3000,
  k21: 71.9000,
  k22: 78.5000,
  k23: 85.1000,
  k24: 91.7000,
  k25: 98.3000,
  k26: 5.2000,
  k27: 11.8000,
  k28: 18.4000,
  k29: 25.0000,
  k30: 31.6000,
  k31: 38.2000,
  k32: 44.8000,
  k33: 51.4000,
  k34: 58.0000,
  k35: 64.6000,
  k36: 71.2000,
  k37: 77.8000,
  k38: 84.4000,
  k39: 91.0000,
  k40: 97.6000,
  k41: 4.5000,
  k42: 11.1000,
  k43: 17.7000,
  k44: 24.3000,
  k45: 30.9000,
  k46: 37.5000,
  k47: 44.1000,
  k48: 50.7000,
  k49: 57.3000,
  k50: 63.9000,
  k51: 70.5000,
  k52: 77.1000,
  k53: 83.7000,
  k54: 90.3000,
  k55: 96.9000,
  k56: 3.8000,
  k57: 10.4000,
  k58: 17.0000,
  k59: 23.6000,
  k60: 30.2000,
  k61: 36.8000,
  k62: 43.4000,
  k63: 50.0000,
  k64: 56.6000,
  k65: 63.2000,
  k66: 69.8000,
  k67: 76.4000,
  k68: 83.0000,
  k69: 89.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_160_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_160_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_160_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_160_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_160_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_160_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_160_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_160_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_160_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_160_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_160_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
