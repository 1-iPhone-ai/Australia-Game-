import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 112 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_112_META = {
  id: 'pipeline_112',
  regionId: 'NSW' as V1020RpipeRegionId,
  primarySystem: 'water' as V1020RpipeSystemDomain,
  transferBand: 'active' as V1020RpipeTransferBand,
  seed: 98265,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_112_COEF = {
  k0: 10.1000,
  k1: 25.7000,
  k2: 41.3000,
  k3: 56.9000,
  k4: 72.5000,
  k5: 88.1000,
  k6: 4.6000,
  k7: 20.2000,
  k8: 35.8000,
  k9: 51.4000,
  k10: 67.0000,
  k11: 82.6000,
  k12: 98.2000,
  k13: 14.7000,
  k14: 30.3000,
  k15: 45.9000,
  k16: 61.5000,
  k17: 77.1000,
  k18: 92.7000,
  k19: 9.2000,
  k20: 24.8000,
  k21: 40.4000,
  k22: 56.0000,
  k23: 71.6000,
  k24: 87.2000,
  k25: 3.7000,
  k26: 19.3000,
  k27: 34.9000,
  k28: 50.5000,
  k29: 66.1000,
  k30: 81.7000,
  k31: 97.3000,
  k32: 13.8000,
  k33: 29.4000,
  k34: 45.0000,
  k35: 60.6000,
  k36: 76.2000,
  k37: 91.8000,
  k38: 8.3000,
  k39: 23.9000,
  k40: 39.5000,
  k41: 55.1000,
  k42: 70.7000,
  k43: 86.3000,
  k44: 2.8000,
  k45: 18.4000,
  k46: 34.0000,
  k47: 49.6000,
  k48: 65.2000,
  k49: 80.8000,
  k50: 96.4000,
  k51: 12.9000,
  k52: 28.5000,
  k53: 44.1000,
  k54: 59.7000,
  k55: 75.3000,
  k56: 90.9000,
  k57: 7.4000,
  k58: 23.0000,
  k59: 38.6000,
  k60: 54.2000,
  k61: 69.8000,
  k62: 85.4000,
  k63: 1.9000,
  k64: 17.5000,
  k65: 33.1000,
  k66: 48.7000,
  k67: 64.3000,
  k68: 79.9000,
  k69: 95.5000,
  k70: 12.0000,
  k71: 27.6000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_112_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_112_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_112_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_112_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_112_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_112_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_112_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_112_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_112_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_112_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_112_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_112_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
