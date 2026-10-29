import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave65ProjectionSyncSelfChecks } from '../forecast-wave65-projection-sync.ts';
import { runAg21IntegrationWave65OriginHandoffSelfChecks } from '../forecast-integration-wave65-origin-handoff.ts';

test('wave65 projection sync self-checks', () => {
  const failed = runAg21Wave65ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave65 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave65OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
