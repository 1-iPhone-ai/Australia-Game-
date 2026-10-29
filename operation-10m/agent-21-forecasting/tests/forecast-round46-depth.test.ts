import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave46ProjectionSyncSelfChecks } from '../forecast-wave46-projection-sync.ts';
import { runAg21IntegrationWave46OriginHandoffSelfChecks } from '../forecast-integration-wave46-origin-handoff.ts';

test('wave 46 projection sync self-checks', () => {
  const failed = runAg21Wave46ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-46 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave46OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
