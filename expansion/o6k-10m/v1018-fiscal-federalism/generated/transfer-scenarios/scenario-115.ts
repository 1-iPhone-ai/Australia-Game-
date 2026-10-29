import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 115 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_115_META = {
  id: 'transfer_115',
  regionId: 'WA' as V1018FfedRegionId,
  primarySystem: 'pharma' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 100896,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_115_COEF = {
  k0: 68.0000,
  k1: 49.4000,
  k2: 30.8000,
  k3: 12.2000,
  k4: 92.7000,
  k5: 74.1000,
  k6: 55.5000,
  k7: 36.9000,
  k8: 18.3000,
  k9: 98.8000,
  k10: 80.2000,
  k11: 61.6000,
  k12: 43.0000,
  k13: 24.4000,
  k14: 5.8000,
  k15: 86.3000,
  k16: 67.7000,
  k17: 49.1000,
  k18: 30.5000,
  k19: 11.9000,
  k20: 92.4000,
  k21: 73.8000,
  k22: 55.2000,
  k23: 36.6000,
  k24: 18.0000,
  k25: 98.5000,
  k26: 79.9000,
  k27: 61.3000,
  k28: 42.7000,
  k29: 24.1000,
  k30: 5.5000,
  k31: 86.0000,
  k32: 67.4000,
  k33: 48.8000,
  k34: 30.2000,
  k35: 11.6000,
  k36: 92.1000,
  k37: 73.5000,
  k38: 54.9000,
  k39: 36.3000,
  k40: 17.7000,
  k41: 98.2000,
  k42: 79.6000,
  k43: 61.0000,
  k44: 42.4000,
  k45: 23.8000,
  k46: 5.2000,
  k47: 85.7000,
  k48: 67.1000,
  k49: 48.5000,
  k50: 29.9000,
  k51: 11.3000,
  k52: 91.8000,
  k53: 73.2000,
  k54: 54.6000,
  k55: 36.0000,
  k56: 17.4000,
  k57: 97.9000,
  k58: 79.3000,
  k59: 60.7000,
  k60: 42.1000,
  k61: 23.5000,
  k62: 4.9000,
  k63: 85.4000,
  k64: 66.8000,
  k65: 48.2000,
  k66: 29.6000,
  k67: 11.0000,
  k68: 91.5000,
  k69: 72.9000,
  k70: 54.3000,
  k71: 35.7000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_115_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_115_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_115_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_115_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_115_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_115_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_115_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_115_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_115_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_115_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_115_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_115_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
