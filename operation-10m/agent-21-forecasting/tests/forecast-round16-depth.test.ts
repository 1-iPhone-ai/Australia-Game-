import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21FullChunksDryRunReadinessSelfChecks } from '../forecast-full-chunks-dry-run-readiness.ts';
import { runAg21Wave16ProjectionSyncSelfChecks } from '../forecast-wave16-projection-sync.ts';
import { runAg21IntegrationDryRunAttestationSelfChecks } from '../forecast-integration-dry-run-attestation.ts';

test('full-chunks dry-run readiness self-checks', () => {
  const failed = runAg21FullChunksDryRunReadinessSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('wave 16 projection sync self-checks', () => {
  const failed = runAg21Wave16ProjectionSyncSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('integration dry-run attestation self-checks', () => {
  const failed = runAg21IntegrationDryRunAttestationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
