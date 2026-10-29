import type { AnnouncementDedupLedger } from './announcement-dedup-ledger.js';

export interface DedupLedgerFootprintDayCoach {
  ledgerEntryCount: number;
  coachCopy: string | null;
}

export function dedupLedgerFootprintCopy(entryCount: number): string | null {
  if (entryCount <= 0) return null;
  if (entryCount === 1) {
    return 'One recent unlock announcement is remembered to prevent repeats.';
  }
  return `${entryCount} recent unlock announcements are remembered to prevent repeats.`;
}

export function buildDedupLedgerFootprintDayCoach(input: {
  ledger: AnnouncementDedupLedger | undefined;
  nextGameDay: number;
}): DedupLedgerFootprintDayCoach {
  const ledgerEntryCount = input.ledger ? Object.keys(input.ledger).length : 0;
  const base = dedupLedgerFootprintCopy(ledgerEntryCount);
  const coachCopy =
    base && ledgerEntryCount >= 2 ? `Day ${input.nextGameDay}: ${base}` : null;
  return { ledgerEntryCount, coachCopy };
}
