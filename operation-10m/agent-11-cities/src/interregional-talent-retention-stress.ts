import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalUrbanCouplingRow,
  OP10M_A11_LinkageHubProfile,
  OP10M_A11_MigrationPressureRow,
  OP10M_A11_RegionId,
  OP10M_A11_TalentRetentionBand,
  OP10M_A11_TalentRetentionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

const HUB_RETENTION: Record<OP10M_A11_LinkageHubProfile['role'], number> = {
  peripheral: 32,
  connector: 22,
  regional_hub: 14,
  national_hub: 8,
};

function retentionBand(drainScore: number): OP10M_A11_TalentRetentionBand {
  if (drainScore < 28) return 'stable';
  if (drainScore < 48) return 'leaky';
  if (drainScore < 66) return 'draining';
  return 'collapse';
}

export function op10mA11ComputeInterregionalTalentRetentionStress(args: {
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
}): { rows: OP10M_A11_TalentRetentionRow[]; nationalIndex: number } {
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));
  const fiscalByRegion = new Map(args.fiscalUrbanCoupling.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_TalentRetentionRow[] = [];
  let weightedDrain = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const mig = migrationByRegion.get(rid);
    const hub = hubByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const outboundDrag =
      mig && mig.primaryDirection === 'outbound' ? op10mA11Clamp(mig.pushScore * 0.58) : op10mA11Clamp((mig?.netPressure ?? 10) * 0.22);
    const hubDrag = hub ? HUB_RETENTION[hub.role] : 18;
    const fiscalDrag = fiscal ? op10mA11Clamp(68 - fiscal.couplingScore) * 0.42 : 16;

    const drainScore = op10mA11Clamp(outboundDrag + hubDrag * 0.45 + fiscalDrag);
    weightedDrain += drainScore;

    const riskFactors: string[] = [];
    if (mig && (mig.band === 'high' || mig.band === 'surge') && mig.primaryDirection === 'outbound') {
      riskFactors.push('outbound migration pull');
    }
    if (hub && (hub.role === 'peripheral' || hub.isolationScore >= 55)) riskFactors.push('peripheral isolation');
    if (fiscal && (fiscal.band === 'strained' || fiscal.band === 'misaligned')) riskFactors.push('fiscal catch-up gap');
    if (!riskFactors.length) riskFactors.push('balanced labor market');

    rows.push({
      regionId: rid,
      drainScore: op10mA11Round(drainScore),
      band: retentionBand(drainScore),
      riskFactors: riskFactors.slice(0, 3),
      narrative: `${rid} talent retention ${retentionBand(drainScore)} (drain ${op10mA11Round(drainScore)}); ${riskFactors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weightedDrain / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.drainScore - a.drainScore), nationalIndex };
}

export function op10mA11RegionsWithTalentDrain(rows: OP10M_A11_TalentRetentionRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'draining' || r.band === 'collapse').map((r) => r.regionId);
}
