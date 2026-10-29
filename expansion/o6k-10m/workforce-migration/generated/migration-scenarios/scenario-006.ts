import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 006 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_006_META = {
  id: 'mig_006',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 5975,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_006_COEF = {
  k0: 96.2000,
  k1: 95.5000,
  k2: 94.8000,
  k3: 94.1000,
  k4: 93.4000,
  k5: 92.7000,
  k6: 92.0000,
  k7: 91.3000,
  k8: 90.6000,
  k9: 89.9000,
  k10: 89.2000,
  k11: 88.5000,
  k12: 87.8000,
  k13: 87.1000,
  k14: 86.4000,
  k15: 85.7000,
  k16: 85.0000,
  k17: 84.3000,
  k18: 83.6000,
  k19: 82.9000,
  k20: 82.2000,
  k21: 81.5000,
  k22: 80.8000,
  k23: 80.1000,
  k24: 79.4000,
  k25: 78.7000,
  k26: 78.0000,
  k27: 77.3000,
  k28: 76.6000,
  k29: 75.9000,
  k30: 75.2000,
  k31: 74.5000,
  k32: 73.8000,
  k33: 73.1000,
  k34: 72.4000,
  k35: 71.7000,
  k36: 71.0000,
  k37: 70.3000,
  k38: 69.6000,
  k39: 68.9000,
  k40: 68.2000,
  k41: 67.5000,
  k42: 66.8000,
  k43: 66.1000,
  k44: 65.4000,
  k45: 64.7000,
  k46: 64.0000,
  k47: 63.3000,
  k48: 62.6000,
  k49: 61.9000,
  k50: 61.2000,
  k51: 60.5000,
  k52: 59.8000,
  k53: 59.1000,
  k54: 58.4000,
  k55: 57.7000,
  k56: 57.0000,
  k57: 56.3000,
  k58: 55.6000,
  k59: 54.9000,
  k60: 54.2000,
  k61: 53.5000,
  k62: 52.8000,
  k63: 52.1000,
  k64: 51.4000,
  k65: 50.7000,
  k66: 50.0000,
  k67: 49.3000,
  k68: 48.6000,
  k69: 47.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_006_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_006_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_006_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_006_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_006_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_006_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_006_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_006_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_006_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_006_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_006_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
