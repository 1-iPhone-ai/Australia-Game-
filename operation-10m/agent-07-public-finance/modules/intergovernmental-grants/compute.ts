import { reconcileFederalStateTransfers } from '../federal-state/reconcile';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantAllocationLine, GrantProgramKind, IntergovernmentalGrantsReport } from './types';
import { INTERGOVERNMENTAL_GRANTS_SCHEMA } from './types';

const PROGRAM_WEIGHTS: Record<GrantProgramKind, { share: number; match: number; label: string }> = {
  health_block: { share: 0.32, match: 0.05, label: 'Health block grant' },
  education_reform: { share: 0.24, match: 0.08, label: 'Schools reform partnership' },
  roads_partner: { share: 0.18, match: 0.12, label: 'Roads of significance partner' },
  housing_accelerator: { share: 0.14, match: 0.1, label: 'Housing accelerator' },
  disaster_recovery: { share: 0.12, match: 0, label: 'Disaster recovery advance' }
};

function performanceGate(v1012: V1012FiscalSnapshot, program: GrantProgramKind): boolean {
  if (program === 'disaster_recovery') return v1012.pressure !== 'critical';
  if (program === 'housing_accelerator') return v1012.fiscalHeadroom > -8;
  if (program === 'roads_partner') return v1012.maintenanceLoad < 16;
  if (program === 'education_reform') return v1012.sustainability !== 'fragile';
  return v1012.debtServiceLoad < 20;
}

export function allocateIntergovernmentalGrants(
  turn: number,
  v1012: V1012FiscalSnapshot
): IntergovernmentalGrantsReport {
  const igr = reconcileFederalStateTransfers(turn, v1012);
  const grantPool = Math.max(8, Math.round(igr.federalRevenuePool * 0.38));
  const warnings: string[] = [];

  const allocations: GrantAllocationLine[] = (Object.keys(PROGRAM_WEIGHTS) as GrantProgramKind[]).map(programId => {
    const meta = PROGRAM_WEIGHTS[programId];
    const federalPoints = Math.round(grantPool * meta.share * 10) / 10;
    const gate = performanceGate(v1012, programId);
    const clawbackRate = gate ? 0 : programId === 'disaster_recovery' ? 0.15 : 0.22;
    const clawbackPoints = Math.round(federalPoints * clawbackRate * 10) / 10;
    const netToStates = Math.round((federalPoints - clawbackPoints) * 10) / 10;
    return {
      programId,
      label: meta.label,
      federalPoints,
      stateMatchRequired: Math.round(federalPoints * meta.match * 10) / 10,
      performanceGateMet: gate,
      clawbackPoints,
      netToStates
    };
  });

  const totalFederal = Math.round(allocations.reduce((s, a) => s + a.federalPoints, 0) * 10) / 10;
  const totalClawback = Math.round(allocations.reduce((s, a) => s + a.clawbackPoints, 0) * 10) / 10;
  const netFederalOutlay = Math.round((totalFederal - totalClawback) * 10) / 10;
  const performancePassRate =
    allocations.length > 0 ? allocations.filter(a => a.performanceGateMet).length / allocations.length : 0;

  const reconciledToIgrPool = Math.abs(totalFederal - grantPool) <= 1.5;
  if (!reconciledToIgrPool) {
    warnings.push(`Grant pool ${totalFederal} vs IGR-derived ${grantPool} — rounding tolerance.`);
  }
  if (totalClawback > grantPool * 0.25) {
    warnings.push('Clawbacks exceed 25% of grant pool — state delivery stress.');
  }

  return {
    schemaVersion: INTERGOVERNMENTAL_GRANTS_SCHEMA,
    turn,
    allocations,
    totalFederal,
    totalClawback,
    netFederalOutlay,
    performancePassRate,
    reconciledToIgrPool,
    warnings
  };
}
