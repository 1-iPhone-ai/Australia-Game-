import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 082 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_082_META = {
  id: 'mig_082',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 81291,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_082_COEF = {
  k0: 67.6000,
  k1: 21.3000,
  k2: 74.7000,
  k3: 28.4000,
  k4: 81.8000,
  k5: 35.5000,
  k6: 88.9000,
  k7: 42.6000,
  k8: 96.0000,
  k9: 49.7000,
  k10: 3.4000,
  k11: 56.8000,
  k12: 10.5000,
  k13: 63.9000,
  k14: 17.6000,
  k15: 71.0000,
  k16: 24.7000,
  k17: 78.1000,
  k18: 31.8000,
  k19: 85.2000,
  k20: 38.9000,
  k21: 92.3000,
  k22: 46.0000,
  k23: 99.4000,
  k24: 53.1000,
  k25: 6.8000,
  k26: 60.2000,
  k27: 13.9000,
  k28: 67.3000,
  k29: 21.0000,
  k30: 74.4000,
  k31: 28.1000,
  k32: 81.5000,
  k33: 35.2000,
  k34: 88.6000,
  k35: 42.3000,
  k36: 95.7000,
  k37: 49.4000,
  k38: 3.1000,
  k39: 56.5000,
  k40: 10.2000,
  k41: 63.6000,
  k42: 17.3000,
  k43: 70.7000,
  k44: 24.4000,
  k45: 77.8000,
  k46: 31.5000,
  k47: 84.9000,
  k48: 38.6000,
  k49: 92.0000,
  k50: 45.7000,
  k51: 99.1000,
  k52: 52.8000,
  k53: 6.5000,
  k54: 59.9000,
  k55: 13.6000,
  k56: 67.0000,
  k57: 20.7000,
  k58: 74.1000,
  k59: 27.8000,
  k60: 81.2000,
  k61: 34.9000,
  k62: 88.3000,
  k63: 42.0000,
  k64: 95.4000,
  k65: 49.1000,
  k66: 2.8000,
  k67: 56.2000,
  k68: 9.9000,
  k69: 63.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_082_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_082_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_082_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_082_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_082_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_082_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_082_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_082_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_082_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_082_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_082_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
