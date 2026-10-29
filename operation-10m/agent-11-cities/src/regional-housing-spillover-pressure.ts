import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsorptionStressRow,
  OP10M_A11_CorridorFlowRow,
  OP10M_A11_HousingSpilloverBand,
  OP10M_A11_HousingSpilloverRow,
  OP10M_A11_PeriUrbanPressureRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function spilloverBand(score: number): OP10M_A11_HousingSpilloverBand {
  if (score < 28) return 'localized';
  if (score < 48) return 'spreading';
  if (score < 66) return 'cascade';
  return 'systemic';
}

export function op10mA11ComputeRegionalHousingSpilloverPressure(args: {
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): { rows: OP10M_A11_HousingSpilloverRow[]; nationalIndex: number } {
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));
  const periByRegion = new Map(args.periUrbanPressure.map((p) => [p.regionId, p]));
  const outboundFlow = new Map<OP10M_A11_RegionId, number>();

  for (const flow of args.corridorFlows) {
    outboundFlow.set(flow.fromRegion, (outboundFlow.get(flow.fromRegion) ?? 0) + flow.flowPressure * 0.42);
  }

  const rows: OP10M_A11_HousingSpilloverRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const abs = absorptionByRegion.get(rid);
    const peri = periByRegion.get(rid);
    const saturationDrag = abs ? op10mA11Clamp(abs.stressScore * 0.55) : 14;
    const fringeDrag = peri ? op10mA11Clamp(peri.pressureScore * 0.48) : 12;
    const corridorPush = op10mA11Clamp(outboundFlow.get(rid) ?? 0);

    const spilloverScore = op10mA11Clamp(saturationDrag + fringeDrag * 0.62 + corridorPush * 0.38);
    weighted += spilloverScore;

    const channels: string[] = [];
    if (abs && (abs.band === 'strained' || abs.band === 'breached')) channels.push('metro saturation bleed');
    if (peri && (peri.band === 'sprawl_risk' || peri.band === 'unchecked')) channels.push('peri-urban fringe');
    if (corridorPush >= 28) channels.push('corridor price diffusion');
    if (!channels.length) channels.push('contained local market');

    rows.push({
      regionId: rid,
      spilloverScore: op10mA11Round(spilloverScore),
      band: spilloverBand(spilloverScore),
      corridorPush: op10mA11Round(corridorPush),
      channels: channels.slice(0, 3),
      narrative: `${rid} housing spillover ${spilloverBand(spilloverScore)} (${op10mA11Round(spilloverScore)}); ${channels.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.spilloverScore - a.spilloverScore), nationalIndex };
}

export function op10mA11RegionsWithHousingSpilloverCascade(rows: OP10M_A11_HousingSpilloverRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'cascade' || r.band === 'systemic').map((r) => r.regionId);
}

export function op10mA11HousingSpilloverEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
