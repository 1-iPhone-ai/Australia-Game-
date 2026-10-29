import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave53ProjectionSyncSelfChecks } from '../forecast-wave53-projection-sync.ts';
import { runAg21IntegrationWave53OriginHandoffSelfChecks } from '../forecast-integration-wave53-origin-handoff.ts';

test('wave53 projection sync self-checks', () => {
  const failed = runAg21Wave53ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave53 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave53OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
