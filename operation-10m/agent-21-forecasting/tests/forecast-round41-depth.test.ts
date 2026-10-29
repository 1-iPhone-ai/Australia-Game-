import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave41ProjectionSyncSelfChecks } from '../forecast-wave41-projection-sync.ts';
import { runAg21IntegrationWave41OriginHandoffSelfChecks } from '../forecast-integration-wave41-origin-handoff.ts';

test('wave 41 projection sync self-checks', () => {
  const failed = runAg21Wave41ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-41 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave41OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
