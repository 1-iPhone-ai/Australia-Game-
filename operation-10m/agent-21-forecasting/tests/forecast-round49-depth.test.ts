import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave49ProjectionSyncSelfChecks } from '../forecast-wave49-projection-sync.ts';
import { runAg21IntegrationWave49OriginHandoffSelfChecks } from '../forecast-integration-wave49-origin-handoff.ts';

test('wave 49 projection sync self-checks', () => {
  const failed = runAg21Wave49ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-49 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave49OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
