/**
 * V1014_AI_FIDELITY public surface (expansion shard — inline before SECTION 21B).
 */
export * from './types/core';
export * from './constants/teams-routes';
export * from './persistence/keys';
export * from './persistence/migrations';
export * from './engine/ai-fidelity-utils';
export * from './engine/ai-fidelity-orchestrator';
export * from './adapters/adapter-acc17-execution';
export * from './adapters/adapter-20au-team-routing';
export * from './adapters/adapter-20pa-advisory';
export * from './adapters/adapter-20bd-ui-gates';
export * from './ai/fidelity-read-adapters';
export * from './self-tests/run-v1014-ai-fidelity-self-tests';
