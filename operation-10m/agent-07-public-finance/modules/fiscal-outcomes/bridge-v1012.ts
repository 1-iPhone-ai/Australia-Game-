import type { FiscalOutcomesSystemInputs, V1012FiscalSnapshot } from './types';

/** Map a loose V10.12 public-finance view into V10.14 bridge input. */
export function bridgeV1012Snapshot(raw: {
  turn?: number;
  fiscalPosition?: {
    revenueCapacity?: number;
    fiscalHeadroom?: number;
    pressure?: V1012FiscalSnapshot['pressure'];
    sustainability?: V1012FiscalSnapshot['sustainability'];
    debtServiceLoad?: number;
    maintenanceLoad?: number;
  };
  debt?: { enabled?: boolean; level?: number; debtServiceLoad?: number };
  commitments?: unknown[];
  revenuePolicy?: V1012FiscalSnapshot['revenuePolicy'];
  reservePolicy?: V1012FiscalSnapshot['reservePolicy'];
  persisted?: { debtEnabled?: boolean; reservePolicy?: V1012FiscalSnapshot['reservePolicy'] };
}): V1012FiscalSnapshot {
  const fp = raw.fiscalPosition || {};
  const debt = raw.debt || {};
  return {
    turn: Number(raw.turn) || 1,
    revenueCapacity: Number(fp.revenueCapacity) || 0,
    fiscalHeadroom: Number(fp.fiscalHeadroom) || 0,
    pressure: fp.pressure || 'healthy',
    sustainability: fp.sustainability || 'stable',
    debtServiceLoad: Number(debt.debtServiceLoad ?? fp.debtServiceLoad) || 0,
    debtLevel: Number(debt.level) || 0,
    debtEnabled: Boolean(debt.enabled ?? raw.persisted?.debtEnabled),
    maintenanceLoad: Number(fp.maintenanceLoad) || 0,
    commitmentCount: Array.isArray(raw.commitments) ? raw.commitments.length : 0,
    revenuePolicy: raw.revenuePolicy ?? null,
    reservePolicy: raw.reservePolicy ?? raw.persisted?.reservePolicy ?? null
  };
}

export function buildFiscalOutcomesInputsFromBridge(
  bridge: V1012FiscalSnapshot,
  extras?: Partial<Omit<FiscalOutcomesSystemInputs, 'turn' | 'v1012'>>
): FiscalOutcomesSystemInputs {
  return {
    turn: bridge.turn,
    v1012: bridge,
    ...extras
  };
}
