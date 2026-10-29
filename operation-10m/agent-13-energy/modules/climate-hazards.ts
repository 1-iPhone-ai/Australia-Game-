/** Agent 13 — climate / environmental hazard pressure from crises & seasonal stress (bounded). */

export type V1014ClimateHazardKind =
  | 'bushfire'
  | 'flood'
  | 'cyclone'
  | 'heatwave'
  | 'drought'
  | 'coastal_erosion';

export interface V1014ClimateHazardTemplate {
  id: string;
  kind: V1014ClimateHazardKind;
  label: string;
  basePressure: number;
  crisisCategoryHints: string[];
  affectedDomain: string;
  documentation: string;
}

export const V1014_CLIMATE_HAZARD_CATALOG: readonly V1014ClimateHazardTemplate[] = [
  {
    id: 'hz_bushfire',
    kind: 'bushfire',
    label: 'Bushfire season',
    basePressure: 14,
    crisisCategoryHints: ['bushfire', 'wildfire', 'fire'],
    affectedDomain: 'air_quality',
    documentation: 'Elevates emissions and land-use pressure; strains extraction permits in forest-adjacent regions.',
  },
  {
    id: 'hz_flood',
    kind: 'flood',
    label: 'River / coastal flood',
    basePressure: 12,
    crisisCategoryHints: ['flood', 'inundation'],
    affectedDomain: 'water_stress',
    documentation: 'Disrupts logistics and mine dewatering; increases water_stress domain weight.',
  },
  {
    id: 'hz_cyclone',
    kind: 'cyclone',
    label: 'Tropical cyclone',
    basePressure: 16,
    crisisCategoryHints: ['cyclone', 'storm', 'hurricane'],
    affectedDomain: 'coastal_buffer',
    documentation: 'Damages coastal energy assets and port-linked LNG infrastructure.',
  },
  {
    id: 'hz_heatwave',
    kind: 'heatwave',
    label: 'Extreme heat',
    basePressure: 10,
    crisisCategoryHints: ['heat', 'heatwave', 'temperature'],
    affectedDomain: 'emissions_intensity',
    documentation: 'Raises grid demand and thermal plant stress without changing canonical prices.',
  },
  {
    id: 'hz_drought',
    kind: 'drought',
    label: 'Prolonged drought',
    basePressure: 13,
    crisisCategoryHints: ['drought', 'water'],
    affectedDomain: 'water_stress',
    documentation: 'Amplifies extraction water-intensity penalties for mining and energy.',
  },
  {
    id: 'hz_coastal',
    kind: 'coastal_erosion',
    label: 'Coastal erosion / surge',
    basePressure: 11,
    crisisCategoryHints: ['coastal', 'erosion', 'surge'],
    affectedDomain: 'coastal_buffer',
    documentation: 'Threatens offshore wind and LNG export corridors.',
  },
] as const;

export interface V1014ActiveClimateHazard {
  templateId: string;
  kind: V1014ClimateHazardKind;
  regionId: string | null;
  pressureDelta: number;
  sourceCrisisId: string;
  summary: string;
}

function crisisMatchesTemplate(category: string, hints: string[]): boolean {
  const c = category.toLowerCase();
  return hints.some(h => c.includes(h));
}

export function detectClimateHazardsFromCrises(
  crises: Array<{ id: string; status: string; category: string; affectedRegions: string[] }>,
  regionId: string,
): V1014ActiveClimateHazard[] {
  const out: V1014ActiveClimateHazard[] = [];
  for (const crisis of crises) {
    if (crisis.status !== 'active' && crisis.status !== 'escalating') continue;
    const regions = crisis.affectedRegions?.length ? crisis.affectedRegions : [regionId];
    if (regions.length && !regions.includes(regionId) && !regions.includes('national')) continue;
    for (const tpl of V1014_CLIMATE_HAZARD_CATALOG) {
      if (!crisisMatchesTemplate(crisis.category, tpl.crisisCategoryHints)) continue;
      out.push({
        templateId: tpl.id,
        kind: tpl.kind,
        regionId,
        pressureDelta: tpl.basePressure,
        sourceCrisisId: crisis.id,
        summary: `${tpl.label} linked to crisis ${crisis.id} (${crisis.category}).`,
      });
      break;
    }
  }
  return out;
}

export function aggregateClimatePressure(hazards: V1014ActiveClimateHazard[]): number {
  return hazards.reduce((a, h) => a + h.pressureDelta, 0);
}
