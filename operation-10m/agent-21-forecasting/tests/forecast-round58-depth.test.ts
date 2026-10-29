import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave58ProjectionSyncSelfChecks } from '../forecast-wave58-projection-sync.ts';
import { runAg21IntegrationWave58OriginHandoffSelfChecks } from '../forecast-integration-wave58-origin-handoff.ts';

test('wave58 projection sync self-checks', () => {
  const failed = runAg21Wave58ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave58 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave58OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
