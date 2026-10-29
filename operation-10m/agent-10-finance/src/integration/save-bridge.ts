import type { MacroFinancialPersisted, NationalMacroFinancialState } from '../definitions/types.js';
import { sanitizeMacroFinancialPersisted } from '../compute/national-macro-financial.js';
import { V1014_FINSTAB_SCHEMA_VERSION } from '../definitions/constants.js';

export interface MacroFinancialSaveBridge {
  schemaVersion: string;
  persisted: MacroFinancialPersisted;
  snapshot?: Pick<
    NationalMacroFinancialState,
    'inflation' | 'credit' | 'stability' | 'stance' | 'modifiers' | 'turn'
  >;
}

export function exportMacroFinancialSaveBridge(
  persisted: MacroFinancialPersisted,
  state?: NationalMacroFinancialState | null,
): MacroFinancialSaveBridge {
  return {
    schemaVersion: V1014_FINSTAB_SCHEMA_VERSION,
    persisted,
    snapshot: state
      ? {
          turn: state.turn,
          inflation: state.inflation,
          credit: state.credit,
          stability: state.stability,
          stance: state.stance,
          modifiers: { ...state.modifiers },
        }
      : undefined,
  };
}

export function importMacroFinancialSaveBridge(raw: unknown, turn = 1): MacroFinancialSaveBridge | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const persisted = sanitizeMacroFinancialPersisted(r.persisted ?? r, turn);
  if (!persisted) return null;
  return {
    schemaVersion: String(r.schemaVersion || V1014_FINSTAB_SCHEMA_VERSION),
    persisted,
    snapshot: undefined,
  };
}

export function saveBridgeJsonSize(bridge: MacroFinancialSaveBridge): number {
  return JSON.stringify(bridge).length;
}
