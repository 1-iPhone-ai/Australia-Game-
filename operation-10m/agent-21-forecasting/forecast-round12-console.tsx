/**
 * Agent 21 — scale wave round 12 console (attestation + manifest + archive seal).
 */

import React, { useMemo } from 'react';
import { attestAg21LabCloseout } from './forecast-closeout-attestation';
import { buildAg21ExportManifest } from './forecast-export-manifest';
import { sealAg21LabArchiveRecord } from './forecast-lab-archive-seal';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound12Console: React.FC<{ seed?: number }> = ({ seed = 88 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 25 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.62), actorDebt: base.actorDebt + 360 }),
    [base]
  );

  const attestation = useMemo(() => attestAg21LabCloseout(base, stressed), [base, stressed]);
  const manifest = useMemo(() => buildAg21ExportManifest(base, stressed), [base, stressed]);
  const seal = useMemo(() => sealAg21LabArchiveRecord(base, stressed), [base, stressed]);

  return (
    <div className="border border-amber-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round12-console">
      <div className="font-bold text-amber-200">
        🔬 Forecast Lab Round 12 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round12-attestation">
        Attest · {attestation.verdict} · {attestation.attestationId.slice(0, 26)}…
      </div>
      <div data-testid="ag21-round12-manifest">
        Manifest · publish {manifest.mayPublish ? 'yes' : 'no'} · {manifest.entries.length} entries
      </div>
      <div data-testid="ag21-round12-seal">
        Archive · {seal.status} · {seal.sealDigest.slice(0, 28)}…
      </div>
    </div>
  );
};
