import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  REQUIRED_BASELINE_MIGRATION_EXPORTS,
  REPLAY_MIGRATION_CHAIN,
  SAVE_MIGRATION_BASELINE_FILE,
  SAVE_MIGRATION_GRAPH,
} from "./constants.js";

export function readBaselineSource(
  repoRoot: string,
  baselineFile = SAVE_MIGRATION_BASELINE_FILE,
): string {
  return readFileSync(resolve(repoRoot, baselineFile), "utf8");
}

export function assertBaselineMigrationExports(
  repoRoot: string,
): { ok: true } | { ok: false; missing: string[] } {
  const text = readBaselineSource(repoRoot);
  const missing = REQUIRED_BASELINE_MIGRATION_EXPORTS.filter(
    (name) => !text.includes(`export function ${name}`),
  );
  return missing.length === 0 ? { ok: true } : { ok: false, missing: [...missing] };
}

export function assertReducerUsesV71Expansion(
  repoRoot: string,
): { ok: true } | { ok: false; reason: string } {
  const text = readBaselineSource(repoRoot);
  const caseBlock = text.match(
    /case 'MIGRATE_SAVE_DATA':[\s\S]{0,1200}?migrateSaveToV71Expansion/,
  );
  if (!caseBlock) {
    return {
      ok: false,
      reason: "MIGRATE_SAVE_DATA reducer path must call migrateSaveToV71Expansion",
    };
  }
  return { ok: true };
}

export function assertReplayChainWired(
  repoRoot: string,
): { ok: true } | { ok: false; missing: string[] } {
  const text = readBaselineSource(repoRoot);
  const missing = REPLAY_MIGRATION_CHAIN.map((step) => step.fn).filter(
    (fn) => !text.includes(`const ${fn}`) && !text.includes(`function ${fn}`),
  );
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}

export function parseMatchScopedSettingKeys(repoRoot: string): string[] {
  const text = readBaselineSource(repoRoot);
  const match = text.match(
    /export const V95_MATCH_SCOPED_SETTING_KEYS = \[([\s\S]*?)\];/,
  );
  if (!match) {
    throw new Error("V95_MATCH_SCOPED_SETTING_KEYS not found in baseline");
  }
  const keys: string[] = [];
  const re = /'([^']+)'|"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(match[1])) !== null) {
    keys.push(m[1] || m[2]);
  }
  return keys;
}

export function assertMigrationGraphDocumented(
  repoRoot: string,
): { ok: true } | { ok: false; missing: string[] } {
  const text = readBaselineSource(repoRoot);
  const missing = SAVE_MIGRATION_GRAPH.flatMap((node) =>
    [node.migrator, "innerMigrator" in node ? node.innerMigrator : null].filter(
      (fn): fn is string => !!fn && !text.includes(`export function ${fn}`),
    ),
  );
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}
