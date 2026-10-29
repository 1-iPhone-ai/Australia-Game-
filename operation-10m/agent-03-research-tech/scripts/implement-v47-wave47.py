#!/usr/bin/env python3
"""One-shot Agent 03 save v47 (O10-225 wave 47)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

# --- types.ts ---
types = (SRC / 'types.ts').read_text()
types = types.replace(
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v46' as const;",
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v47' as const;",
)
types = types.replace(
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v45'\n  | 'op10m-agent03-v44'\n  | 'op10m-agent03-v43'",
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v46'\n  | 'op10m-agent03-v45'\n  | 'op10m-agent03-v44'\n  | 'op10m-agent03-v43'",
)
insert_types = """
export type ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealBand = 89 | 98 | 99 | 100;

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBand;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot {
  capturedAtTurn: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationSealMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBand | 0;
  digest: string;
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveSealHandoffIntegrationOutlook {
"""
if 'IntegrationSealBand = 88' not in types:
    types = types.replace(
        'export interface ResearchScaleWaveSealHandoffIntegrationOutlook {',
        insert_types,
        1,
    )
types = types.replace(
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook | null;\n  unlockSeq:",
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook | null;\n  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook | null;\n  unlockSeq:",
)
types = types.replace(
    "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;\n}",
    "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[];\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null;\n}",
)
(SRC / 'types.ts').write_text(types)

# --- new TS modules (from v45 integration band templates) ---
integration_band = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts').read_text()
integration_seal_band = integration_band.replace('IntegrationOutlook', 'IntegrationSealOutlook')
integration_seal_band = integration_seal_band.replace('IntegrationBand', 'IntegrationSealBand')
integration_seal_band = integration_seal_band.replace('IntegrationSnapshot', 'IntegrationSealSnapshot')
integration_seal_band = integration_seal_band.replace('integrationScore', 'integrationSealScore')
integration_seal_band = integration_seal_band.replace(
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore',
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore',
)
integration_seal_band = integration_seal_band.replace('SEAL_CONTINUITY_HANDOFF_INTEGRATION_BANDS', 'SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BANDS')
integration_seal_band = integration_seal_band.replace('[87, 98, 99, 100]', '[88, 98, 99, 100]')
integration_seal_band = integration_seal_band.replace('O10-221 (persist, scale wave round 45)', 'O10-223 (persist, scale wave round 46)')
integration_seal_band = integration_seal_band.replace(
    'seal-continuity-handoff-integration-band-log.ts',
    'seal-continuity-handoff-integration-seal-band-log.ts',
)
integration_seal_band = integration_seal_band.replace(
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts',
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-band-log.ts',
)
out_band = SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-band-log.ts'
out_band.write_text(integration_seal_band)

integration_snap = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-snapshot.ts').read_text()
integration_seal_snap = integration_snap.replace('IntegrationOutlook', 'IntegrationSealOutlook')
integration_seal_snap = integration_seal_snap.replace('IntegrationSnapshot', 'IntegrationSealSnapshot')
integration_seal_snap = integration_seal_snap.replace(
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore',
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore',
)
integration_seal_snap = integration_seal_snap.replace('integrationMomentum', 'integrationSealMomentum')
integration_seal_snap = integration_seal_snap.replace('[87, 98, 99, 100]', '[88, 98, 99, 100]')
integration_seal_snap = integration_seal_snap.replace('seal-continuity-handoff-integration-band-log.ts', 'seal-continuity-handoff-integration-seal-band-log.ts')
integration_seal_snap = integration_seal_snap.replace(
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts',
    'seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-snapshot.ts').write_text(integration_seal_snap)

seal_out = '''import type {
  ResearchProgressInputs,
  ResearchProgressState,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
} from './types.ts';

/** Seal handoff integration seal continuity handoff integration seal continuity handoff integration seal continuity handoff integration seal for Agent 25 O10-223 (read-only, scale wave round 46). */
export function computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook'
    | 'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot'
    | 'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot'
  >
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook {
  const integration = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
  const handoff = ctx.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook;
  const horizonTurns = integration?.horizonTurns ?? handoff?.horizonTurns ?? 6;
  const waveOrdinal = 46;

  const integrationScore = integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore ?? 0;
  const handoffScore = handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore ?? 0;
  const priorIntegrationPeak = ctx.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?.peakBand ?? 0;
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
    integrationBaselineShaHint: 'a9bb07e5',
    priorBaselineHints: [...new Set(priorHints)].slice(0, 4),
    projectedFunctionalHint: 2_593_189,
    dryRunEligible,
    ticketHint: dryRunEligible ? 'O10-224' : null,
  };
}
'''
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-outlook.ts').write_text(seal_out)

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
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
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

# --- save-migration.ts (minimal v46 deltas) ---
sm = (SRC / 'save-migration.ts').read_text()
imp_anchor = "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-snapshot.ts';"
imp_add = imp_anchor + """
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-snapshot.ts';"""
if 'emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog' not in sm:
    sm = sm.replace(imp_anchor, imp_add, 1)

if "const LEGACY_V45 = 'op10m-agent03-v45'" not in sm:
    sm = sm.replace(
        "const LEGACY_V44 = 'op10m-agent03-v44' as const;",
        "const LEGACY_V45 = 'op10m-agent03-v45' as const;\nconst LEGACY_V44 = 'op10m-agent03-v44' as const;",
    )

if 'ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent' not in sm.split('interface ResearchProgressPersistedCore')[1][:4000]:
    sm = sm.replace(
        "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;\n}",
        "  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[];\n  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null;\n}",
        1,
    )

sm = sm.replace(
    "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',\n] as const;",
    "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',\n  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook',\n] as const;",
)

# finalizeCore / merge partials — append empty defaults (pattern from v45)
for old, new in [
    (
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n  };",
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,\n  };",
    ),
    (
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n    unlockEventLog",
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,\n    unlockEventLog",
    ),
    (
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,\n  });",
        "    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),\n    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: null,\n  });",
    ),
]:
    if new.split('\n')[1].strip()[:40] not in sm:
        sm = sm.replace(old, new, 1)

