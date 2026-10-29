import type { NationalMacroEconomyState } from '../types.ts';
import { BUSINESS_CYCLE_LABEL, V1014_MACRO_INVESTMENT_LABEL, V1014_MACRO_PRODUCTIVITY_LABEL } from '../constants.ts';

export function MacroEconomyInspectorLab(props: {
  state: NationalMacroEconomyState | null;
  onRunTests?: () => void;
  testResult?: unknown;
}) {
  const st = props.state;
  if (!st) {
    return <div style={{ padding: 10, color: '#94a3b8' }}>V10.14 Inspector: No state active.</div>;
  }
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid="macro-economy-inspector">
      <strong style={{ color: '#38bdf8' }}>LAB — V10.14 Macro Economy (Agent 06 modular)</strong>
      <div>
        Cycle: {BUSINESS_CYCLE_LABEL[st.cyclePhase]} · Productivity:{' '}
        {V1014_MACRO_PRODUCTIVITY_LABEL[st.productivityBand]} · Investment:{' '}
        {V1014_MACRO_INVESTMENT_LABEL[st.investmentClimate]}
      </div>
      <div>
        Output index: {st.accounting.grossOutputIndex.toFixed(1)} · Identity OK:{' '}
        {String(st.accounting.identityOk)}
      </div>
      <div style={{ marginTop: 8 }}>
        {st.regionalContributions.map(r => (
          <div key={r.regionId}>
            {r.regionId} {(r.share * 100).toFixed(1)}% · {r.role} · {r.primarySector}
          </div>
        ))}
      </div>
      {props.onRunTests && (
        <button type="button" onClick={props.onRunTests} style={{ marginTop: 8 }}>
          Run Agent 06 Self-Tests
        </button>
      )}
    </div>
  );
}
