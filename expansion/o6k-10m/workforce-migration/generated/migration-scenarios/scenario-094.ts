import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 094 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_094_META = {
  id: 'mig_094',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 93183,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_094_COEF = {
  k0: 31.6000,
  k1: 77.8000,
  k2: 24.3000,
  k3: 70.5000,
  k4: 17.0000,
  k5: 63.2000,
  k6: 9.7000,
  k7: 55.9000,
  k8: 2.4000,
  k9: 48.6000,
  k10: 94.8000,
  k11: 41.3000,
  k12: 87.5000,
  k13: 34.0000,
  k14: 80.2000,
  k15: 26.7000,
  k16: 72.9000,
  k17: 19.4000,
  k18: 65.6000,
  k19: 12.1000,
  k20: 58.3000,
  k21: 4.8000,
  k22: 51.0000,
  k23: 97.2000,
  k24: 43.7000,
  k25: 89.9000,
  k26: 36.4000,
  k27: 82.6000,
  k28: 29.1000,
  k29: 75.3000,
  k30: 21.8000,
  k31: 68.0000,
  k32: 14.5000,
  k33: 60.7000,
  k34: 7.2000,
  k35: 53.4000,
  k36: 99.6000,
  k37: 46.1000,
  k38: 92.3000,
  k39: 38.8000,
  k40: 85.0000,
  k41: 31.5000,
  k42: 77.7000,
  k43: 24.2000,
  k44: 70.4000,
  k45: 16.9000,
  k46: 63.1000,
  k47: 9.6000,
  k48: 55.8000,
  k49: 2.3000,
  k50: 48.5000,
  k51: 94.7000,
  k52: 41.2000,
  k53: 87.4000,
  k54: 33.9000,
  k55: 80.1000,
  k56: 26.6000,
  k57: 72.8000,
  k58: 19.3000,
  k59: 65.5000,
  k60: 12.0000,
  k61: 58.2000,
  k62: 4.7000,
  k63: 50.9000,
  k64: 97.1000,
  k65: 43.6000,
  k66: 89.8000,
  k67: 36.3000,
  k68: 82.5000,
  k69: 29.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_094_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_094_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_094_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_094_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_094_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_094_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_094_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_094_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_094_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_094_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_094_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
