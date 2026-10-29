import { ConstructionProject } from './types.js';

/** Extends completion turn when time was frozen (UI pause / blocked advances). */
export function slipActiveConstructionCompletion(
  projects: ConstructionProject[],
  slipTurns = 1,
): ConstructionProject[] {
  const slip = Math.max(0, Math.floor(slipTurns));
  if (slip === 0) return projects;
  return projects.map((p) => {
    if (p.status !== 'under_construction') return p;
    return { ...p, completionTurn: p.completionTurn + slip };
  });
}

export function totalPauseSlipApplied(projects: ConstructionProject[], baselineCompletion: number): number {
  const project = projects.find((p) => p.completionTurn > baselineCompletion);
  return project ? project.completionTurn - baselineCompletion : 0;
}
