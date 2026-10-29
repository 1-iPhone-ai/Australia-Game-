import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave22ProjectionSyncSelfChecks } from '../forecast-wave22-projection-sync.ts';
import { runAg21IntegrationWave22OriginHandoffSelfChecks } from '../forecast-integration-wave22-origin-handoff.ts';

test('wave 22 projection sync self-checks', () => {
  const failed = runAg21Wave22ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-22 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave22OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
