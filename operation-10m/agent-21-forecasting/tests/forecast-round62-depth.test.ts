import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave62ProjectionSyncSelfChecks } from '../forecast-wave62-projection-sync.ts';
import { runAg21IntegrationWave62OriginHandoffSelfChecks } from '../forecast-integration-wave62-origin-handoff.ts';

test('wave62 projection sync self-checks', () => {
  const failed = runAg21Wave62ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave62 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave62OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
