import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave33ProjectionSyncSelfChecks } from '../forecast-wave33-projection-sync.ts';
import { runAg21IntegrationWave33OriginHandoffSelfChecks } from '../forecast-integration-wave33-origin-handoff.ts';

test('wave 33 projection sync self-checks', () => {
  const failed = runAg21Wave33ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-33 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave33OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
