import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalRetentionReliabilityCouplingBrief,
  type NationalSustainmentRetentionCouplingBrief,
  type NationalWorkforceSustainmentIndex,
  type SustainmentRetentionCouplingBand
} from './types';

function couplingBand(index: number): SustainmentRetentionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'linked';
  return 'reinforced';
}

export function computeNationalSustainmentRetentionCouplingBrief(
  state: NationalLaborDemographicsState,
  sustainment: NationalWorkforceSustainmentIndex | null | undefined,
  retentionCoupling: NationalRetentionReliabilityCouplingBrief | null | undefined
): NationalSustainmentRetentionCouplingBrief {
  if (!state.enabled || !sustainment || !retentionCoupling) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      sustainmentDrag: 0,
      summary: 'Sustainment-retention coupling idle — sustainment or retention coupling unavailable.',
      stewardNote: 'Compute workforce sustainment and retention-reliability coupling before round-18 guidance.'
    };
  }

  const sustainmentDrag = v1014laborClamp(
    sustainment.subjectDrag * 0.45 +
      retentionCoupling.reliabilityDrag * 0.35 +
      (sustainment.band === 'depleted' || sustainment.band === 'thin' ? 10 : 2)
  );
  const sustainmentLift =
    sustainment.band === 'sustained' || sustainment.band === 'resilient'
      ? sustainment.sustainmentIndex * 0.26
      : sustainment.sustainmentIndex * 0.13;
  const retentionLift =
    retentionCoupling.band === 'anchored' || retentionCoupling.band === 'reinforced'
      ? retentionCoupling.couplingIndex * 0.24
      : retentionCoupling.couplingIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + sustainmentLift + retentionLift - sustainmentDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained sustainment-retention link — rebuild sustainment before retention corridor moves.'
      : band === 'reinforced'
        ? 'Reinforced coupling — guard onboarding velocity spikes that thin retention pools.'
        : 'Linked coupling — pair sustainment checks with retention packs each assembly wave.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    sustainmentDrag,
    summary: `Sustainment-retention coupling ${band} (index ${Math.round(couplingIndex)}); sustainment drag ${Math.round(sustainmentDrag)}.`,
    stewardNote
  };
}
