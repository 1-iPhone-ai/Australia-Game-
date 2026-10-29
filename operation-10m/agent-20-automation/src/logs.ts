import type {
  AutomationRunLogEntry,
  AutomationRunStatus,
  HumanAutomationTriggerType,
  NationalStewardHistoryEntry,
  NationalStewardPersisted,
  O10AutomationPathId,
} from './types.js';

export const DEFAULT_RUN_HISTORY_CAP = 50;
export const DEFAULT_STEWARD_HISTORY_CAP = 24;

export interface CreateRunLogInput {
  id: string;
  timestamp: number;
  day: number;
  turn: number;
  ruleId: string;
  ruleName: string;
  triggerType: HumanAutomationTriggerType;
  actionType: string;
  status: AutomationRunStatus;
  resultMessage: string;
  error?: string;
}

export function createAutomationRunLogEntry(input: CreateRunLogInput): AutomationRunLogEntry {
  return { ...input };
}

export function appendAutomationRunHistory(
  history: AutomationRunLogEntry[] | undefined,
  entry: AutomationRunLogEntry,
  cap = DEFAULT_RUN_HISTORY_CAP
): AutomationRunLogEntry[] {
  return [entry, ...(history || [])].slice(0, cap);
}

export function appendNationalStewardHistory(
  persisted: NationalStewardPersisted,
  turn: number,
  path: O10AutomationPathId,
  outcome: NationalStewardHistoryEntry['outcome'],
  summary: string,
  cap = DEFAULT_STEWARD_HISTORY_CAP
): NationalStewardPersisted {
  const entry: NationalStewardHistoryEntry = { turn, path, outcome, summary };
  const history = [...(persisted.history || []), entry].slice(-cap);
  return { ...persisted, history, lastPlanSummary: summary };
}

export interface DailyDigestLine {
  ruleId: string;
  ruleName: string;
  successCount: number;
  failedCount: number;
  skippedCount: number;
}

/** Groups run history for automationDailyDigestEnabled-style summaries. */
export function buildAutomationDailyDigest(
  entries: AutomationRunLogEntry[],
  day: number
): DailyDigestLine[] {
  const byRule = new Map<string, DailyDigestLine>();
  for (const e of entries) {
    if (e.day !== day) continue;
    const line = byRule.get(e.ruleId) || {
      ruleId: e.ruleId,
      ruleName: e.ruleName,
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
    };
    if (e.status === 'success') line.successCount += 1;
    else if (e.status === 'failed') line.failedCount += 1;
    else line.skippedCount += 1;
    byRule.set(e.ruleId, line);
  }
  return [...byRule.values()].sort((a, b) => a.ruleName.localeCompare(b.ruleName));
}

export function formatDailyDigestMarkdown(day: number, lines: DailyDigestLine[]): string {
  if (lines.length === 0) return `Day ${day}: no automation runs logged.`;
  const parts = lines.map(
    l =>
      `• **${l.ruleName}** — ${l.successCount} ok, ${l.failedCount} failed, ${l.skippedCount} skipped`
  );
  return [`### Automation digest (day ${day})`, ...parts].join('\n');
}

export interface StewardLogFilter {
  minTurn?: number;
  outcomes?: NationalStewardHistoryEntry['outcome'][];
}

export function filterStewardHistory(
  history: NationalStewardHistoryEntry[],
  filter: StewardLogFilter
): NationalStewardHistoryEntry[] {
  return history.filter(h => {
    if (filter.minTurn !== undefined && h.turn < filter.minTurn) return false;
    if (filter.outcomes && !filter.outcomes.includes(h.outcome)) return false;
    return true;
  });
}
