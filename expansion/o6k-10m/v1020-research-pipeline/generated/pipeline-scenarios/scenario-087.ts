import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 087 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_087_META = {
  id: 'pipeline_087',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'industrial' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 76340,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_087_COEF = {
  k0: 23.1000,
  k1: 26.4000,
  k2: 29.7000,
  k3: 33.0000,
  k4: 36.3000,
  k5: 39.6000,
  k6: 42.9000,
  k7: 46.2000,
  k8: 49.5000,
  k9: 52.8000,
  k10: 56.1000,
  k11: 59.4000,
  k12: 62.7000,
  k13: 66.0000,
  k14: 69.3000,
  k15: 72.6000,
  k16: 75.9000,
  k17: 79.2000,
  k18: 82.5000,
  k19: 85.8000,
  k20: 89.1000,
  k21: 92.4000,
  k22: 95.7000,
  k23: 99.0000,
  k24: 3.2000,
  k25: 6.5000,
  k26: 9.8000,
  k27: 13.1000,
  k28: 16.4000,
  k29: 19.7000,
  k30: 23.0000,
  k31: 26.3000,
  k32: 29.6000,
  k33: 32.9000,
  k34: 36.2000,
  k35: 39.5000,
  k36: 42.8000,
  k37: 46.1000,
  k38: 49.4000,
  k39: 52.7000,
  k40: 56.0000,
  k41: 59.3000,
  k42: 62.6000,
  k43: 65.9000,
  k44: 69.2000,
  k45: 72.5000,
  k46: 75.8000,
  k47: 79.1000,
  k48: 82.4000,
  k49: 85.7000,
  k50: 89.0000,
  k51: 92.3000,
  k52: 95.6000,
  k53: 98.9000,
  k54: 3.1000,
  k55: 6.4000,
  k56: 9.7000,
  k57: 13.0000,
  k58: 16.3000,
  k59: 19.6000,
  k60: 22.9000,
  k61: 26.2000,
  k62: 29.5000,
  k63: 32.8000,
  k64: 36.1000,
  k65: 39.4000,
  k66: 42.7000,
  k67: 46.0000,
  k68: 49.3000,
  k69: 52.6000,
  k70: 55.9000,
  k71: 59.2000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_087_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_087_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_087_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_087_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_087_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_087_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_087_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_087_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_087_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_087_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_087_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_087_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
