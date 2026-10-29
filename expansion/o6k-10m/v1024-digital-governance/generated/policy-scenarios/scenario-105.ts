import { V1024_DGOV_clamp, V1024_DGOV_governanceBandFromScore } from '../../engine/digital-governance-utils.ts';
import type {
  V1024DgovGovernanceBand,
  V1024DgovRegionId,
  V1024DgovPolicySnapshot,
  V1024DgovGovernanceChannel,
} from '../../types/core.ts';

/** Generated policy scenario 105 — residency/liability/audit handoff matrix. */
export const V1024_DGOV_POLICY_SCENARIO_105_META = {
  id: 'stress_105',
  regionId: 'VIC' as V1024DgovRegionId,
  primaryChannel: 'open_banking' as V1024DgovGovernanceChannel,
  governanceBand: 'minimal' as V1024DgovGovernanceBand,
  seed: 96176,
} as const;

const V1024_DGOV_POLICY_SCENARIO_105_COEF = {
  k0: 11.9000,
  k1: 58.3000,
  k2: 5.0000,
  k3: 51.4000,
  k4: 97.8000,
  k5: 44.5000,
  k6: 90.9000,
  k7: 37.6000,
  k8: 84.0000,
  k9: 30.7000,
  k10: 77.1000,
  k11: 23.8000,
  k12: 70.2000,
  k13: 16.9000,
  k14: 63.3000,
  k15: 10.0000,
  k16: 56.4000,
  k17: 3.1000,
  k18: 49.5000,
  k19: 95.9000,
  k20: 42.6000,
  k21: 89.0000,
  k22: 35.7000,
  k23: 82.1000,
  k24: 28.8000,
  k25: 75.2000,
  k26: 21.9000,
  k27: 68.3000,
  k28: 15.0000,
  k29: 61.4000,
  k30: 8.1000,
  k31: 54.5000,
  k32: 1.2000,
  k33: 47.6000,
  k34: 94.0000,
  k35: 40.7000,
  k36: 87.1000,
  k37: 33.8000,
  k38: 80.2000,
  k39: 26.9000,
  k40: 73.3000,
  k41: 20.0000,
  k42: 66.4000,
  k43: 13.1000,
  k44: 59.5000,
  k45: 6.2000,
  k46: 52.6000,
  k47: 99.0000,
  k48: 45.7000,
  k49: 92.1000,
  k50: 38.8000,
  k51: 85.2000,
  k52: 31.9000,
  k53: 78.3000,
  k54: 25.0000,
  k55: 71.4000,
  k56: 18.1000,
  k57: 64.5000,
  k58: 11.2000,
  k59: 57.6000,
  k60: 4.3000,
  k61: 50.7000,
  k62: 97.1000,
  k63: 43.8000,
  k64: 90.2000,
  k65: 36.9000,
  k66: 83.3000,
  k67: 30.0000,
  k68: 76.4000,
  k69: 23.1000,
  k70: 69.5000,
  k71: 16.2000,
} as const;

export function V1024_DGOV_POLICY_SCENARIO_105_evaluate(turn: number): {
  complianceStressIndex: number;
  dataSovereigntyDelayTurns: number;
  governanceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1024_DGOV_POLICY_SCENARIO_105_COEF) as Array<
    keyof typeof V1024_DGOV_POLICY_SCENARIO_105_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1024_DGOV_POLICY_SCENARIO_105_COEF[keys[j]] * ((turn + j) % 17);
  }
  const complianceStressIndex = V1024_DGOV_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const dataSovereigntyDelayTurns = V1024_DGOV_clamp(2 + (acc % 11), 1, 18);
  const governanceScore = V1024_DGOV_clamp(90 - complianceStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1024_DGOV_governanceBandFromScore(governanceScore) !== 'fragile';
  return { complianceStressIndex, dataSovereigntyDelayTurns, governanceScore, stable };
}

export function V1024_DGOV_POLICY_SCENARIO_105_snapshot(turn: number): V1024DgovPolicySnapshot {
  const r = V1024_DGOV_POLICY_SCENARIO_105_evaluate(turn);
  return {
    scenarioId: V1024_DGOV_POLICY_SCENARIO_105_META.id,
    regionId: V1024_DGOV_POLICY_SCENARIO_105_META.regionId,
    governanceChannel: V1024_DGOV_POLICY_SCENARIO_105_META.primaryChannel,
    governanceBand: V1024_DGOV_POLICY_SCENARIO_105_META.governanceBand,
    complianceStressIndex: r.complianceStressIndex,
    dataSovereigntyDelayTurns: r.dataSovereigntyDelayTurns,
    governanceScore: r.governanceScore,
    governanceBand: V1024_DGOV_governanceBandFromScore(r.governanceScore),
  };
}

export function V1024_DGOV_POLICY_SCENARIO_105_regressionAssert(turn: number): boolean {
  const r = V1024_DGOV_POLICY_SCENARIO_105_evaluate(turn);
  return typeof r.complianceStressIndex === 'number' && r.governanceScore <= 100;
}
