/**
 * Minimal V9.4 type stubs for modular Agent 13 build (Agent 25 removes when inlining).
 */
export const V1014_SCHEMA_VERSION = '10.14.0-agent20' as const;

export type NationalSystemsState = {
  inputHash?: string;
  regions?: Record<
    string,
    { networks?: { energy?: { condition?: string; utilization?: number } } }
  >;
};

export type IndustriesSupplyChainsState = {
  revision?: number;
  regions?: Record<
    string,
    {
      industries?: Record<
        string,
        {
          industry?: string;
          strength?: number;
        }
      >;
    }
  >;
};

export type RegionalFactionsState = unknown;

export interface IndustriesInputs {
  modifiers?: Record<string, Partial<Record<'mining' | 'energy' | 'manufacturing' | 'logistics', number>>>;
}
