import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave63ProjectionSyncSelfChecks } from '../forecast-wave63-projection-sync.ts';
import { runAg21IntegrationWave63OriginHandoffSelfChecks } from '../forecast-integration-wave63-origin-handoff.ts';

test('wave63 projection sync self-checks', () => {
  const failed = runAg21Wave63ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave63 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave63OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
