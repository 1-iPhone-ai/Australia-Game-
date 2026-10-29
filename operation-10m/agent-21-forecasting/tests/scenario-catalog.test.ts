import assert from 'node:assert/strict';
import test from 'node:test';
import { AG21_FORECAST_SCENARIO_CATALOG, lookupAg21Scenario } from '../scenario-catalog.ts';

test('scenario catalog size gate', () => {
  assert.ok(AG21_FORECAST_SCENARIO_CATALOG.length >= 100);
});

test('lookup returns stable narrative', () => {
  const entry = lookupAg21Scenario('ag21_sc_050');
  assert.ok(entry);
  assert.match(entry!.narrative, /non-authoritative|canonical state/i);
});

test('catalog domains cover forecast lab areas', () => {
  const domains = new Set(AG21_FORECAST_SCENARIO_CATALOG.map(s => s.domain));
  assert.ok(domains.has('balance'));
  assert.ok(domains.has('workforce'));
  assert.ok(domains.has('resilience'));
});
