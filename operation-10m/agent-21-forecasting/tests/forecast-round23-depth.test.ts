import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave23ProjectionSyncSelfChecks } from '../forecast-wave23-projection-sync.ts';
import { runAg21IntegrationWave23OriginHandoffSelfChecks } from '../forecast-integration-wave23-origin-handoff.ts';

test('wave 23 projection sync self-checks', () => {
  const failed = runAg21Wave23ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-23 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave23OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
