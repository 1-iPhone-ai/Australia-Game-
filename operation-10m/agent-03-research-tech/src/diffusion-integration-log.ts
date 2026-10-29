import type {
  RegionalDiffusionCell,
  ResearchDiffusionIntegrationMilestone,
  ResearchDiffusionIntegrationMilestoneEvent,
  ResearchDiffusionIntegrationSnapshot,
} from './types.ts';

export const RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP = 32;

export const RESEARCH_DIFFUSION_INTEGRATION_MILESTONES: ResearchDiffusionIntegrationMilestone[] = [1, 2, 4, 6];

export function emptyDiffusionIntegrationLog(): ResearchDiffusionIntegrationMilestoneEvent[] {
  return [];
}

function integratedRegionCount(cells: RegionalDiffusionCell[]): number {
  return cells.filter(c => c.level === 'integrated').length;
}

function highestLoggedMilestone(
  log: ResearchDiffusionIntegrationMilestoneEvent[],
  phase: ResearchDiffusionIntegrationMilestoneEvent['phase']
): ResearchDiffusionIntegrationMilestone {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.milestone > best) best = ev.milestone;
  }
  return best as ResearchDiffusionIntegrationMilestone;
}

export function rebuildDiffusionIntegrationLogFromSnapshot(
  snapshot: ResearchDiffusionIntegrationSnapshot | null,
  cells: RegionalDiffusionCell[],
  turn: number
): ResearchDiffusionIntegrationMilestoneEvent[] {
  if (!snapshot) return emptyDiffusionIntegrationLog();
  return appendDiffusionIntegrationEvents(emptyDiffusionIntegrationLog(), snapshot, cells, turn);
}

export function appendDiffusionIntegrationEvents(
  previousLog: ResearchDiffusionIntegrationMilestoneEvent[],
  previousSnapshot: ResearchDiffusionIntegrationSnapshot | null,
  cells: RegionalDiffusionCell[],
  turn: number
): ResearchDiffusionIntegrationMilestoneEvent[] {
  const count = integratedRegionCount(cells);
  const priorCount = previousSnapshot?.integratedRegionCount ?? 0;
  const meanScore =
    cells.length > 0 ? Math.round((cells.reduce((s, c) => s + c.score, 0) / cells.length) * 1000) / 1000 : 0;
  const appended: ResearchDiffusionIntegrationMilestoneEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (count > priorCount) {
    const floor = Math.max(
      highestLoggedMilestone(previousLog, 'escalation'),
      previousSnapshot?.peakMilestone ?? 0
    );
    for (const milestone of RESEARCH_DIFFUSION_INTEGRATION_MILESTONES) {
      if (milestone <= floor) continue;
      if (count < milestone) break;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        integratedRegionCount: count,
        meanDiffusionScore: meanScore,
        phase: 'escalation',
      });
    }
  } else if (count < priorCount) {
    const ceiling =
      previousSnapshot?.peakMilestone ??
      (highestLoggedMilestone(previousLog, 'escalation') ||
        RESEARCH_DIFFUSION_INTEGRATION_MILESTONES[RESEARCH_DIFFUSION_INTEGRATION_MILESTONES.length - 1]);
    for (const milestone of [...RESEARCH_DIFFUSION_INTEGRATION_MILESTONES].reverse()) {
      if (milestone > ceiling) continue;
      if (count > milestone) break;
      if (priorCount < milestone) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        integratedRegionCount: count,
        meanDiffusionScore: meanScore,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
}
