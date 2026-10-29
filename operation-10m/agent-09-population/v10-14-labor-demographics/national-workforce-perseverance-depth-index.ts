import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalPerseveranceResilienceOutlook,
  type NationalSubjectPerseveranceReadinessBrief,
  type NationalTenacityPerseveranceCouplingBrief,
  type NationalWorkforcePerseveranceDepthIndex,
  type WorkforcePerseveranceDepthBand
} from './types';

function depthBand(index: number): WorkforcePerseveranceDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'perseverance';
}

export function computeNationalWorkforcePerseveranceDepthIndex(
  state: NationalLaborDemographicsState,
  tenacityPerseverance: NationalTenacityPerseveranceCouplingBrief | null | undefined,
  perseveranceResilience: NationalPerseveranceResilienceOutlook | null | undefined,
  subjectPerseverance: NationalSubjectPerseveranceReadinessBrief | null | undefined
): NationalWorkforcePerseveranceDepthIndex {
  if (!state.enabled || !tenacityPerseverance || !perseveranceResilience || !subjectPerseverance) {
    return {
      turn: state.turn,
      perseveranceIndex: 50,
      band: 'thin',
      perseveranceDrag: 0,
      summary: 'Workforce perseverance depth idle — coupling, resilience, or subject perseverance unavailable.',
      stewardNote: 'Compute O10-227 wave-48 depth stack before perseverance guidance.'
    };
  }

  const perseveranceDrag = v1014laborClamp(
    subjectPerseverance.perseveranceDrag * 0.35 +
      tenacityPerseverance.tenacityDrag * 0.3 +
      perseveranceResilience.tenacityDrag * 0.25 +
      (subjectPerseverance.band === 'below_perseverance' || tenacityPerseverance.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    tenacityPerseverance.band === 'amplified' || tenacityPerseverance.band === 'elevated'
      ? tenacityPerseverance.couplingIndex * 0.2
      : tenacityPerseverance.couplingIndex * 0.1;
  const resilienceLift =
    perseveranceResilience.band === 'rising' || perseveranceResilience.band === 'fortified'
      ? perseveranceResilience.resilienceIndex * 0.18
      : perseveranceResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectPerseverance.band === 'perseverance_ready' || subjectPerseverance.band === 'tenacity_locked'
      ? subjectPerseverance.perseveranceIndex * 0.22
      : subjectPerseverance.perseveranceIndex * 0.11;

  const perseveranceIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - perseveranceDrag);
  const band = depthBand(perseveranceIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce perseverance depth — sequence tenacity-perseverance, resilience, and subject perseverance before post-4404bf0f tranche.'
      : band === 'perseverance'
        ? 'Perseverance band — avoid corridor overload that breaks subject perseverance bands.'
        : 'Elevated perseverance depth — refresh subject perseverance checks each scale wave.';

  return {
    turn: state.turn,
    perseveranceIndex,
    band,
    perseveranceDrag,
    summary: `National workforce perseverance depth ${band} (index ${Math.round(perseveranceIndex)}); perseverance drag ${Math.round(perseveranceDrag)}.`,
    stewardNote
  };
}
