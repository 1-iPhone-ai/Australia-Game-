import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave30ProjectionSyncSelfChecks } from '../forecast-wave30-projection-sync.ts';
import { runAg21IntegrationWave30OriginHandoffSelfChecks } from '../forecast-integration-wave30-origin-handoff.ts';

test('wave 30 projection sync self-checks', () => {
  const failed = runAg21Wave30ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-30 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave30OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
