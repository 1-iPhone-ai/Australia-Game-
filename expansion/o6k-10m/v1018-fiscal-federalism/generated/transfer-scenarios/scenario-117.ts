import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 117 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_117_META = {
  id: 'transfer_117',
  regionId: 'TAS' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 102650,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_117_COEF = {
  k0: 7.5000,
  k1: 65.2000,
  k2: 23.8000,
  k3: 81.5000,
  k4: 40.1000,
  k5: 97.8000,
  k6: 56.4000,
  k7: 15.0000,
  k8: 72.7000,
  k9: 31.3000,
  k10: 89.0000,
  k11: 47.6000,
  k12: 6.2000,
  k13: 63.9000,
  k14: 22.5000,
  k15: 80.2000,
  k16: 38.8000,
  k17: 96.5000,
  k18: 55.1000,
  k19: 13.7000,
  k20: 71.4000,
  k21: 30.0000,
  k22: 87.7000,
  k23: 46.3000,
  k24: 4.9000,
  k25: 62.6000,
  k26: 21.2000,
  k27: 78.9000,
  k28: 37.5000,
  k29: 95.2000,
  k30: 53.8000,
  k31: 12.4000,
  k32: 70.1000,
  k33: 28.7000,
  k34: 86.4000,
  k35: 45.0000,
  k36: 3.6000,
  k37: 61.3000,
  k38: 19.9000,
  k39: 77.6000,
  k40: 36.2000,
  k41: 93.9000,
  k42: 52.5000,
  k43: 11.1000,
  k44: 68.8000,
  k45: 27.4000,
  k46: 85.1000,
  k47: 43.7000,
  k48: 2.3000,
  k49: 60.0000,
  k50: 18.6000,
  k51: 76.3000,
  k52: 34.9000,
  k53: 92.6000,
  k54: 51.2000,
  k55: 9.8000,
  k56: 67.5000,
  k57: 26.1000,
  k58: 83.8000,
  k59: 42.4000,
  k60: 1.0000,
  k61: 58.7000,
  k62: 17.3000,
  k63: 75.0000,
  k64: 33.6000,
  k65: 91.3000,
  k66: 49.9000,
  k67: 8.5000,
  k68: 66.2000,
  k69: 24.8000,
  k70: 82.5000,
  k71: 41.1000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_117_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_117_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_117_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_117_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_117_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_117_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_117_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_117_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_117_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_117_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_117_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_117_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
