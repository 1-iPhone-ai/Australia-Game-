/**
 * Agent 13 — read-only household ↔ industry / energy linkage metadata (V10.13 boundary).
 * Never mutates household economy state; supplies ranking hints and guardian-facing notes only.
 */

export interface V1014HouseholdEnergyHint {
  regionId: string;
  concern: 'affordability' | 'essential_access' | 'employment_exposure';
  severity: 'low' | 'moderate' | 'high';
  relevanceDelta: number;
  reason: string;
  provenance: 'v1014_industrial_energy';
}

export interface V1014HouseholdLinkInputs {
  regionId: string;
  constraintBand: string;
  environmentalPressure: number;
  extractionBand: string;
  renewableBand: string;
  energyIndustryModifier: number | null;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function buildHouseholdEnergyHints(input: V1014HouseholdLinkInputs): V1014HouseholdEnergyHint[] {
  const hints: V1014HouseholdEnergyHint[] = [];
  if (input.constraintBand === 'critical' || input.environmentalPressure >= 72) {
    hints.push({
      regionId: input.regionId,
      concern: 'essential_access',
      severity: 'high',
      relevanceDelta: clamp(-1.5 - input.environmentalPressure / 100, -2, -0.5),
      reason: `Environmental constraint ${input.constraintBand} may strain household essential access via energy network stress.`,
      provenance: 'v1014_industrial_energy',
    });
  } else if (input.constraintBand === 'constrained') {
    hints.push({
      regionId: input.regionId,
      concern: 'essential_access',
      severity: 'moderate',
      relevanceDelta: -0.75,
      reason: `Regional environmental constraints (${input.constraintBand}) add modest essential-access risk.`,
      provenance: 'v1014_industrial_energy',
    });
  }

  if (input.extractionBand === 'extreme' || input.extractionBand === 'intensive') {
    hints.push({
      regionId: input.regionId,
      concern: 'employment_exposure',
      severity: input.extractionBand === 'extreme' ? 'high' : 'moderate',
      relevanceDelta: clamp(0.4 + (input.extractionBand === 'extreme' ? 0.6 : 0.3), 0, 1.2),
      reason: `High extraction intensity (${input.extractionBand}) correlates with mining/energy employment exposure.`,
      provenance: 'v1014_industrial_energy',
    });
  }

  if (input.renewableBand === 'leading') {
    hints.push({
      regionId: input.regionId,
      concern: 'affordability',
      severity: 'low',
      relevanceDelta: 0.35,
      reason: 'Leading renewable share supports long-run household energy affordability (metadata only).',
      provenance: 'v1014_industrial_energy',
    });
  }

  if (input.energyIndustryModifier != null && input.energyIndustryModifier < -6) {
    hints.push({
      regionId: input.regionId,
      concern: 'affordability',
      severity: 'moderate',
      relevanceDelta: clamp(input.energyIndustryModifier / 20, -1.5, -0.2),
      reason: 'Energy industry output under environmental caps may pass through to household bills (bounded hint).',
      provenance: 'v1014_industrial_energy',
    });
  }

  return hints;
}

export function mergeHouseholdEnergyHints(
  lists: V1014HouseholdEnergyHint[][],
): V1014HouseholdEnergyHint[] {
  const byKey = new Map<string, V1014HouseholdEnergyHint>();
  for (const list of lists) {
    for (const h of list) {
      const key = `${h.regionId}:${h.concern}`;
      const prev = byKey.get(key);
      if (!prev || Math.abs(h.relevanceDelta) > Math.abs(prev.relevanceDelta)) {
        byKey.set(key, h);
      }
    }
  }
  return [...byKey.values()];
}
