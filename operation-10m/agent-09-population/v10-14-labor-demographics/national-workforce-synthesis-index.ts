import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectSynthesisReadinessBrief,
  type NationalUnificationUpskillingCouplingBrief,
  type NationalUpskillingSynthesisOutlook,
  type NationalWorkforceSynthesisIndex,
  type WorkforceSynthesisBand
} from './types';

function synthesisBand(index: number): WorkforceSynthesisBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'synthesis';
}

export function computeNationalWorkforceSynthesisIndex(
  state: NationalLaborDemographicsState,
  upskillingCoupling: NationalUnificationUpskillingCouplingBrief | null | undefined,
  upskillingSynthesis: NationalUpskillingSynthesisOutlook | null | undefined,
  subjectSynthesis: NationalSubjectSynthesisReadinessBrief | null | undefined
): NationalWorkforceSynthesisIndex {
  if (!state.enabled || !upskillingCoupling || !upskillingSynthesis || !subjectSynthesis) {
    return {
      turn: state.turn,
      synthesisIndex: 50,
      band: 'thin',
      synthesisDrag: 0,
      summary: 'Workforce synthesis idle — upskilling coupling, upskilling synthesis, or subject synthesis unavailable.',
      stewardNote: 'Compute O10-201 wave-35 depth stack before synthesis guidance.'
    };
  }

  const synthesisDrag = v1014laborClamp(
    subjectSynthesis.synthesisDrag * 0.35 +
      upskillingCoupling.unificationDrag * 0.3 +
      upskillingSynthesis.harmonyDrag * 0.25 +
      (subjectSynthesis.band === 'below_synthesis' || upskillingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const upskillingLift =
    upskillingCoupling.band === 'amplified' || upskillingCoupling.band === 'elevated'
      ? upskillingCoupling.couplingIndex * 0.2
      : upskillingCoupling.couplingIndex * 0.1;
  const outlookLift =
    upskillingSynthesis.band === 'rising' || upskillingSynthesis.band === 'synthesis'
      ? upskillingSynthesis.synthesisIndex * 0.18
      : upskillingSynthesis.synthesisIndex * 0.09;
  const subjectLift =
    subjectSynthesis.band === 'synthesis_ready' || subjectSynthesis.band === 'unification_locked'
      ? subjectSynthesis.synthesisIndex * 0.22
      : subjectSynthesis.synthesisIndex * 0.11;

  const synthesisIndex = v1014laborClamp(18 + upskillingLift + outlookLift + subjectLift - synthesisDrag);
  const band = synthesisBand(synthesisIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce synthesis — sequence unification-upskilling, upskilling synthesis, and subject synthesis before post-1f7d25b tranche.'
      : band === 'synthesis'
        ? 'Synthesis band — avoid corridor overload that breaks subject synthesis bands.'
        : 'Elevated synthesis — refresh subject synthesis checks each scale wave.';

  return {
    turn: state.turn,
    synthesisIndex,
    band,
    synthesisDrag,
    summary: `National workforce synthesis ${band} (index ${Math.round(synthesisIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}
