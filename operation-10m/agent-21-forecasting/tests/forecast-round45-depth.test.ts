import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave45ProjectionSyncSelfChecks } from '../forecast-wave45-projection-sync.ts';
import { runAg21IntegrationWave45OriginHandoffSelfChecks } from '../forecast-integration-wave45-origin-handoff.ts';

test('wave 45 projection sync self-checks', () => {
  const failed = runAg21Wave45ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-45 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave45OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
