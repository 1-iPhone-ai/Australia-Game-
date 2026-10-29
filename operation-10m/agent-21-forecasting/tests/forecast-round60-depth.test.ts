import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave60ProjectionSyncSelfChecks } from '../forecast-wave60-projection-sync.ts';
import { runAg21IntegrationWave60OriginHandoffSelfChecks } from '../forecast-integration-wave60-origin-handoff.ts';

test('wave60 projection sync self-checks', () => {
  const failed = runAg21Wave60ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave60 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave60OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
