import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 144 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_144_META = {
  id: 'transfer_144',
  regionId: 'NSW' as V1018FfedRegionId,
  primarySystem: 'trade' as V1018FfedSystemDomain,
  transferBand: 'recovering' as V1018FfedTransferBand,
  seed: 126329,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_144_COEF = {
  k0: 33.1000,
  k1: 80.3000,
  k2: 28.4000,
  k3: 75.6000,
  k4: 23.7000,
  k5: 70.9000,
  k6: 19.0000,
  k7: 66.2000,
  k8: 14.3000,
  k9: 61.5000,
  k10: 9.6000,
  k11: 56.8000,
  k12: 4.9000,
  k13: 52.1000,
  k14: 0.2000,
  k15: 47.4000,
  k16: 94.6000,
  k17: 42.7000,
  k18: 89.9000,
  k19: 38.0000,
  k20: 85.2000,
  k21: 33.3000,
  k22: 80.5000,
  k23: 28.6000,
  k24: 75.8000,
  k25: 23.9000,
  k26: 71.1000,
  k27: 19.2000,
  k28: 66.4000,
  k29: 14.5000,
  k30: 61.7000,
  k31: 9.8000,
  k32: 57.0000,
  k33: 5.1000,
  k34: 52.3000,
  k35: 0.4000,
  k36: 47.6000,
  k37: 94.8000,
  k38: 42.9000,
  k39: 90.1000,
  k40: 38.2000,
  k41: 85.4000,
  k42: 33.5000,
  k43: 80.7000,
  k44: 28.8000,
  k45: 76.0000,
  k46: 24.1000,
  k47: 71.3000,
  k48: 19.4000,
  k49: 66.6000,
  k50: 14.7000,
  k51: 61.9000,
  k52: 10.0000,
  k53: 57.2000,
  k54: 5.3000,
  k55: 52.5000,
  k56: 0.6000,
  k57: 47.8000,
  k58: 95.0000,
  k59: 43.1000,
  k60: 90.3000,
  k61: 38.4000,
  k62: 85.6000,
  k63: 33.7000,
  k64: 80.9000,
  k65: 29.0000,
  k66: 76.2000,
  k67: 24.3000,
  k68: 71.5000,
  k69: 19.6000,
  k70: 66.8000,
  k71: 14.9000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_144_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_144_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_144_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_144_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_144_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_144_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_144_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_144_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_144_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_144_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_144_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_144_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
