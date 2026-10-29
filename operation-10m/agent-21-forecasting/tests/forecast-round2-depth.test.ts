import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21ForecastAuditSelfChecks } from '../forecast-audit-ledger.ts';
import { runAg21DomainStressMatrixSelfChecks } from '../forecast-domain-matrix.ts';
import { runAg21PolicySensitivitySelfChecks } from '../forecast-policy-sensitivity.ts';

test('policy sensitivity self-checks', () => {
  const failed = runAg21PolicySensitivitySelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('domain stress matrix self-checks', () => {
  const failed = runAg21DomainStressMatrixSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('forecast audit ledger self-checks', () => {
  const failed = runAg21ForecastAuditSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
