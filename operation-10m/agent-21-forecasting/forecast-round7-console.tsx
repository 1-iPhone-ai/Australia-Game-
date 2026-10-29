/**
 * Agent 21 — scale wave round 7 console (surface decision + telemetry + crosslink packet).
 */

import React, { useMemo } from 'react';
import { resolveAg21SurfaceDecision } from './forecast-surface-decision';
import { collectAg21LabTelemetry } from './forecast-lab-telemetry';
import { buildAg21CrosslinkPacket } from './forecast-crosslink-packet';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound7Console: React.FC<{ seed?: number }> = ({ seed = 47 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 17 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.74), actorDebt: base.actorDebt + 240 }),
    [base]
  );

  const decision = useMemo(() => resolveAg21SurfaceDecision(base, stressed), [base, stressed]);
  const telemetry = useMemo(() => collectAg21LabTelemetry(base, stressed), [base, stressed]);
  const packet = useMemo(() => buildAg21CrosslinkPacket(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round7-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 7 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round7-decision">
        Decision · {decision.decision} · readiness {decision.readinessScore}/100
      </div>
      <div data-testid="ag21-round7-telemetry">
        Telemetry · {telemetry.telemetryHealth} · gates {(telemetry.gatePassRatio * 100).toFixed(0)}%
      </div>
      <div data-testid="ag21-round7-packet">
        Crosslink · {packet.packetId} · tags {packet.dashboardTags.length}
      </div>
    </div>
  );
};
