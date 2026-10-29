import type {
  DemographicStructureBand,
  EmploymentLinkageBand,
  MigrationFlowBand,
  WagePressureBand
} from './types';
import { V1014_LABOR_LIMITS } from './types';

export function v1014laborClamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

export function v1014laborBandDemographic(score: number): DemographicStructureBand {
  if (score < 28) return 'contracting';
  if (score < 42) return 'aging_pressure';
  if (score < 58) return 'stable';
  if (score < 72) return 'youthful_growth';
  return 'rapid_growth';
}

export function v1014laborBandEmployment(score: number): EmploymentLinkageBand {
  if (score < 30) return 'dislocated';
  if (score < 45) return 'weak';
  if (score < 62) return 'balanced';
  if (score < 78) return 'strong';
  return 'tight_labor';
}

export function v1014laborBandWage(score: number): WagePressureBand {
  if (score < 25) return 'deflationary';
  if (score < 42) return 'soft';
  if (score < 58) return 'stable';
  if (score < 74) return 'elevated';
  return 'surging';
}

export function v1014laborBandMigration(score: number): MigrationFlowBand {
  if (score < 28) return 'outflow';
  if (score < 44) return 'slight_outflow';
  if (score < 56) return 'balanced';
  if (score < 72) return 'inflow';
  return 'strong_inflow';
}

export function v1014laborApplyHysteresis<T extends string>(
  prevBand: T,
  targetScore: number,
  prevScore: number,
  bandFn: (s: number) => T
): { band: T; score: number } {
  const target = bandFn(targetScore);
  const dead = V1014_LABOR_LIMITS.hysteresisDeadband;
  if (target === prevBand) {
    return { band: prevBand, score: v1014laborClamp(prevScore * 0.35 + targetScore * 0.65) };
  }
  const delta = Math.abs(targetScore - prevScore);
  if (delta < dead) {
    return { band: prevBand, score: v1014laborClamp(prevScore * 0.6 + targetScore * 0.4) };
  }
  return { band: target, score: v1014laborClamp(targetScore) };
}
