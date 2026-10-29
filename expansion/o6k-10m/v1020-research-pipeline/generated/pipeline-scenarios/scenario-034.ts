import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 034 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_034_META = {
  id: 'pipeline_034',
  regionId: 'QLD' as V1020RpipeRegionId,
  primarySystem: 'trade' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 29859,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_034_COEF = {
  k0: 90.3000,
  k1: 4.1000,
  k2: 17.0000,
  k3: 29.9000,
  k4: 42.8000,
  k5: 55.7000,
  k6: 68.6000,
  k7: 81.5000,
  k8: 94.4000,
  k9: 8.2000,
  k10: 21.1000,
  k11: 34.0000,
  k12: 46.9000,
  k13: 59.8000,
  k14: 72.7000,
  k15: 85.6000,
  k16: 98.5000,
  k17: 12.3000,
  k18: 25.2000,
  k19: 38.1000,
  k20: 51.0000,
  k21: 63.9000,
  k22: 76.8000,
  k23: 89.7000,
  k24: 3.5000,
  k25: 16.4000,
  k26: 29.3000,
  k27: 42.2000,
  k28: 55.1000,
  k29: 68.0000,
  k30: 80.9000,
  k31: 93.8000,
  k32: 7.6000,
  k33: 20.5000,
  k34: 33.4000,
  k35: 46.3000,
  k36: 59.2000,
  k37: 72.1000,
  k38: 85.0000,
  k39: 97.9000,
  k40: 11.7000,
  k41: 24.6000,
  k42: 37.5000,
  k43: 50.4000,
  k44: 63.3000,
  k45: 76.2000,
  k46: 89.1000,
  k47: 2.9000,
  k48: 15.8000,
  k49: 28.7000,
  k50: 41.6000,
  k51: 54.5000,
  k52: 67.4000,
  k53: 80.3000,
  k54: 93.2000,
  k55: 7.0000,
  k56: 19.9000,
  k57: 32.8000,
  k58: 45.7000,
  k59: 58.6000,
  k60: 71.5000,
  k61: 84.4000,
  k62: 97.3000,
  k63: 11.1000,
  k64: 24.0000,
  k65: 36.9000,
  k66: 49.8000,
  k67: 62.7000,
  k68: 75.6000,
  k69: 88.5000,
  k70: 2.3000,
  k71: 15.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_034_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_034_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_034_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_034_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_034_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_034_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_034_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_034_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_034_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_034_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_034_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_034_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
