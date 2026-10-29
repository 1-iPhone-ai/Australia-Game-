import { ConstructionProject, StartConstructionInput, TurnClock } from './types.js';

export function startConstruction(
  projects: ConstructionProject[],
  clock: TurnClock,
  input: StartConstructionInput,
): ConstructionProject[] {
  if (!input.id) throw new Error('startConstruction: id is required');
  if (projects.some((p) => p.id === input.id)) {
    throw new Error(`startConstruction: duplicate id ${input.id}`);
  }
  const labor = Math.floor(input.laborTurnsRequired);
  if (!Number.isFinite(labor) || labor < 1) {
    throw new Error(`startConstruction: invalid laborTurnsRequired for ${input.id}`);
  }
  const startedTurn = input.startedTurn ?? clock.turnIndex;
  const startedDay = input.startedDay ?? clock.dayIndex;
  const project: ConstructionProject = {
    id: input.id,
    startedTurn,
    startedDay,
    laborTurnsRequired: labor,
    laborTurnsCompleted: 0,
    completionTurn: startedTurn + labor,
    status: 'under_construction',
  };
  return [...projects, project];
}

export interface LaborTickResult {
  projects: ConstructionProject[];
  project: ConstructionProject | null;
  sequence: number;
  completed: boolean;
}

/**
 * Applies one labor tick on `end` phase — at most once per turn per project (via lastLaborSequence).
 */
export function tickConstructionLaborOnce(
  projects: ConstructionProject[],
  projectId: string,
  clock: TurnClock,
  sequence: number,
): LaborTickResult {
  let touched: ConstructionProject | null = null;
  let completed = false;
  const next = projects.map((p) => {
    if (p.id !== projectId) return p;
    if (p.status !== 'under_construction') return p;
    if (p.lastLaborSequence !== undefined && p.lastLaborSequence >= sequence) {
      return p;
    }
    const laborTurnsCompleted = p.laborTurnsCompleted + 1;
    const done = laborTurnsCompleted >= p.laborTurnsRequired;
    touched = {
      ...p,
      laborTurnsCompleted,
      status: done ? 'completed' : 'under_construction',
      lastLaborSequence: sequence,
    };
    completed = done;
    return touched;
  });
  return { projects: next, project: touched, sequence, completed };
}

export function activeConstruction(projects: ConstructionProject[]): ConstructionProject[] {
  return projects.filter((p) => p.status === 'under_construction');
}

export function constructionDueForCompletion(projects: ConstructionProject[], turnIndex: number): ConstructionProject[] {
  return projects.filter(
    (p) => p.status === 'under_construction' && p.completionTurn <= turnIndex && p.laborTurnsCompleted < p.laborTurnsRequired,
  );
}
