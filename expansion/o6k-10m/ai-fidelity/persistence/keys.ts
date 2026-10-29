/** §6 persistence keys for V1014_AI_FIDELITY (T6-8). */

export const V1014_AI_FIDELITY_SAVE_ROOT = 'save.meta.v1014.ai_fidelity' as const;

export const V1014_AI_FIDELITY_SAVE_PATHS = {
  root: V1014_AI_FIDELITY_SAVE_ROOT,
  loops: `${V1014_AI_FIDELITY_SAVE_ROOT}.loop_snapshots`,
  verify: `${V1014_AI_FIDELITY_SAVE_ROOT}.verify_pass_rate`,
  routes: `${V1014_AI_FIDELITY_SAVE_ROOT}.route_hashes`,
  advisory: `${V1014_AI_FIDELITY_SAVE_ROOT}.advisory_escalations`,
  ui: `${V1014_AI_FIDELITY_SAVE_ROOT}.ui_unlock_flags`,
  explain: `${V1014_AI_FIDELITY_SAVE_ROOT}.explainability_cache`,
} as const;
