import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21Wave34ProjectionSyncSelfChecks } from '../forecast-wave34-projection-sync.ts';
import { runAg21IntegrationWave34OriginHandoffSelfChecks } from '../forecast-integration-wave34-origin-handoff.ts';

test('wave 34 projection sync self-checks', () => {
  const failed = runAg21Wave34ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration wave-34 origin handoff self-checks', () => {
  const failed = runAg21IntegrationWave34OriginHandoffSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
