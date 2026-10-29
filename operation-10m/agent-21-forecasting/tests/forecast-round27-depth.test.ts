import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave27ProjectionSyncSelfChecks } from '../forecast-wave27-projection-sync.ts';
import { runAg21IntegrationWave27OriginHandoffSelfChecks } from '../forecast-integration-wave27-origin-handoff.ts';

test('wave 27 projection sync self-checks', () => {
  const failed = runAg21Wave27ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-27 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave27OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
