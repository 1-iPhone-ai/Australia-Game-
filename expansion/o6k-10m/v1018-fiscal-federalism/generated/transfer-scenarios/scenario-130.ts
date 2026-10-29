import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 130 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_130_META = {
  id: 'transfer_130',
  regionId: 'QLD' as V1018FfedRegionId,
  primarySystem: 'freight' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 114051,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_130_COEF = {
  k0: 60.2000,
  k1: 68.8000,
  k2: 77.4000,
  k3: 86.0000,
  k4: 94.6000,
  k5: 4.1000,
  k6: 12.7000,
  k7: 21.3000,
  k8: 29.9000,
  k9: 38.5000,
  k10: 47.1000,
  k11: 55.7000,
  k12: 64.3000,
  k13: 72.9000,
  k14: 81.5000,
  k15: 90.1000,
  k16: 98.7000,
  k17: 8.2000,
  k18: 16.8000,
  k19: 25.4000,
  k20: 34.0000,
  k21: 42.6000,
  k22: 51.2000,
  k23: 59.8000,
  k24: 68.4000,
  k25: 77.0000,
  k26: 85.6000,
  k27: 94.2000,
  k28: 3.7000,
  k29: 12.3000,
  k30: 20.9000,
  k31: 29.5000,
  k32: 38.1000,
  k33: 46.7000,
  k34: 55.3000,
  k35: 63.9000,
  k36: 72.5000,
  k37: 81.1000,
  k38: 89.7000,
  k39: 98.3000,
  k40: 7.8000,
  k41: 16.4000,
  k42: 25.0000,
  k43: 33.6000,
  k44: 42.2000,
  k45: 50.8000,
  k46: 59.4000,
  k47: 68.0000,
  k48: 76.6000,
  k49: 85.2000,
  k50: 93.8000,
  k51: 3.3000,
  k52: 11.9000,
  k53: 20.5000,
  k54: 29.1000,
  k55: 37.7000,
  k56: 46.3000,
  k57: 54.9000,
  k58: 63.5000,
  k59: 72.1000,
  k60: 80.7000,
  k61: 89.3000,
  k62: 97.9000,
  k63: 7.4000,
  k64: 16.0000,
  k65: 24.6000,
  k66: 33.2000,
  k67: 41.8000,
  k68: 50.4000,
  k69: 59.0000,
  k70: 67.6000,
  k71: 76.2000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_130_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_130_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_130_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_130_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_130_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_130_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_130_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_130_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_130_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_130_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_130_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_130_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
