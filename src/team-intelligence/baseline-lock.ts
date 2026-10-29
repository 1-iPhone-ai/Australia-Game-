import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  TEAM_INTELLIGENCE_BASELINE_FILE,
  TEAM_INTELLIGENCE_PUBLIC_EXPORTS,
  TEAM_OS_SECTION_MARKER,
  TEAM_OS_SETTINGS_KEYS,
} from "./constants.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function readTeamIntelligenceBaselineSource(): string {
  return readFileSync(resolve(repoRoot, TEAM_INTELLIGENCE_BASELINE_FILE), "utf8");
}

export function assertTeamIntelligenceBaselineStructure(source: string): string[] {
  const issues: string[] = [];
  if (!source.includes(TEAM_OS_SECTION_MARKER)) {
    issues.push(`missing section marker: ${TEAM_OS_SECTION_MARKER}`);
  }
  for (const name of TEAM_INTELLIGENCE_PUBLIC_EXPORTS) {
    const pattern = new RegExp(`export function ${name}\\(`);
    if (!pattern.test(source)) {
      issues.push(`missing export: ${name}`);
    }
  }
  for (const key of TEAM_OS_SETTINGS_KEYS) {
    if (!source.includes(key)) {
      issues.push(`missing settings key: ${key}`);
    }
  }
  if (!/export const TEAM_OS_LIMITS = \{/.test(source)) {
    issues.push("missing TEAM_OS_LIMITS export");
  }
  return issues;
}
