/**
 * Projects maintenance backlog one turn forward from utilization + spend.
 */
export function projectMaintenanceBacklogNextTurn(
  current: ReadonlyMap<string, number> | undefined,
  operationalAssetIds: ReadonlySet<string>,
  options: {
    networkStress: number;
    maintenanceSpendIndex?: number;
  },
): Record<string, number> {
  const out: Record<string, number> = {};
  const spend = Math.max(0, Math.min(100, options.maintenanceSpendIndex ?? 40));
  const relief = spend / 200;
  const drift = 1.2 + Math.max(0, options.networkStress) * 2.5;

  for (const assetId of operationalAssetIds) {
    const base = current?.get(assetId) ?? 18;
    const next = Math.min(100, Math.max(0, base + drift - relief));
    out[assetId] = Math.round(next * 10) / 10;
  }
  return out;
}

export function aggregateNetworkStress(
  utilization: Partial<Record<'freight' | 'trade' | 'mobility', number>> | undefined,
): number {
  if (!utilization) return 0;
  const vals = [utilization.freight ?? 0, utilization.trade ?? 0, utilization.mobility ?? 0];
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
