import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave32ProjectionSyncSelfChecks } from '../forecast-wave32-projection-sync.ts';
import { runAg21IntegrationWave32OriginHandoffSelfChecks } from '../forecast-integration-wave32-origin-handoff.ts';

test('wave 32 projection sync self-checks', () => {
  const failed = runAg21Wave32ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-32 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave32OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
