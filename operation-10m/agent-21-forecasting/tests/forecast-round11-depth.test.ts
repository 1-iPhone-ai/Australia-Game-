import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21StagingVerificationSelfChecks } from '../forecast-staging-verification.ts';
import { runAg21ExportClearanceSelfChecks } from '../forecast-export-clearance.ts';
import { runAg21LabCycleCloseoutSelfChecks } from '../forecast-lab-cycle-closeout.ts';

test('staging verification self-checks', () => {
  const failed = runAg21StagingVerificationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('export clearance self-checks', () => {
  const failed = runAg21ExportClearanceSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab cycle closeout self-checks', () => {
  const failed = runAg21LabCycleCloseoutSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
