import type { FiscalOutcomesState } from './types';
import { summarizeBoundariesForGi } from './boundaries';

export interface FiscalOutcomesGiAnswer {
  headline: string;
  facts: string[];
  inferences: string[];
  followUps: string[];
}

export function detectFiscalOutcomesQuestion(raw: string): boolean {
  const q = String(raw || '').toLowerCase();
  if (!q) return false;
  return (
    /tax (policy|mix|reform|rate)/.test(q) ||
    /budget envelope/.test(q) ||
    /debt sustainability/.test(q) ||
    /fiscal outcome/.test(q) ||
    /linked outcome/.test(q) ||
    /why.*(prosperity|affordability).*fiscal/.test(q)
  );
}

export function composeFiscalOutcomesGiAnswer(
  question: string,
  state: FiscalOutcomesState | null | undefined
): FiscalOutcomesGiAnswer {
  if (!state) {
    return {
      headline: 'Fiscal outcomes layer inactive',
      facts: summarizeBoundariesForGi().slice(0, 2),
      inferences: ['Enable National Systems and V10.14 integration to see tax, budget, and debt-outcome links.'],
      followUps: ['What is our current fiscal position?', 'Why is fiscal capacity strained?']
    };
  }

  const weak = state.outcomeLinks.filter(l => l.band === 'weak' || l.band === 'critical');
  const gates = state.constraintGates.filter(g => g.triggered);

  return {
    headline: `Composite fiscal outcome: ${state.compositeBand.toUpperCase()} (${state.compositeOutcomeScore})`,
    facts: [
      `Budget ${state.budget.fiscalYearLabel}: ${state.budget.totalCapacityPoints} pts capacity, flex ${state.budget.unallocatedFlex}.`,
      `Debt path: ${state.debtTrajectory.sustainability} — ${state.debtTrajectory.narrative}`,
      ...state.taxInstruments
        .filter(t => Math.abs(t.revenueDeltaEstimate) > 0.5)
        .slice(0, 3)
        .map(t => `${t.explanation} Est. revenue Δ ${t.revenueDeltaEstimate}.`)
    ],
    inferences: [
      weak.length
        ? `Weak outcome dimensions: ${weak.map(w => `${w.dimension} (${w.band})`).join('; ')}.`
        : 'All linked outcome dimensions are mixed or better.',
      gates.length
        ? `Active fiscal gates: ${gates.map(g => g.label).join(', ')}.`
        : 'No fiscal constraint gates triggered.'
    ],
    followUps: [
      'Should we rebalance the budget envelope?',
      'What is the debt sustainability outlook?',
      'How does tax mix affect household affordability?'
    ]
  };
}

export function formatGiAnswer(answer: FiscalOutcomesGiAnswer): string {
  return [answer.headline, ...answer.facts.map(f => `• ${f}`), ...answer.inferences.map(i => `→ ${i}`)].join(
    '\n'
  );
}
