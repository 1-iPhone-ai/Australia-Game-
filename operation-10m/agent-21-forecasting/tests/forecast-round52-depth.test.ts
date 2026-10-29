import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave52ProjectionSyncSelfChecks } from '../forecast-wave52-projection-sync.ts';
import { runAg21IntegrationWave52OriginHandoffSelfChecks } from '../forecast-integration-wave52-origin-handoff.ts';

test('wave52 projection sync self-checks', () => {
  const failed = runAg21Wave52ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave52 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave52OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
