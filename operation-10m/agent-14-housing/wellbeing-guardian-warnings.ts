import type {
  Agent14WellbeingWarning,
  Agent14WellbeingWarningBundle,
  NationalHousingWellbeingSnapshot,
  NationalServiceAccessLens,
  PublicServiceCapacitySnapshot,
} from './types.ts';

export function evaluateAgent14WellbeingWarnings(
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens
): Agent14WellbeingWarningBundle {
  const warnings: Agent14WellbeingWarning[] = [];
  const assumptions = [
    'Warn-only V10.14 modular slice; does not block player actions.',
    'Uses capacity, housing pipeline, and service access lens only.',
  ];

  if (capacity.bindingConstraint === 'fiscal_absorption') {
    warnings.push({
      id: 'warn_fiscal_absorption',
      severity: 'elevated',
      pillar: 'cross',
      title: 'Fiscal absorption saturated',
      summary: `Public program fiscal load (${capacity.fiscalLoadScheduledThisTurn}) exceeds absorption cap (${capacity.fiscalAbsorptionCap}). Delay new commitments or relieve load.`,
      assumptions,
    });
  }

  if (capacity.bindingConstraint === 'program_slots') {
    warnings.push({
      id: 'warn_program_slots',
      severity: 'watch',
      pillar: 'cross',
      title: 'National program slots full',
      summary: `All ${capacity.nationalProgramSlots} national program slots are in use; sequencing required before new housing/health/education packages.`,
      assumptions,
    });
  }

  if (housing.regionalEquityGap >= 40) {
    warnings.push({
      id: 'warn_housing_equity',
      severity: 'elevated',
      pillar: 'housing',
      title: 'Regional housing equity gap',
      summary: `Affordability equity gap ${housing.regionalEquityGap} exceeds tolerance; remote and backlog-heavy regions lag capitals.`,
      assumptions,
    });
  }

  if (housing.affordabilityStress === 'severe') {
    warnings.push({
      id: 'warn_affordability_severe',
      severity: 'critical',
      pillar: 'housing',
      title: 'Severe affordability stress',
      summary: `National affordability index ${housing.nationalAffordabilityIndex} (${housing.affordabilityStress}).`,
      assumptions,
    });
  }

  for (const pillar of ['healthcare', 'education', 'housing'] as const) {
    const p = access.pillarNational[pillar];
    if (p.band === 'critical' || p.band === 'weak') {
      warnings.push({
        id: `warn_${pillar}_access`,
        severity: p.band === 'critical' ? 'critical' : 'watch',
        pillar,
        title: `${pillar} access strain`,
        summary: `National ${pillar} access index ${p.accessIndex} (${p.band}); backlog pressure ${p.backlogPressure}.`,
        assumptions,
      });
    }
  }

  if (access.equityGap >= 35) {
    warnings.push({
      id: 'warn_service_equity',
      severity: 'watch',
      pillar: 'cross',
      title: 'Service access equity divergence',
      summary: `Cross-pillar regional composite equity gap ${access.equityGap}.`,
      assumptions,
    });
  }

  const shouldSurface = warnings.some((w) => w.severity === 'critical' || w.severity === 'elevated');
  return { shouldSurface, warnings: warnings.slice(0, 8) };
}
