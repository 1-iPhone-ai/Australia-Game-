import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave47ProjectionSyncSelfChecks } from '../forecast-wave47-projection-sync.ts';
import { runAg21IntegrationWave47OriginHandoffSelfChecks } from '../forecast-integration-wave47-origin-handoff.ts';

test('wave 47 projection sync self-checks', () => {
  const failed = runAg21Wave47ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-47 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave47OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
