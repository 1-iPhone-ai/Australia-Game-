import { buildMemoryExplainabilityBrief } from '../explainability.ts';
import type { AiMemoryHorizonSnapshot } from '../types.ts';

export interface MemoryExplainabilityLabProps {
  snapshot: AiMemoryHorizonSnapshot;
  title?: string;
  onRunSelfTests?: () => void;
}

/** LAB stub for Agent 25 wiring — shows horizon + explainability brief lines. */
export function MemoryExplainabilityLab(props: MemoryExplainabilityLabProps) {
  const lines = buildMemoryExplainabilityBrief(props.snapshot);
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid="agent-19-memory-explainability-lab">
      <strong style={{ color: '#a78bfa' }}>
        {props.title ?? 'LAB — Agent 19 AI Memory Explainability (modular)'}
      </strong>
      <div style={{ marginTop: 8, opacity: 0.9 }}>{props.snapshot.qualityNote}</div>
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {lines.map((line, i) => (
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
