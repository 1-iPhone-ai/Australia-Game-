import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave44ProjectionSyncSelfChecks } from '../forecast-wave44-projection-sync.ts';
import { runAg21IntegrationWave44OriginHandoffSelfChecks } from '../forecast-integration-wave44-origin-handoff.ts';

test('wave 44 projection sync self-checks', () => {
  const failed = runAg21Wave44ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-44 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave44OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
