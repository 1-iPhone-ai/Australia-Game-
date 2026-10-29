import type { TransportAssetCondition } from '../types.ts';

const CONDITION_ORDER: TransportAssetCondition[] = [
  'excellent',
  'good',
  'fair',
  'degraded',
  'closed',
];

export function conditionFromMaintenanceBacklog(backlog: number): TransportAssetCondition {
  const b = Math.max(0, Math.min(100, backlog));
  if (b <= 12) return 'excellent';
  if (b <= 28) return 'good';
  if (b <= 52) return 'fair';
  if (b <= 78) return 'degraded';
  return 'closed';
}

export function worsenCondition(
  base: TransportAssetCondition,
  penaltySteps: number,
): TransportAssetCondition {
  const idx = CONDITION_ORDER.indexOf(base);
  if (idx < 0) return base;
  return CONDITION_ORDER[Math.min(CONDITION_ORDER.length - 1, idx + Math.max(0, penaltySteps))];
}

export function buildConditionMapFromMaintenance(
  backlogByAssetId: ReadonlyMap<string, number> | undefined,
): Map<string, TransportAssetCondition> {
  const out = new Map<string, TransportAssetCondition>();
  if (!backlogByAssetId) return out;
  for (const [assetId, backlog] of backlogByAssetId.entries()) {
    out.set(assetId, conditionFromMaintenanceBacklog(backlog));
  }
  return out;
}

export function maintenanceWarningsFromBacklog(
  backlogByAssetId: ReadonlyMap<string, number> | undefined,
): string[] {
  if (!backlogByAssetId) return [];
  const warnings: string[] = [];
  for (const [assetId, backlog] of backlogByAssetId.entries()) {
    if (backlog >= 70) warnings.push(`${assetId}:critical_backlog=${backlog}`);
    else if (backlog >= 50) warnings.push(`${assetId}:elevated_backlog=${backlog}`);
  }
  return warnings.sort();
}
