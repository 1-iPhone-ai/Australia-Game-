import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21CloseoutAttestationSelfChecks } from '../forecast-closeout-attestation.ts';
import { runAg21ExportManifestSelfChecks } from '../forecast-export-manifest.ts';
import { runAg21LabArchiveSealSelfChecks } from '../forecast-lab-archive-seal.ts';

test('closeout attestation self-checks', () => {
  const failed = runAg21CloseoutAttestationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('export manifest self-checks', () => {
  const failed = runAg21ExportManifestSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab archive seal self-checks', () => {
  const failed = runAg21LabArchiveSealSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
