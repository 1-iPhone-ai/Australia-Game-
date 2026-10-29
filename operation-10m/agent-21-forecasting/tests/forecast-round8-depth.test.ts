import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21PacketValidationSelfChecks } from '../forecast-packet-validation.ts';
import { runAg21OperatorEscalationSelfChecks } from '../forecast-operator-escalation.ts';
import { runAg21LabReplaySeedSelfChecks } from '../forecast-lab-replay-seed.ts';

test('packet validation self-checks', () => {
  const failed = runAg21PacketValidationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('operator escalation self-checks', () => {
  const failed = runAg21OperatorEscalationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab replay seed self-checks', () => {
  const failed = runAg21LabReplaySeedSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
