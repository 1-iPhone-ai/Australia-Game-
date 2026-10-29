import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave69ProjectionSyncSelfChecks } from '../forecast-wave69-projection-sync.ts';
import { runAg21IntegrationWave69OriginHandoffSelfChecks } from '../forecast-integration-wave69-origin-handoff.ts';

test('wave69 projection sync self-checks', () => {
  const failed = runAg21Wave69ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave69 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave69OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
