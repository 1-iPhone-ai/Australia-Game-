import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 169 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_169_META = {
  id: 'pipeline_169',
  regionId: 'VIC' as V1020RpipeRegionId,
  primarySystem: 'finance' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 148254,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_169_COEF = {
  k0: 20.1000,
  k1: 79.6000,
  k2: 40.0000,
  k3: 0.4000,
  k4: 59.9000,
  k5: 20.3000,
  k6: 79.8000,
  k7: 40.2000,
  k8: 0.6000,
  k9: 60.1000,
  k10: 20.5000,
  k11: 80.0000,
  k12: 40.4000,
  k13: 0.8000,
  k14: 60.3000,
  k15: 20.7000,
  k16: 80.2000,
  k17: 40.6000,
  k18: 1.0000,
  k19: 60.5000,
  k20: 20.9000,
  k21: 80.4000,
  k22: 40.8000,
  k23: 1.2000,
  k24: 60.7000,
  k25: 21.1000,
  k26: 80.6000,
  k27: 41.0000,
  k28: 1.4000,
  k29: 60.9000,
  k30: 21.3000,
  k31: 80.8000,
  k32: 41.2000,
  k33: 1.6000,
  k34: 61.1000,
  k35: 21.5000,
  k36: 81.0000,
  k37: 41.4000,
  k38: 1.8000,
  k39: 61.3000,
  k40: 21.7000,
  k41: 81.2000,
  k42: 41.6000,
  k43: 2.0000,
  k44: 61.5000,
  k45: 21.9000,
  k46: 81.4000,
  k47: 41.8000,
  k48: 2.2000,
  k49: 61.7000,
  k50: 22.1000,
  k51: 81.6000,
  k52: 42.0000,
  k53: 2.4000,
  k54: 61.9000,
  k55: 22.3000,
  k56: 81.8000,
  k57: 42.2000,
  k58: 2.6000,
  k59: 62.1000,
  k60: 22.5000,
  k61: 82.0000,
  k62: 42.4000,
  k63: 2.8000,
  k64: 62.3000,
  k65: 22.7000,
  k66: 82.2000,
  k67: 42.6000,
  k68: 3.0000,
  k69: 62.5000,
  k70: 22.9000,
  k71: 82.4000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_169_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_169_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_169_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_169_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_169_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_169_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_169_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_169_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_169_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_169_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_169_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_169_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
