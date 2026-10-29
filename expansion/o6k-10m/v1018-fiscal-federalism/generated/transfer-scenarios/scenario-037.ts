import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 037 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_037_META = {
  id: 'transfer_037',
  regionId: 'TAS' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 32490,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_037_COEF = {
  k0: 49.1000,
  k1: 27.8000,
  k2: 6.5000,
  k3: 84.3000,
  k4: 63.0000,
  k5: 41.7000,
  k6: 20.4000,
  k7: 98.2000,
  k8: 76.9000,
  k9: 55.6000,
  k10: 34.3000,
  k11: 13.0000,
  k12: 90.8000,
  k13: 69.5000,
  k14: 48.2000,
  k15: 26.9000,
  k16: 5.6000,
  k17: 83.4000,
  k18: 62.1000,
  k19: 40.8000,
  k20: 19.5000,
  k21: 97.3000,
  k22: 76.0000,
  k23: 54.7000,
  k24: 33.4000,
  k25: 12.1000,
  k26: 89.9000,
  k27: 68.6000,
  k28: 47.3000,
  k29: 26.0000,
  k30: 4.7000,
  k31: 82.5000,
  k32: 61.2000,
  k33: 39.9000,
  k34: 18.6000,
  k35: 96.4000,
  k36: 75.1000,
  k37: 53.8000,
  k38: 32.5000,
  k39: 11.2000,
  k40: 89.0000,
  k41: 67.7000,
  k42: 46.4000,
  k43: 25.1000,
  k44: 3.8000,
  k45: 81.6000,
  k46: 60.3000,
  k47: 39.0000,
  k48: 17.7000,
  k49: 95.5000,
  k50: 74.2000,
  k51: 52.9000,
  k52: 31.6000,
  k53: 10.3000,
  k54: 88.1000,
  k55: 66.8000,
  k56: 45.5000,
  k57: 24.2000,
  k58: 2.9000,
  k59: 80.7000,
  k60: 59.4000,
  k61: 38.1000,
  k62: 16.8000,
  k63: 94.6000,
  k64: 73.3000,
  k65: 52.0000,
  k66: 30.7000,
  k67: 9.4000,
  k68: 87.2000,
  k69: 65.9000,
  k70: 44.6000,
  k71: 23.3000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_037_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_037_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_037_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_037_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_037_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_037_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_037_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_037_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_037_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_037_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_037_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_037_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
