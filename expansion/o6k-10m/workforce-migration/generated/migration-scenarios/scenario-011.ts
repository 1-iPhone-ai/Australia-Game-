import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 011 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_011_META = {
  id: 'mig_011',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 10930,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_011_COEF = {
  k0: 81.2000,
  k1: 77.5000,
  k2: 73.8000,
  k3: 70.1000,
  k4: 66.4000,
  k5: 62.7000,
  k6: 59.0000,
  k7: 55.3000,
  k8: 51.6000,
  k9: 47.9000,
  k10: 44.2000,
  k11: 40.5000,
  k12: 36.8000,
  k13: 33.1000,
  k14: 29.4000,
  k15: 25.7000,
  k16: 22.0000,
  k17: 18.3000,
  k18: 14.6000,
  k19: 10.9000,
  k20: 7.2000,
  k21: 3.5000,
  k22: 99.5000,
  k23: 95.8000,
  k24: 92.1000,
  k25: 88.4000,
  k26: 84.7000,
  k27: 81.0000,
  k28: 77.3000,
  k29: 73.6000,
  k30: 69.9000,
  k31: 66.2000,
  k32: 62.5000,
  k33: 58.8000,
  k34: 55.1000,
  k35: 51.4000,
  k36: 47.7000,
  k37: 44.0000,
  k38: 40.3000,
  k39: 36.6000,
  k40: 32.9000,
  k41: 29.2000,
  k42: 25.5000,
  k43: 21.8000,
  k44: 18.1000,
  k45: 14.4000,
  k46: 10.7000,
  k47: 7.0000,
  k48: 3.3000,
  k49: 99.3000,
  k50: 95.6000,
  k51: 91.9000,
  k52: 88.2000,
  k53: 84.5000,
  k54: 80.8000,
  k55: 77.1000,
  k56: 73.4000,
  k57: 69.7000,
  k58: 66.0000,
  k59: 62.3000,
  k60: 58.6000,
  k61: 54.9000,
  k62: 51.2000,
  k63: 47.5000,
  k64: 43.8000,
  k65: 40.1000,
  k66: 36.4000,
  k67: 32.7000,
  k68: 29.0000,
  k69: 25.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_011_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_011_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_011_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_011_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_011_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_011_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_011_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_011_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_011_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_011_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_011_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
