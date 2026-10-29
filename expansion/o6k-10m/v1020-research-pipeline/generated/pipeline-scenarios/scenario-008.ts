import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 008 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_008_META = {
  id: 'pipeline_008',
  regionId: 'NSW' as V1020RpipeRegionId,
  primarySystem: 'telecom' as V1020RpipeSystemDomain,
  transferBand: 'critical' as V1020RpipeTransferBand,
  seed: 7057,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_008_COEF = {
  k0: 84.0000,
  k1: 96.0000,
  k2: 8.9000,
  k3: 20.9000,
  k4: 32.9000,
  k5: 44.9000,
  k6: 56.9000,
  k7: 68.9000,
  k8: 80.9000,
  k9: 92.9000,
  k10: 5.8000,
  k11: 17.8000,
  k12: 29.8000,
  k13: 41.8000,
  k14: 53.8000,
  k15: 65.8000,
  k16: 77.8000,
  k17: 89.8000,
  k18: 2.7000,
  k19: 14.7000,
  k20: 26.7000,
  k21: 38.7000,
  k22: 50.7000,
  k23: 62.7000,
  k24: 74.7000,
  k25: 86.7000,
  k26: 98.7000,
  k27: 11.6000,
  k28: 23.6000,
  k29: 35.6000,
  k30: 47.6000,
  k31: 59.6000,
  k32: 71.6000,
  k33: 83.6000,
  k34: 95.6000,
  k35: 8.5000,
  k36: 20.5000,
  k37: 32.5000,
  k38: 44.5000,
  k39: 56.5000,
  k40: 68.5000,
  k41: 80.5000,
  k42: 92.5000,
  k43: 5.4000,
  k44: 17.4000,
  k45: 29.4000,
  k46: 41.4000,
  k47: 53.4000,
  k48: 65.4000,
  k49: 77.4000,
  k50: 89.4000,
  k51: 2.3000,
  k52: 14.3000,
  k53: 26.3000,
  k54: 38.3000,
  k55: 50.3000,
  k56: 62.3000,
  k57: 74.3000,
  k58: 86.3000,
  k59: 98.3000,
  k60: 11.2000,
  k61: 23.2000,
  k62: 35.2000,
  k63: 47.2000,
  k64: 59.2000,
  k65: 71.2000,
  k66: 83.2000,
  k67: 95.2000,
  k68: 8.1000,
  k69: 20.1000,
  k70: 32.1000,
  k71: 44.1000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_008_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_008_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_008_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_008_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_008_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_008_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_008_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_008_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_008_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_008_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_008_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_008_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
