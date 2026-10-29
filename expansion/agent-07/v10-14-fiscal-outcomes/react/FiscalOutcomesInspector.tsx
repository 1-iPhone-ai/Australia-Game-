/**
 * V10.14 LAB inspector panel (Agent 07) — merge-ready React surface.
 * Not wired into canonical TSX on this branch.
 */
import React, { useMemo } from 'react';
import type { FiscalOutcomesState } from './types';
import { BUDGET_ENVELOPE_CATEGORY_LABELS } from './budget-envelopes';

export interface FiscalOutcomesInspectorProps {
  state: FiscalOutcomesState | null | undefined;
  onRunSelfTests?: () => void;
}

export const FiscalOutcomesInspector: React.FC<FiscalOutcomesInspectorProps> = ({ state, onRunSelfTests }) => {
  const weakLinks = useMemo(
    () => (state?.outcomeLinks || []).filter(l => l.band === 'weak' || l.band === 'critical'),
    [state]
  );

  if (!state) {
    return (
      <div style={{ padding: 12, color: '#94a3b8', fontFamily: 'system-ui' }}>
        V10.14 Fiscal Outcomes: inactive (enable after Agent 25 merge).
      </div>
    );
  }

  return (
    <div style={{ padding: 12, fontFamily: 'system-ui', color: '#e2e8f0', background: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: '#38bdf8' }}>LAB — V10.14 Fiscal Policy &amp; Outcome Linkage</strong>
        {onRunSelfTests && (
          <button type="button" onClick={onRunSelfTests} style={{ fontSize: 11, padding: '4px 8px' }}>
            Run self-tests
          </button>
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 12 }}>
        Composite: <span style={{ color: '#a5f3fc' }}>{state.compositeBand.toUpperCase()}</span> ({state.compositeOutcomeScore})
      </div>
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Budget envelope — {state.budget.fiscalYearLabel}</div>
        <div style={{ fontSize: 12 }}>Capacity {state.budget.totalCapacityPoints} · Flex {state.budget.unallocatedFlex}</div>
        {state.budget.rebalanceSummary && (
          <div style={{ color: '#fbbf24', fontSize: 11, marginTop: 4 }}>{state.budget.rebalanceSummary}</div>
        )}
        <ul style={{ fontSize: 11, marginTop: 6, paddingLeft: 16 }}>
          {state.budget.lines.map(line => (
            <li key={line.category}>
              {BUDGET_ENVELOPE_CATEGORY_LABELS[line.category]}: {line.allocatedPoints}/{line.committedPoints} ({line.band})
            </li>
          ))}
        </ul>
      </section>
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Debt outcome trajectory</div>
        <div style={{ fontSize: 12 }}>{state.debtTrajectory.sustainability} — {state.debtTrajectory.narrative}</div>
      </section>
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Linked outcomes</div>
        <ul style={{ fontSize: 11, paddingLeft: 16 }}>
          {state.outcomeLinks.map(link => (
            <li key={link.dimension}>
              {link.dimension}: {link.band} ({link.score}) — {link.summary}
            </li>
          ))}
        </ul>
      </section>
      {weakLinks.length > 0 && (
        <section style={{ marginTop: 8, color: '#fca5a5', fontSize: 11 }}>
          Weak dimensions: {weakLinks.map(w => w.dimension).join(', ')}
        </section>
      )}
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Constraint gates</div>
        <ul style={{ fontSize: 11, paddingLeft: 16 }}>
          {state.constraintGates.map(g => (
            <li key={g.id}>
              {g.triggered ? '⚠' : '○'} {g.label} ({g.severity}): {g.reason}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FiscalOutcomesInspector;
