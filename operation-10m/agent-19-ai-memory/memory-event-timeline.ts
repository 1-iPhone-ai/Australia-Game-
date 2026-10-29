import type { AiActorMemory, AiMemoryEvent } from './types.ts';

export interface MemoryEventTimelineEntry {
  turn: number;
  actionType: string;
  actorId: string;
  targetId: string | null;
  summaryLine: string;
  valenceLabel: 'positive' | 'negative' | 'neutral';
  importance: number;
}

export const AGENT19_TIMELINE_DISPLAY_CAP = 12;

function valenceLabel(valence: number): MemoryEventTimelineEntry['valenceLabel'] {
  if (valence > 0.05) return 'positive';
  if (valence < -0.05) return 'negative';
  return 'neutral';
}

export function formatMemoryEventForTimeline(event: AiMemoryEvent): MemoryEventTimelineEntry {
  const target = event.targetId ? ` → ${event.targetId}` : '';
  return {
    turn: event.turn,
    actionType: event.actionType,
    actorId: event.actorId,
    targetId: event.targetId,
    summaryLine: `Turn ${event.turn}: ${event.actorId} ${event.actionType}${target} — ${event.summary}`,
    valenceLabel: valenceLabel(event.valence),
    importance: event.importance,
  };
}

/** Chronological, capped timeline for explainability panels (newest last). */
export function buildMemoryEventTimeline(
  memory: AiActorMemory | null | undefined,
  opts?: { limit?: number; minImportance?: number },
): MemoryEventTimelineEntry[] {
  const limit = opts?.limit ?? AGENT19_TIMELINE_DISPLAY_CAP;
  const minImportance = opts?.minImportance ?? 0;
  const events = (memory?.events || [])
    .filter(e => e.importance >= minImportance)
    .slice()
    .sort((a, b) => a.turn - b.turn || a.id.localeCompare(b.id));
  const tail = events.length > limit ? events.slice(-limit) : events;
  return tail.map(formatMemoryEventForTimeline);
}

export function summarizeMemoryEventTimeline(entries: MemoryEventTimelineEntry[]): string[] {
  if (!entries.length) return ['No committed memory events in this view yet.'];
  const lines = [`${entries.length} event(s) in timeline (most recent last).`];
  entries.slice(-5).forEach(e => lines.push(`• ${e.summaryLine}`));
  return lines;
}
