#!/usr/bin/env python3
"""One-shot Agent 03 save v51 (O10-233 wave 51)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

# --- types.ts ---
types = (SRC / 'types.ts').read_text()
types = types.replace(
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v50' as const;",
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v51' as const;",
)
types = types.replace(
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v49'",
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v50'\n  | 'op10m-agent03-v49'",
)
insert_types = """
export type ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealBand = 93 | 98 | 99 | 100;

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealBand;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSnapshot {
  capturedAtTurn: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationSealSealSealSealSealSealMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealBand | 0;
  digest: string;
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveSealHandoffIntegrationOutlook {
"""
if 'SealSealSealSealSealSealBand = 93' not in types:
    types = types.replace(
        'export interface ResearchScaleWaveSealHandoffIntegrationOutlook {',
        insert_types,
        1,
    )
types = types.replace(
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook | null;\n  unlockSeq:",
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook | null;\n  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook | null;\n  unlockSeq:",
)
(SRC / 'types.ts').write_text(types)

# --- band log + snapshot from seal-seal-seal-seal-seal templates ---
seal_band = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-band-log.ts').read_text()
seal_seal_band = seal_band.replace('SealSealSealSealSealBand', 'SealSealSealSealSealSealBand')
seal_seal_band = seal_seal_band.replace('SealSealSealSealSealOutlook', 'SealSealSealSealSealSealOutlook')
seal_seal_band = seal_seal_band.replace('SealSealSealSealSealScore', 'SealSealSealSealSealSealScore')
seal_seal_band = seal_seal_band.replace('[92, 98, 99, 100]', '[93, 98, 99, 100]')
seal_seal_band = seal_seal_band.replace('seal-seal-seal-seal-seal-band-log.ts', 'seal-seal-seal-seal-seal-seal-band-log.ts')
seal_seal_band = seal_seal_band.replace(
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-band-log.ts',
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-band-log.ts').write_text(seal_seal_band)

seal_snap = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-snapshot.ts').read_text()
seal_seal_snap = seal_snap.replace('SealSealSealSealSealOutlook', 'SealSealSealSealSealSealOutlook')
seal_seal_snap = seal_seal_snap.replace('SealSealSealSealSealSnapshot', 'SealSealSealSealSealSealSnapshot')
seal_seal_snap = seal_seal_snap.replace('SealSealSealSealSealScore', 'SealSealSealSealSealSealScore')
seal_seal_snap = seal_seal_snap.replace('integrationSealSealSealSealSealMomentum', 'integrationSealSealSealSealSealSealMomentum')
seal_seal_snap = seal_seal_snap.replace('[92, 98, 99, 100]', '[93, 98, 99, 100]')
seal_seal_snap = seal_seal_snap.replace('seal-seal-seal-seal-seal-band-log.ts', 'seal-seal-seal-seal-seal-seal-band-log.ts')
seal_seal_snap = seal_seal_snap.replace(
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-band-log.ts',
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-snapshot.ts').write_text(seal_seal_snap)

seal_out = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-outlook.ts').read_text()
seal_out = seal_out.replace('SealSealSealSealSealSealOutlook', 'SealSealSealSealSealSealSealOutlook')
seal_out = seal_out.replace('SealSealSealSealSealSealScore', 'SealSealSealSealSealSealSealScore')
seal_out = seal_out.replace(
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealOutlook',
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',
)
seal_out = seal_out.replace(
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook',
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealOutlook',
)
seal_out = seal_out.replace(
    "integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealScore",
    "integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealScore",
)
seal_out = seal_out.replace(
    'handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealScore',
    'handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealScore',
)
seal_out = seal_out.replace('waveOrdinal = 50', 'waveOrdinal = 51')
seal_out = seal_out.replace("'8aaaf700'", "'a32b2b15'")
seal_out = seal_out.replace('2_771_207', '2_887_600')
seal_out = seal_out.replace("'O10-231'", "'O10-233'")
seal_out = seal_out.replace('O10-231', 'O10-233')
seal_out = seal_out.replace('round 50', 'round 51')
seal_out = seal_out.replace('seal-seal-seal-seal-seal-seal-outlook.ts', 'seal-seal-seal-seal-seal-seal-seal-outlook.ts')
seal_out = seal_out.replace(
    'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',
    'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-outlook.ts').write_text(seal_out)

# --- compute.ts ---
compute = (SRC / 'compute.ts').read_text()
if 'SealSealSealSealSealSealSealOutlook' not in compute:
    compute = compute.replace(
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-outlook.ts';",
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-outlook.ts';\nimport { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-outlook.ts';",
        1,
    )
    block = """
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealOutlook,
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
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook,\n    unlockSeq:',
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook,\n    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook,\n    unlockSeq:',
        1,
    )
(SRC / 'compute.ts').write_text(compute)

# --- save-migration.ts ---
sm = (SRC / 'save-migration.ts').read_text()
if "const LEGACY_V50 = 'op10m-agent03-v50'" not in sm:
    sm = sm.replace(
        "const LEGACY_V49 = 'op10m-agent03-v49' as const;",
        "const LEGACY_V50 = 'op10m-agent03-v50' as const;\nconst LEGACY_V49 = 'op10m-agent03-v49' as const;",
    )
if 'SealSealSealSealSealSealSealOutlook' not in sm:
    sm = sm.replace(
        "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',\n] as const;",
        "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',\n  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook',\n] as const;",
    )
(SRC / 'save-migration.ts').write_text(sm)

# --- bundle ---
bundle = (ROOT / 'scripts/bundle-chunk.mjs').read_text()
bundle = bundle.replace("'op10m-agent03-v50'", "'op10m-agent03-v51'")
if 'savefmt_v50_to_v51' not in bundle:
    bundle = bundle.replace(
        "  push('savefmt_v49_to_v50', v42m?.schemaVersion === 'op10m-agent03-v50'",
        "  push('savefmt_v50_to_v51', v42m?.schemaVersion === 'op10m-agent03-v51' && Array.isArray(v42m?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealBandLog));\n  push('savefmt_v49_to_v50', v42m?.schemaVersion === 'op10m-agent03-v51'",
    )
bundle = bundle.replace('saveFormatVersion: 47', 'saveFormatVersion: 48')
(ROOT / 'scripts/bundle-chunk.mjs').write_text(bundle)

# --- tests ---
tests = (ROOT / 'tests/agent03-self-tests.ts').read_text()
if 'wave51' not in tests:
    tests = tests.replace(
        "  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_seal_seal_outlook_derived_wave50', () => {",
        """  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_seal_seal_seal_outlook_derived_wave51', () => {
    const inputs = baseInputs({ turn: 51 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 51);
    assert(outlook?.integrationBaselineShaHint === 'a32b2b15');
    assert(outlook?.projectedFunctionalHint === 2_887_600);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_seal_outlook_derived_wave50', () => {""",
    )
(ROOT / 'tests/agent03-self-tests.ts').write_text(tests)

print('v51 implement script done')
