import { V1024_DGOV_clamp, V1024_DGOV_governanceBandFromScore } from '../../engine/digital-governance-utils.ts';
import type {
  V1024DgovGovernanceBand,
  V1024DgovRegionId,
  V1024DgovPolicySnapshot,
  V1024DgovGovernanceChannel,
} from '../../types/core.ts';

/** Generated policy scenario 166 — residency/liability/audit handoff matrix. */
export const V1024_DGOV_POLICY_SCENARIO_166_META = {
  id: 'stress_166',
  regionId: 'NT' as V1024DgovRegionId,
  primaryChannel: 'critical_infra' as V1024DgovGovernanceChannel,
  governanceBand: 'moderate' as V1024DgovGovernanceBand,
  seed: 151747,
} as const;

const V1024_DGOV_POLICY_SCENARIO_166_COEF = {
  k0: 23.9000,
  k1: 44.2000,
  k2: 64.5000,
  k3: 84.8000,
  k4: 5.4000,
  k5: 25.7000,
  k6: 46.0000,
  k7: 66.3000,
  k8: 86.6000,
  k9: 7.2000,
  k10: 27.5000,
  k11: 47.8000,
  k12: 68.1000,
  k13: 88.4000,
  k14: 9.0000,
  k15: 29.3000,
  k16: 49.6000,
  k17: 69.9000,
  k18: 90.2000,
  k19: 10.8000,
  k20: 31.1000,
  k21: 51.4000,
  k22: 71.7000,
  k23: 92.0000,
  k24: 12.6000,
  k25: 32.9000,
  k26: 53.2000,
  k27: 73.5000,
  k28: 93.8000,
  k29: 14.4000,
  k30: 34.7000,
  k31: 55.0000,
  k32: 75.3000,
  k33: 95.6000,
  k34: 16.2000,
  k35: 36.5000,
  k36: 56.8000,
  k37: 77.1000,
  k38: 97.4000,
  k39: 18.0000,
  k40: 38.3000,
  k41: 58.6000,
  k42: 78.9000,
  k43: 99.2000,
  k44: 19.8000,
  k45: 40.1000,
  k46: 60.4000,
  k47: 80.7000,
  k48: 1.3000,
  k49: 21.6000,
  k50: 41.9000,
  k51: 62.2000,
  k52: 82.5000,
  k53: 3.1000,
  k54: 23.4000,
  k55: 43.7000,
  k56: 64.0000,
  k57: 84.3000,
  k58: 4.9000,
  k59: 25.2000,
  k60: 45.5000,
  k61: 65.8000,
  k62: 86.1000,
  k63: 6.7000,
  k64: 27.0000,
  k65: 47.3000,
  k66: 67.6000,
  k67: 87.9000,
  k68: 8.5000,
  k69: 28.8000,
  k70: 49.1000,
  k71: 69.4000,
} as const;

export function V1024_DGOV_POLICY_SCENARIO_166_evaluate(turn: number): {
  complianceStressIndex: number;
  dataSovereigntyDelayTurns: number;
  governanceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1024_DGOV_POLICY_SCENARIO_166_COEF) as Array<
    keyof typeof V1024_DGOV_POLICY_SCENARIO_166_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1024_DGOV_POLICY_SCENARIO_166_COEF[keys[j]] * ((turn + j) % 17);
  }
  const complianceStressIndex = V1024_DGOV_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const dataSovereigntyDelayTurns = V1024_DGOV_clamp(2 + (acc % 11), 1, 18);
  const governanceScore = V1024_DGOV_clamp(90 - complianceStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1024_DGOV_governanceBandFromScore(governanceScore) !== 'fragile';
  return { complianceStressIndex, dataSovereigntyDelayTurns, governanceScore, stable };
}

export function V1024_DGOV_POLICY_SCENARIO_166_snapshot(turn: number): V1024DgovPolicySnapshot {
  const r = V1024_DGOV_POLICY_SCENARIO_166_evaluate(turn);
  return {
    scenarioId: V1024_DGOV_POLICY_SCENARIO_166_META.id,
    regionId: V1024_DGOV_POLICY_SCENARIO_166_META.regionId,
    governanceChannel: V1024_DGOV_POLICY_SCENARIO_166_META.primaryChannel,
    governanceBand: V1024_DGOV_POLICY_SCENARIO_166_META.governanceBand,
    complianceStressIndex: r.complianceStressIndex,
    dataSovereigntyDelayTurns: r.dataSovereigntyDelayTurns,
    governanceScore: r.governanceScore,
    governanceBand: V1024_DGOV_governanceBandFromScore(r.governanceScore),
  };
}

export function V1024_DGOV_POLICY_SCENARIO_166_regressionAssert(turn: number): boolean {
  const r = V1024_DGOV_POLICY_SCENARIO_166_evaluate(turn);
  return typeof r.complianceStressIndex === 'number' && r.governanceScore <= 100;
}
