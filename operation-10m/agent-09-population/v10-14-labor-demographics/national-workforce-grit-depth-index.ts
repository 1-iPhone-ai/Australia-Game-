import { v1014laborClamp } from './bands';
import {
  type NationalGritResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalPerseveranceGritCouplingBrief,
  type NationalSubjectGritReadinessBrief,
  type NationalWorkforceGritDepthIndex,
  type WorkforceGritDepthBand
} from './types';

function depthBand(index: number): WorkforceGritDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'grit';
}

export function computeNationalWorkforceGritDepthIndex(
  state: NationalLaborDemographicsState,
  perseveranceGrit: NationalPerseveranceGritCouplingBrief | null | undefined,
  gritResilience: NationalGritResilienceOutlook | null | undefined,
  subjectGrit: NationalSubjectGritReadinessBrief | null | undefined
): NationalWorkforceGritDepthIndex {
  if (!state.enabled || !perseveranceGrit || !gritResilience || !subjectGrit) {
    return {
      turn: state.turn,
      gritIndex: 50,
      band: 'thin',
      gritDrag: 0,
      summary: 'Workforce grit depth idle — coupling, resilience, or subject grit unavailable.',
      stewardNote: 'Compute O10-229 wave-49 depth stack before grit guidance.'
    };
  }

  const gritDrag = v1014laborClamp(
    subjectGrit.gritDrag * 0.35 +
      perseveranceGrit.perseveranceDrag * 0.3 +
      gritResilience.perseveranceDrag * 0.25 +
      (subjectGrit.band === 'below_grit' || perseveranceGrit.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    perseveranceGrit.band === 'amplified' || perseveranceGrit.band === 'elevated'
      ? perseveranceGrit.couplingIndex * 0.2
      : perseveranceGrit.couplingIndex * 0.1;
  const resilienceLift =
    gritResilience.band === 'rising' || gritResilience.band === 'fortified'
      ? gritResilience.resilienceIndex * 0.18
      : gritResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectGrit.band === 'grit_ready' || subjectGrit.band === 'perseverance_locked'
      ? subjectGrit.gritIndex * 0.22
      : subjectGrit.gritIndex * 0.11;

  const gritIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - gritDrag);
  const band = depthBand(gritIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce grit depth — sequence perseverance-grit, resilience, and subject grit before post-73e5e01 tranche.'
      : band === 'grit'
        ? 'Grit band — avoid corridor overload that breaks subject grit bands.'
        : 'Elevated grit depth — refresh subject grit checks each scale wave.';

  return {
    turn: state.turn,
    gritIndex,
    band,
    gritDrag,
    summary: `National workforce grit depth ${band} (index ${Math.round(gritIndex)}); grit drag ${Math.round(gritDrag)}.`,
    stewardNote
  };
}
