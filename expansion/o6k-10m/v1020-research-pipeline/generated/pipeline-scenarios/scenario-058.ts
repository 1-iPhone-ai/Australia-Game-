import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 058 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_058_META = {
  id: 'pipeline_058',
  regionId: 'QLD' as V1020RpipeRegionId,
  primarySystem: 'telecom' as V1020RpipeSystemDomain,
  transferBand: 'critical' as V1020RpipeTransferBand,
  seed: 50907,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_058_COEF = {
  k0: 58.0000,
  k1: 94.6000,
  k2: 32.1000,
  k3: 68.7000,
  k4: 6.2000,
  k5: 42.8000,
  k6: 79.4000,
  k7: 16.9000,
  k8: 53.5000,
  k9: 90.1000,
  k10: 27.6000,
  k11: 64.2000,
  k12: 1.7000,
  k13: 38.3000,
  k14: 74.9000,
  k15: 12.4000,
  k16: 49.0000,
  k17: 85.6000,
  k18: 23.1000,
  k19: 59.7000,
  k20: 96.3000,
  k21: 33.8000,
  k22: 70.4000,
  k23: 7.9000,
  k24: 44.5000,
  k25: 81.1000,
  k26: 18.6000,
  k27: 55.2000,
  k28: 91.8000,
  k29: 29.3000,
  k30: 65.9000,
  k31: 3.4000,
  k32: 40.0000,
  k33: 76.6000,
  k34: 14.1000,
  k35: 50.7000,
  k36: 87.3000,
  k37: 24.8000,
  k38: 61.4000,
  k39: 98.0000,
  k40: 35.5000,
  k41: 72.1000,
  k42: 9.6000,
  k43: 46.2000,
  k44: 82.8000,
  k45: 20.3000,
  k46: 56.9000,
  k47: 93.5000,
  k48: 31.0000,
  k49: 67.6000,
  k50: 5.1000,
  k51: 41.7000,
  k52: 78.3000,
  k53: 15.8000,
  k54: 52.4000,
  k55: 89.0000,
  k56: 26.5000,
  k57: 63.1000,
  k58: 0.6000,
  k59: 37.2000,
  k60: 73.8000,
  k61: 11.3000,
  k62: 47.9000,
  k63: 84.5000,
  k64: 22.0000,
  k65: 58.6000,
  k66: 95.2000,
  k67: 32.7000,
  k68: 69.3000,
  k69: 6.8000,
  k70: 43.4000,
  k71: 80.0000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_058_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_058_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_058_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_058_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_058_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_058_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_058_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_058_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_058_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_058_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_058_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_058_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
