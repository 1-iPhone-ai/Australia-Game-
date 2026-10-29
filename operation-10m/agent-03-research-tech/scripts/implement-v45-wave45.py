#!/usr/bin/env python3
"""One-shot Agent 03 save v45 (O10-221 wave 45)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

# --- types.ts ---
types = (SRC / 'types.ts').read_text()
types = types.replace(
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v44' as const;",
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v45' as const;",
)
types = types.replace(
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v43'",
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v44'\n  | 'op10m-agent03-v43'",
)
insert_types = """
export type ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBand = 87 | 98 | 99 | 100;

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBand;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot {
  capturedAtTurn: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBand | 0;
  digest: string;
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveSealHandoffIntegrationOutlook {
"""
if 'SealContinuityHandoffIntegrationSealScore' not in types:
    types = types.replace(
        'export interface ResearchScaleWaveSealHandoffIntegrationOutlook {',
        insert_types,
        1,
    )
types = types.replace(
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook | null;\n  unlockSeq:",
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook | null;\n  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook | null;\n  unlockSeq:",
)
types = types.replace(
    "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;\n}",
    "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;\n}",
)
(SRC / 'types.ts').write_text(types)

# --- new TS modules (from v44 handoff band templates) ---
handoff_band = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-band-log.ts').read_text()
integration_band = handoff_band.replace('HandoffOutlook', 'IntegrationOutlook')
integration_band = integration_band.replace('HandoffBand', 'IntegrationBand')
integration_band = integration_band.replace('HandoffSnapshot', 'IntegrationSnapshot')
integration_band = integration_band.replace('handoffScore', 'integrationScore')
integration_band = integration_band.replace(
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore',
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore',
)
integration_band = integration_band.replace('SEAL_CONTINUITY_HANDOFF_BANDS', 'SEAL_CONTINUITY_HANDOFF_INTEGRATION_BANDS')
integration_band = integration_band.replace('[86, 98, 99, 100]', '[87, 98, 99, 100]')
integration_band = integration_band.replace('O10-219 (read-only, scale wave round 44)', 'O10-221 (persist, scale wave round 45)')
integration_band = integration_band.replace(
    'seal-continuity-handoff-band-log.ts',
    'seal-continuity-handoff-integration-band-log.ts',
)
integration_band = integration_band.replace(
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-band-log.ts',
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts',
)
out_band = SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts'
out_band.write_text(integration_band)

handoff_snap = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-snapshot.ts').read_text()
integration_snap = handoff_snap.replace('HandoffOutlook', 'IntegrationOutlook')
integration_snap = integration_snap.replace('HandoffSnapshot', 'IntegrationSnapshot')
integration_snap = integration_snap.replace(
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore',
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore',
)
integration_snap = integration_snap.replace('handoffMomentum', 'integrationMomentum')
integration_snap = integration_snap.replace('[86, 98, 99, 100]', '[87, 98, 99, 100]')
integration_snap = integration_snap.replace('seal-continuity-handoff-band-log.ts', 'seal-continuity-handoff-integration-band-log.ts')
integration_snap = integration_snap.replace(
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-band-log.ts',
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-snapshot.ts').write_text(integration_snap)

seal_out = '''import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff integration seal continuity handoff integration seal for Agent 25 O10-221 (read-only, scale wave round 45). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook {
  const integration = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
  const handoff = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook;
  const horizonTurns = integration?.horizonTurns ?? handoff?.horizonTurns ?? 6;
  const waveOrdinal = 45;

  const integrationScore = integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore ?? 0;
  const handoffScore = handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore ?? 0;
  const priorIntegrationPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?.peakBand ?? 0;
  const sealMomentum = Math.max(0, integrationScore - priorIntegrationPeak * 0.09);

  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore = Math.min(
    100,
    Math.round(
      integrationScore * 0.24 +
        handoffScore * 0.12 +
        sealMomentum * 0.2 +
        (integration?.dryRunEligible ? 23 : 0) +
        (ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot?.peakBand ?? 0) * 0.03
    )
  );

  const dryRunEligible =
    inputs.turn >= waveOrdinal ||
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore >= 84 ||
    (integration?.dryRunEligible && integrationScore >= 80);

  const priorHints = [
    integration?.integrationBaselineShaHint,
    handoff?.integrationBaselineShaHint,
  ].filter((h): h is string => typeof h === 'string' && h.length > 0);

  return {
    active:
      dryRunEligible ||
      (integration?.active ?? false) ||
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore > 0 ||
      (handoff?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    waveOrdinal,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore,
    sealMomentum: Math.round(sealMomentum),
    integrationBaselineShaHint: '98bcd652',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_548_579,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-222' : null,
  };
}
'''
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-outlook.ts').write_text(seal_out)

# --- compute.ts ---
compute = (SRC / 'compute.ts').read_text()
if 'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook' not in compute:
    compute = compute.replace(
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-outlook.ts';",
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-outlook.ts';\nimport { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-outlook.ts';",
        1,
    )
    block = """
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    });

