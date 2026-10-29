import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave25ProjectionSyncSelfChecks } from '../forecast-wave25-projection-sync.ts';
import { runAg21IntegrationWave25OriginHandoffSelfChecks } from '../forecast-integration-wave25-origin-handoff.ts';

test('wave 25 projection sync self-checks', () => {
  const failed = runAg21Wave25ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-25 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave25OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
