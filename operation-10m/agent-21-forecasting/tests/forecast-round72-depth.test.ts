import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave72ProjectionSyncSelfChecks } from '../forecast-wave72-projection-sync.ts';
import { runAg21IntegrationWave72OriginHandoffSelfChecks } from '../forecast-integration-wave72-origin-handoff.ts';

test('wave72 projection sync self-checks', () => {
  const failed = runAg21Wave72ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave72 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave72OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