"""
    compute = compute.replace(
        '  const computed: ResearchProgressState = {',
        block + '  const computed: ResearchProgressState = {',
        1,
    )
    compute = compute.replace(
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,\n    unlockSeq:',
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,\n    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,\n    unlockSeq:',
        1,
    )
(SRC / 'compute.ts').write_text(compute)

# --- save-migration.ts (minimal v45 deltas) ---
sm = (SRC / 'save-migration.ts').read_text()
imp_anchor = "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-snapshot.ts';"
imp_add = imp_anchor + """
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-snapshot.ts';"""
if 'emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog' not in sm:
    sm = sm.replace(imp_anchor, imp_add, 1)

sm = sm.replace(
    "const LEGACY_V43 = 'op10m-agent03-v43' as const;",
    "const LEGACY_V44 = 'op10m-agent03-v44' as const;\nconst LEGACY_V43 = 'op10m-agent03-v43' as const;",
)

if 'ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent' not in sm.split('interface ResearchProgressPersistedCore')[1][:4000]:
    sm = sm.replace(
        "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;\n}",
        "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;\n}",
        1,
    )

sm = sm.replace(
    "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',\n] as const;",
    "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',\n  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook',\n] as const;",
)

# finalizeCore / merge partials — append empty defaults (pattern from v44)
for old, new in [
    (
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n  };",
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,\n  };",
    ),
    (
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n    unlockEventLog",
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,\n    unlockEventLog",
    ),
    (
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,\n  });",
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,\n  });",
    ),
]:
    if new.split('\n')[1].strip()[:40] not in sm:
        sm = sm.replace(old, new, 1)

if 'if (ver === LEGACY_V44)' not in sm:
    start = sm.index('  if (ver === LEGACY_V43) {')
    end = sm.index('  if (ver === LEGACY_V42) {')
    block43 = sm[start:end]
    block44 = block43.replace('LEGACY_V43', 'LEGACY_V44')
    block44 = block44.replace(
        """        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
      },
      LEGACY_V44""",
        """        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V44""",
    )
    sm = sm[:start] + block44 + sm[start:]

merge_insert = """
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 44,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: 0,
      integrationMomentum: 0,
      integrationBaselineShaHint: 'bca7e0a3',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_300_377,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    computed.turn
  );
"""
marker = "  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvents("
if 'appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents' not in sm:
    sm = sm.replace(marker, merge_insert + marker, 1)

tail_a = """    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      computed.turn
    ),
  };
}"""
tail_b = tail_a.replace(
    "  };\n}",
    """    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      computed.turn
    ),
  };
}""",
)
if 'SealContinuityHandoffIntegrationBandLog,' not in sm:
    sm = sm.replace(tail_a, tail_b, 1)

(SRC / 'save-migration.ts').write_text(sm)

# bundle v44 -> v45
bundle = (ROOT / 'scripts/bundle-chunk.mjs').read_text()
bundle = bundle.replace("'op10m-agent03-v44'", "'op10m-agent03-v45'")
if 'savefmt_v44_to_v45' not in bundle:
    bundle = bundle.replace(
        "  push('savefmt_v43_to_v44', v42m?.schemaVersion === 'op10m-agent03-v45'",
        "  push('savefmt_v44_to_v45', v42m?.schemaVersion === 'op10m-agent03-v45' && Array.isArray(v42m?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog));\n  push('savefmt_v43_to_v44', v42m?.schemaVersion === 'op10m-agent03-v45'",
    )
(ROOT / 'scripts/bundle-chunk.mjs').write_text(bundle)

# tests
tests = (ROOT / 'tests/agent03-self-tests.ts').read_text()
if 'wave45' not in tests:
    tests = tests.replace(
        "  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave44', () => {",
        """  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_outlook_derived_wave45', () => {
    const inputs = baseInputs({ turn: 45 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 45);
    assert(outlook?.integrationBaselineShaHint === '98bcd652');
    assert(outlook?.projectedFunctionalHint === 2_548_579);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave44', () => {""",
    )
(ROOT / 'tests/agent03-self-tests.ts').write_text(tests)

print('v45 implement script done')
