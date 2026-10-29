import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave57ProjectionSyncSelfChecks } from '../forecast-wave57-projection-sync.ts';
import { runAg21IntegrationWave57OriginHandoffSelfChecks } from '../forecast-integration-wave57-origin-handoff.ts';

test('wave57 projection sync self-checks', () => {
  const failed = runAg21Wave57ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave57 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave57OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
