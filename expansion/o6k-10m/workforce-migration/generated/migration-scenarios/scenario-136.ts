import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 136 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_136_META = {
  id: 'mig_136',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 134805,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_136_COEF = {
  k0: 5.3000,
  k1: 26.3000,
  k2: 47.3000,
  k3: 68.3000,
  k4: 89.3000,
  k5: 10.6000,
  k6: 31.6000,
  k7: 52.6000,
  k8: 73.6000,
  k9: 94.6000,
  k10: 15.9000,
  k11: 36.9000,
  k12: 57.9000,
  k13: 78.9000,
  k14: 0.2000,
  k15: 21.2000,
  k16: 42.2000,
  k17: 63.2000,
  k18: 84.2000,
  k19: 5.5000,
  k20: 26.5000,
  k21: 47.5000,
  k22: 68.5000,
  k23: 89.5000,
  k24: 10.8000,
  k25: 31.8000,
  k26: 52.8000,
  k27: 73.8000,
  k28: 94.8000,
  k29: 16.1000,
  k30: 37.1000,
  k31: 58.1000,
  k32: 79.1000,
  k33: 0.4000,
  k34: 21.4000,
  k35: 42.4000,
  k36: 63.4000,
  k37: 84.4000,
  k38: 5.7000,
  k39: 26.7000,
  k40: 47.7000,
  k41: 68.7000,
  k42: 89.7000,
  k43: 11.0000,
  k44: 32.0000,
  k45: 53.0000,
  k46: 74.0000,
  k47: 95.0000,
  k48: 16.3000,
  k49: 37.3000,
  k50: 58.3000,
  k51: 79.3000,
  k52: 0.6000,
  k53: 21.6000,
  k54: 42.6000,
  k55: 63.6000,
  k56: 84.6000,
  k57: 5.9000,
  k58: 26.9000,
  k59: 47.9000,
  k60: 68.9000,
  k61: 89.9000,
  k62: 11.2000,
  k63: 32.2000,
  k64: 53.2000,
  k65: 74.2000,
  k66: 95.2000,
  k67: 16.5000,
  k68: 37.5000,
  k69: 58.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_136_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_136_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_136_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_136_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_136_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_136_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_136_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_136_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_136_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_136_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_136_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
