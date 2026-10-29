import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave18ProjectionSyncSelfChecks } from '../forecast-wave18-projection-sync.ts';
import { runAg21IntegrationWave18OriginHandoffSelfChecks } from '../forecast-integration-wave18-origin-handoff.ts';

test('wave 18 projection sync self-checks', () => {
  const failed = runAg21Wave18ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-18 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave18OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
