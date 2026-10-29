import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 142 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_142_META = {
  id: 'pipeline_142',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'water' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 124575,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_142_COEF = {
  k0: 93.6000,
  k1: 64.5000,
  k2: 35.4000,
  k3: 6.3000,
  k4: 76.3000,
  k5: 47.2000,
  k6: 18.1000,
  k7: 88.1000,
  k8: 59.0000,
  k9: 29.9000,
  k10: 0.8000,
  k11: 70.8000,
  k12: 41.7000,
  k13: 12.6000,
  k14: 82.6000,
  k15: 53.5000,
  k16: 24.4000,
  k17: 94.4000,
  k18: 65.3000,
  k19: 36.2000,
  k20: 7.1000,
  k21: 77.1000,
  k22: 48.0000,
  k23: 18.9000,
  k24: 88.9000,
  k25: 59.8000,
  k26: 30.7000,
  k27: 1.6000,
  k28: 71.6000,
  k29: 42.5000,
  k30: 13.4000,
  k31: 83.4000,
  k32: 54.3000,
  k33: 25.2000,
  k34: 95.2000,
  k35: 66.1000,
  k36: 37.0000,
  k37: 7.9000,
  k38: 77.9000,
  k39: 48.8000,
  k40: 19.7000,
  k41: 89.7000,
  k42: 60.6000,
  k43: 31.5000,
  k44: 2.4000,
  k45: 72.4000,
  k46: 43.3000,
  k47: 14.2000,
  k48: 84.2000,
  k49: 55.1000,
  k50: 26.0000,
  k51: 96.0000,
  k52: 66.9000,
  k53: 37.8000,
  k54: 8.7000,
  k55: 78.7000,
  k56: 49.6000,
  k57: 20.5000,
  k58: 90.5000,
  k59: 61.4000,
  k60: 32.3000,
  k61: 3.2000,
  k62: 73.2000,
  k63: 44.1000,
  k64: 15.0000,
  k65: 85.0000,
  k66: 55.9000,
  k67: 26.8000,
  k68: 96.8000,
  k69: 67.7000,
  k70: 38.6000,
  k71: 9.5000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_142_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_142_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_142_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_142_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_142_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_142_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_142_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_142_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_142_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_142_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_142_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_142_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
