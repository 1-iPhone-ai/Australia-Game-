import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 102 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_102_META = {
  id: 'pipeline_102',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'water' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 89495,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_102_COEF = {
  k0: 15.3000,
  k1: 45.8000,
  k2: 76.3000,
  k3: 7.7000,
  k4: 38.2000,
  k5: 68.7000,
  k6: 0.1000,
  k7: 30.6000,
  k8: 61.1000,
  k9: 91.6000,
  k10: 23.0000,
  k11: 53.5000,
  k12: 84.0000,
  k13: 15.4000,
  k14: 45.9000,
  k15: 76.4000,
  k16: 7.8000,
  k17: 38.3000,
  k18: 68.8000,
  k19: 0.2000,
  k20: 30.7000,
  k21: 61.2000,
  k22: 91.7000,
  k23: 23.1000,
  k24: 53.6000,
  k25: 84.1000,
  k26: 15.5000,
  k27: 46.0000,
  k28: 76.5000,
  k29: 7.9000,
  k30: 38.4000,
  k31: 68.9000,
  k32: 0.3000,
  k33: 30.8000,
  k34: 61.3000,
  k35: 91.8000,
  k36: 23.2000,
  k37: 53.7000,
  k38: 84.2000,
  k39: 15.6000,
  k40: 46.1000,
  k41: 76.6000,
  k42: 8.0000,
  k43: 38.5000,
  k44: 69.0000,
  k45: 0.4000,
  k46: 30.9000,
  k47: 61.4000,
  k48: 91.9000,
  k49: 23.3000,
  k50: 53.8000,
  k51: 84.3000,
  k52: 15.7000,
  k53: 46.2000,
  k54: 76.7000,
  k55: 8.1000,
  k56: 38.6000,
  k57: 69.1000,
  k58: 0.5000,
  k59: 31.0000,
  k60: 61.5000,
  k61: 92.0000,
  k62: 23.4000,
  k63: 53.9000,
  k64: 84.4000,
  k65: 15.8000,
  k66: 46.3000,
  k67: 76.8000,
  k68: 8.2000,
  k69: 38.7000,
  k70: 69.2000,
  k71: 0.6000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_102_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_102_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_102_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_102_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_102_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_102_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_102_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_102_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_102_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_102_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_102_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_102_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
