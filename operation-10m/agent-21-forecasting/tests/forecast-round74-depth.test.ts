import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave74ProjectionSyncSelfChecks } from '../forecast-wave74-projection-sync.ts';
import { runAg21IntegrationWave74OriginHandoffSelfChecks } from '../forecast-integration-wave74-origin-handoff.ts';

test('wave74 projection sync self-checks', () => {
  const failed = runAg21Wave74ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});

test('wave74 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave74OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.detail).join('; '));
});
