import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave54ProjectionSyncSelfChecks } from '../forecast-wave54-projection-sync.ts';
import { runAg21IntegrationWave54OriginHandoffSelfChecks } from '../forecast-integration-wave54-origin-handoff.ts';

test('wave54 projection sync self-checks', () => {
  const failed = runAg21Wave54ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave54 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave54OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
