import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 159 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_159_META = {
  id: 'pipeline_159',
  regionId: 'ACT' as V1020RpipeRegionId,
  primarySystem: 'finance' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 139484,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_159_COEF = {
  k0: 25.3000,
  k1: 0.6000,
  k2: 75.0000,
  k3: 50.3000,
  k4: 25.6000,
  k5: 0.9000,
  k6: 75.3000,
  k7: 50.6000,
  k8: 25.9000,
  k9: 1.2000,
  k10: 75.6000,
  k11: 50.9000,
  k12: 26.2000,
  k13: 1.5000,
  k14: 75.9000,
  k15: 51.2000,
  k16: 26.5000,
  k17: 1.8000,
  k18: 76.2000,
  k19: 51.5000,
  k20: 26.8000,
  k21: 2.1000,
  k22: 76.5000,
  k23: 51.8000,
  k24: 27.1000,
  k25: 2.4000,
  k26: 76.8000,
  k27: 52.1000,
  k28: 27.4000,
  k29: 2.7000,
  k30: 77.1000,
  k31: 52.4000,
  k32: 27.7000,
  k33: 3.0000,
  k34: 77.4000,
  k35: 52.7000,
  k36: 28.0000,
  k37: 3.3000,
  k38: 77.7000,
  k39: 53.0000,
  k40: 28.3000,
  k41: 3.6000,
  k42: 78.0000,
  k43: 53.3000,
  k44: 28.6000,
  k45: 3.9000,
  k46: 78.3000,
  k47: 53.6000,
  k48: 28.9000,
  k49: 4.2000,
  k50: 78.6000,
  k51: 53.9000,
  k52: 29.2000,
  k53: 4.5000,
  k54: 78.9000,
  k55: 54.2000,
  k56: 29.5000,
  k57: 4.8000,
  k58: 79.2000,
  k59: 54.5000,
  k60: 29.8000,
  k61: 5.1000,
  k62: 79.5000,
  k63: 54.8000,
  k64: 30.1000,
  k65: 5.4000,
  k66: 79.8000,
  k67: 55.1000,
  k68: 30.4000,
  k69: 5.7000,
  k70: 80.1000,
  k71: 55.4000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_159_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_159_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_159_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_159_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_159_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_159_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_159_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_159_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_159_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_159_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_159_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_159_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
