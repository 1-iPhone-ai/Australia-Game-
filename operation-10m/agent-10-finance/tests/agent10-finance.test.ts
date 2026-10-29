import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENT10_GLOSSARY_ENTRIES,
  macroInflationMayUseCommodityPrices,
} from '../src/definitions/glossary.js';
import {
  integrationNoteNonCpiBoundary,
  macroInflationMayUseCommodityPrices,
  applyResourcePricePressure,
  baseResourceMarketPrice,
  clampResourcePricePressure,
} from '../src/prices/boundary.js';
import { V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS, V1014_FINSTAB_REGION_CREDIT_PROFILE } from '../src/definitions/constants.js';
import { bandCredit, bandInflation } from '../src/credit/bands.js';
import { computeActorCreditStressIndex } from '../src/credit/actor-leverage.js';
import { referencePolicyRate } from '../src/rates/reference-rate.js';
import { FINANCIAL_SHOCK_CATALOG, getShockById, applyShockDeltasToScores } from '../src/shocks/catalog.js';
import {
  computeNationalMacroFinancialConditions,
  createInitialMacroFinancialPersisted,
  macroFinancialEconomyCostMultiplier,
  macroFinancialInputHash,
  macroFinancialLoanSpreadMultiplier,
  makeDefaultMacroFinancialTestInputs,
  sanitizeMacroFinancialPersisted,
  buildMacroFinancialInputs,
} from '../src/compute/national-macro-financial.js';
import {
  V1014_FINSTAB_CORE_REGIONS,
  V1014_FINSTAB_LIMITS,
  V1014_FINSTAB_SCHEMA_VERSION,
} from '../src/definitions/constants.js';

describe('Agent 10 glossary & boundaries', () => {
  it('defines coherent finance terms', () => {
    assert.ok(AGENT10_GLOSSARY_ENTRIES.length >= 7);
    assert.equal(macroInflationMayUseCommodityPrices(), false);
    assert.match(integrationNoteNonCpiBoundary(), /commodity/i);
  });
});

describe('Credit bands & leverage', () => {
  it('maps inflation and credit scores to bands', () => {
    assert.equal(bandInflation(80, false), 'high');
    assert.equal(bandCredit(80), 'accommodative');
  });

  it('computes actor credit stress from loans', () => {
    const idx = computeActorCreditStressIndex(
      { money: 100, loans: [{ remaining: 900 }] },
      { money: 5000, loans: [] },
    );
    assert.ok(idx >= 0.45 && idx < 1);
  });
});

describe('Rates metadata', () => {
  it('raises reference rate when credit is restricted', () => {
    const easy = referencePolicyRate('neutral', 'accommodative');
    const tight = referencePolicyRate('tightening', 'restricted');
    assert.ok(tight > easy);
  });
});

describe('Resource market prices (not macro CPI)', () => {
  it('clamps world pressure to ±6%', () => {
    assert.equal(clampResourcePricePressure(0.2), 0.06);
    assert.equal(clampResourcePricePressure(-0.2), -0.06);
  });

  it('applies pressure to base category price', () => {
    const base = baseResourceMarketPrice('minerals');
    const up = applyResourcePricePressure(base, 0.06);
    assert.ok(up > base);
  });
});

describe('Financial shocks catalog', () => {
  it('includes credit tightening with flag', () => {
    const shock = getShockById('shock_credit_tightening');
    assert.ok(shock);
    const applied = applyShockDeltasToScores({ inflation: 50, credit: 55, stability: 60 }, shock!);
    assert.equal(applied.creditShockActive, true);
    assert.ok(applied.credit < 55);
  });

  it('commodity spike does not move macro inflation score', () => {
    const shock = FINANCIAL_SHOCK_CATALOG.find((s) => s.kind === 'commodity_spike');
    assert.equal(shock?.inflationScoreDelta, 0);
  });
});

describe('National macro-financial compute (V10.14 parity)', () => {
  it('schema version matches canonical', () => {
    assert.equal(createInitialMacroFinancialPersisted().schemaVersion, V1014_FINSTAB_SCHEMA_VERSION);
  });

  it('credit shock tightens spread multiplier', () => {
    const r = computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ creditShockActive: true }),
      null,
      null,
    );
    assert.ok(r.state.modifiers.creditSpreadMultiplier > 1.05);
  });

  it('high inflation scenario raises cost multiplier', () => {
    const r = computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true }),
      null,
      null,
    );
    assert.ok(r.state.modifiers.costOfLivingMultiplier > 1.1);
  });

  it('deterministic replay', () => {
    const a = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ turn: 7 }), null, null)
      .state;
    const b = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ turn: 7 }), null, null)
      .state;
    assert.deepEqual(a, b);
  });

  it('input hash stable and turn-sensitive', () => {
    const base = makeDefaultMacroFinancialTestInputs();
    assert.equal(macroFinancialInputHash(base), macroFinancialInputHash(base));
    assert.notEqual(
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 1 })),
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 2 })),
    );
  });

  it('multipliers default to 1 when disabled', () => {
    assert.equal(macroFinancialEconomyCostMultiplier(null), 1);
    assert.equal(macroFinancialLoanSpreadMultiplier(undefined), 1);
  });

  it('regional spreads cover core regions', () => {
    const r = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null);
    assert.equal(r.state.regionalSpreads.length, V1014_FINSTAB_CORE_REGIONS.length);
  });

  it('WA mining exposure profile > 1', () => {
    assert.ok(V1014_FINSTAB_REGION_CREDIT_PROFILE.WA.miningExposure > 1);
  });

  it('policy transmission catalog size', () => {
    assert.ok(V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS.length >= 10);
  });

  it('sanitize round-trip', () => {
    const p = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).persisted;
    const s = sanitizeMacroFinancialPersisted(p)!;
    assert.equal(s.schemaVersion, V1014_FINSTAB_SCHEMA_VERSION);
  });

  it('buildMacroFinancialInputs detects inflation scenario id', () => {
    assert.equal(
      buildMacroFinancialInputs({ turn: 3, gameSettings: { selectedScenarioId: 'high_inflation' } }).highInflationScenario,
      true,
    );
  });

  it('modifiers stay within limits', () => {
    const r = computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true, inflationSettingMultiplier: 2 }),
      null,
      null,
    );
    assert.ok(r.state.modifiers.costOfLivingMultiplier <= V1014_FINSTAB_LIMITS.maxCostMultiplier);
    assert.ok(r.state.modifiers.creditSpreadMultiplier <= V1014_FINSTAB_LIMITS.maxCreditSpreadMultiplier);
  });
});
