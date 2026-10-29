import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave21ProjectionSyncSelfChecks } from '../forecast-wave21-projection-sync.ts';
import { runAg21IntegrationWave21OriginHandoffSelfChecks } from '../forecast-integration-wave21-origin-handoff.ts';

test('wave 21 projection sync self-checks', () => {
  const failed = runAg21Wave21ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-21 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave21OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
