import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave75ProjectionSyncSelfChecks } from '../forecast-wave75-projection-sync.ts';
import { runAg21IntegrationWave75OriginHandoffSelfChecks } from '../forecast-integration-wave75-origin-handoff.ts';

test('wave75 projection sync self-checks', () => {
  const failed = runAg21Wave75ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave75 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave75OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
