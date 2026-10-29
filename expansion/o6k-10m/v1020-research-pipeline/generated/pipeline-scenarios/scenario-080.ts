import { V1020_RPIPE_clamp, V1020_RPIPE_complianceFromScore } from '../../engine/research-pipeline-utils.ts';
import type {
  V1020RpipeTransferBand,
  V1020RpipeRegionId,
  V1020RpipeTransferSnapshot,
  V1020RpipeSystemDomain,
} from '../../types/core.ts';

/** Generated pipeline scenario 080 — research pipeline / compliance matrix. */
export const V1020_RPIPE_PIPELINE_SCENARIO_080_META = {
  id: 'pipeline_080',
  regionId: 'NSW' as V1020RpipeRegionId,
  primarySystem: 'freight' as V1020RpipeSystemDomain,
  transferBand: 'latent' as V1020RpipeTransferBand,
  seed: 70201,
} as const;

const V1020_RPIPE_PIPELINE_SCENARIO_080_COEF = {
  k0: 86.2000,
  k1: 70.2000,
  k2: 54.2000,
  k3: 38.2000,
  k4: 22.2000,
  k5: 6.2000,
  k6: 89.3000,
  k7: 73.3000,
  k8: 57.3000,
  k9: 41.3000,
  k10: 25.3000,
  k11: 9.3000,
  k12: 92.4000,
  k13: 76.4000,
  k14: 60.4000,
  k15: 44.4000,
  k16: 28.4000,
  k17: 12.4000,
  k18: 95.5000,
  k19: 79.5000,
  k20: 63.5000,
  k21: 47.5000,
  k22: 31.5000,
  k23: 15.5000,
  k24: 98.6000,
  k25: 82.6000,
  k26: 66.6000,
  k27: 50.6000,
  k28: 34.6000,
  k29: 18.6000,
  k30: 2.6000,
  k31: 85.7000,
  k32: 69.7000,
  k33: 53.7000,
  k34: 37.7000,
  k35: 21.7000,
  k36: 5.7000,
  k37: 88.8000,
  k38: 72.8000,
  k39: 56.8000,
  k40: 40.8000,
  k41: 24.8000,
  k42: 8.8000,
  k43: 91.9000,
  k44: 75.9000,
  k45: 59.9000,
  k46: 43.9000,
  k47: 27.9000,
  k48: 11.9000,
  k49: 95.0000,
  k50: 79.0000,
  k51: 63.0000,
  k52: 47.0000,
  k53: 31.0000,
  k54: 15.0000,
  k55: 98.1000,
  k56: 82.1000,
  k57: 66.1000,
  k58: 50.1000,
  k59: 34.1000,
  k60: 18.1000,
  k61: 2.1000,
  k62: 85.2000,
  k63: 69.2000,
  k64: 53.2000,
  k65: 37.2000,
  k66: 21.2000,
  k67: 5.2000,
  k68: 88.3000,
  k69: 72.3000,
  k70: 56.3000,
  k71: 40.3000,
} as const;

export function V1020_RPIPE_PIPELINE_SCENARIO_080_evaluate(turn: number): {
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1020_RPIPE_PIPELINE_SCENARIO_080_COEF) as Array<
    keyof typeof V1020_RPIPE_PIPELINE_SCENARIO_080_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1020_RPIPE_PIPELINE_SCENARIO_080_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1020_RPIPE_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const commercializationStackDelayTurns = V1020_RPIPE_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1020_RPIPE_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1020_RPIPE_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, commercializationStackDelayTurns, complianceScore, stable };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_080_snapshot(turn: number): V1020RpipeTransferSnapshot {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_080_evaluate(turn);
  return {
    scenarioId: V1020_RPIPE_PIPELINE_SCENARIO_080_META.id,
    regionId: V1020_RPIPE_PIPELINE_SCENARIO_080_META.regionId,
    systemDomain: V1020_RPIPE_PIPELINE_SCENARIO_080_META.primarySystem,
    transferBand: V1020_RPIPE_PIPELINE_SCENARIO_080_META.transferBand,
    severityIndex: r.severityIndex,
    commercializationStackDelayTurns: r.commercializationStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1020_RPIPE_complianceFromScore(r.complianceScore),
  };
}

export function V1020_RPIPE_PIPELINE_SCENARIO_080_regressionAssert(turn: number): boolean {
  const r = V1020_RPIPE_PIPELINE_SCENARIO_080_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
