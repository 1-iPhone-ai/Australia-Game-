import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';

export const ANNOUNCEMENT_DEDUP_WINDOW_DAYS = 3;
export const ANNOUNCEMENT_DEDUP_LEDGER_MAX_ENTRIES = 24;

export type AnnouncementDedupLedger = Record<string, number>;

export function hashAnnouncementText(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return `a${(hash >>> 0).toString(16)}`;
}

export function isAnnouncementDuplicate(
  hash: string,
  ledger: AnnouncementDedupLedger | undefined,
  gameDay: number
): boolean {
  const lastDay = ledger?.[hash];
  if (lastDay == null) return false;
  return gameDay - lastDay < ANNOUNCEMENT_DEDUP_WINDOW_DAYS;
}

export function pruneAnnouncementDedupLedger(
  ledger: AnnouncementDedupLedger | undefined,
  gameDay: number
): AnnouncementDedupLedger {
  if (!ledger) return {};
  const next: AnnouncementDedupLedger = {};
  for (const [hash, day] of Object.entries(ledger)) {
    if (gameDay - day <= ANNOUNCEMENT_DEDUP_WINDOW_DAYS) next[hash] = day;
  }
  const entries = Object.entries(next);
  if (entries.length <= ANNOUNCEMENT_DEDUP_LEDGER_MAX_ENTRIES) return next;
  entries.sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(entries.slice(0, ANNOUNCEMENT_DEDUP_LEDGER_MAX_ENTRIES));
}

export interface AnnouncementDedupResult {
  freshAnnouncements: string[];
  suppressedCount: number;
  ledger: AnnouncementDedupLedger;
}

export function filterDedupedAnnouncements(
  announcements: string[],
  gameDay: number,
  ledger: AnnouncementDedupLedger | undefined
): AnnouncementDedupResult {
  const pruned = pruneAnnouncementDedupLedger(ledger, gameDay);
  const freshAnnouncements: string[] = [];
  let suppressedCount = 0;
  const nextLedger = { ...pruned };

  for (const line of announcements) {
    const hash = hashAnnouncementText(line);
    if (isAnnouncementDuplicate(hash, nextLedger, gameDay)) {
      suppressedCount++;
      continue;
    }
    freshAnnouncements.push(line);
    nextLedger[hash] = gameDay;
  }

  return {
    freshAnnouncements,
    suppressedCount,
    ledger: pruneAnnouncementDedupLedger(nextLedger, gameDay),
  };
}

export function mergeAnnouncementDedupLedgerIntoPersisted(
  persisted: EvolvingUiPersistedState,
  ledger: AnnouncementDedupLedger
): EvolvingUiPersistedState {
  return {
    ...persisted,
    announcementDedupLedger: ledger,
  };
}

export function dedupStatusCopy(suppressedCount: number): string {
  if (suppressedCount <= 0) return '';
  if (suppressedCount === 1) {
    return 'One repeated unlock announcement was held back so screen readers are not spammed.';
  }
  return `${suppressedCount} repeated unlock announcements were held back so screen readers stay calm.`;
}
