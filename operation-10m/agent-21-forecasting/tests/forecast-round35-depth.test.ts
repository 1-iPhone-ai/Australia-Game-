import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave35ProjectionSyncSelfChecks } from '../forecast-wave35-projection-sync.ts';
import { runAg21IntegrationWave35OriginHandoffSelfChecks } from '../forecast-integration-wave35-origin-handoff.ts';

test('wave 35 projection sync self-checks', () => {
  const failed = runAg21Wave35ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-35 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave35OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