if 'if (ver === LEGACY_V45)' not in sm:
    start = sm.index('  if (ver === LEGACY_V44) {')
    end = sm.index('  if (ver === LEGACY_V43) {')
    block44 = sm[start:end]
    block45 = block44.replace('LEGACY_V44', 'LEGACY_V45')
    block45 = block45.replace(
        """        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
      },
      LEGACY_V45""",
        """        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: null,
      },
      LEGACY_V45""",
    )
    sm = sm[:start] + block45 + sm[start:]

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
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
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
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      computed.turn
    ),
  };
}""",
)
if 'SealContinuityHandoffIntegrationBandLog,' not in sm:
    sm = sm.replace(tail_a, tail_b, 1)

(SRC / 'save-migration.ts').write_text(sm)

# bundle v45 -> v46
bundle = (ROOT / 'scripts/bundle-chunk.mjs').read_text()
bundle = bundle.replace("'op10m-agent03-v45'", "'op10m-agent03-v46'")
if 'savefmt_v45_to_v46' not in bundle:
    bundle = bundle.replace(
        "  push('savefmt_v43_to_v44', v42m?.schemaVersion === 'op10m-agent03-v46'",
        "  push('savefmt_v45_to_v46', v42m?.schemaVersion === 'op10m-agent03-v46' && Array.isArray(v42m?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog));\n  push('savefmt_v43_to_v44', v42m?.schemaVersion === 'op10m-agent03-v46'",
    )
(ROOT / 'scripts/bundle-chunk.mjs').write_text(bundle)

# tests
tests = (ROOT / 'tests/agent03-self-tests.ts').read_text()
if 'wave46' not in tests:
    tests = tests.replace(
        "  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave44', () => {",
        """  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_outlook_derived_wave46', () => {
    const inputs = baseInputs({ turn: 46 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 45);
    assert(outlook?.integrationBaselineShaHint === 'a9bb07e5');
    assert(outlook?.projectedFunctionalHint === 2_593_189);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave44', () => {""",
    )
(ROOT / 'tests/agent03-self-tests.ts').write_text(tests)

print('v46 implement script done')
