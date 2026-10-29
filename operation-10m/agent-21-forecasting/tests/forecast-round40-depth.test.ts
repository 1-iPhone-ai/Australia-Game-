import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave40ProjectionSyncSelfChecks } from '../forecast-wave40-projection-sync.ts';
import { runAg21IntegrationWave40OriginHandoffSelfChecks } from '../forecast-integration-wave40-origin-handoff.ts';

test('wave 40 projection sync self-checks', () => {
  const failed = runAg21Wave40ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-40 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave40OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
