import {
  V1014_SCHEMA_VERSION,
  type ActiveTaxInstrument,
  type FiscalOutcomesPersisted,
  type FiscalOutcomesState,
  type FiscalOutcomesSystemInputs,
  type TaxReformStance
} from './types';
import {
  DEFAULT_TAX_INSTRUMENT_IDS,
  TAX_INSTRUMENT_CATALOG,
  clampRate,
  estimateRevenueDelta
} from './tax-instruments';
import { buildBudgetEnvelope } from './budget-envelopes';
import { computeDebtOutcomeTrajectory } from './debt-outcomes';
import {
  compositeFromLinks,
  computeConstraintGates,
  computeOutcomeLinks
} from './outcome-linkage';

function stableHash(obj: unknown): string {
  const s = JSON.stringify(obj);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v1014_${(h >>> 0).toString(16)}`;
}

export function createInitialFiscalOutcomesPersisted(turn = 1): FiscalOutcomesPersisted {
  const instrumentRates: Record<string, number> = {};
  for (const id of DEFAULT_TAX_INSTRUMENT_IDS) {
    instrumentRates[id] = TAX_INSTRUMENT_CATALOG[id].defaultRatePoints;
  }
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: 0,
    instrumentRates,
    instrumentStances: {},
    envelopeOverrides: {},
    lastCompositeBand: 'mixed',
    lastInputHash: '',
    lastUpdatedTurn: turn
  };
}

export function sanitizeFiscalOutcomesPersisted(raw: unknown): FiscalOutcomesPersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const base = createInitialFiscalOutcomesPersisted(Number((raw as any).lastUpdatedTurn) || 1);
  const r = raw as Partial<FiscalOutcomesPersisted>;
  return {
    ...base,
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: Number(r.revision) || 0,
    instrumentRates: { ...base.instrumentRates, ...(r.instrumentRates || {}) },
    instrumentStances: { ...(r.instrumentStances || {}) },
    envelopeOverrides: { ...(r.envelopeOverrides || {}) },
    lastCompositeBand: (r.lastCompositeBand as any) || base.lastCompositeBand,
    lastInputHash: String(r.lastInputHash || ''),
    lastUpdatedTurn: Number(r.lastUpdatedTurn) || 1
  };
}

function buildActiveTaxInstruments(
  persisted: FiscalOutcomesPersisted,
  structuralCapacity: number
): ActiveTaxInstrument[] {
  return DEFAULT_TAX_INSTRUMENT_IDS.map(id => {
    const def = TAX_INSTRUMENT_CATALOG[id];
    const ratePoints = clampRate(def, persisted.instrumentRates[id] ?? def.defaultRatePoints);
    const stance: TaxReformStance =
      persisted.instrumentStances[id] ||
      (ratePoints > def.defaultRatePoints + 0.5
        ? 'raise'
        : ratePoints < def.defaultRatePoints - 0.5
        ? 'cut'
        : 'hold');
    return {
      instrumentId: id,
      ratePoints,
      stance,
      turnsInEffect: 1,
      revenueDeltaEstimate: estimateRevenueDelta(def, ratePoints, structuralCapacity),
      explanation: `${def.label} at ${ratePoints} pts (${stance}).`
    };
  });
}

export function computeFiscalOutcomesLayer(
  inputs: FiscalOutcomesSystemInputs,
  persistedRaw?: FiscalOutcomesPersisted | null
): { state: FiscalOutcomesState; persisted: FiscalOutcomesPersisted } {
  const turn = inputs.turn;
  const persisted = sanitizeFiscalOutcomesPersisted(persistedRaw) || createInitialFiscalOutcomesPersisted(turn);
  const inputHash = stableHash({ turn, v1012: inputs.v1012, rates: persisted.instrumentRates });

  if (inputHash === persisted.lastInputHash) {
    const taxInstruments = buildActiveTaxInstruments(persisted, inputs.v1012.revenueCapacity);
    const budget = buildBudgetEnvelope(inputs.v1012, persisted.envelopeOverrides);
    const debtTrajectory = computeDebtOutcomeTrajectory(inputs.v1012);
    const outcomeLinks = computeOutcomeLinks(inputs, taxInstruments, budget, debtTrajectory);
    const constraintGates = computeConstraintGates(inputs, outcomeLinks, debtTrajectory, budget);
    const { score, band } = compositeFromLinks(outcomeLinks);
    return {
      state: {
        schemaVersion: V1014_SCHEMA_VERSION,
        revision: persisted.revision,
        taxInstruments,
        budget,
        debtTrajectory,
        outcomeLinks,
        constraintGates,
        compositeOutcomeScore: score,
        compositeBand: band,
        inputHash,
        lastUpdatedTurn: turn
      },
      persisted
    };
  }

  const taxInstruments = buildActiveTaxInstruments(persisted, inputs.v1012.revenueCapacity);
  const budget = buildBudgetEnvelope(inputs.v1012, persisted.envelopeOverrides);
  const debtTrajectory = computeDebtOutcomeTrajectory(inputs.v1012);
  const outcomeLinks = computeOutcomeLinks(inputs, taxInstruments, budget, debtTrajectory);
  const constraintGates = computeConstraintGates(inputs, outcomeLinks, debtTrajectory, budget);
  const { score, band } = compositeFromLinks(outcomeLinks);

  const nextPersisted: FiscalOutcomesPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastCompositeBand: band,
    lastInputHash: inputHash,
    lastUpdatedTurn: turn
  };

  const state: FiscalOutcomesState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: nextPersisted.revision,
    taxInstruments,
    budget,
    debtTrajectory,
    outcomeLinks,
    constraintGates,
    compositeOutcomeScore: score,
    compositeBand: band,
    inputHash,
    lastUpdatedTurn: turn
  };

  return { state, persisted: nextPersisted };
}

export function setTaxInstrumentRate(
  persisted: FiscalOutcomesPersisted,
  instrumentId: string,
  ratePoints: number,
  stance?: TaxReformStance
): FiscalOutcomesPersisted {
  const def = TAX_INSTRUMENT_CATALOG[instrumentId];
  if (!def) return persisted;
  return {
    ...persisted,
    instrumentRates: {
      ...persisted.instrumentRates,
      [instrumentId]: clampRate(def, ratePoints)
    },
    instrumentStances: stance
      ? { ...persisted.instrumentStances, [instrumentId]: stance }
      : persisted.instrumentStances,
    lastInputHash: ''
  };
}
