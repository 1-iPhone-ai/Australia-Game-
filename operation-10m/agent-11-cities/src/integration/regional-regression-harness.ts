import {
  buildOP10M_A11_CompositeInputsFromFixtures,
  recomputeOP10M_A11_CitiesRegionsComposite,
  validateOP10M_A11_CompositeState,
} from '../composite-recompute.ts';
import type { OP10M_A11_CompositePersisted } from '../types.ts';

export type OP10M_A11_RegressionTurnSnapshot = {
  turn: number;
  revision: number;
  cohesionIndex: number;
  inequalityIndex: number;
  validationErrors: number;
};

export function runOP10M_A11_RegionalRegressionHarness(turns = 6): {
  ok: boolean;
  snapshots: OP10M_A11_RegressionTurnSnapshot[];
  detail: string;
} {
  const snapshots: OP10M_A11_RegressionTurnSnapshot[] = [];
  let persisted: OP10M_A11_CompositePersisted | null = null;

  for (let t = 1; t <= turns; t += 1) {
    const inputs = buildOP10M_A11_CompositeInputsFromFixtures({
      turn: t,
      urban: {
        national: {
          nationalGrowthBand: t % 3 === 0 ? 'strong' : 'steady',
          distributionBand: t >= 4 ? 'uneven' : 'mixed',
          capitalCityBias: 42 + t,
        },
      },
      infra: {
        networkFreight: 55 + t,
        networkDigital: 58 + t * 0.5,
      },
    });

    const out = recomputeOP10M_A11_CitiesRegionsComposite(inputs, persisted);
    persisted = out.persisted;
    const validationErrors = validateOP10M_A11_CompositeState(out.state).length;

    snapshots.push({
      turn: out.state.turn,
      revision: out.state.revision,
      cohesionIndex: out.state.regionalCohesionIndex,
      inequalityIndex: out.state.urban.inequalityIndex,
      validationErrors,
    });
  }

  const monotonicRevision = snapshots.every((s, i) => (i === 0 ? s.revision === 1 : s.revision === snapshots[i - 1].revision + 1));
  const allValid = snapshots.every((s) => s.validationErrors === 0);
  const cohesionStable = snapshots.every((s) => s.cohesionIndex >= 8 && s.cohesionIndex <= 100);

  const ok = monotonicRevision && allValid && cohesionStable;
  const detail = ok
    ? `${turns}-turn harness: revisions 1..${turns}, cohesion ${snapshots[0].cohesionIndex}→${snapshots[snapshots.length - 1].cohesionIndex}`
    : `harness failed: revision=${monotonicRevision} valid=${allValid} cohesion=${cohesionStable}`;

  return { ok, snapshots, detail };
}
