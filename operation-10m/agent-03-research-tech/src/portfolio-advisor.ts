import { RESEARCH_BRANCHES } from './branches.ts';
import type {
  ResearchBranchEmphasisState,
  ResearchBranchId,
  ResearchPortfolioBalanceReport,
  ResearchProgramEmphasis,
  ResearchProgressState,
} from './types.ts';

function suggestedEmphasisForGap(
  branchId: ResearchBranchId,
  readiness: number,
  current: ResearchProgramEmphasis
): ResearchProgramEmphasis {
  if (readiness < 25) {
    if (branchId === 'sovereign_research') return 'sovereign';
    if (branchId === 'industrial_transformation') return 'commercial';
    return 'fundamental';
  }
  if (readiness < 45 && current === 'fundamental') return 'applied';
  return current;
}

function priorityForGap(gap: number): ResearchPortfolioBalanceReport['hints'][number]['priority'] {
  if (gap >= 28) return 'critical';
  if (gap >= 14) return 'watch';
  return 'balanced';
}

/** Read-only branch balance hints for national strategy / copilot (round 5). */
export function computeResearchPortfolioBalanceReport(
  state: Pick<
    ResearchProgressState,
    'readinessByBranch' | 'branchEmphasis' | 'unlockedNodes' | 'scaleWave'
  >
): ResearchPortfolioBalanceReport {
  const emphasis = state.branchEmphasis ?? [];
  const readiness = state.readinessByBranch ?? ({} as Record<ResearchBranchId, number>);
  const values = RESEARCH_BRANCHES.map(b => readiness[b.id] ?? 0);
  const mean = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);

  const hints: ResearchPortfolioBalanceReport['hints'] = [];
  for (const branch of RESEARCH_BRANCHES) {
    const r = readiness[branch.id] ?? 0;
    const gap = Math.max(0, Math.round(mean - r));
    const emph = emphasis.find(e => e.branchId === branch.id)?.emphasis ?? 'fundamental';
    hints.push({
      branchId: branch.id,
      readinessGap: gap,
      currentEmphasis: emph,
      suggestedEmphasis: suggestedEmphasisForGap(branch.id, r, emph),
      priority: priorityForGap(gap),
    });
  }

  hints.sort((a, b) => b.readinessGap - a.readinessGap || a.branchId.localeCompare(b.branchId));

  const criticalCount = hints.filter(h => h.priority === 'critical').length;
  const synergy = state.scaleWave?.crossBranchSynergyScore ?? 0;
  const nationalBalanceScore = Math.min(
    100,
    Math.round(100 - criticalCount * 9 - hints.filter(h => h.priority === 'watch').length * 4 + synergy * 0.2)
  );

  return {
    active: criticalCount > 0 || hints.some(h => h.suggestedEmphasis !== h.currentEmphasis),
    hints: hints.slice(0, 6),
    nationalBalanceScore,
  };
}

/** Bounded readiness tilt when portfolio is critically imbalanced. */
export function applyPortfolioBalanceReadinessNudge(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchPortfolioBalanceReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const out = { ...readinessByBranch };
  for (const hint of report.hints) {
    if (hint.priority !== 'critical') continue;
    out[hint.branchId] = Math.min(100, (out[hint.branchId] ?? 0) + 2);
  }
  return out;
}
