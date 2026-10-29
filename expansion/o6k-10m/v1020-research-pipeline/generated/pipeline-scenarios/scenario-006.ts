import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 006 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_006_META = {
  id: 'pipeline_006',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'food' as V1020RpipeSystemDomain,
  transferBand: 'emerging' as V1020RpipeTransferBand,
  seed: 5303,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_006_COEF = {
  k0: 45.4000,
  k1: 80.2000,
  k2: 15.9000,
  k3: 50.7000,
  k4: 85.5000,
  k5: 21.2000,
  k6: 56.0000,
  k7: 90.8000,
  k8: 26.5000,
  k9: 61.3000,
  k10: 96.1000,
  k11: 31.8000,
  k12: 66.6000,
  k13: 2.3000,
  k14: 37.1000,
  k15: 71.9000,
  k16: 7.6000,
  k17: 42.4000,
  k18: 77.2000,
  k19: 12.9000,
  k20: 47.7000,
  k21: 82.5000,
  k22: 18.2000,
  k23: 53.0000,
  k24: 87.8000,
  k25: 23.5000,
  k26: 58.3000,
  k27: 93.1000,
  k28: 28.8000,
  k29: 63.6000,
  k30: 98.4000,
  k31: 34.1000,
  k32: 68.9000,
  k33: 4.6000,
  k34: 39.4000,
  k35: 74.2000,
  k36: 9.9000,
  k37: 44.7000,
  k38: 79.5000,
  k39: 15.2000,
  k40: 50.0000,
  k41: 84.8000,
  k42: 20.5000,
  k43: 55.3000,
  k44: 90.1000,
  k45: 25.8000,
  k46: 60.6000,
  k47: 95.4000,
  k48: 31.1000,
  k49: 65.9000,
  k50: 1.6000,
  k51: 36.4000,
  k52: 71.2000,
  k53: 6.9000,
  k54: 41.7000,
  k55: 76.5000,
  k56: 12.2000,
  k57: 47.0000,
  k58: 81.8000,
  k59: 17.5000,
  k60: 52.3000,
  k61: 87.1000,
  k62: 22.8000,
  k63: 57.6000,
  k64: 92.4000,
  k65: 28.1000,
  k66: 62.9000,
  k67: 97.7000,
  k68: 33.4000,
  k69: 68.2000,
  k70: 3.9000,
  k71: 38.7000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_006_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_006_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_006_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_006_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_006_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_006_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_006_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_006_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_006_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_006_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_006_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_006_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
