import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 140 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_140_META = {
  id: 'pipeline_140',
  regionId: 'SA' as V1020RpipeRegionId,
  primarySystem: 'freight' as V1020RpipeSystemDomain,
  transferBand: 'latent' as V1020RpipeTransferBand,
  seed: 122821,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_140_COEF = {
  k0: 55.0000,
  k1: 48.7000,
  k2: 42.4000,
  k3: 36.1000,
  k4: 29.8000,
  k5: 23.5000,
  k6: 17.2000,
  k7: 10.9000,
  k8: 4.6000,
  k9: 97.4000,
  k10: 91.1000,
  k11: 84.8000,
  k12: 78.5000,
  k13: 72.2000,
  k14: 65.9000,
  k15: 59.6000,
  k16: 53.3000,
  k17: 47.0000,
  k18: 40.7000,
  k19: 34.4000,
  k20: 28.1000,
  k21: 21.8000,
  k22: 15.5000,
  k23: 9.2000,
  k24: 2.9000,
  k25: 95.7000,
  k26: 89.4000,
  k27: 83.1000,
  k28: 76.8000,
  k29: 70.5000,
  k30: 64.2000,
  k31: 57.9000,
  k32: 51.6000,
  k33: 45.3000,
  k34: 39.0000,
  k35: 32.7000,
  k36: 26.4000,
  k37: 20.1000,
  k38: 13.8000,
  k39: 7.5000,
  k40: 1.2000,
  k41: 94.0000,
  k42: 87.7000,
  k43: 81.4000,
  k44: 75.1000,
  k45: 68.8000,
  k46: 62.5000,
  k47: 56.2000,
  k48: 49.9000,
  k49: 43.6000,
  k50: 37.3000,
  k51: 31.0000,
  k52: 24.7000,
  k53: 18.4000,
  k54: 12.1000,
  k55: 5.8000,
  k56: 98.6000,
  k57: 92.3000,
  k58: 86.0000,
  k59: 79.7000,
  k60: 73.4000,
  k61: 67.1000,
  k62: 60.8000,
  k63: 54.5000,
  k64: 48.2000,
  k65: 41.9000,
  k66: 35.6000,
  k67: 29.3000,
  k68: 23.0000,
  k69: 16.7000,
  k70: 10.4000,
  k71: 4.1000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_140_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_140_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_140_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_140_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_140_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_140_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_140_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_140_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_140_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_140_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_140_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_140_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
