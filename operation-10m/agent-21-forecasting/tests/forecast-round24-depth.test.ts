import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave24ProjectionSyncSelfChecks } from '../forecast-wave24-projection-sync.ts';
import { runAg21IntegrationWave24OriginHandoffSelfChecks } from '../forecast-integration-wave24-origin-handoff.ts';

test('wave 24 projection sync self-checks', () => {
  const failed = runAg21Wave24ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-24 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave24OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
