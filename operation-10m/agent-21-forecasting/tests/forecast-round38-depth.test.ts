import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave38ProjectionSyncSelfChecks } from '../forecast-wave38-projection-sync.ts';
import { runAg21IntegrationWave38OriginHandoffSelfChecks } from '../forecast-integration-wave38-origin-handoff.ts';

test('wave 38 projection sync self-checks', () => {
  const failed = runAg21Wave38ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-38 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave38OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
