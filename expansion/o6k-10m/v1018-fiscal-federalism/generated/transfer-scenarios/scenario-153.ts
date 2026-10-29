import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 153 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_153_META = {
  id: 'transfer_153',
  regionId: 'VIC' as V1018FfedRegionId,
  primarySystem: 'digital' as V1018FfedSystemDomain,
  transferBand: 'critical' as V1018FfedTransferBand,
  seed: 134222,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_153_COEF = {
  k0: 8.6000,
  k1: 52.3000,
  k2: 96.0000,
  k3: 40.6000,
  k4: 84.3000,
  k5: 28.9000,
  k6: 72.6000,
  k7: 17.2000,
  k8: 60.9000,
  k9: 5.5000,
  k10: 49.2000,
  k11: 92.9000,
  k12: 37.5000,
  k13: 81.2000,
  k14: 25.8000,
  k15: 69.5000,
  k16: 14.1000,
  k17: 57.8000,
  k18: 2.4000,
  k19: 46.1000,
  k20: 89.8000,
  k21: 34.4000,
  k22: 78.1000,
  k23: 22.7000,
  k24: 66.4000,
  k25: 11.0000,
  k26: 54.7000,
  k27: 98.4000,
  k28: 43.0000,
  k29: 86.7000,
  k30: 31.3000,
  k31: 75.0000,
  k32: 19.6000,
  k33: 63.3000,
  k34: 7.9000,
  k35: 51.6000,
  k36: 95.3000,
  k37: 39.9000,
  k38: 83.6000,
  k39: 28.2000,
  k40: 71.9000,
  k41: 16.5000,
  k42: 60.2000,
  k43: 4.8000,
  k44: 48.5000,
  k45: 92.2000,
  k46: 36.8000,
  k47: 80.5000,
  k48: 25.1000,
  k49: 68.8000,
  k50: 13.4000,
  k51: 57.1000,
  k52: 1.7000,
  k53: 45.4000,
  k54: 89.1000,
  k55: 33.7000,
  k56: 77.4000,
  k57: 22.0000,
  k58: 65.7000,
  k59: 10.3000,
  k60: 54.0000,
  k61: 97.7000,
  k62: 42.3000,
  k63: 86.0000,
  k64: 30.6000,
  k65: 74.3000,
  k66: 18.9000,
  k67: 62.6000,
  k68: 7.2000,
  k69: 50.9000,
  k70: 94.6000,
  k71: 39.2000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_153_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_153_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_153_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_153_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_153_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_153_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_153_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_153_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_153_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_153_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_153_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_153_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
