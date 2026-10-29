/**
 * §6 persistence keys — V1020 research pipeline (O6K-42).
 */
export const V1020_RPIPE_SAVE_META_KEY = 'save.meta.v1020.research_pipeline' as const;
export const V1020_RPIPE_LAB_SUITE_ID = 'v1020_research_pipeline' as const;

export const V1020_RPIPE_PERSISTENCE_PATHS = {
  root: V1020_RPIPE_SAVE_META_KEY,
  pipelineSnapshots: `${V1020_RPIPE_SAVE_META_KEY}.pipeline_snapshots`,
  commercializationStack: `${V1020_RPIPE_SAVE_META_KEY}.commercialization_stack_graph`,
  regional: `${V1020_RPIPE_SAVE_META_KEY}.regional_lab_transfer`,
  history: `${V1020_RPIPE_SAVE_META_KEY}.history`,
  aiCache: `${V1020_RPIPE_SAVE_META_KEY}.ai_read_cache`,
} as const;
