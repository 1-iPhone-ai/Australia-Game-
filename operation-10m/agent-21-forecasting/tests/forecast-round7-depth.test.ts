import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21SurfaceDecisionSelfChecks } from '../forecast-surface-decision.ts';
import { runAg21LabTelemetrySelfChecks } from '../forecast-lab-telemetry.ts';
import { runAg21CrosslinkPacketSelfChecks } from '../forecast-crosslink-packet.ts';

test('surface decision self-checks', () => {
  const failed = runAg21SurfaceDecisionSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab telemetry self-checks', () => {
  const failed = runAg21LabTelemetrySelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('crosslink packet self-checks', () => {
  const failed = runAg21CrosslinkPacketSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
