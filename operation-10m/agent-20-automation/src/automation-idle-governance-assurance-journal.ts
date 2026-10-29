import type { O10IdleGovernanceAssurancePassResult } from './automation-idle-governance-assurance-pass.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceAssuranceJournalEntry {
  schema: '10m.agent20.idle-governance-assurance-journal-entry.v1';
  turn: number;
  attestationFingerprint: string;
  reconcileStatus: string;
  trendDirection: string;
  watchUrgency: string;
  attestValid: boolean;
}

export interface O10IdleGovernanceAssuranceJournal {
  schema: '10m.agent20.idle-governance-assurance-journal.v1';
  entries: O10IdleGovernanceAssuranceJournalEntry[];
}

export function createEmptyIdleGovernanceAssuranceJournal(): O10IdleGovernanceAssuranceJournal {
  return { schema: '10m.agent20.idle-governance-assurance-journal.v1', entries: [] };
}

export function appendIdleGovernanceAssuranceJournalEntry(
  journal: O10IdleGovernanceAssuranceJournal,
  pass: O10IdleGovernanceAssurancePassResult,
  turn: number,
  attestValid: boolean
): O10IdleGovernanceAssuranceJournal {
  const entry: O10IdleGovernanceAssuranceJournalEntry = {
    schema: '10m.agent20.idle-governance-assurance-journal-entry.v1',
    turn,
    attestationFingerprint: pass.attestationFingerprint,
    reconcileStatus: pass.cycle.reconciliation.status,
    trendDirection: pass.trendDirection,
    watchUrgency: pass.watch.urgency,
    attestValid,
  };
  return { schema: journal.schema, entries: [...journal.entries, entry].slice(-48) };
}

export function formatIdleGovernanceAssuranceJournalDigest(journal: O10IdleGovernanceAssuranceJournal): string {
  if (journal.entries.length === 0) return 'gov_assurance_journal entries=0';
  const last = journal.entries[journal.entries.length - 1];
  return `gov_assurance_journal entries=${journal.entries.length} last_urgency=${last.watchUrgency} valid=${last.attestValid}`;
}

export function runO10Agent20IdleGovernanceAssuranceJournalSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let journal = createEmptyIdleGovernanceAssuranceJournal();
  push('gov_journal_empty', 'empty journal digest', formatIdleGovernanceAssuranceJournalDigest(journal).includes('entries=0'));

  const mockPass: O10IdleGovernanceAssurancePassResult = {
    schema: '10m.agent20.idle-governance-assurance-pass.v1',
    attestationFingerprint: 'fnv1a_abc',
    trendDirection: 'stable',
    briefMarkdown: '',
    summaryLine: 'gov_assurance',
    watch: {
      schema: '10m.agent20.idle-governance-watch-schedule.v1',
      turnsUntilNextCycle: 3,
      urgency: 'medium',
      reason: 'test',
    },
    cycle: {
      schema: '10m.agent20.idle-governance-compliance-cycle.v1',
      auditDigest: 'd',
      governance: {} as never,
      pass: {} as never,
      reconciliation: {
        schema: '10m.agent20.idle-governance-reconciliation.v1',
        status: 'aligned',
        priorAlertLevel: null,
        deltaPeakTier: 0,
        auditMatchesPass: true,
        summaryLine: 'ok',
      },
    },
  };

  journal = appendIdleGovernanceAssuranceJournalEntry(journal, mockPass, 2, true);
  push('gov_journal_append', 'append records urgency and fingerprint', journal.entries.length === 1 && journal.entries[0].attestationFingerprint === 'fnv1a_abc');

  journal = appendIdleGovernanceAssuranceJournalEntry(journal, { ...mockPass, watch: { ...mockPass.watch, urgency: 'high' } }, 3, false);
  push('gov_journal_digest', 'digest reflects last entry', formatIdleGovernanceAssuranceJournalDigest(journal).includes('last_urgency=high'));

  push('gov_journal_schema', 'journal schema marker', journal.schema === '10m.agent20.idle-governance-assurance-journal.v1');

  return results;
}
