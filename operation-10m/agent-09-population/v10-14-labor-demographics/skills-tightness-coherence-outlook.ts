import { v1014laborClamp } from './bands';
import type {
  NationalCredentialMobilityOutlook,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalSkillMismatchIndex,
  NationalSkillsTightnessCoherenceOutlook,
  SkillsTightnessCoherenceBand
} from './types';

function coherenceBand(index: number): SkillsTightnessCoherenceBand {
  if (index <= 34) return 'incoherent';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'coherent';
  return 'aligned';
}

export function computeNationalSkillsTightnessCoherenceOutlook(
  state: NationalLaborDemographicsState,
  mismatch: NationalSkillMismatchIndex | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined,
  credential: NationalCredentialMobilityOutlook | null | undefined
): NationalSkillsTightnessCoherenceOutlook {
  if (!state.enabled || !mismatch || !tightness || !credential) {
    return {
      turn: state.turn,
      coherenceIndex: 50,
      band: 'strained',
      mismatchDrag: 0,
      summary: 'Skills-tightness coherence idle — mismatch, tightness, or credential unavailable.',
      stewardNote: 'Compute mismatch, tightness, and credential mobility before coherence guidance.'
    };
  }

  const mismatchDrag =
    mismatch.nationalBand === 'critical_mismatch'
      ? 18
      : mismatch.nationalBand === 'elevated_gap'
        ? 12
        : mismatch.nationalMismatchIndex * 0.15;
  const tightnessDrag =
    tightness.band === 'critical_shortage' ? 14 : tightness.band === 'tight' ? 8 : 0;
  const credentialLift =
    credential.band === 'portable' || credential.band === 'fluid'
      ? credential.mobilityIndex * 0.28
      : credential.mobilityIndex * 0.16;
  const linkageLift = state.employmentLinkageScore * 0.14;

  const coherenceIndex = v1014laborClamp(32 + credentialLift + linkageLift - mismatchDrag - tightnessDrag);
  const band = coherenceBand(coherenceIndex);

  const stewardNote =
    band === 'incoherent' || band === 'strained'
      ? 'Strained skills-tightness coherence — sequence upskilling before wage surges in tight hubs.'
      : band === 'aligned'
        ? 'Aligned coherence — avoid corridor moves that outrun credential mobility.'
        : 'Coherent band — monitor mismatch in critical shortage regions.';

  return {
    turn: state.turn,
    coherenceIndex,
    band,
    mismatchDrag,
    summary: `Skills-tightness coherence ${band} (index ${Math.round(coherenceIndex)}); mismatch drag ${Math.round(mismatchDrag)}.`,
    stewardNote
  };
}
