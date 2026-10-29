import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 005 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_005_META = {
  id: 'mig_005',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 4984,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_005_COEF = {
  k0: 99.2000,
  k1: 99.1000,
  k2: 99.0000,
  k3: 98.9000,
  k4: 98.8000,
  k5: 98.7000,
  k6: 98.6000,
  k7: 98.5000,
  k8: 98.4000,
  k9: 98.3000,
  k10: 98.2000,
  k11: 98.1000,
  k12: 98.0000,
  k13: 97.9000,
  k14: 97.8000,
  k15: 97.7000,
  k16: 97.6000,
  k17: 97.5000,
  k18: 97.4000,
  k19: 97.3000,
  k20: 97.2000,
  k21: 97.1000,
  k22: 97.0000,
  k23: 96.9000,
  k24: 96.8000,
  k25: 96.7000,
  k26: 96.6000,
  k27: 96.5000,
  k28: 96.4000,
  k29: 96.3000,
  k30: 96.2000,
  k31: 96.1000,
  k32: 96.0000,
  k33: 95.9000,
  k34: 95.8000,
  k35: 95.7000,
  k36: 95.6000,
  k37: 95.5000,
  k38: 95.4000,
  k39: 95.3000,
  k40: 95.2000,
  k41: 95.1000,
  k42: 95.0000,
  k43: 94.9000,
  k44: 94.8000,
  k45: 94.7000,
  k46: 94.6000,
  k47: 94.5000,
  k48: 94.4000,
  k49: 94.3000,
  k50: 94.2000,
  k51: 94.1000,
  k52: 94.0000,
  k53: 93.9000,
  k54: 93.8000,
  k55: 93.7000,
  k56: 93.6000,
  k57: 93.5000,
  k58: 93.4000,
  k59: 93.3000,
  k60: 93.2000,
  k61: 93.1000,
  k62: 93.0000,
  k63: 92.9000,
  k64: 92.8000,
  k65: 92.7000,
  k66: 92.6000,
  k67: 92.5000,
  k68: 92.4000,
  k69: 92.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_005_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_005_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_005_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_005_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_005_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_005_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_005_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_005_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_005_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_005_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_005_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
