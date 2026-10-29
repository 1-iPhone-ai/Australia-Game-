import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 150 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_150_META = {
  id: 'pipeline_150',
  regionId: 'NT' as V1020RpipeRegionId,
  primarySystem: 'freight' as V1020RpipeSystemDomain,
  transferBand: 'latent' as V1020RpipeTransferBand,
  seed: 131591,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_150_COEF = {
  k0: 49.8000,
  k1: 28.6000,
  k2: 7.4000,
  k3: 85.3000,
  k4: 64.1000,
  k5: 42.9000,
  k6: 21.7000,
  k7: 0.5000,
  k8: 78.4000,
  k9: 57.2000,
  k10: 36.0000,
  k11: 14.8000,
  k12: 92.7000,
  k13: 71.5000,
  k14: 50.3000,
  k15: 29.1000,
  k16: 7.9000,
  k17: 85.8000,
  k18: 64.6000,
  k19: 43.4000,
  k20: 22.2000,
  k21: 1.0000,
  k22: 78.9000,
  k23: 57.7000,
  k24: 36.5000,
  k25: 15.3000,
  k26: 93.2000,
  k27: 72.0000,
  k28: 50.8000,
  k29: 29.6000,
  k30: 8.4000,
  k31: 86.3000,
  k32: 65.1000,
  k33: 43.9000,
  k34: 22.7000,
  k35: 1.5000,
  k36: 79.4000,
  k37: 58.2000,
  k38: 37.0000,
  k39: 15.8000,
  k40: 93.7000,
  k41: 72.5000,
  k42: 51.3000,
  k43: 30.1000,
  k44: 8.9000,
  k45: 86.8000,
  k46: 65.6000,
  k47: 44.4000,
  k48: 23.2000,
  k49: 2.0000,
  k50: 79.9000,
  k51: 58.7000,
  k52: 37.5000,
  k53: 16.3000,
  k54: 94.2000,
  k55: 73.0000,
  k56: 51.8000,
  k57: 30.6000,
  k58: 9.4000,
  k59: 87.3000,
  k60: 66.1000,
  k61: 44.9000,
  k62: 23.7000,
  k63: 2.5000,
  k64: 80.4000,
  k65: 59.2000,
  k66: 38.0000,
  k67: 16.8000,
  k68: 94.7000,
  k69: 73.5000,
  k70: 52.3000,
  k71: 31.1000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_150_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_150_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_150_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_150_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_150_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_150_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_150_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_150_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_150_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_150_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_150_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_150_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
