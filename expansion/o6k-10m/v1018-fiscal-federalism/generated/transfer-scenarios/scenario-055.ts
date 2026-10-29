import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 055 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_055_META = {
  id: 'transfer_055',
  regionId: 'ACT' as V1018FfedRegionId,
  primarySystem: 'pharma' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 48276,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_055_COEF = {
  k0: 0.1000,
  k1: 70.9000,
  k2: 42.6000,
  k3: 14.3000,
  k4: 85.1000,
  k5: 56.8000,
  k6: 28.5000,
  k7: 0.2000,
  k8: 71.0000,
  k9: 42.7000,
  k10: 14.4000,
  k11: 85.2000,
  k12: 56.9000,
  k13: 28.6000,
  k14: 0.3000,
  k15: 71.1000,
  k16: 42.8000,
  k17: 14.5000,
  k18: 85.3000,
  k19: 57.0000,
  k20: 28.7000,
  k21: 0.4000,
  k22: 71.2000,
  k23: 42.9000,
  k24: 14.6000,
  k25: 85.4000,
  k26: 57.1000,
  k27: 28.8000,
  k28: 0.5000,
  k29: 71.3000,
  k30: 43.0000,
  k31: 14.7000,
  k32: 85.5000,
  k33: 57.2000,
  k34: 28.9000,
  k35: 0.6000,
  k36: 71.4000,
  k37: 43.1000,
  k38: 14.8000,
  k39: 85.6000,
  k40: 57.3000,
  k41: 29.0000,
  k42: 0.7000,
  k43: 71.5000,
  k44: 43.2000,
  k45: 14.9000,
  k46: 85.7000,
  k47: 57.4000,
  k48: 29.1000,
  k49: 0.8000,
  k50: 71.6000,
  k51: 43.3000,
  k52: 15.0000,
  k53: 85.8000,
  k54: 57.5000,
  k55: 29.2000,
  k56: 0.9000,
  k57: 71.7000,
  k58: 43.4000,
  k59: 15.1000,
  k60: 85.9000,
  k61: 57.6000,
  k62: 29.3000,
  k63: 1.0000,
  k64: 71.8000,
  k65: 43.5000,
  k66: 15.2000,
  k67: 86.0000,
  k68: 57.7000,
  k69: 29.4000,
  k70: 1.1000,
  k71: 71.9000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_055_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_055_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_055_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_055_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_055_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_055_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_055_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_055_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_055_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_055_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_055_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_055_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
