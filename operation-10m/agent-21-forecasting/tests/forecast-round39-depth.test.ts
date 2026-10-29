import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave39ProjectionSyncSelfChecks } from '../forecast-wave39-projection-sync.ts';
import { runAg21IntegrationWave39OriginHandoffSelfChecks } from '../forecast-integration-wave39-origin-handoff.ts';

test('wave 39 projection sync self-checks', () => {
  const failed = runAg21Wave39ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-39 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave39OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
