import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21ManifestConfirmationSelfChecks } from '../forecast-manifest-confirmation.ts';
import { runAg21ArchiveAuditTrailSelfChecks } from '../forecast-archive-audit-trail.ts';
import { runAg21LabRetentionPolicySelfChecks } from '../forecast-lab-retention-policy.ts';

test('manifest confirmation self-checks', () => {
  const failed = runAg21ManifestConfirmationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('archive audit trail self-checks', () => {
  const failed = runAg21ArchiveAuditTrailSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab retention policy self-checks', () => {
  const failed = runAg21LabRetentionPolicySelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
