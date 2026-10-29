import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21FullChunksDryRunExecutionSelfChecks } from '../forecast-full-chunks-dry-run-execution.ts';
import { runAg21Wave17ProjectionSyncSelfChecks } from '../forecast-wave17-projection-sync.ts';
import { runAg21IntegrationDryRunClosureSelfChecks } from '../forecast-integration-dry-run-closure.ts';

test('full-chunks dry-run execution self-checks', () => {
  const failed = runAg21FullChunksDryRunExecutionSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('wave 17 projection sync self-checks', () => {
  const failed = runAg21Wave17ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration dry-run closure self-checks', () => {
  const failed = runAg21IntegrationDryRunClosureSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
