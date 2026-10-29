import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 085 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_085_META = {
  id: 'transfer_085',
  regionId: 'TAS' as V1018FfedRegionId,
  primarySystem: 'pharma' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 74586,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_085_COEF = {
  k0: 83.6000,
  k1: 10.6000,
  k2: 36.7000,
  k3: 62.8000,
  k4: 88.9000,
  k5: 15.9000,
  k6: 42.0000,
  k7: 68.1000,
  k8: 94.2000,
  k9: 21.2000,
  k10: 47.3000,
  k11: 73.4000,
  k12: 0.4000,
  k13: 26.5000,
  k14: 52.6000,
  k15: 78.7000,
  k16: 5.7000,
  k17: 31.8000,
  k18: 57.9000,
  k19: 84.0000,
  k20: 11.0000,
  k21: 37.1000,
  k22: 63.2000,
  k23: 89.3000,
  k24: 16.3000,
  k25: 42.4000,
  k26: 68.5000,
  k27: 94.6000,
  k28: 21.6000,
  k29: 47.7000,
  k30: 73.8000,
  k31: 0.8000,
  k32: 26.9000,
  k33: 53.0000,
  k34: 79.1000,
  k35: 6.1000,
  k36: 32.2000,
  k37: 58.3000,
  k38: 84.4000,
  k39: 11.4000,
  k40: 37.5000,
  k41: 63.6000,
  k42: 89.7000,
  k43: 16.7000,
  k44: 42.8000,
  k45: 68.9000,
  k46: 95.0000,
  k47: 22.0000,
  k48: 48.1000,
  k49: 74.2000,
  k50: 1.2000,
  k51: 27.3000,
  k52: 53.4000,
  k53: 79.5000,
  k54: 6.5000,
  k55: 32.6000,
  k56: 58.7000,
  k57: 84.8000,
  k58: 11.8000,
  k59: 37.9000,
  k60: 64.0000,
  k61: 90.1000,
  k62: 17.1000,
  k63: 43.2000,
  k64: 69.3000,
  k65: 95.4000,
  k66: 22.4000,
  k67: 48.5000,
  k68: 74.6000,
  k69: 1.6000,
  k70: 27.7000,
  k71: 53.8000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_085_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_085_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_085_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_085_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_085_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_085_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_085_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_085_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_085_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_085_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_085_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_085_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
