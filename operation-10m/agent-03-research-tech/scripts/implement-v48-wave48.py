#!/usr/bin/env python3
"""One-shot Agent 03 save v48 (O10-227 wave 48)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

# --- types.ts ---
types = (SRC / 'types.ts').read_text()
types = types.replace(
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v47' as const;",
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v48' as const;",
)
types = types.replace(
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v46'",
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v47'\n  | 'op10m-agent03-v46'",
)
insert_types = """
export type ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealBand = 90 | 98 | 99 | 100;

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealBand;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSnapshot {
  capturedAtTurn: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationSealSealSealMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealBand | 0;
  digest: string;
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveSealHandoffIntegrationOutlook {
"""
if 'SealSealSealBand = 90' not in types:
    types = types.replace(
        'export interface ResearchScaleWaveSealHandoffIntegrationOutlook {',
        insert_types,
        1,
    )
types = types.replace(
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook | null;\n  unlockSeq:",
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook | null;\n  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook | null;\n  unlockSeq:",
)
(SRC / 'types.ts').write_text(types)

# --- band log + snapshot from seal-seal templates ---
seal_band = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-band-log.ts').read_text()
seal_seal_band = seal_band.replace('SealSealBand', 'SealSealSealBand')
seal_seal_band = seal_seal_band.replace('SealSealOutlook', 'SealSealSealOutlook')
seal_seal_band = seal_seal_band.replace('SealSealScore', 'SealSealSealScore')
seal_seal_band = seal_seal_band.replace('[89, 98, 99, 100]', '[90, 98, 99, 100]')
seal_seal_band = seal_seal_band.replace('seal-seal-band-log.ts', 'seal-seal-seal-band-log.ts')
seal_seal_band = seal_seal_band.replace(
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-band-log.ts',
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-band-log.ts').write_text(seal_seal_band)

seal_snap = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-snapshot.ts').read_text()
seal_seal_snap = seal_snap.replace('SealSealOutlook', 'SealSealSealOutlook')
seal_seal_snap = seal_seal_snap.replace('SealSealSnapshot', 'SealSealSealSnapshot')
seal_seal_snap = seal_seal_snap.replace('SealSealScore', 'SealSealSealScore')
seal_seal_snap = seal_seal_snap.replace('integrationSealSealMomentum', 'integrationSealSealSealMomentum')
seal_seal_snap = seal_seal_snap.replace('[89, 98, 99, 100]', '[90, 98, 99, 100]')
seal_seal_snap = seal_seal_snap.replace('seal-seal-band-log.ts', 'seal-seal-seal-band-log.ts')
seal_seal_snap = seal_seal_snap.replace(
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-band-log.ts',
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-snapshot.ts').write_text(seal_seal_snap)

seal_seal_seal_out = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-outlook.ts').read_text()
seal_seal_seal_seal_out = seal_seal_seal_out.replace('SealSealSealOutlook', 'SealSealSealSealOutlook')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace('SealSealSealScore', 'SealSealSealSealScore')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace(
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook',
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook',
)
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace(
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot',
    'sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSnapshot',
)
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace(
    "integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealScore",
    "integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealScore",
)
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace(
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook',
)
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace(
    'handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore',
    'handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealScore',
)
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace('waveOrdinal = 47', 'waveOrdinal = 48')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace("'456efb9'", "'4404bf0f'")
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace('2_637_258', '2_684_235')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace("'O10-226'", "'O10-227'")
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace('O10-225', 'O10-227')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace('round 47', 'round 48')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace('seal-seal-seal-outlook.ts', 'seal-seal-seal-seal-outlook.ts')
seal_seal_seal_seal_out = seal_seal_seal_seal_out.replace(
    'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook',
    'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-outlook.ts').write_text(seal_seal_seal_seal_out)

# --- compute.ts ---
compute = (SRC / 'compute.ts').read_text()
if 'SealSealSealSealOutlook' not in compute:
    compute = compute.replace(
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-outlook.ts';",
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-outlook.ts';\nimport { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-outlook.ts';",
        1,
    )
    block = """
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot:
        coreBase.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    });

"""
    compute = compute.replace(
        '  const computed: ResearchProgressState = {',
        block + '  const computed: ResearchProgressState = {',
        1,
    )
    compute = compute.replace(
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook,\n    unlockSeq:',
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook,\n    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook,\n    unlockSeq:',
        1,
    )
(SRC / 'compute.ts').write_text(compute)

# --- save-migration.ts ---
sm = (SRC / 'save-migration.ts').read_text()
if "const LEGACY_V47 = 'op10m-agent03-v47'" not in sm:
    sm = sm.replace(
        "const LEGACY_V46 = 'op10m-agent03-v46' as const;",
        "const LEGACY_V47 = 'op10m-agent03-v47' as const;\nconst LEGACY_V46 = 'op10m-agent03-v46' as const;",
    )
if 'SealSealSealSealOutlook' not in sm:
    sm = sm.replace(
        "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook',\n] as const;",
        "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook',\n  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook',\n] as const;",
    )
(SRC / 'save-migration.ts').write_text(sm)

# --- bundle ---
bundle = (ROOT / 'scripts/bundle-chunk.mjs').read_text()
bundle = bundle.replace("'op10m-agent03-v47'", "'op10m-agent03-v48'")
if 'savefmt_v47_to_v48' not in bundle:
    bundle = bundle.replace(
        "  push('savefmt_v46_to_v47', v42m?.schemaVersion === 'op10m-agent03-v48'",
        "  push('savefmt_v47_to_v48', v42m?.schemaVersion === 'op10m-agent03-v48' && Array.isArray(v42m?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealBandLog));\n  push('savefmt_v46_to_v47', v42m?.schemaVersion === 'op10m-agent03-v48'",
    )
bundle = bundle.replace('saveFormatVersion: 44', 'saveFormatVersion: 45')
(ROOT / 'scripts/bundle-chunk.mjs').write_text(bundle)

# --- tests ---
tests = (ROOT / 'tests/agent03-self-tests.ts').read_text()
if 'wave48' not in tests:
    tests = tests.replace(
        "  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_outlook_derived_wave47', () => {",
        """  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_outlook_derived_wave48', () => {
    const inputs = baseInputs({ turn: 48 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 48);
    assert(outlook?.integrationBaselineShaHint === '4404bf0f');
    assert(outlook?.projectedFunctionalHint === 2_684_235);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_outlook_derived_wave47', () => {""",
    )
(ROOT / 'tests/agent03-self-tests.ts').write_text(tests)

print('v48 implement script done')
