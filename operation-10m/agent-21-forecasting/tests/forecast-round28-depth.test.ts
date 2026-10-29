import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave28ProjectionSyncSelfChecks } from '../forecast-wave28-projection-sync.ts';
import { runAg21IntegrationWave28OriginHandoffSelfChecks } from '../forecast-integration-wave28-origin-handoff.ts';

test('wave 28 projection sync self-checks', () => {
  const failed = runAg21Wave28ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-28 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave28OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
