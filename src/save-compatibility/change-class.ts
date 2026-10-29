import type { PersistenceChangeClass } from "./constants.js";
import { requiresSaveSchemaBump } from "./constants.js";

export interface ChangeClassDecision {
  changeClass: PersistenceChangeClass;
  saveSchemaBumpRequired: boolean;
  integrationNotes: string[];
}

const NOTES: Record<PersistenceChangeClass, string[]> = {
  P0_presentation: ["No save/replay writes; V9.4 game feel falls here."],
  P1_additive_optional: ["Add sanitizer default if readers assume presence; extend self-test."],
  P2_additive_default: ["validateSaveDataCore must default from initial* state."],
  P3_match_scoped: ["Add key to V95_MATCH_SCOPED_SETTING_KEYS in baseline."],
  P4_profile_scoped: ["Do not restore from save; session profile wins (K03)."],
  P5_semantic_repair: ["Coerce in sanitizer; document in V95 audit if user-visible."],
  P6_breaking_structure: [
    "Bump SAVE_SCHEMA_VERSION.",
    "Add named migrator + idempotency test + fixture JSON.",
    "Append row to save-compatibility-spec.md §8.",
  ],
};

export function decideChangeClass(changeClass: PersistenceChangeClass): ChangeClassDecision {
  return {
    changeClass,
    saveSchemaBumpRequired: requiresSaveSchemaBump(changeClass),
    integrationNotes: NOTES[changeClass],
  };
}

export function assertV94FeelScope(changeClass: PersistenceChangeClass): boolean {
  return changeClass === "P0_presentation";
}
