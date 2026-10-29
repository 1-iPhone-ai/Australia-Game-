import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave26ProjectionSyncSelfChecks } from '../forecast-wave26-projection-sync.ts';
import { runAg21IntegrationWave26OriginHandoffSelfChecks } from '../forecast-integration-wave26-origin-handoff.ts';

test('wave 26 projection sync self-checks', () => {
  const failed = runAg21Wave26ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-26 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave26OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
