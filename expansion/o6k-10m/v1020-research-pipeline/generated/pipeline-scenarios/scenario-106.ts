import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 106 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_106_META = {
  id: 'pipeline_106',
  regionId: 'QLD' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 93003,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_106_COEF = {
  k0: 92.5000,
  k1: 77.4000,
  k2: 62.3000,
  k3: 47.2000,
  k4: 32.1000,
  k5: 17.0000,
  k6: 1.9000,
  k7: 85.9000,
  k8: 70.8000,
  k9: 55.7000,
  k10: 40.6000,
  k11: 25.5000,
  k12: 10.4000,
  k13: 94.4000,
  k14: 79.3000,
  k15: 64.2000,
  k16: 49.1000,
  k17: 34.0000,
  k18: 18.9000,
  k19: 3.8000,
  k20: 87.8000,
  k21: 72.7000,
  k22: 57.6000,
  k23: 42.5000,
  k24: 27.4000,
  k25: 12.3000,
  k26: 96.3000,
  k27: 81.2000,
  k28: 66.1000,
  k29: 51.0000,
  k30: 35.9000,
  k31: 20.8000,
  k32: 5.7000,
  k33: 89.7000,
  k34: 74.6000,
  k35: 59.5000,
  k36: 44.4000,
  k37: 29.3000,
  k38: 14.2000,
  k39: 98.2000,
  k40: 83.1000,
  k41: 68.0000,
  k42: 52.9000,
  k43: 37.8000,
  k44: 22.7000,
  k45: 7.6000,
  k46: 91.6000,
  k47: 76.5000,
  k48: 61.4000,
  k49: 46.3000,
  k50: 31.2000,
  k51: 16.1000,
  k52: 1.0000,
  k53: 85.0000,
  k54: 69.9000,
  k55: 54.8000,
  k56: 39.7000,
  k57: 24.6000,
  k58: 9.5000,
  k59: 93.5000,
  k60: 78.4000,
  k61: 63.3000,
  k62: 48.2000,
  k63: 33.1000,
  k64: 18.0000,
  k65: 2.9000,
  k66: 86.9000,
  k67: 71.8000,
  k68: 56.7000,
  k69: 41.6000,
  k70: 26.5000,
  k71: 11.4000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_106_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_106_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_106_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_106_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_106_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_106_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_106_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_106_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_106_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_106_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_106_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_106_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
