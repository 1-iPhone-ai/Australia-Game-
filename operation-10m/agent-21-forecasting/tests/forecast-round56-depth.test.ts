import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave56ProjectionSyncSelfChecks } from '../forecast-wave56-projection-sync.ts';
import { runAg21IntegrationWave56OriginHandoffSelfChecks } from '../forecast-integration-wave56-origin-handoff.ts';

test('wave56 projection sync self-checks', () => {
  const failed = runAg21Wave56ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave56 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave56OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
