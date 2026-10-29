import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  O10M_AGENT21_MODULE_ID
} from '../isolation-core.ts';

test('O10M Agent 21 module id', () => {
  assert.equal(O10M_AGENT21_MODULE_ID, 'forecasting_policy_lab');
});

test('isolated experiment preserves authoritative fingerprint', () => {
  const subject = { turn: 2, cash: 100 };
  const before = ag21FingerprintSnapshot(subject);
  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    copy.cash = 999;
    return copy.cash;
  });
  assert.equal(iso.ok, true);
  assert.equal(ag21FingerprintSnapshot(subject), before);
});

test('uncertainty labels are non-authoritative', () => {
  const label = ag21LabelUncertainty('moderate', ['seed=1']);
  assert.match(label.playerFacing, /Non-authoritative/);
});
