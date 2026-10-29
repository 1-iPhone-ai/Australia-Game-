import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave36ProjectionSyncSelfChecks } from '../forecast-wave36-projection-sync.ts';
import { runAg21IntegrationWave36OriginHandoffSelfChecks } from '../forecast-integration-wave36-origin-handoff.ts';

test('wave 36 projection sync self-checks', () => {
  const failed = runAg21Wave36ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-36 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave36OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
