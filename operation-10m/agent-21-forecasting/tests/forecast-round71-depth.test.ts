import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave71ProjectionSyncSelfChecks } from '../forecast-wave71-projection-sync.ts';
import { runAg21IntegrationWave71OriginHandoffSelfChecks } from '../forecast-integration-wave71-origin-handoff.ts';

test('wave71 projection sync self-checks', () => {
  const failed = runAg21Wave71ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave71 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave71OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
