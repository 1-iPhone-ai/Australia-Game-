import { v1014laborBandMigration, v1014laborClamp } from './bands';
import type { MigrationFlowBand } from './types';
import { V1014_LABOR_CORE_REGIONS } from './types';

export function computeRegionalAttractiveness(params: {
  empLinkageRaw: number;
  wfStrain: number;
  hhFit: number;
}): number {
  const { empLinkageRaw, wfStrain, hhFit } = params;
  return empLinkageRaw * 0.5 + (100 - wfStrain) * 0.3 + hhFit * 0.2;
}

export function applyMigrationScoresToRegions(
  regions: Record<string, { migrationFlow: MigrationFlowBand; migrationFlowScore: number }>,
  attractiveness: Record<string, number>
): void {
  const avgAttr =
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + (attractiveness[c] || 50), 0) /
    V1014_LABOR_CORE_REGIONS.length;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const diff = (attractiveness[regionId] || 50) - avgAttr;
    const migRaw = v1014laborClamp(50 + diff * 0.85);
    regions[regionId].migrationFlow = v1014laborBandMigration(migRaw);
    regions[regionId].migrationFlowScore = migRaw;
  });
}

export function nationalMigrationAverage(
  regions: Record<string, { migrationFlowScore: number }>
): number {
  return v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].migrationFlowScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
}
