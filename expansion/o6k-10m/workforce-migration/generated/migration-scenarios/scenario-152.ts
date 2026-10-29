import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 152 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_152_META = {
  id: 'mig_152',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 150661,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_152_COEF = {
  k0: 57.0000,
  k1: 68.4000,
  k2: 79.8000,
  k3: 91.2000,
  k4: 2.9000,
  k5: 14.3000,
  k6: 25.7000,
  k7: 37.1000,
  k8: 48.5000,
  k9: 59.9000,
  k10: 71.3000,
  k11: 82.7000,
  k12: 94.1000,
  k13: 5.8000,
  k14: 17.2000,
  k15: 28.6000,
  k16: 40.0000,
  k17: 51.4000,
  k18: 62.8000,
  k19: 74.2000,
  k20: 85.6000,
  k21: 97.0000,
  k22: 8.7000,
  k23: 20.1000,
  k24: 31.5000,
  k25: 42.9000,
  k26: 54.3000,
  k27: 65.7000,
  k28: 77.1000,
  k29: 88.5000,
  k30: 0.2000,
  k31: 11.6000,
  k32: 23.0000,
  k33: 34.4000,
  k34: 45.8000,
  k35: 57.2000,
  k36: 68.6000,
  k37: 80.0000,
  k38: 91.4000,
  k39: 3.1000,
  k40: 14.5000,
  k41: 25.9000,
  k42: 37.3000,
  k43: 48.7000,
  k44: 60.1000,
  k45: 71.5000,
  k46: 82.9000,
  k47: 94.3000,
  k48: 6.0000,
  k49: 17.4000,
  k50: 28.8000,
  k51: 40.2000,
  k52: 51.6000,
  k53: 63.0000,
  k54: 74.4000,
  k55: 85.8000,
  k56: 97.2000,
  k57: 8.9000,
  k58: 20.3000,
  k59: 31.7000,
  k60: 43.1000,
  k61: 54.5000,
  k62: 65.9000,
  k63: 77.3000,
  k64: 88.7000,
  k65: 0.4000,
  k66: 11.8000,
  k67: 23.2000,
  k68: 34.6000,
  k69: 46.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_152_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_152_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_152_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_152_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_152_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_152_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_152_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_152_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_152_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_152_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_152_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
