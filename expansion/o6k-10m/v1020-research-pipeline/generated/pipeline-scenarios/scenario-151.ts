import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 151 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_151_META = {
  id: 'pipeline_151',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'energy' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 132468,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_151_COEF = {
  k0: 69.1000,
  k1: 36.5000,
  k2: 3.9000,
  k3: 70.4000,
  k4: 37.8000,
  k5: 5.2000,
  k6: 71.7000,
  k7: 39.1000,
  k8: 6.5000,
  k9: 73.0000,
  k10: 40.4000,
  k11: 7.8000,
  k12: 74.3000,
  k13: 41.7000,
  k14: 9.1000,
  k15: 75.6000,
  k16: 43.0000,
  k17: 10.4000,
  k18: 76.9000,
  k19: 44.3000,
  k20: 11.7000,
  k21: 78.2000,
  k22: 45.6000,
  k23: 13.0000,
  k24: 79.5000,
  k25: 46.9000,
  k26: 14.3000,
  k27: 80.8000,
  k28: 48.2000,
  k29: 15.6000,
  k30: 82.1000,
  k31: 49.5000,
  k32: 16.9000,
  k33: 83.4000,
  k34: 50.8000,
  k35: 18.2000,
  k36: 84.7000,
  k37: 52.1000,
  k38: 19.5000,
  k39: 86.0000,
  k40: 53.4000,
  k41: 20.8000,
  k42: 87.3000,
  k43: 54.7000,
  k44: 22.1000,
  k45: 88.6000,
  k46: 56.0000,
  k47: 23.4000,
  k48: 89.9000,
  k49: 57.3000,
  k50: 24.7000,
  k51: 91.2000,
  k52: 58.6000,
  k53: 26.0000,
  k54: 92.5000,
  k55: 59.9000,
  k56: 27.3000,
  k57: 93.8000,
  k58: 61.2000,
  k59: 28.6000,
  k60: 95.1000,
  k61: 62.5000,
  k62: 29.9000,
  k63: 96.4000,
  k64: 63.8000,
  k65: 31.2000,
  k66: 97.7000,
  k67: 65.1000,
  k68: 32.5000,
  k69: 99.0000,
  k70: 66.4000,
  k71: 33.8000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_151_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_151_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_151_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_151_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_151_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_151_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_151_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_151_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_151_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_151_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_151_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_151_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
