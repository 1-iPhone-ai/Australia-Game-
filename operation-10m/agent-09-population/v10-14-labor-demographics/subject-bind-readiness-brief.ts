import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectBindReadinessBrief,
  type NationalSubjectSealReadinessBrief,
  type NationalWorkforceResolveIndex,
  type SubjectBindReadinessBand
} from './types';

function bindBand(index: number): SubjectBindReadinessBand {
  if (index <= 34) return 'unbound';
  if (index <= 48) return 'tension';
  if (index <= 62) return 'bound';
  return 'locked';
}

/** Round-24 subject bind readiness — seal × resolve gate for wave bind. */
export function computeNationalSubjectBindReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSeal: NationalSubjectSealReadinessBrief | null | undefined,
  resolve: NationalWorkforceResolveIndex | null | undefined
): NationalSubjectBindReadinessBrief {
  if (!state.enabled || !subjectSeal || !resolve) {
    return {
      turn: state.turn,
      bindIndex: 50,
      band: 'tension',
      bindDrag: 0,
      summary: 'Subject bind readiness idle — subject seal or resolve unavailable.',
      stewardNote: 'Compute subject seal readiness and workforce resolve before bind guidance.'
    };
  }

  const bindDrag = v1014laborClamp(
    subjectSeal.sealDrag * 0.38 +
      resolve.sealDrag * 0.38 +
      (subjectSeal.band === 'open' || resolve.band === 'fragile' ? 12 : 3)
  );
  const sealLift =
    subjectSeal.band === 'sealed' || subjectSeal.band === 'locked'
      ? subjectSeal.sealIndex * 0.27
      : subjectSeal.sealIndex * 0.14;
  const resolveLift =
    resolve.band === 'firm' || resolve.band === 'indomitable'
      ? resolve.resolveIndex * 0.25
      : resolve.resolveIndex * 0.12;

  const bindIndex = v1014laborClamp(20 + sealLift + resolveLift - bindDrag);
  const band = bindBand(bindIndex);

  const stewardNote =
    band === 'unbound' || band === 'tension'
      ? 'Tension bind readiness — hold O10-179 scale bind until resolve-upskilling syncs.'
      : band === 'locked'
        ? 'Locked bind band — still monitor coordination bind during corridor peaks.'
        : 'Bound band — pair with workforce fortitude index each assembly tranche.';

  return {
    turn: state.turn,
    bindIndex,
    band,
    bindDrag,
    summary: `Subject bind readiness ${band} (index ${Math.round(bindIndex)}); bind drag ${Math.round(bindDrag)}.`,
    stewardNote
  };
}
