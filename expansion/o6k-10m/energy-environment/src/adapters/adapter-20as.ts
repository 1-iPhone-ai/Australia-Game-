import type {
  V1014EnergyDepthCrisisHint,
  V1014EnergyDepthGridBand,
  V1014EnergyDepthCarbonBand,
  V1014EnergyDepthRegionalSlice,
  V1014EnergyDepthRegionId,
} from '../types';

/** Cross-wire SECTION 20AS — derived crisis hints (content engine consumes). */
export function V1014_ENERGY_DEPTH_adaptCrisisTriggers(
  regions: Record<V1014EnergyDepthRegionId, V1014EnergyDepthRegionalSlice>,
  nationalGrid: V1014EnergyDepthGridBand,
  nationalCarbon: V1014EnergyDepthCarbonBand,
  activeCrises: Array<{ id: string; category: string }>,
): V1014EnergyDepthCrisisHint[] {
  const hints: V1014EnergyDepthCrisisHint[] = [];
  const stressed = (Object.keys(regions) as V1014EnergyDepthRegionId[]).filter(
    r => regions[r].gridBand === 'critical' || regions[r].gridBand === 'blackout_risk',
  );
  if (stressed.length >= 2 && !activeCrises.some(c => c.category === 'energy')) {
    hints.push({
      id: 'v1014_depth_grid_cascade',
      category: 'energy',
      severity: nationalGrid === 'blackout_risk' ? 'critical' : 'elevated',
      regionIds: stressed,
      reason: 'Multi-region reserve margin collapse under renewable intermittency',
    });
  }
  if (
    (nationalCarbon === 'overshoot' || nationalCarbon === 'critical_overshoot') &&
    !activeCrises.some(c => c.category === 'environment')
  ) {
    hints.push({
      id: 'v1014_depth_carbon_overshoot',
      category: 'environment',
      severity: nationalCarbon === 'critical_overshoot' ? 'critical' : 'elevated',
      regionIds: Object.keys(regions) as V1014EnergyDepthRegionId[],
      reason: 'National carbon budget pathway exceeded — permit pressure likely',
    });
  }
  return hints;
}
