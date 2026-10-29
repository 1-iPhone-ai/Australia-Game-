import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21HandoffReadinessSelfChecks } from '../forecast-handoff-readiness.ts';
import { runAg21OperatorSignoffSelfChecks } from '../forecast-operator-signoff.ts';
import { runAg21LabStagingPacketSelfChecks } from '../forecast-lab-staging-packet.ts';

test('handoff readiness self-checks', () => {
  const failed = runAg21HandoffReadinessSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('operator signoff self-checks', () => {
  const failed = runAg21OperatorSignoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab staging packet self-checks', () => {
  const failed = runAg21LabStagingPacketSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
