import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave37ProjectionSyncSelfChecks } from '../forecast-wave37-projection-sync.ts';
import { runAg21IntegrationWave37OriginHandoffSelfChecks } from '../forecast-integration-wave37-origin-handoff.ts';

test('wave 37 projection sync self-checks', () => {
  const failed = runAg21Wave37ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-37 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave37OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
