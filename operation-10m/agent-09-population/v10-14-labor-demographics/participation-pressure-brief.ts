import { v1014laborClamp } from './bands';
import type {
  IntegratedLaborMarketBrief,
  NationalDependencyRatioSnapshot,
  NationalLaborDemographicsState,
  NationalParticipationPressureBrief,
  ParticipationPressureBand
} from './types';

function participationBand(score: number): ParticipationPressureBand {
  if (score >= 68) return 'expansionary';
  if (score >= 52) return 'stable';
  if (score >= 38) return 'constrained';
  return 'shrinking';
}

export function computeNationalParticipationPressureBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  dependency: NationalDependencyRatioSnapshot | null | undefined
): NationalParticipationPressureBrief {
  if (!state.enabled || !brief) {
    return {
      turn: state.turn,
      participationIndex: 50,
      band: 'stable',
      headwinds: [],
      tailwinds: [],
      summary: 'Participation outlook idle — labor layer off.',
      stewardNote: 'Enable labor demographics before participation guidance.'
    };
  }

  const automationDrag = (state.regions.NSW?.automationPressureIndex ?? 50) * 0.22;
  const dependencyDrag =
    dependency?.nationalBand === 'aged_pressure'
      ? 14
      : dependency?.nationalBand === 'aging'
        ? 8
        : 0;
  const strainDrag = brief.compositePressureIndex * 0.35;
  const linkageLift = state.employmentLinkageScore * 0.4;
  const migrationLift = state.migrationFlowScore * 0.12;

  const participationIndex = v1014laborClamp(
    50 + linkageLift + migrationLift - automationDrag - dependencyDrag - strainDrag * 0.5
  );
  const band = participationBand(participationIndex);

  const headwinds: string[] = [];
  const tailwinds: string[] = [];
  if (dependencyDrag >= 8) headwinds.push('Aging dependency structure weighs on participation indices.');
  if (automationDrag >= 12) headwinds.push('Automation pressure caps near-term participation expansion.');
  if (brief.pressureBand === 'critical' || brief.pressureBand === 'elevated') {
    headwinds.push('Composite labor pressure constrains participation upside.');
  }
  if (state.employmentLinkageScore >= 58) tailwinds.push('Strong employment linkage supports participation depth.');
  if (state.nationalMigrationFlow === 'inflow' || state.nationalMigrationFlow === 'strong_inflow') {
    tailwinds.push('Migration inflow bands add participation tailwind (bounded).');
  }
  if (state.workforceCapacityBridge?.nationalBand === 'surplus') {
    tailwinds.push('Workforce capacity surplus eases participation constraints.');
  }

  const stewardNote =
    band === 'shrinking' || band === 'constrained'
      ? 'Participation constrained — prioritize retention levers and affordability before automation stacks.'
      : band === 'expansionary'
        ? 'Participation expansionary — monitor strain hubs so growth does not outrun capacity.'
        : 'Participation stable — maintain corridor balance and household cushion.';

  return {
    turn: state.turn,
    participationIndex,
    band,
    headwinds: headwinds.slice(0, 3),
    tailwinds: tailwinds.slice(0, 3),
    summary: `Participation ${band} (index ${Math.round(participationIndex)}); ${headwinds.length ? headwinds[0] : tailwinds[0] ?? 'mixed signals'}.`,
    stewardNote
  };
}
