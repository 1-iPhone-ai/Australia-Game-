import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 073 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_073_META = {
  id: 'transfer_073',
  regionId: 'VIC' as V1018FfedRegionId,
  primarySystem: 'digital' as V1018FfedSystemDomain,
  transferBand: 'critical' as V1018FfedTransferBand,
  seed: 64062,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_073_COEF = {
  k0: 50.2000,
  k1: 14.9000,
  k2: 78.7000,
  k3: 43.4000,
  k4: 8.1000,
  k5: 71.9000,
  k6: 36.6000,
  k7: 1.3000,
  k8: 65.1000,
  k9: 29.8000,
  k10: 93.6000,
  k11: 58.3000,
  k12: 23.0000,
  k13: 86.8000,
  k14: 51.5000,
  k15: 16.2000,
  k16: 80.0000,
  k17: 44.7000,
  k18: 9.4000,
  k19: 73.2000,
  k20: 37.9000,
  k21: 2.6000,
  k22: 66.4000,
  k23: 31.1000,
  k24: 94.9000,
  k25: 59.6000,
  k26: 24.3000,
  k27: 88.1000,
  k28: 52.8000,
  k29: 17.5000,
  k30: 81.3000,
  k31: 46.0000,
  k32: 10.7000,
  k33: 74.5000,
  k34: 39.2000,
  k35: 3.9000,
  k36: 67.7000,
  k37: 32.4000,
  k38: 96.2000,
  k39: 60.9000,
  k40: 25.6000,
  k41: 89.4000,
  k42: 54.1000,
  k43: 18.8000,
  k44: 82.6000,
  k45: 47.3000,
  k46: 12.0000,
  k47: 75.8000,
  k48: 40.5000,
  k49: 5.2000,
  k50: 69.0000,
  k51: 33.7000,
  k52: 97.5000,
  k53: 62.2000,
  k54: 26.9000,
  k55: 90.7000,
  k56: 55.4000,
  k57: 20.1000,
  k58: 83.9000,
  k59: 48.6000,
  k60: 13.3000,
  k61: 77.1000,
  k62: 41.8000,
  k63: 6.5000,
  k64: 70.3000,
  k65: 35.0000,
  k66: 98.8000,
  k67: 63.5000,
  k68: 28.2000,
  k69: 92.0000,
  k70: 56.7000,
  k71: 21.4000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_073_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_073_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_073_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_073_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_073_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_073_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_073_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_073_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_073_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_073_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_073_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_073_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
