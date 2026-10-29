import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 046 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_046_META = {
  id: 'pipeline_046',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 40383,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_046_COEF = {
  k0: 24.6000,
  k1: 98.9000,
  k2: 74.1000,
  k3: 49.3000,
  k4: 24.5000,
  k5: 98.8000,
  k6: 74.0000,
  k7: 49.2000,
  k8: 24.4000,
  k9: 98.7000,
  k10: 73.9000,
  k11: 49.1000,
  k12: 24.3000,
  k13: 98.6000,
  k14: 73.8000,
  k15: 49.0000,
  k16: 24.2000,
  k17: 98.5000,
  k18: 73.7000,
  k19: 48.9000,
  k20: 24.1000,
  k21: 98.4000,
  k22: 73.6000,
  k23: 48.8000,
  k24: 24.0000,
  k25: 98.3000,
  k26: 73.5000,
  k27: 48.7000,
  k28: 23.9000,
  k29: 98.2000,
  k30: 73.4000,
  k31: 48.6000,
  k32: 23.8000,
  k33: 98.1000,
  k34: 73.3000,
  k35: 48.5000,
  k36: 23.7000,
  k37: 98.0000,
  k38: 73.2000,
  k39: 48.4000,
  k40: 23.6000,
  k41: 97.9000,
  k42: 73.1000,
  k43: 48.3000,
  k44: 23.5000,
  k45: 97.8000,
  k46: 73.0000,
  k47: 48.2000,
  k48: 23.4000,
  k49: 97.7000,
  k50: 72.9000,
  k51: 48.1000,
  k52: 23.3000,
  k53: 97.6000,
  k54: 72.8000,
  k55: 48.0000,
  k56: 23.2000,
  k57: 97.5000,
  k58: 72.7000,
  k59: 47.9000,
  k60: 23.1000,
  k61: 97.4000,
  k62: 72.6000,
  k63: 47.8000,
  k64: 23.0000,
  k65: 97.3000,
  k66: 72.5000,
  k67: 47.7000,
  k68: 22.9000,
  k69: 97.2000,
  k70: 72.4000,
  k71: 47.6000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_046_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_046_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_046_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_046_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_046_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_046_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_046_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_046_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_046_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_046_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_046_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_046_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
