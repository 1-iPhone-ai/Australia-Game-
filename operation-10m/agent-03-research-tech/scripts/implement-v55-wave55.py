#!/usr/bin/env python3
"""One-shot Agent 03 save v55 (O10-247 wave 55)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

# --- types.ts ---
types = (SRC / 'types.ts').read_text()
types = types.replace(
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v54' as const;",
    "export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v55' as const;",
)
types = types.replace(
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v53'\n  | 'op10m-agent03-v52'\n  | 'op10m-agent03-v50'\n  | 'op10m-agent03-v49'",
    "  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION\n  | 'op10m-agent03-v54'\n  | 'op10m-agent03-v53'\n  | 'op10m-agent03-v52'\n  | 'op10m-agent03-v50'\n  | 'op10m-agent03-v49'",
)
insert_types = """
export type ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand = 96 | 98 | 99 | 100;

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSnapshot {
  capturedAtTurn: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationSealSealSealSealSealSealSealSealSealMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealBand | 0;
  digest: string;
}

export interface ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveSealHandoffIntegrationOutlook {
"""
if 'SealSealSealSealSealSealSealSealSealBand = 96' not in types:
    types = types.replace(
        'export interface ResearchScaleWaveSealHandoffIntegrationOutlook {',
        insert_types,
        1,
    )
types = types.replace(
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook | null;\n  unlockSeq:",
    "  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook | null;\n  scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook | null;\n  unlockSeq:",
)
(SRC / 'types.ts').write_text(types)

# --- band log + snapshot from prior seal templates ---
seal_band = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts').read_text()
seal_seal_band = seal_band.replace('SealSealSealSealSealSealSealSealBand', 'SealSealSealSealSealSealSealSealSealBand')
seal_seal_band = seal_seal_band.replace('SealSealSealSealSealSealSealSealOutlook', 'SealSealSealSealSealSealSealSealSealOutlook')
seal_seal_band = seal_seal_band.replace('SealSealSealSealSealSealSealSealScore', 'SealSealSealSealSealSealSealSealSealScore')
seal_seal_band = seal_seal_band.replace('[95, 98, 99, 100]', '[96, 98, 99, 100]')
seal_seal_band = seal_seal_band.replace('seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts', 'seal-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts')
seal_seal_band = seal_seal_band.replace(
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts',
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts').write_text(seal_seal_band)

seal_snap = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-snapshot.ts').read_text()
seal_seal_snap = seal_snap.replace('SealSealSealSealSealSealSealSealOutlook', 'SealSealSealSealSealSealSealSealSealOutlook')
seal_seal_snap = seal_seal_snap.replace('SealSealSealSealSealSealSealSealSnapshot', 'SealSealSealSealSealSealSealSealSealSnapshot')
seal_seal_snap = seal_seal_snap.replace('SealSealSealSealSealSealSealSealScore', 'SealSealSealSealSealSealSealSealSealScore')
seal_seal_snap = seal_seal_snap.replace('integrationSealSealSealSealSealSealSealSealMomentum', 'integrationSealSealSealSealSealSealSealSealSealMomentum')
seal_seal_snap = seal_seal_snap.replace('[95, 98, 99, 100]', '[96, 98, 99, 100]')
seal_seal_snap = seal_seal_snap.replace('seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts', 'seal-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts')
seal_seal_snap = seal_seal_snap.replace(
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts',
    'integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-band-log.ts',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-snapshot.ts').write_text(seal_seal_snap)

seal_out = (SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts').read_text()
seal_out = seal_out.replace('SealSealSealSealSealSealSealSealSealOutlook', 'SealSealSealSealSealSealSealSealSealSealOutlook')
seal_out = seal_out.replace('SealSealSealSealSealSealSealSealSealScore', 'SealSealSealSealSealSealSealSealSealSealScore')
seal_out = seal_out.replace(
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook',
)
seal_out = seal_out.replace(
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealOutlook',
    'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',
)
seal_out = seal_out.replace(
    "integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealScore",
    "integration?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealScore",
)
seal_out = seal_out.replace(
    'handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealScore',
    'handoff?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealScore',
)
seal_out = seal_out.replace('inputs.turn >= 54 ? 54 : 53', 'inputs.turn >= 55 ? 55 : 54')
seal_out = seal_out.replace("'5bd043ad' : '51039c5e'", "'c4bbec67' : '5bd043ad'")
seal_out = seal_out.replace('3_022_056 : 2_979_928', '3_054_213 : 3_022_056')
seal_out = seal_out.replace("'O10-240'", "'O10-247'")
seal_out = seal_out.replace('O10-240', 'O10-247')
seal_out = seal_out.replace('round 54', 'round 55')
seal_out = seal_out.replace('seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts', 'seal-seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts')
seal_out = seal_out.replace(
    'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook',
    'computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook',
)
(SRC / 'scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts').write_text(seal_out)

# --- compute.ts ---
compute = (SRC / 'compute.ts').read_text()
if 'SealSealSealSealSealSealSealSealSealSealOutlook' not in compute:
    compute = compute.replace(
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts';",
        "} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts';\nimport { computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook } from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-seal-seal-seal-seal-seal-seal-seal-seal-seal-outlook.ts';",
        1,
    )
    block = """
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook =
    computeResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook(inputs, {
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealOutlook,
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
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,\n    unlockSeq:',
        '    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook,\n    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook,\n    unlockSeq:',
        1,
    )
(SRC / 'compute.ts').write_text(compute)

# --- save-migration.ts ---
sm = (SRC / 'save-migration.ts').read_text()
if "const LEGACY_V53 = 'op10m-agent03-v54'" not in sm:
    sm = sm.replace(
        "const LEGACY_V52 = 'op10m-agent03-v53' as const;\nconst LEGACY_V51 = 'op10m-agent03-v52' as const;\nconst LEGACY_V50 = 'op10m-agent03-v50' as const;",
        "const LEGACY_V53 = 'op10m-agent03-v54' as const;\nconst LEGACY_V52 = 'op10m-agent03-v53' as const;\nconst LEGACY_V51 = 'op10m-agent03-v52' as const;\nconst LEGACY_V50 = 'op10m-agent03-v50' as const;",
    )
if 'SealSealSealSealSealSealSealSealSealSealOutlook' not in sm:
    sm = sm.replace(
        "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook',\n] as const;",
        "  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealOutlook',\n  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook',\n] as const;",
    )
(SRC / 'save-migration.ts').write_text(sm)

# --- bundle ---
bundle = (ROOT / 'scripts/bundle-chunk.mjs').read_text()
bundle = bundle.replace("'op10m-agent03-v54'", "'op10m-agent03-v55'")
if 'savefmt_v53_to_v54' not in bundle:
    bundle = bundle.replace(
        "  push('savefmt_v52_to_v53', v42m?.schemaVersion === 'op10m-agent03-v54'",
        "  push('savefmt_v53_to_v54', v42m?.schemaVersion === 'op10m-agent03-v55' && Array.isArray(v42m?.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealBandLog));\n  push('savefmt_v52_to_v53', v42m?.schemaVersion === 'op10m-agent03-v55'",
    )
bundle = bundle.replace('saveFormatVersion: 50', 'saveFormatVersion: 51')
(ROOT / 'scripts/bundle-chunk.mjs').write_text(bundle)

# --- tests ---
tests = (ROOT / 'tests/agent03-self-tests.ts').read_text()
if 'derived_wave55' not in tests:
    tests = tests.replace(
        "  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_seal_seal_seal_seal_seal_outlook_derived_wave54', () => {",
        """  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_seal_seal_seal_seal_seal_seal_outlook_derived_wave55', () => {
    const inputs = baseInputs({ turn: 55 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 55);
    assert(outlook?.integrationBaselineShaHint === 'c4bbec67');
    assert(outlook?.projectedFunctionalHint === 3_054_213);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealSealSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_seal_seal_seal_seal_seal_seal_outlook_derived_wave54', () => {""",
    )
(ROOT / 'tests/agent03-self-tests.ts').write_text(tests)

print('v55 implement script done')
