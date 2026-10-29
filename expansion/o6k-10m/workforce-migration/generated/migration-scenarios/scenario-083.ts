import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 083 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_083_META = {
  id: 'mig_083',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 82282,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_083_COEF = {
  k0: 64.6000,
  k1: 17.7000,
  k2: 70.5000,
  k3: 23.6000,
  k4: 76.4000,
  k5: 29.5000,
  k6: 82.3000,
  k7: 35.4000,
  k8: 88.2000,
  k9: 41.3000,
  k10: 94.1000,
  k11: 47.2000,
  k12: 0.3000,
  k13: 53.1000,
  k14: 6.2000,
  k15: 59.0000,
  k16: 12.1000,
  k17: 64.9000,
  k18: 18.0000,
  k19: 70.8000,
  k20: 23.9000,
  k21: 76.7000,
  k22: 29.8000,
  k23: 82.6000,
  k24: 35.7000,
  k25: 88.5000,
  k26: 41.6000,
  k27: 94.4000,
  k28: 47.5000,
  k29: 0.6000,
  k30: 53.4000,
  k31: 6.5000,
  k32: 59.3000,
  k33: 12.4000,
  k34: 65.2000,
  k35: 18.3000,
  k36: 71.1000,
  k37: 24.2000,
  k38: 77.0000,
  k39: 30.1000,
  k40: 82.9000,
  k41: 36.0000,
  k42: 88.8000,
  k43: 41.9000,
  k44: 94.7000,
  k45: 47.8000,
  k46: 0.9000,
  k47: 53.7000,
  k48: 6.8000,
  k49: 59.6000,
  k50: 12.7000,
  k51: 65.5000,
  k52: 18.6000,
  k53: 71.4000,
  k54: 24.5000,
  k55: 77.3000,
  k56: 30.4000,
  k57: 83.2000,
  k58: 36.3000,
  k59: 89.1000,
  k60: 42.2000,
  k61: 95.0000,
  k62: 48.1000,
  k63: 1.2000,
  k64: 54.0000,
  k65: 7.1000,
  k66: 59.9000,
  k67: 13.0000,
  k68: 65.8000,
  k69: 18.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_083_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_083_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_083_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_083_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_083_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_083_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_083_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_083_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_083_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_083_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_083_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
