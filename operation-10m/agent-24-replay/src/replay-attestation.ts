import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayAnalyticsDepth } from './analytics-depth.ts';
import type { Agent24ReplayScenarioSuiteResult } from './replay-scenarios.ts';
import type { Agent24MultiSessionContinuity } from './multi-session.ts';
import type { Agent24CausalRecordIndex } from './causal-records.ts';
import type { Agent24AuditTrail } from './audit-trails.ts';
import type { O6kHistoricalAnalyticsSnapshot } from './history-replay-analytics.ts';

export interface Agent24ReplayAttestationInput {
  twinBuildPassed: boolean;
  compositeFingerprint: string;
  snapshot: O6kHistoricalAnalyticsSnapshot;
  causalIndex: Agent24CausalRecordIndex;
  auditTrail: Agent24AuditTrail;
  multiSession: Agent24MultiSessionContinuity;
  analyticsDepth: Agent24ReplayAnalyticsDepth;
  scenarioSuite: Agent24ReplayScenarioSuiteResult;
}

export type Agent24AttestationStatus = 'verified' | 'degraded' | 'failed';

export interface Agent24ReplayAttestation {
  attestationId: string;
  matchId: string;
  turn: number;
  status: Agent24AttestationStatus;
  twinBuildPassed: boolean;
  integrityScore: number;
  scenarioSatisfiedRatio: number;
  resumeSafe: boolean;
  chainRoot: string;
  chainTip: string;
  deterministicFingerprint: string;
}

function ratio(n: number, d: number): number {
  if (d <= 0) return 0;
  return Math.round((n / d) * 100) / 100;
}

export function buildAgent24ReplayAttestation(bundle: Agent24ReplayAttestationInput): Agent24ReplayAttestation {
  const satisfied = bundle.scenarioSuite.satisfiedCount;
  const total = bundle.scenarioSuite.assessments.length;
  const scenarioSatisfiedRatio = ratio(satisfied, total);
  let status: Agent24AttestationStatus = 'verified';
  if (!bundle.twinBuildPassed) status = 'failed';
  else if (bundle.analyticsDepth.integrityScore < 70 || !bundle.multiSession.resumeSafe) status = 'degraded';

  const chainLinks = [
    bundle.snapshot.integrity.fingerprint,
    bundle.causalIndex.deterministicFingerprint,
    bundle.auditTrail.deterministicFingerprint,
    bundle.multiSession.deterministicFingerprint,
    bundle.compositeFingerprint,
  ];
  const chainRoot = chainLinks[0];
  let chainTip = chainRoot;
  for (let i = 1; i < chainLinks.length; i++) {
    chainTip = o6kAgent24Fingerprint('attest_link', { prev: chainTip, next: chainLinks[i] });
  }

  const payload = {
    status,
    twin: bundle.twinBuildPassed,
    integrityScore: bundle.analyticsDepth.integrityScore,
    scenarioSatisfiedRatio,
    resumeSafe: bundle.multiSession.resumeSafe,
    chainTip,
  };

  return {
    attestationId: o6kAgent24Fingerprint('replay_attestation', { matchId: bundle.snapshot.matchId, turn: bundle.snapshot.generatedAtTurn }),
    matchId: bundle.snapshot.matchId,
    turn: bundle.snapshot.generatedAtTurn,
    status,
    twinBuildPassed: bundle.twinBuildPassed,
    integrityScore: bundle.analyticsDepth.integrityScore,
    scenarioSatisfiedRatio,
    resumeSafe: bundle.multiSession.resumeSafe,
    chainRoot,
    chainTip,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_attestation_body', payload),
  };
}

export function runAgent24AttestationSelfTests(): Array<{ name: string; passed: boolean; detail: string }> {
  return [
    {
      name: 'attestation_ratio_bounds',
      passed: ratio(2, 5) === 0.4 && ratio(0, 0) === 0,
      detail: 'ratio helper',
    },
  ];
}
