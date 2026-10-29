import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_DecentralizationBand,
  OP10M_A11_DecentralizationShiftRow,
  OP10M_A11_LinkageHubProfile,
  OP10M_A11_MigrationPressureRow,
  OP10M_A11_RegionId,
  OP10M_A11_UrbanHierarchyRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function decentralizationBand(score: number): OP10M_A11_DecentralizationBand {
  if (score < 22) return 'metro_locked';
  if (score < 40) return 'partial_shift';
  if (score < 58) return 'broadening';
  return 'accelerating';
}

export function op10mA11ComputeDigitalConnectivityDecentralizationShift(args: {
  networkDigital: number;
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  hierarchy: OP10M_A11_UrbanHierarchyRow[];
}): { rows: OP10M_A11_DecentralizationShiftRow[]; nationalIndex: number } {
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));
  const hierarchyByRegion = new Map(args.hierarchy.map((h) => [h.regionId, h]));
  const digitalLift = op10mA11Clamp(args.networkDigital * 0.48);

  const rows: OP10M_A11_DecentralizationShiftRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const migration = migrationByRegion.get(rid);
    const hub = hubByRegion.get(rid);
    const hier = hierarchyByRegion.get(rid);

    const remoteEnablement = op10mA11Clamp(digitalLift * (hub && hub.role === 'peripheral' ? 1.08 : 0.92));
    const outboundRelief =
      migration && migration.primaryDirection === 'outbound'
        ? op10mA11Clamp(migration.netPressure * 0.35)
        : migration && migration.primaryDirection === 'inbound'
          ? op10mA11Clamp(-migration.netPressure * 0.18)
          : 0;
    const primateDrag = hier
      ? op10mA11Clamp(
          (hier.primateBand === 'concentrated' || hier.primateBand === 'hyper_concentrated' ? 18 : 6) -
            hier.secondaryMomentum * 0.12,
        )
      : 10;

    const shiftScore = op10mA11Clamp(remoteEnablement + outboundRelief + (100 - primateDrag) * 0.22);
    weighted += shiftScore;

    const signals: string[] = [];
    if (remoteEnablement >= 32) signals.push('digital connectivity lift');
    if (outboundRelief >= 12) signals.push('outbound migration relief');
    if (hub && (hub.role === 'connector' || hub.role === 'regional_hub')) signals.push('secondary hub pull');
    if (hier && hier.primateBand === 'decentralized') signals.push('balanced hierarchy');
    if (!signals.length) signals.push('metro-centric default');

    rows.push({
      regionId: rid,
      shiftScore: op10mA11Round(shiftScore),
      band: decentralizationBand(shiftScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} decentralization ${decentralizationBand(shiftScore)} (${op10mA11Round(shiftScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.shiftScore - a.shiftScore), nationalIndex };
}

export function op10mA11RegionsWithAcceleratingDecentralization(
  rows: OP10M_A11_DecentralizationShiftRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'broadening' || r.band === 'accelerating').map((r) => r.regionId);
}
