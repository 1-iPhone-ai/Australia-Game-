import {
  BASELINE_VERSION_MATRIX,
  SAVE_LOAD_PIPELINE_STAGES,
  SAVE_REQUIRED_TOP_LEVEL_KEYS,
  type SaveLoadPipelineStage,
} from "./constants.js";
import { isFutureGameVersion } from "./semver.js";

export function assertPipelineStageOrder(stages: readonly string[]): boolean {
  if (stages.length !== SAVE_LOAD_PIPELINE_STAGES.length) return false;
  return stages.every((s, i) => s === SAVE_LOAD_PIPELINE_STAGES[i]);
}

export function resolveSourceSchema(raw: Record<string, unknown>): string | null {
  const meta = raw.metadata;
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    const sv = (meta as Record<string, unknown>).schemaVersion;
    if (typeof sv === "string") return sv;
  }
  const top = raw.schemaVersion;
  return typeof top === "string" ? top : null;
}

export function resolveSourceGameVersion(raw: Record<string, unknown>): string {
  const meta = raw.metadata;
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    const gv = (meta as Record<string, unknown>).gameVersion;
    if (typeof gv === "string") return gv;
  }
  return "unknown";
}

export function structuralSaveGuard(raw: unknown): { ok: true } | { ok: false; reason: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, reason: "not_an_object" };
  }
  const obj = raw as Record<string, unknown>;
  for (const key of SAVE_REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in obj)) {
      return { ok: false, reason: `missing_${key}` };
    }
  }
  const meta = obj.metadata;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return { ok: false, reason: "invalid_metadata" };
  }
  const m = meta as Record<string, unknown>;
  if (typeof m.timestamp !== "number") {
    return { ok: false, reason: "metadata_timestamp" };
  }
  if (typeof m.gameVersion !== "string") {
    return { ok: false, reason: "metadata_gameVersion" };
  }
  return { ok: true };
}

export interface LoadPrecheckResult {
  futureVersionWarning: boolean;
  sourceGameVersion: string;
  sourceSchema: string | null;
  targetGameVersion: string;
  targetSaveSchema: string;
}

export function precheckSaveLoad(raw: Record<string, unknown>): LoadPrecheckResult {
  const sourceGameVersion = resolveSourceGameVersion(raw);
  const sourceSchema = resolveSourceSchema(raw);
  const targetGameVersion = BASELINE_VERSION_MATRIX.GAME_VERSION;
  const targetSaveSchema = BASELINE_VERSION_MATRIX.SAVE_SCHEMA_VERSION;
  return {
    futureVersionWarning: isFutureGameVersion(sourceGameVersion, targetGameVersion),
    sourceGameVersion,
    sourceSchema,
    targetGameVersion,
    targetSaveSchema,
  };
}

export function pipelineStageIndex(stage: SaveLoadPipelineStage): number {
  return SAVE_LOAD_PIPELINE_STAGES.indexOf(stage);
}
