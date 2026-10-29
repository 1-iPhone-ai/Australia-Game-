import { v1014laborClamp } from './bands';
import type {
  IntergenerationalBalanceBand,
  NationalIntergenerationalWorkforceBalanceOutlook,
  NationalLaborDemographicsState,
  NationalSeniorWorkforceRetentionOutlook,
  NationalYouthEntryPipelineOutlook
} from './types';

function balanceBand(index: number): IntergenerationalBalanceBand {
  if (index <= 34) return 'skewed_aged';
  if (index <= 48) return 'narrow_youth';
  if (index <= 62) return 'balanced';
  return 'renewal';
}

export function computeNationalIntergenerationalWorkforceBalanceOutlook(
  state: NationalLaborDemographicsState,
  youth: NationalYouthEntryPipelineOutlook | null | undefined,
  senior: NationalSeniorWorkforceRetentionOutlook | null | undefined
): NationalIntergenerationalWorkforceBalanceOutlook {
  if (!state.enabled || !youth || !senior) {
    return {
      turn: state.turn,
      balanceIndex: 50,
      band: 'narrow_youth',
      pipelineGap: 0,
      summary: 'Intergenerational balance idle — youth or senior outlook unavailable.',
      stewardNote: 'Compute youth pipeline and senior retention before intergenerational guidance.'
    };
  }

  const pipelineGap = v1014laborClamp(Math.abs(youth.pipelineIndex - senior.retentionIndex));
  const youthLift = youth.pipelineIndex * 0.35;
  const seniorLift = senior.retentionIndex * 0.3;
  const headwindDrag = youth.dependencyHeadwind * 0.4 + senior.agedPressureDrag * 0.35;
  const bandPenalty =
    (youth.band === 'constricted' || youth.band === 'narrow' ? 8 : 0) +
    (senior.band === 'fragile' || senior.band === 'strained' ? 8 : 0);

  const balanceIndex = v1014laborClamp(28 + youthLift + seniorLift - headwindDrag - bandPenalty - pipelineGap * 0.15);
  const band = balanceBand(balanceIndex);

  const stewardNote =
    band === 'skewed_aged' || band === 'narrow_youth'
      ? 'Imbalanced intergenerational pipeline — pair youth upskilling with senior retention levers.'
      : band === 'renewal'
        ? 'Renewal balance — avoid wage surges that compress youth entry bands.'
        : 'Balanced intergenerational mix — monitor dependency headwinds in aging regions.';

  return {
    turn: state.turn,
    balanceIndex,
    band,
    pipelineGap,
    summary: `Intergenerational workforce balance ${band.replace('_', ' ')} (index ${Math.round(balanceIndex)}); pipeline gap ${Math.round(pipelineGap)}.`,
    stewardNote
  };
}
