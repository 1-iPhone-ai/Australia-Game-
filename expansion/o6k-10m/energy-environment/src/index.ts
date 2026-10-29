export * from './types';
export * from './primitives';
export * from './compute';
export * from './persistence';
export * from './self-tests';
export * from './self-test-fixtures';
export * from './engine-grid-stability';
export * from './engine-extraction-depletion';
export * from './engine-renewable-intermittency';
export * from './engine-carbon-budgets';
export * from './adapters/adapter-20al';
export * from './adapters/adapter-20t';
export * from './adapters/adapter-20y';
export * from './adapters/adapter-20u';
export * from './adapters/adapter-20as';
export * from './engine-contingency';
export * from './engine-coupling';

export const V1014_ENERGY_DEPTH_MODULE_VERSION = '1.0.0' as const;

/** SECTION 20AY integration banner for Agent 25 splice before SECTION 21B. */
export const V1014_ENERGY_DEPTH_SECTION_LABEL =
  'SECTION 20AY: V10.14 ENERGY DEPTH — GRID, DEPLETION, INTERMITTENCY, CARBON' as const;
