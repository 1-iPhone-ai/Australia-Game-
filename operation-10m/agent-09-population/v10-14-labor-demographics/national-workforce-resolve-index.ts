import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalRetentionAnchorOutlook,
  type NationalSteadfastSchedulingCouplingBrief,
  type NationalSubjectSealReadinessBrief,
  type NationalWorkforceResolveIndex,
  type WorkforceResolveBand
} from './types';

function resolveBand(index: number): WorkforceResolveBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'firm';
  return 'indomitable';
}

export function computeNationalWorkforceResolveIndex(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalSteadfastSchedulingCouplingBrief | null | undefined,
  retentionAnchor: NationalRetentionAnchorOutlook | null | undefined,
  subjectSeal: NationalSubjectSealReadinessBrief | null | undefined
): NationalWorkforceResolveIndex {
  if (!state.enabled || !schedulingCoupling || !retentionAnchor || !subjectSeal) {
    return {
      turn: state.turn,
      resolveIndex: 50,
      band: 'thin',
      sealDrag: 0,
      summary: 'Workforce resolve idle — scheduling coupling, retention anchor, or subject seal unavailable.',
      stewardNote: 'Compute round-23 depth stack before resolve guidance.'
    };
  }

  const sealDrag = v1014laborClamp(
    subjectSeal.sealDrag * 0.35 +
      schedulingCoupling.steadfastDrag * 0.3 +
      retentionAnchor.cohesionDrag * 0.25 +
      (subjectSeal.band === 'open' || schedulingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const schedulingLift =
    schedulingCoupling.band === 'rhythmic' || schedulingCoupling.band === 'locked'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;
  const anchorLift =
    retentionAnchor.band === 'anchored' || retentionAnchor.band === 'moored'
      ? retentionAnchor.anchorIndex * 0.18
      : retentionAnchor.anchorIndex * 0.09;
  const sealLift =
    subjectSeal.band === 'sealed' || subjectSeal.band === 'locked'
      ? subjectSeal.sealIndex * 0.22
      : subjectSeal.sealIndex * 0.11;

  const resolveIndex = v1014laborClamp(18 + schedulingLift + anchorLift + sealLift - sealDrag);
  const band = resolveBand(resolveIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce resolve — sequence steadfast-scheduling, retention anchor, and subject seal before post-b23e1449 tranche.'
      : band === 'indomitable'
        ? 'Indomitable resolve — avoid corridor overload that breaks subject seal bands.'
        : 'Firm resolve — refresh subject seal checks each scale wave.';

  return {
    turn: state.turn,
    resolveIndex,
    band,
    sealDrag,
    summary: `National workforce resolve ${band} (index ${Math.round(resolveIndex)}); seal drag ${Math.round(sealDrag)}.`,
    stewardNote
  };
}
