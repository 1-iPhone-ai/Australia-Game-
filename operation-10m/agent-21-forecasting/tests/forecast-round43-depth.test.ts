import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave43ProjectionSyncSelfChecks } from '../forecast-wave43-projection-sync.ts';
import { runAg21IntegrationWave43OriginHandoffSelfChecks } from '../forecast-integration-wave43-origin-handoff.ts';

test('wave 43 projection sync self-checks', () => {
  const failed = runAg21Wave43ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-43 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave43OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
