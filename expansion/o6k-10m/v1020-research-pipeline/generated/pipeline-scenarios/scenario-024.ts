import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 024 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_024_META = {
  id: 'pipeline_024',
  regionId: 'NSW' as V1020RpipeRegionId,
  primarySystem: 'trade' as V1020RpipeSystemDomain,
  transferBand: 'recovering' as V1020RpipeTransferBand,
  seed: 21089,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_024_COEF = {
  k0: 95.5000,
  k1: 24.2000,
  k2: 52.0000,
  k3: 79.8000,
  k4: 8.5000,
  k5: 36.3000,
  k6: 64.1000,
  k7: 91.9000,
  k8: 20.6000,
  k9: 48.4000,
  k10: 76.2000,
  k11: 4.9000,
  k12: 32.7000,
  k13: 60.5000,
  k14: 88.3000,
  k15: 17.0000,
  k16: 44.8000,
  k17: 72.6000,
  k18: 1.3000,
  k19: 29.1000,
  k20: 56.9000,
  k21: 84.7000,
  k22: 13.4000,
  k23: 41.2000,
  k24: 69.0000,
  k25: 96.8000,
  k26: 25.5000,
  k27: 53.3000,
  k28: 81.1000,
  k29: 9.8000,
  k30: 37.6000,
  k31: 65.4000,
  k32: 93.2000,
  k33: 21.9000,
  k34: 49.7000,
  k35: 77.5000,
  k36: 6.2000,
  k37: 34.0000,
  k38: 61.8000,
  k39: 89.6000,
  k40: 18.3000,
  k41: 46.1000,
  k42: 73.9000,
  k43: 2.6000,
  k44: 30.4000,
  k45: 58.2000,
  k46: 86.0000,
  k47: 14.7000,
  k48: 42.5000,
  k49: 70.3000,
  k50: 98.1000,
  k51: 26.8000,
  k52: 54.6000,
  k53: 82.4000,
  k54: 11.1000,
  k55: 38.9000,
  k56: 66.7000,
  k57: 94.5000,
  k58: 23.2000,
  k59: 51.0000,
  k60: 78.8000,
  k61: 7.5000,
  k62: 35.3000,
  k63: 63.1000,
  k64: 90.9000,
  k65: 19.6000,
  k66: 47.4000,
  k67: 75.2000,
  k68: 3.9000,
  k69: 31.7000,
  k70: 59.5000,
  k71: 87.3000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_024_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_024_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_024_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_024_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_024_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_024_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_024_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_024_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_024_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_024_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_024_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_024_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
