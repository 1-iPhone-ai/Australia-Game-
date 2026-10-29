/**
 * V1014_TRADE_DEPTH public surface (expansion shard — inline before SECTION 21B).
 */
export * from './types/core';
export * from './constants/regions-partners';
export * from './persistence/keys';
export * from './persistence/migrations';
export * from './engine/trade-depth-utils';
export * from './engine/trade-depth-orchestrator';
export * from './adapters/adapter-20at-gtel';
export * from './adapters/adapter-20h-diplomacy';
export * from './adapters/adapter-20ab-investment';
export * from './adapters/adapter-20ae-fiscal';
export * from './adapters/adapter-20af-household';
export * from './ai/diplomatic-read-adapters';
export * from './self-tests/run-v1014-trade-depth-self-tests';
