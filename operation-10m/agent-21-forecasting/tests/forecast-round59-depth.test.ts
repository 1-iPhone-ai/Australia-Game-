import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave59ProjectionSyncSelfChecks } from '../forecast-wave59-projection-sync.ts';
import { runAg21IntegrationWave59OriginHandoffSelfChecks } from '../forecast-integration-wave59-origin-handoff.ts';

test('wave59 projection sync self-checks', () => {
  const failed = runAg21Wave59ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave59 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave59OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
