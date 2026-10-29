import type {
  ActiveTaxInstrument,
  FiscalConstraintGate,
  FiscalOutcomeBand,
  FiscalOutcomeLink,
  FiscalOutcomesSystemInputs,
  LinkedOutcomeDimension,
  NationalBudgetEnvelope
} from './types';
import { TAX_INSTRUMENT_CATALOG } from './tax-instruments';
import type { DebtOutcomeTrajectory } from './types';

function band(score: number): FiscalOutcomeBand {
  if (score >= 78) return 'strong';
  if (score >= 60) return 'healthy';
  if (score >= 45) return 'mixed';
  if (score >= 28) return 'weak';
  return 'critical';
}

function link(
  dimension: LinkedOutcomeDimension,
  score: number,
  drivers: string[],
  binding: boolean,
  turns: number,
  summary: string
): FiscalOutcomeLink {
  return {
    dimension,
    score: Math.round(score * 10) / 10,
    band: band(score),
    fiscalDrivers: drivers,
    constraintBinding: binding,
    projectedTurns: turns,
    summary
  };
}

export function computeOutcomeLinks(
  inputs: FiscalOutcomesSystemInputs,
  tax: ActiveTaxInstrument[],
  budget: NationalBudgetEnvelope,
  debt: DebtOutcomeTrajectory
): FiscalOutcomeLink[] {
  const h = inputs.v1012;
  const stability = inputs.publicStability ?? 55;
  const affordability = inputs.householdAffordabilityIndex ?? 50;
  const programCount = inputs.activeProgramIds?.length ?? h.commitmentCount;

  const headroomFactor = Math.max(-15, Math.min(25, h.fiscalHeadroom));
  const prosperityScore =
    52 +
    headroomFactor * 0.9 +
    (h.revenuePolicy === 'growth_focused' ? 4 : h.revenuePolicy === 'revenue_focused' ? -2 : 0) -
    (h.pressure === 'critical' ? 12 : h.pressure === 'strained' ? 6 : 0);

  const stabilityScore =
    stability * 0.55 +
    (h.pressure === 'comfortable' || h.pressure === 'healthy' ? 18 : h.pressure === 'tight' ? 8 : 0) -
    tax.reduce((s, t) => {
      const def = TAX_INSTRUMENT_CATALOG[t.instrumentId];
      return s + (def ? def.stabilitySensitivity * Math.abs(t.ratePoints - def.defaultRatePoints) * 0.08 : 0);
    }, 0);

  const deliveryScore =
    48 +
    headroomFactor * 0.5 +
    budget.unallocatedFlex * 0.15 -
    budget.lines.filter(l => l.band === 'critical_over').length * 9 -
    programCount * 0.8;

  const householdScore =
    affordability * 0.7 -
    tax.reduce((s, t) => {
      const def = TAX_INSTRUMENT_CATALOG[t.instrumentId];
      if (!def) return s;
      return s + def.householdSensitivity * Math.max(0, t.ratePoints - def.defaultRatePoints) * 0.12;
    }, 0) +
    (h.fiscalHeadroom < -5 ? -8 : 0);

  const regionalPros = inputs.regionalProsperity || {};
  const regionalVals = Object.values(regionalPros);
  const spread =
    regionalVals.length > 1 ? Math.max(...regionalVals) - Math.min(...regionalVals) : 12;
  const regionalScore = 62 - spread * 0.35 + (budget.lines.find(l => l.category === 'regional_development')?.flexPoints || 0) * 0.2;

  const innovationScore =
    50 +
    (budget.lines.find(l => l.category === 'research_innovation')?.flexPoints || 0) * 0.25 +
    tax.reduce((s, t) => {
      if (t.instrumentId === 'innovation_credit') return s + Math.abs(t.ratePoints) * 0.4;
      return s;
    }, 0) -
    (debt.sustainability === 'stress' || debt.sustainability === 'distress' ? 10 : 0);

  return [
    link(
      'national_prosperity',
      prosperityScore,
      [`Headroom ${h.fiscalHeadroom}`, `Pressure ${h.pressure}`, `Revenue capacity ${h.revenueCapacity}`],
      h.fiscalHeadroom < 2,
      4,
      prosperityScore >= 60
        ? 'Fiscal space supports prosperity-oriented programs.'
        : 'Tight headroom caps prosperity upside until commitments ease or revenue strengthens.'
    ),
    link(
      'public_stability',
      stabilityScore,
      [`Baseline stability ${stability}`, `Fiscal pressure ${h.pressure}`],
      h.pressure === 'critical',
      3,
      stabilityScore >= 55 ? 'Fiscal stance compatible with stability.' : 'Strained fiscal capacity adds stability risk.'
    ),
    link(
      'program_delivery',
      deliveryScore,
      [`Active programs ~${programCount}`, `Budget flex ${budget.unallocatedFlex}`],
      budget.rebalanceNeeded,
      2,
      deliveryScore >= 50
        ? 'Envelope flex supports delivery timelines.'
        : 'Over-committed envelopes may delay or stage major programs.'
    ),
    link(
      'household_affordability',
      householdScore,
      [`Affordability index ${affordability}`],
      householdScore < 35,
      5,
      householdScore >= 50
        ? 'Tax mix neutral-to-supportive for affordability.'
        : 'Tax and fiscal pressure may compress household outcomes (V10.13 interprets).'
    ),
    link(
      'regional_balance',
      regionalScore,
      [`Prosperity spread ${Math.round(spread)}`],
      spread > 28,
      6,
      regionalScore >= 55 ? 'Regional envelope flex offsets divergence.' : 'Regional divergence high — targeted envelope shift may help.'
    ),
    link(
      'innovation_momentum',
      innovationScore,
      ['R&D envelope', 'Innovation credit instrument'],
      innovationScore < 40,
      8,
      innovationScore >= 52 ? 'Innovation-friendly fiscal mix.' : 'Innovation outcomes constrained by debt or envelope crowding.'
    )
  ];
}

