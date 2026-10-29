import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 088 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_088_META = {
  id: 'mig_088',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 87237,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_088_COEF = {
  k0: 49.6000,
  k1: 99.4000,
  k2: 49.5000,
  k3: 99.3000,
  k4: 49.4000,
  k5: 99.2000,
  k6: 49.3000,
  k7: 99.1000,
  k8: 49.2000,
  k9: 99.0000,
  k10: 49.1000,
  k11: 98.9000,
  k12: 49.0000,
  k13: 98.8000,
  k14: 48.9000,
  k15: 98.7000,
  k16: 48.8000,
  k17: 98.6000,
  k18: 48.7000,
  k19: 98.5000,
  k20: 48.6000,
  k21: 98.4000,
  k22: 48.5000,
  k23: 98.3000,
  k24: 48.4000,
  k25: 98.2000,
  k26: 48.3000,
  k27: 98.1000,
  k28: 48.2000,
  k29: 98.0000,
  k30: 48.1000,
  k31: 97.9000,
  k32: 48.0000,
  k33: 97.8000,
  k34: 47.9000,
  k35: 97.7000,
  k36: 47.8000,
  k37: 97.6000,
  k38: 47.7000,
  k39: 97.5000,
  k40: 47.6000,
  k41: 97.4000,
  k42: 47.5000,
  k43: 97.3000,
  k44: 47.4000,
  k45: 97.2000,
  k46: 47.3000,
  k47: 97.1000,
  k48: 47.2000,
  k49: 97.0000,
  k50: 47.1000,
  k51: 96.9000,
  k52: 47.0000,
  k53: 96.8000,
  k54: 46.9000,
  k55: 96.7000,
  k56: 46.8000,
  k57: 96.6000,
  k58: 46.7000,
  k59: 96.5000,
  k60: 46.6000,
  k61: 96.4000,
  k62: 46.5000,
  k63: 96.3000,
  k64: 46.4000,
  k65: 96.2000,
  k66: 46.3000,
  k67: 96.1000,
  k68: 46.2000,
  k69: 96.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_088_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_088_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_088_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_088_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_088_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_088_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_088_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_088_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_088_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_088_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_088_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
