import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21CalibrationDriftSelfChecks } from '../forecast-calibration-drift.ts';
import { runAg21EnsembleProjectionSelfChecks } from '../forecast-ensemble-projection.ts';
import { runAg21TrajectoryFusionSelfChecks } from '../forecast-trajectory-fusion.ts';

test('ensemble projection self-checks', () => {
  const failed = runAg21EnsembleProjectionSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('calibration drift self-checks', () => {
  const failed = runAg21CalibrationDriftSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('trajectory fusion self-checks', () => {
  const failed = runAg21TrajectoryFusionSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
