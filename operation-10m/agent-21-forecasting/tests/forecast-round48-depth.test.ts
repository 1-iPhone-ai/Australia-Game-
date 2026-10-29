import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave48ProjectionSyncSelfChecks } from '../forecast-wave48-projection-sync.ts';
import { runAg21IntegrationWave48OriginHandoffSelfChecks } from '../forecast-integration-wave48-origin-handoff.ts';

test('wave 48 projection sync self-checks', () => {
  const failed = runAg21Wave48ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-48 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave48OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
