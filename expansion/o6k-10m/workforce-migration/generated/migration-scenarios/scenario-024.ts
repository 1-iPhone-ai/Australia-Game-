import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 024 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_024_META = {
  id: 'mig_024',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 23813,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_024_COEF = {
  k0: 42.2000,
  k1: 30.7000,
  k2: 19.2000,
  k3: 7.7000,
  k4: 95.9000,
  k5: 84.4000,
  k6: 72.9000,
  k7: 61.4000,
  k8: 49.9000,
  k9: 38.4000,
  k10: 26.9000,
  k11: 15.4000,
  k12: 3.9000,
  k13: 92.1000,
  k14: 80.6000,
  k15: 69.1000,
  k16: 57.6000,
  k17: 46.1000,
  k18: 34.6000,
  k19: 23.1000,
  k20: 11.6000,
  k21: 0.1000,
  k22: 88.3000,
  k23: 76.8000,
  k24: 65.3000,
  k25: 53.8000,
  k26: 42.3000,
  k27: 30.8000,
  k28: 19.3000,
  k29: 7.8000,
  k30: 96.0000,
  k31: 84.5000,
  k32: 73.0000,
  k33: 61.5000,
  k34: 50.0000,
  k35: 38.5000,
  k36: 27.0000,
  k37: 15.5000,
  k38: 4.0000,
  k39: 92.2000,
  k40: 80.7000,
  k41: 69.2000,
  k42: 57.7000,
  k43: 46.2000,
  k44: 34.7000,
  k45: 23.2000,
  k46: 11.7000,
  k47: 0.2000,
  k48: 88.4000,
  k49: 76.9000,
  k50: 65.4000,
  k51: 53.9000,
  k52: 42.4000,
  k53: 30.9000,
  k54: 19.4000,
  k55: 7.9000,
  k56: 96.1000,
  k57: 84.6000,
  k58: 73.1000,
  k59: 61.6000,
  k60: 50.1000,
  k61: 38.6000,
  k62: 27.1000,
  k63: 15.6000,
  k64: 4.1000,
  k65: 92.3000,
  k66: 80.8000,
  k67: 69.3000,
  k68: 57.8000,
  k69: 46.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_024_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_024_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_024_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_024_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_024_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_024_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_024_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_024_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_024_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_024_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_024_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
