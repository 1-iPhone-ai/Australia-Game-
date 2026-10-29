import { V1014_LABOR_FORBIDDEN_STATE_KEYS } from './boundaries';
import { V1014_LABOR_SCHEMA_VERSION, type NationalLaborDemographicsState } from './types';

export function validateLaborDemographicsState(
  st: NationalLaborDemographicsState | null | undefined
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!st) return { valid: false, errors: ['null state'] };
  if (st.schemaVersion !== V1014_LABOR_SCHEMA_VERSION) errors.push('schema');
  if (!Number.isFinite(st.turn)) errors.push('turn');
  V1014_LABOR_FORBIDDEN_STATE_KEYS.forEach(k => {
    if ((st as any)[k] != null) errors.push(`forbidden:${k}`);
  });
  return { valid: errors.length === 0, errors };
}
