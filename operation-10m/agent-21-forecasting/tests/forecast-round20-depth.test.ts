import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave20ProjectionSyncSelfChecks } from '../forecast-wave20-projection-sync.ts';
import { runAg21IntegrationWave20OriginHandoffSelfChecks } from '../forecast-integration-wave20-origin-handoff.ts';

test('wave 20 projection sync self-checks', () => {
  const failed = runAg21Wave20ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-20 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave20OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
