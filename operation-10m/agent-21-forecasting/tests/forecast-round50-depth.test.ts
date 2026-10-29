import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave50ProjectionSyncSelfChecks } from '../forecast-wave50-projection-sync.ts';
import { runAg21IntegrationWave50OriginHandoffSelfChecks } from '../forecast-integration-wave50-origin-handoff.ts';

test('wave 50 projection sync self-checks', () => {
  const failed = runAg21Wave50ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-50 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave50OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
