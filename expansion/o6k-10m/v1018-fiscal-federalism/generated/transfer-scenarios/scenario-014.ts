import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 014 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_014_META = {
  id: 'transfer_014',
  regionId: 'NT' as V1018FfedRegionId,
  primarySystem: 'trade' as V1018FfedSystemDomain,
  transferBand: 'recovering' as V1018FfedTransferBand,
  seed: 12319,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_014_COEF = {
  k0: 1.6000,
  k1: 44.3000,
  k2: 87.0000,
  k3: 30.6000,
  k4: 73.3000,
  k5: 16.9000,
  k6: 59.6000,
  k7: 3.2000,
  k8: 45.9000,
  k9: 88.6000,
  k10: 32.2000,
  k11: 74.9000,
  k12: 18.5000,
  k13: 61.2000,
  k14: 4.8000,
  k15: 47.5000,
  k16: 90.2000,
  k17: 33.8000,
  k18: 76.5000,
  k19: 20.1000,
  k20: 62.8000,
  k21: 6.4000,
  k22: 49.1000,
  k23: 91.8000,
  k24: 35.4000,
  k25: 78.1000,
  k26: 21.7000,
  k27: 64.4000,
  k28: 8.0000,
  k29: 50.7000,
  k30: 93.4000,
  k31: 37.0000,
  k32: 79.7000,
  k33: 23.3000,
  k34: 66.0000,
  k35: 9.6000,
  k36: 52.3000,
  k37: 95.0000,
  k38: 38.6000,
  k39: 81.3000,
  k40: 24.9000,
  k41: 67.6000,
  k42: 11.2000,
  k43: 53.9000,
  k44: 96.6000,
  k45: 40.2000,
  k46: 82.9000,
  k47: 26.5000,
  k48: 69.2000,
  k49: 12.8000,
  k50: 55.5000,
  k51: 98.2000,
  k52: 41.8000,
  k53: 84.5000,
  k54: 28.1000,
  k55: 70.8000,
  k56: 14.4000,
  k57: 57.1000,
  k58: 0.7000,
  k59: 43.4000,
  k60: 86.1000,
  k61: 29.7000,
  k62: 72.4000,
  k63: 16.0000,
  k64: 58.7000,
  k65: 2.3000,
  k66: 45.0000,
  k67: 87.7000,
  k68: 31.3000,
  k69: 74.0000,
  k70: 17.6000,
  k71: 60.3000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_014_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_014_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_014_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_014_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_014_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_014_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_014_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_014_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_014_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_014_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_014_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_014_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
