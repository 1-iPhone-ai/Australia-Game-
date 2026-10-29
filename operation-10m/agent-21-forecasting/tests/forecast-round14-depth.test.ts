import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21RetentionComplianceSelfChecks } from '../forecast-retention-compliance.ts';
import { runAg21ArchiveAuditRollupSelfChecks } from '../forecast-archive-audit-rollup.ts';
import { runAg21LabGovernanceCheckpointSelfChecks } from '../forecast-lab-governance-checkpoint.ts';

test('retention compliance self-checks', () => {
  const failed = runAg21RetentionComplianceSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('archive audit rollup self-checks', () => {
  const failed = runAg21ArchiveAuditRollupSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab governance checkpoint self-checks', () => {
  const failed = runAg21LabGovernanceCheckpointSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
