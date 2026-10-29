import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave29ProjectionSyncSelfChecks } from '../forecast-wave29-projection-sync.ts';
import { runAg21IntegrationWave29OriginHandoffSelfChecks } from '../forecast-integration-wave29-origin-handoff.ts';

test('wave 29 projection sync self-checks', () => {
  const failed = runAg21Wave29ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-29 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave29OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
