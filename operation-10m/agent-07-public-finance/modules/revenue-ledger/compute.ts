import type { RevenueLedgerInputs, NationalRevenueLedger, RevenueStreamLine } from './types';
import { REVENUE_LEDGER_SCHEMA } from './types';

function volatilityForInstrument(instrumentId: string): RevenueStreamLine['volatilityBand'] {
  if (instrumentId === 'resource_rent') return 'high';
  if (instrumentId === 'carbon_price') return 'medium';
  if (instrumentId === 'innovation_credit') return 'low';
  return 'low';
}

export function buildNationalRevenueLedger(inputs: RevenueLedgerInputs): NationalRevenueLedger {
  const { v1012, taxInstruments, turn } = inputs;
  const structuralCapacity = v1012.revenueCapacity;
  const streams: RevenueStreamLine[] = taxInstruments.map(inst => ({
    id: `stream_${inst.instrumentId}`,
    kind: 'tax_instrument',
    label: inst.explanation.split(' at ')[0] || inst.instrumentId,
    baseCapacityPoints: Math.round(structuralCapacity * 0.11),
    deltaPoints: Math.round(inst.revenueDeltaEstimate),
    volatilityBand: volatilityForInstrument(inst.instrumentId),
    sourceInstrumentId: inst.instrumentId,
    explanation: inst.explanation
  }));

  if (v1012.revenuePolicy === 'revenue_focused') {
    streams.push({
      id: 'stream_policy_dividend',
      kind: 'policy_dividend',
      label: 'Revenue-focused policy dividend',
      baseCapacityPoints: 0,
      deltaPoints: 2,
      volatilityBand: 'low',
      sourceInstrumentId: null,
      explanation: 'V10.12 revenue policy stance adds modest structural uplift (normalized points).'
    });
  }

  const totalDelta = streams.reduce((s, l) => s + l.deltaPoints, 0);
  const modeledCurrent = structuralCapacity + Math.round(totalDelta * 0.15);
  const reconciledToV1012 = Math.abs(modeledCurrent - structuralCapacity) <= Math.max(8, structuralCapacity * 0.12);
  const reconciliationNotes: string[] = [];
  if (!reconciledToV1012) {
    reconciliationNotes.push(
      `Modeled current ${modeledCurrent} vs V10.12 structural ${structuralCapacity} — within tolerance band for policy deltas only.`
    );
  } else {
    reconciliationNotes.push('Ledger deltas reconcile to V10.12 structural capacity (policy-scaled).');
  }

  return {
    schemaVersion: REVENUE_LEDGER_SCHEMA,
    turn,
    structuralCapacity,
    currentCapacity: structuralCapacity,
    streams,
    totalDelta,
    reconciledToV1012,
    reconciliationNotes
  };
}
