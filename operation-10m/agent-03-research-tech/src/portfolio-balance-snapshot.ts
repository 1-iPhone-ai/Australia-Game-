import type { ResearchPortfolioBalanceReport, ResearchPortfolioBalanceSnapshot } from './types.ts';
import { RESEARCH_PORTFOLIO_BALANCE_BANDS } from './portfolio-balance-log.ts';

/** Compact persisted digest of portfolio balance at seal (round 12). */
export function computePortfolioBalanceSnapshot(
  report: ResearchPortfolioBalanceReport,
  turn: number
): ResearchPortfolioBalanceSnapshot {
  const nationalBalanceScore = Math.round(Math.min(100, Math.max(0, report.nationalBalanceScore)));
  const criticalBranchCount = report.hints.filter(h => h.priority === 'critical').length;
  const watchBranchCount = report.hints.filter(h => h.priority === 'watch').length;
  let peakBand = 0;
  for (const band of RESEARCH_PORTFOLIO_BALANCE_BANDS) {
    if (nationalBalanceScore >= band) peakBand = band;
  }
  const payload = `t${turn}|b${nationalBalanceScore}|c${criticalBranchCount}|w${watchBranchCount}|a${report.active ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalBalanceScore,
    criticalBranchCount,
    watchBranchCount,
    peakBand: peakBand as ResearchPortfolioBalanceSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergePortfolioBalanceSnapshots(
  local: ResearchPortfolioBalanceSnapshot | undefined,
  remote: ResearchPortfolioBalanceSnapshot | undefined
): ResearchPortfolioBalanceSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
