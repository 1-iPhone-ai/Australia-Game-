import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 076 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_076_META = {
  id: 'mig_076',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 75345,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_076_COEF = {
  k0: 85.6000,
  k1: 42.9000,
  k2: 0.2000,
  k3: 57.2000,
  k4: 14.5000,
  k5: 71.5000,
  k6: 28.8000,
  k7: 85.8000,
  k8: 43.1000,
  k9: 0.4000,
  k10: 57.4000,
  k11: 14.7000,
  k12: 71.7000,
  k13: 29.0000,
  k14: 86.0000,
  k15: 43.3000,
  k16: 0.6000,
  k17: 57.6000,
  k18: 14.9000,
  k19: 71.9000,
  k20: 29.2000,
  k21: 86.2000,
  k22: 43.5000,
  k23: 0.8000,
  k24: 57.8000,
  k25: 15.1000,
  k26: 72.1000,
  k27: 29.4000,
  k28: 86.4000,
  k29: 43.7000,
  k30: 1.0000,
  k31: 58.0000,
  k32: 15.3000,
  k33: 72.3000,
  k34: 29.6000,
  k35: 86.6000,
  k36: 43.9000,
  k37: 1.2000,
  k38: 58.2000,
  k39: 15.5000,
  k40: 72.5000,
  k41: 29.8000,
  k42: 86.8000,
  k43: 44.1000,
  k44: 1.4000,
  k45: 58.4000,
  k46: 15.7000,
  k47: 72.7000,
  k48: 30.0000,
  k49: 87.0000,
  k50: 44.3000,
  k51: 1.6000,
  k52: 58.6000,
  k53: 15.9000,
  k54: 72.9000,
  k55: 30.2000,
  k56: 87.2000,
  k57: 44.5000,
  k58: 1.8000,
  k59: 58.8000,
  k60: 16.1000,
  k61: 73.1000,
  k62: 30.4000,
  k63: 87.4000,
  k64: 44.7000,
  k65: 2.0000,
  k66: 59.0000,
  k67: 16.3000,
  k68: 73.3000,
  k69: 30.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_076_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_076_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_076_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_076_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_076_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_076_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_076_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_076_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_076_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_076_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_076_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
