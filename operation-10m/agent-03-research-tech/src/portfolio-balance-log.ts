import type {
  ResearchPortfolioBalanceReport,
  ResearchPortfolioBalanceBand,
  ResearchPortfolioBalanceBandEvent,
  ResearchPortfolioBalanceSnapshot,
} from './types.ts';

export const RESEARCH_PORTFOLIO_BALANCE_LOG_CAP = 32;

export const RESEARCH_PORTFOLIO_BALANCE_BANDS: ResearchPortfolioBalanceBand[] = [40, 55, 70, 85];

export function emptyPortfolioBalanceLog(): ResearchPortfolioBalanceBandEvent[] {
  return [];
}

function highestLoggedBand(
  log: ResearchPortfolioBalanceBandEvent[],
  phase: ResearchPortfolioBalanceBandEvent['phase']
): ResearchPortfolioBalanceBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchPortfolioBalanceBand;
}

export function rebuildPortfolioBalanceLogFromSnapshot(
  snapshot: ResearchPortfolioBalanceSnapshot | null,
  report: ResearchPortfolioBalanceReport,
  turn: number
): ResearchPortfolioBalanceBandEvent[] {
  if (!snapshot) return emptyPortfolioBalanceLog();
  return appendPortfolioBalanceBandEvents(emptyPortfolioBalanceLog(), snapshot, report, turn);
}

export function appendPortfolioBalanceBandEvents(
  previousLog: ResearchPortfolioBalanceBandEvent[],
  previousSnapshot: ResearchPortfolioBalanceSnapshot | null,
  report: ResearchPortfolioBalanceReport,
  turn: number
): ResearchPortfolioBalanceBandEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, report.nationalBalanceScore)));
  const priorScore = previousSnapshot?.nationalBalanceScore ?? 0;
  const criticalCount = report.hints.filter(h => h.priority === 'critical').length;
  const appended: ResearchPortfolioBalanceBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_PORTFOLIO_BALANCE_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalBalanceScore: score,
        criticalBranchCount: criticalCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_PORTFOLIO_BALANCE_BANDS[RESEARCH_PORTFOLIO_BALANCE_BANDS.length - 1]);
    for (const band of [...RESEARCH_PORTFOLIO_BALANCE_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalBalanceScore: score,
        criticalBranchCount: criticalCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
}
