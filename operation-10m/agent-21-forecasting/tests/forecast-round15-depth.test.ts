import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21GovernanceRemediationPlanSelfChecks } from '../forecast-governance-remediation-plan.ts';
import { runAg21OriginGateAttestationSelfChecks } from '../forecast-origin-gate-attestation.ts';
import { runAg21LabContinuityVerdictSelfChecks } from '../forecast-lab-continuity-verdict.ts';

test('governance remediation plan self-checks', () => {
  const failed = runAg21GovernanceRemediationPlanSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('origin gate attestation self-checks', () => {
  const failed = runAg21OriginGateAttestationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab continuity verdict self-checks', () => {
  const failed = runAg21LabContinuityVerdictSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
