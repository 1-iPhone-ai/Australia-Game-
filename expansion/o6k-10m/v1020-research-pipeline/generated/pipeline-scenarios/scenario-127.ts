import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 127 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_127_META = {
  id: 'pipeline_127',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'industrial' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 111420,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_127_COEF = {
  k0: 2.3000,
  k1: 45.1000,
  k2: 87.9000,
  k3: 31.6000,
  k4: 74.4000,
  k5: 18.1000,
  k6: 60.9000,
  k7: 4.6000,
  k8: 47.4000,
  k9: 90.2000,
  k10: 33.9000,
  k11: 76.7000,
  k12: 20.4000,
  k13: 63.2000,
  k14: 6.9000,
  k15: 49.7000,
  k16: 92.5000,
  k17: 36.2000,
  k18: 79.0000,
  k19: 22.7000,
  k20: 65.5000,
  k21: 9.2000,
  k22: 52.0000,
  k23: 94.8000,
  k24: 38.5000,
  k25: 81.3000,
  k26: 25.0000,
  k27: 67.8000,
  k28: 11.5000,
  k29: 54.3000,
  k30: 97.1000,
  k31: 40.8000,
  k32: 83.6000,
  k33: 27.3000,
  k34: 70.1000,
  k35: 13.8000,
  k36: 56.6000,
  k37: 0.3000,
  k38: 43.1000,
  k39: 85.9000,
  k40: 29.6000,
  k41: 72.4000,
  k42: 16.1000,
  k43: 58.9000,
  k44: 2.6000,
  k45: 45.4000,
  k46: 88.2000,
  k47: 31.9000,
  k48: 74.7000,
  k49: 18.4000,
  k50: 61.2000,
  k51: 4.9000,
  k52: 47.7000,
  k53: 90.5000,
  k54: 34.2000,
  k55: 77.0000,
  k56: 20.7000,
  k57: 63.5000,
  k58: 7.2000,
  k59: 50.0000,
  k60: 92.8000,
  k61: 36.5000,
  k62: 79.3000,
  k63: 23.0000,
  k64: 65.8000,
  k65: 9.5000,
  k66: 52.3000,
  k67: 95.1000,
  k68: 38.8000,
  k69: 81.6000,
  k70: 25.3000,
  k71: 68.1000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_127_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_127_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_127_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_127_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_127_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_127_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_127_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_127_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_127_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_127_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_127_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_127_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