export function computeConstraintGates(
  inputs: FiscalOutcomesSystemInputs,
  links: FiscalOutcomeLink[],
  debt: DebtOutcomeTrajectory,
  budget: NationalBudgetEnvelope
): FiscalConstraintGate[] {
  const h = inputs.v1012;
  const gates: FiscalConstraintGate[] = [];

  gates.push({
    id: 'headroom_floor',
    label: 'Fiscal headroom floor',
    warnOnly: true,
    triggered: h.fiscalHeadroom < 1,
    severity: h.fiscalHeadroom < -8 ? 'critical' : h.fiscalHeadroom < 1 ? 'major' : 'info',
    reason:
      h.fiscalHeadroom < 1
        ? 'National fiscal headroom below safe staging band — major new capital should use staged paygo or private co-funding.'
        : 'Headroom adequate for routine commitments.',
    linkedOutcomeIds: ['national_prosperity', 'program_delivery']
  });

  gates.push({
    id: 'debt_stress_path',
    label: 'Debt sustainability path',
    warnOnly: true,
    triggered: debt.sustainability === 'stress' || debt.sustainability === 'distress',
    severity: debt.sustainability === 'distress' ? 'critical' : 'major',
    reason: debt.narrative,
    linkedOutcomeIds: ['national_prosperity', 'innovation_momentum']
  });

  gates.push({
    id: 'budget_overcommit',
    label: 'Budget envelope over-commit',
    warnOnly: true,
    triggered: budget.rebalanceNeeded,
    severity: budget.lines.some(l => l.band === 'critical_over') ? 'major' : 'caution',
    reason: budget.rebalanceSummary || 'Envelopes balanced.',
    linkedOutcomeIds: ['program_delivery', 'regional_balance']
  });

  const weakOutcomes = links.filter(l => l.band === 'weak' || l.band === 'critical');
  gates.push({
    id: 'outcome_weakness',
    label: 'Linked outcome weakness',
    warnOnly: true,
    triggered: weakOutcomes.length >= 2,
    severity: weakOutcomes.some(l => l.band === 'critical') ? 'major' : 'caution',
    reason:
      weakOutcomes.length >= 2
        ? `Multiple outcome dimensions weak: ${weakOutcomes.map(w => w.dimension).join(', ')}.`
        : 'No multi-dimensional outcome weakness detected.',
    linkedOutcomeIds: weakOutcomes.map(w => w.dimension)
  });

  return gates;
}

export function compositeFromLinks(links: FiscalOutcomeLink[]): { score: number; band: FiscalOutcomeBand } {
  const score = links.reduce((s, l) => s + l.score, 0) / Math.max(1, links.length);
  return { score: Math.round(score * 10) / 10, band: band(score) };
}
