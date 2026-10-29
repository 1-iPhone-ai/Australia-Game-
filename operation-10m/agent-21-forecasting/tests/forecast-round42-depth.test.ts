import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave42ProjectionSyncSelfChecks } from '../forecast-wave42-projection-sync.ts';
import { runAg21IntegrationWave42OriginHandoffSelfChecks } from '../forecast-integration-wave42-origin-handoff.ts';

test('wave 42 projection sync self-checks', () => {
  const failed = runAg21Wave42ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-42 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave42OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
