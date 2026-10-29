import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave61ProjectionSyncSelfChecks } from '../forecast-wave61-projection-sync.ts';
import { runAg21IntegrationWave61OriginHandoffSelfChecks } from '../forecast-integration-wave61-origin-handoff.ts';

test('wave61 projection sync self-checks', () => {
  const failed = runAg21Wave61ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave61 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave61OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
