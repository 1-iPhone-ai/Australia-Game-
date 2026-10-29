import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 036 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_036_META = {
  id: 'pipeline_036',
  regionId: 'SA' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 31613,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_036_COEF = {
  k0: 29.8000,
  k1: 19.9000,
  k2: 10.0000,
  k3: 0.1000,
  k4: 89.3000,
  k5: 79.4000,
  k6: 69.5000,
  k7: 59.6000,
  k8: 49.7000,
  k9: 39.8000,
  k10: 29.9000,
  k11: 20.0000,
  k12: 10.1000,
  k13: 0.2000,
  k14: 89.4000,
  k15: 79.5000,
  k16: 69.6000,
  k17: 59.7000,
  k18: 49.8000,
  k19: 39.9000,
  k20: 30.0000,
  k21: 20.1000,
  k22: 10.2000,
  k23: 0.3000,
  k24: 89.5000,
  k25: 79.6000,
  k26: 69.7000,
  k27: 59.8000,
  k28: 49.9000,
  k29: 40.0000,
  k30: 30.1000,
  k31: 20.2000,
  k32: 10.3000,
  k33: 0.4000,
  k34: 89.6000,
  k35: 79.7000,
  k36: 69.8000,
  k37: 59.9000,
  k38: 50.0000,
  k39: 40.1000,
  k40: 30.2000,
  k41: 20.3000,
  k42: 10.4000,
  k43: 0.5000,
  k44: 89.7000,
  k45: 79.8000,
  k46: 69.9000,
  k47: 60.0000,
  k48: 50.1000,
  k49: 40.2000,
  k50: 30.3000,
  k51: 20.4000,
  k52: 10.5000,
  k53: 0.6000,
  k54: 89.8000,
  k55: 79.9000,
  k56: 70.0000,
  k57: 60.1000,
  k58: 50.2000,
  k59: 40.3000,
  k60: 30.4000,
  k61: 20.5000,
  k62: 10.6000,
  k63: 0.7000,
  k64: 89.9000,
  k65: 80.0000,
  k66: 70.1000,
  k67: 60.2000,
  k68: 50.3000,
  k69: 40.4000,
  k70: 30.5000,
  k71: 20.6000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_036_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_036_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_036_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_036_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_036_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_036_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_036_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_036_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_036_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_036_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_036_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_036_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
