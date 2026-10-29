import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave19ProjectionSyncSelfChecks } from '../forecast-wave19-projection-sync.ts';
import { runAg21IntegrationWave19OriginHandoffSelfChecks } from '../forecast-integration-wave19-origin-handoff.ts';

test('wave 19 projection sync self-checks', () => {
  const failed = runAg21Wave19ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-19 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave19OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
