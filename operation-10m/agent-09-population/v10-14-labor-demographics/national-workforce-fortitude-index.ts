import { v1014laborClamp } from './bands';
import {
  type NationalCoordinationBindOutlook,
  type NationalLaborDemographicsState,
  type NationalResolveUpskillingCouplingBrief,
  type NationalSubjectBindReadinessBrief,
  type NationalWorkforceFortitudeIndex,
  type WorkforceFortitudeBand
} from './types';

function fortitudeBand(index: number): WorkforceFortitudeBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'solid';
  return 'unshakable';
}

export function computeNationalWorkforceFortitudeIndex(
  state: NationalLaborDemographicsState,
  upskillingCoupling: NationalResolveUpskillingCouplingBrief | null | undefined,
  coordinationBind: NationalCoordinationBindOutlook | null | undefined,
  subjectBind: NationalSubjectBindReadinessBrief | null | undefined
): NationalWorkforceFortitudeIndex {
  if (!state.enabled || !upskillingCoupling || !coordinationBind || !subjectBind) {
    return {
      turn: state.turn,
      fortitudeIndex: 50,
      band: 'thin',
      bindDrag: 0,
      summary: 'Workforce fortitude idle — upskilling coupling, coordination bind, or subject bind unavailable.',
      stewardNote: 'Compute round-24 depth stack before fortitude guidance.'
    };
  }

  const bindDrag = v1014laborClamp(
    subjectBind.bindDrag * 0.35 +
      upskillingCoupling.resolveDrag * 0.3 +
      coordinationBind.schedulingDrag * 0.25 +
      (subjectBind.band === 'unbound' || upskillingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const upskillingLift =
    upskillingCoupling.band === 'aligned' || upskillingCoupling.band === 'accelerated'
      ? upskillingCoupling.couplingIndex * 0.2
      : upskillingCoupling.couplingIndex * 0.1;
  const coordinationLift =
    coordinationBind.band === 'bound' || coordinationBind.band === 'locked'
      ? coordinationBind.bindIndex * 0.18
      : coordinationBind.bindIndex * 0.09;
  const subjectLift =
    subjectBind.band === 'bound' || subjectBind.band === 'locked'
      ? subjectBind.bindIndex * 0.22
      : subjectBind.bindIndex * 0.11;

  const fortitudeIndex = v1014laborClamp(18 + upskillingLift + coordinationLift + subjectLift - bindDrag);
  const band = fortitudeBand(fortitudeIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce fortitude — sequence resolve-upskilling, coordination bind, and subject bind before post-b64a7aa8 tranche.'
      : band === 'unshakable'
        ? 'Unshakable fortitude — avoid corridor overload that breaks subject bind bands.'
        : 'Solid fortitude — refresh subject bind checks each scale wave.';

  return {
    turn: state.turn,
    fortitudeIndex,
    band,
    bindDrag,
    summary: `National workforce fortitude ${band} (index ${Math.round(fortitudeIndex)}); bind drag ${Math.round(bindDrag)}.`,
    stewardNote
  };
}
