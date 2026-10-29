import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21EnsembleConvergenceSelfChecks } from '../forecast-ensemble-convergence.ts';
import { runAg21PlayerBriefSelfChecks } from '../forecast-player-brief.ts';
import { runAg21LabPlaybookSelfChecks } from '../forecast-lab-playbook.ts';

test('ensemble convergence self-checks', () => {
  const failed = runAg21EnsembleConvergenceSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('player brief self-checks', () => {
  const failed = runAg21PlayerBriefSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lab playbook self-checks', () => {
  const failed = runAg21LabPlaybookSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
