import { buildMemoryExplainabilityBrief } from '../explainability.ts';
import { buildInspectionExplainabilityNarrative, getFilteredAiMemoryInspectionView } from '../inspection-explainability.ts';
import type { AiMemoryHorizonSnapshot } from '../types.ts';

export interface MemoryExplainabilityLabProps {
  snapshot: AiMemoryHorizonSnapshot;
  title?: string;
  ownerActorId?: string;
  viewerTeamId?: string | null;
  ownerTeamId?: string | null;
  fullInspection?: boolean;
  onRunSelfTests?: () => void;
}

/** LAB stub for Agent 25 wiring — shows horizon + explainability brief lines. */
export function MemoryExplainabilityLab(props: MemoryExplainabilityLabProps) {
  const lines = buildMemoryExplainabilityBrief(props.snapshot);
  const inspectionLines =
    props.ownerActorId != null
      ? buildInspectionExplainabilityNarrative(
          getFilteredAiMemoryInspectionView(
            { ownerActorId: props.ownerActorId, events: [], relationships: {}, opponentModels: {}, adaptivePlan: null, seenKeys: [], lastDecayTurn: 0 },
            {
              viewerTeamId: props.viewerTeamId,
              ownerTeamId: props.ownerTeamId,
              fullInspection: props.fullInspection,
              persistentMemoryEnabled: false,
            },
          ),
        )
      : [];
  const allLines = inspectionLines.length > 1 ? [...lines, ...inspectionLines.slice(0, 4)] : lines;
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid="agent-19-memory-explainability-lab">
      <strong style={{ color: '#a78bfa' }}>
        {props.title ?? 'LAB — Agent 19 AI Memory Explainability (modular)'}
      </strong>
      <div style={{ marginTop: 8, opacity: 0.9 }}>{props.snapshot.qualityNote}</div>
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {allLines.map((line, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {line}
          </li>
        ))}
      </ul>
      {props.onRunSelfTests && (
        <button type="button" onClick={props.onRunSelfTests} style={{ marginTop: 8 }}>
          Run Agent 19 Module Self-Tests
        </button>
      )}
    </div>
  );
}
