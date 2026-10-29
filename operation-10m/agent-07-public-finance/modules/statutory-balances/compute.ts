import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { StatutoryBalancesReport, StatutoryBalanceBand } from './types';
import { STATUTORY_BALANCES_SCHEMA } from './types';

const OPERATING_ANCHOR_FLOOR = -8;
const FISCAL_ANCHOR_FLOOR = -14;
const NET_DEBT_RATIO_CEILING = 0.72;

export function buildStatutoryBalancesReport(turn: number, v1012: V1012FiscalSnapshot): StatutoryBalancesReport {
  const revenueBase = v1012.revenueCapacity * 0.42;
  const operatingOutlays =
    revenueBase * 0.38 + v1012.maintenanceLoad * 0.55 + Math.max(0, -v1012.fiscalHeadroom) * 0.25;
  const netOperatingBalance = Math.round((revenueBase - operatingOutlays + v1012.fiscalHeadroom * 0.6) * 10) / 10;

  const capitalNet = v1012.debtEnabled ? v1012.debtLevel * 0.04 - v1012.debtServiceLoad * 0.15 : 0;
  const fiscalBalance = Math.round((netOperatingBalance - capitalNet) * 10) / 10;

  const netDebtToCapacityRatio =
    v1012.revenueCapacity > 0
      ? Math.round((v1012.debtLevel / v1012.revenueCapacity) * 1000) / 1000
      : 0;

  const bands: StatutoryBalanceBand[] = [
    {
      id: 'operating',
      label: 'Net operating balance',
      balancePoints: netOperatingBalance,
      anchorPoints: OPERATING_ANCHOR_FLOOR,
      withinAnchor: netOperatingBalance >= OPERATING_ANCHOR_FLOOR || v1012.pressure === 'critical',
      warnOnly: true
    },
    {
      id: 'fiscal',
      label: 'Fiscal balance (incl. capital net)',
      balancePoints: fiscalBalance,
      anchorPoints: FISCAL_ANCHOR_FLOOR,
      withinAnchor: fiscalBalance >= FISCAL_ANCHOR_FLOOR || v1012.pressure === 'critical',
      warnOnly: true
    },
    {
      id: 'net_debt_anchor',
      label: 'Net debt to capacity ratio',
      balancePoints: netDebtToCapacityRatio,
      anchorPoints: NET_DEBT_RATIO_CEILING,
      withinAnchor: netDebtToCapacityRatio <= NET_DEBT_RATIO_CEILING || !v1012.debtEnabled,
      warnOnly: false
    }
  ];

  const warnings: string[] = [];
  if (!bands[0].withinAnchor) {
    warnings.push(`Operating balance ${netOperatingBalance} below soft floor ${OPERATING_ANCHOR_FLOOR}.`);
  }
  if (!bands[2].withinAnchor) {
    warnings.push(`Net debt ratio ${netDebtToCapacityRatio} exceeds anchor ${NET_DEBT_RATIO_CEILING}.`);
  }
  if (v1012.sustainability === 'fragile' && fiscalBalance < -6) {
    warnings.push('Fragile sustainability with deeply negative fiscal balance.');
  }

  const allWithinSoftAnchors = bands.every(b => b.withinAnchor);
  const narrative = allWithinSoftAnchors
    ? `Statutory balances within anchors (NOB ${netOperatingBalance}, FB ${fiscalBalance}).`
    : `Statutory balance pressure: NOB ${netOperatingBalance}, FB ${fiscalBalance}, debt/cap ${netDebtToCapacityRatio}.`;

  return {
    schemaVersion: STATUTORY_BALANCES_SCHEMA,
    turn,
    bands,
    netOperatingBalance,
    fiscalBalance,
    netDebtToCapacityRatio,
    allWithinSoftAnchors,
    narrative,
    warnings
  };
}
