import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 055 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_055_META = {
  id: 'mig_055',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 54534,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_055_COEF = {
  k0: 48.9000,
  k1: 18.8000,
  k2: 88.4000,
  k3: 58.3000,
  k4: 28.2000,
  k5: 97.8000,
  k6: 67.7000,
  k7: 37.6000,
  k8: 7.5000,
  k9: 77.1000,
  k10: 47.0000,
  k11: 16.9000,
  k12: 86.5000,
  k13: 56.4000,
  k14: 26.3000,
  k15: 95.9000,
  k16: 65.8000,
  k17: 35.7000,
  k18: 5.6000,
  k19: 75.2000,
  k20: 45.1000,
  k21: 15.0000,
  k22: 84.6000,
  k23: 54.5000,
  k24: 24.4000,
  k25: 94.0000,
  k26: 63.9000,
  k27: 33.8000,
  k28: 3.7000,
  k29: 73.3000,
  k30: 43.2000,
  k31: 13.1000,
  k32: 82.7000,
  k33: 52.6000,
  k34: 22.5000,
  k35: 92.1000,
  k36: 62.0000,
  k37: 31.9000,
  k38: 1.8000,
  k39: 71.4000,
  k40: 41.3000,
  k41: 11.2000,
  k42: 80.8000,
  k43: 50.7000,
  k44: 20.6000,
  k45: 90.2000,
  k46: 60.1000,
  k47: 30.0000,
  k48: 99.6000,
  k49: 69.5000,
  k50: 39.4000,
  k51: 9.3000,
  k52: 78.9000,
  k53: 48.8000,
  k54: 18.7000,
  k55: 88.3000,
  k56: 58.2000,
  k57: 28.1000,
  k58: 97.7000,
  k59: 67.6000,
  k60: 37.5000,
  k61: 7.4000,
  k62: 77.0000,
  k63: 46.9000,
  k64: 16.8000,
  k65: 86.4000,
  k66: 56.3000,
  k67: 26.2000,
  k68: 95.8000,
  k69: 65.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_055_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_055_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_055_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_055_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_055_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_055_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_055_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_055_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_055_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_055_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_055_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
