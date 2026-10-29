import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 050 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_050_META = {
  id: 'mig_050',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 49579,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_050_COEF = {
  k0: 63.9000,
  k1: 36.8000,
  k2: 9.7000,
  k3: 82.3000,
  k4: 55.2000,
  k5: 28.1000,
  k6: 1.0000,
  k7: 73.6000,
  k8: 46.5000,
  k9: 19.4000,
  k10: 92.0000,
  k11: 64.9000,
  k12: 37.8000,
  k13: 10.7000,
  k14: 83.3000,
  k15: 56.2000,
  k16: 29.1000,
  k17: 2.0000,
  k18: 74.6000,
  k19: 47.5000,
  k20: 20.4000,
  k21: 93.0000,
  k22: 65.9000,
  k23: 38.8000,
  k24: 11.7000,
  k25: 84.3000,
  k26: 57.2000,
  k27: 30.1000,
  k28: 3.0000,
  k29: 75.6000,
  k30: 48.5000,
  k31: 21.4000,
  k32: 94.0000,
  k33: 66.9000,
  k34: 39.8000,
  k35: 12.7000,
  k36: 85.3000,
  k37: 58.2000,
  k38: 31.1000,
  k39: 4.0000,
  k40: 76.6000,
  k41: 49.5000,
  k42: 22.4000,
  k43: 95.0000,
  k44: 67.9000,
  k45: 40.8000,
  k46: 13.7000,
  k47: 86.3000,
  k48: 59.2000,
  k49: 32.1000,
  k50: 5.0000,
  k51: 77.6000,
  k52: 50.5000,
  k53: 23.4000,
  k54: 96.0000,
  k55: 68.9000,
  k56: 41.8000,
  k57: 14.7000,
  k58: 87.3000,
  k59: 60.2000,
  k60: 33.1000,
  k61: 6.0000,
  k62: 78.6000,
  k63: 51.5000,
  k64: 24.4000,
  k65: 97.0000,
  k66: 69.9000,
  k67: 42.8000,
  k68: 15.7000,
  k69: 88.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_050_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_050_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_050_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_050_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_050_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_050_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_050_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_050_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_050_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_050_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_050_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
