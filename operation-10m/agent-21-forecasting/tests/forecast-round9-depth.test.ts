import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21ReplayCoherenceSelfChecks } from '../forecast-replay-coherence.ts';
import { runAg21EscalationRunbookSelfChecks } from '../forecast-escalation-runbook.ts';
import { runAg21LabIntegrationHandoffSelfChecks } from '../forecast-lab-integration-handoff.ts';

test('replay coherence self-checks', () => {
  const failed = runAg21ReplayCoherenceSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('escalation runbook self-checks', () => {
  const failed = runAg21EscalationRunbookSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab integration handoff self-checks', () => {
  const failed = runAg21LabIntegrationHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
