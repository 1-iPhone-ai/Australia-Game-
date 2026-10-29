import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave67ProjectionSyncSelfChecks } from '../forecast-wave67-projection-sync.ts';
import { runAg21IntegrationWave67OriginHandoffSelfChecks } from '../forecast-integration-wave67-origin-handoff.ts';

test('wave67 projection sync self-checks', () => {
  const failed = runAg21Wave67ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave67 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave67OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
