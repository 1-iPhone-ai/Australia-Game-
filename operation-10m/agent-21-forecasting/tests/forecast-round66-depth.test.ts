import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave66ProjectionSyncSelfChecks } from '../forecast-wave66-projection-sync.ts';
import { runAg21IntegrationWave66OriginHandoffSelfChecks } from '../forecast-integration-wave66-origin-handoff.ts';

test('wave66 projection sync self-checks', () => {
  const failed = runAg21Wave66ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave66 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave66OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
