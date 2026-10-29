import { v1014laborClamp } from './bands';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type EssentialWorkerParticipationBand,
  type NationalEssentialWorkerParticipationOutlook,
  type NationalLaborDemographicsState,
  type NationalMigrationShockParticipationBufferOutlook,
  type NationalParticipationPressureBrief
} from './types';

function essentialBand(index: number): EssentialWorkerParticipationBand {
  if (index <= 34) return 'strained';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'supported';
  return 'resilient';
}

export function computeNationalEssentialWorkerParticipationOutlook(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  buffer: NationalMigrationShockParticipationBufferOutlook | null | undefined
): NationalEssentialWorkerParticipationOutlook {
  if (!state.enabled || !participation || !buffer) {
    return {
      turn: state.turn,
      essentialIndex: 50,
      band: 'mixed',
      shockDrag: 0,
      summary: 'Essential-worker participation idle — participation or buffer unavailable.',
      stewardNote: 'Compute participation and migration buffer before essential-worker guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const essentialShocks =
    (state.activeMigrationShocks || []).filter(s => s.kind === 'essential_access_outflow').length;
  const shockDrag = v1014laborClamp(buffer.activeShockDrag * 0.55 + essentialShocks * 8);
  const participationLift = participation.participationIndex * 0.3;
  const bufferLift =
    buffer.band === 'cushioned' || buffer.band === 'adequate' ? buffer.bufferIndex * 0.2 : 0;

  const essentialIndex = v1014laborClamp(30 + participationLift + bufferLift + safetyLift * 20 - shockDrag);
  const band = essentialBand(essentialIndex);

  const stewardNote =
    band === 'strained' || band === 'mixed'
      ? 'Mixed essential-worker participation — deploy safety levers before stacking migration shocks.'
      : band === 'resilient'
        ? 'Resilient essential band — avoid corridor overload that erodes shock buffers.'
        : 'Supported essential participation — monitor equity gaps in access-strained regions.';

  return {
    turn: state.turn,
    essentialIndex,
    band,
    shockDrag,
    summary: `Essential-worker participation ${band} (index ${Math.round(essentialIndex)}); shock drag ${Math.round(shockDrag)}.`,
    stewardNote
  };
}
