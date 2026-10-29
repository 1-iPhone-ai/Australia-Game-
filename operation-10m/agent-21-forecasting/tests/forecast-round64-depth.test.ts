import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave64ProjectionSyncSelfChecks } from '../forecast-wave64-projection-sync.ts';
import { runAg21IntegrationWave64OriginHandoffSelfChecks } from '../forecast-integration-wave64-origin-handoff.ts';

test('wave64 projection sync self-checks', () => {
  const failed = runAg21Wave64ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave64 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave64OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
