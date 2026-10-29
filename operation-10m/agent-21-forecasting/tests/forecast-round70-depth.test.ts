import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave70ProjectionSyncSelfChecks } from '../forecast-wave70-projection-sync.ts';
import { runAg21IntegrationWave70OriginHandoffSelfChecks } from '../forecast-integration-wave70-origin-handoff.ts';

test('wave70 projection sync self-checks', () => {
  const failed = runAg21Wave70ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave70 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave70OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
