import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave31ProjectionSyncSelfChecks } from '../forecast-wave31-projection-sync.ts';
import { runAg21IntegrationWave31OriginHandoffSelfChecks } from '../forecast-integration-wave31-origin-handoff.ts';

test('wave 31 projection sync self-checks', () => {
  const failed = runAg21Wave31ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-31 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave31OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
