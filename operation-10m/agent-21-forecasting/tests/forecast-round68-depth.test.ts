import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave68ProjectionSyncSelfChecks } from '../forecast-wave68-projection-sync.ts';
import { runAg21IntegrationWave68OriginHandoffSelfChecks } from '../forecast-integration-wave68-origin-handoff.ts';

test('wave68 projection sync self-checks', () => {
  const failed = runAg21Wave68ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave68 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave68OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
