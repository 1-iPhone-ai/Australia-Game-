import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 023 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_023_META = {
  id: 'pipeline_023',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'digital' as V1020RpipeSystemDomain,
  transferBand: 'critical' as V1020RpipeTransferBand,
  seed: 20212,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_023_COEF = {
  k0: 76.2000,
  k1: 16.3000,
  k2: 55.5000,
  k3: 94.7000,
  k4: 34.8000,
  k5: 74.0000,
  k6: 14.1000,
  k7: 53.3000,
  k8: 92.5000,
  k9: 32.6000,
  k10: 71.8000,
  k11: 11.9000,
  k12: 51.1000,
  k13: 90.3000,
  k14: 30.4000,
  k15: 69.6000,
  k16: 9.7000,
  k17: 48.9000,
  k18: 88.1000,
  k19: 28.2000,
  k20: 67.4000,
  k21: 7.5000,
  k22: 46.7000,
  k23: 85.9000,
  k24: 26.0000,
  k25: 65.2000,
  k26: 5.3000,
  k27: 44.5000,
  k28: 83.7000,
  k29: 23.8000,
  k30: 63.0000,
  k31: 3.1000,
  k32: 42.3000,
  k33: 81.5000,
  k34: 21.6000,
  k35: 60.8000,
  k36: 0.9000,
  k37: 40.1000,
  k38: 79.3000,
  k39: 19.4000,
  k40: 58.6000,
  k41: 97.8000,
  k42: 37.9000,
  k43: 77.1000,
  k44: 17.2000,
  k45: 56.4000,
  k46: 95.6000,
  k47: 35.7000,
  k48: 74.9000,
  k49: 15.0000,
  k50: 54.2000,
  k51: 93.4000,
  k52: 33.5000,
  k53: 72.7000,
  k54: 12.8000,
  k55: 52.0000,
  k56: 91.2000,
  k57: 31.3000,
  k58: 70.5000,
  k59: 10.6000,
  k60: 49.8000,
  k61: 89.0000,
  k62: 29.1000,
  k63: 68.3000,
  k64: 8.4000,
  k65: 47.6000,
  k66: 86.8000,
  k67: 26.9000,
  k68: 66.1000,
  k69: 6.2000,
  k70: 45.4000,
  k71: 84.6000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_023_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_023_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_023_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_023_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_023_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_023_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_023_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_023_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_023_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_023_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_023_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_023_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
