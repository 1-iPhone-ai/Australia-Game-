/**
 * Agent 21 — scale wave round 13 console (confirmation + audit trail + retention).
 */

import React, { useMemo } from 'react';
import { confirmAg21ExportManifest } from './forecast-manifest-confirmation';
import { buildAg21ArchiveAuditTrail } from './forecast-archive-audit-trail';
import { resolveAg21LabRetentionPolicy } from './forecast-lab-retention-policy';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound13Console: React.FC<{ seed?: number }> = ({ seed = 92 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 26 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.6), actorDebt: base.actorDebt + 380 }),
    [base]
  );

  const confirmation = useMemo(() => confirmAg21ExportManifest(base, stressed), [base, stressed]);
  const trail = useMemo(() => buildAg21ArchiveAuditTrail(base, stressed), [base, stressed]);
  const retention = useMemo(() => resolveAg21LabRetentionPolicy(base, stressed), [base, stressed]);

  return (
    <div className="border border-lime-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round13-console">
      <div className="font-bold text-lime-200">
        🔬 Forecast Lab Round 13 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round13-confirmation">
        Confirm · {confirmation.status} · notes {confirmation.mismatchNotes.length}
      </div>
      <div data-testid="ag21-round13-audit">
        Audit · {trail.eventCount} events · {trail.trailId.slice(0, 24)}…
      </div>
      <div data-testid="ag21-round13-retention">
        Retention · {retention.disposition} · {retention.retentionDaysHint}d hint
      </div>
    </div>
  );
};
