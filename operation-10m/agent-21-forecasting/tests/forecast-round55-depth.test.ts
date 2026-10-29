import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave55ProjectionSyncSelfChecks } from '../forecast-wave55-projection-sync.ts';
import { runAg21IntegrationWave55OriginHandoffSelfChecks } from '../forecast-integration-wave55-origin-handoff.ts';

test('wave55 projection sync self-checks', () => {
  const failed = runAg21Wave55ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave55 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave55OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
