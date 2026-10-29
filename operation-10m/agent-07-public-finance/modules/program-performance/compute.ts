import type { ProgramPerformanceReview, ProgramPerformanceScore, ProgramPerformanceTarget } from './types';
import { PROGRAM_PERFORMANCE_SCHEMA } from './types';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export const PROGRAM_PERFORMANCE_TARGETS: ProgramPerformanceTarget[] = [
  {
    appropriationLineId: 'ic_transport_corridor',
    category: 'infrastructure_capital',
    title: 'Transport corridor capital',
    deliveryKpiTarget: 72,
    costEfficiencyTarget: 68
  },
  {
    appropriationLineId: 'cs_health_admin',
    category: 'core_services',
    title: 'Health administration',
    deliveryKpiTarget: 70,
    costEfficiencyTarget: 75
  },
  {
    appropriationLineId: 'ri_research_council',
    category: 'research_innovation',
    title: 'Research councils',
    deliveryKpiTarget: 65,
    costEfficiencyTarget: 70
  },
  {
    appropriationLineId: 'rr_disaster_recovery',
    category: 'resilience_recovery',
    title: 'Disaster recovery',
    deliveryKpiTarget: 60,
    costEfficiencyTarget: 62
  },
  {
    appropriationLineId: 'rd_regional_growth',
    category: 'regional_development',
    title: 'Regional growth packages',
    deliveryKpiTarget: 68,
    costEfficiencyTarget: 66
  },
  {
    appropriationLineId: 'mb_road_network',
    category: 'maintenance_backlog',
    title: 'Road network maintenance',
    deliveryKpiTarget: 74,
    costEfficiencyTarget: 71
  }
];

function bandFromComposite(score: number): ProgramPerformanceScore['band'] {
  if (score >= 80) return 'leading';
  if (score >= 65) return 'on_track';
  if (score >= 50) return 'at_risk';
  return 'failing';
}

function simulateScores(target: ProgramPerformanceTarget, v1012: V1012FiscalSnapshot, turn: number): ProgramPerformanceScore {
  const pressureDrag = v1012.pressure === 'critical' ? 12 : v1012.pressure === 'strained' ? 6 : 0;
  const maintenanceBoost = target.category === 'maintenance_backlog' ? v1012.maintenanceLoad * 0.3 : 0;
  const deliveryScore = Math.max(
    0,
    Math.min(100, Math.round(target.deliveryKpiTarget + maintenanceBoost - pressureDrag + ((turn % 5) - 2)))
  );
  const costEfficiencyScore = Math.max(
    0,
    Math.min(100, Math.round(target.costEfficiencyTarget - pressureDrag * 0.7 + (v1012.fiscalHeadroom > 0 ? 2 : -4)))
  );
  const compositeScore = Math.round((deliveryScore * 0.55 + costEfficiencyScore * 0.45) * 10) / 10;
  const band = bandFromComposite(compositeScore);
  let fiscalFeedbackPoints = 0;
  if (band === 'leading') fiscalFeedbackPoints = 1.5;
  else if (band === 'on_track') fiscalFeedbackPoints = 0;
  else if (band === 'at_risk') fiscalFeedbackPoints = -1.5;
  else fiscalFeedbackPoints = -3;

  return {
    appropriationLineId: target.appropriationLineId,
    deliveryScore,
    costEfficiencyScore,
    compositeScore,
    band,
    fiscalFeedbackPoints,
    explanation: `${target.title}: delivery ${deliveryScore}, efficiency ${costEfficiencyScore} (${band}).`
  };
}

export function reviewProgramPerformance(turn: number, v1012: V1012FiscalSnapshot): ProgramPerformanceReview {
  const scores = PROGRAM_PERFORMANCE_TARGETS.map(t => simulateScores(t, v1012, turn));
  const aggregateFeedbackPoints = Math.round(scores.reduce((s, p) => s + p.fiscalFeedbackPoints, 0) * 10) / 10;
  const programsAtRisk = scores.filter(p => p.band === 'at_risk' || p.band === 'failing').length;
  const rebalanceRecommendations: string[] = [];
  if (programsAtRisk >= 2) {
    rebalanceRecommendations.push('Shift contingency to under-performing programs or pause new capital approvals.');
  }
  if (aggregateFeedbackPoints < -4) {
    rebalanceRecommendations.push('Aggregate performance drag — review appropriation weights in next MYEFO pass.');
  }
  if (v1012.pressure === 'critical' && programsAtRisk > 0) {
    rebalanceRecommendations.push('Critical fiscal pressure — prioritize mandatory maintenance over discretionary capital.');
  }

  return {
    schemaVersion: PROGRAM_PERFORMANCE_SCHEMA,
    turn,
    scores,
    aggregateFeedbackPoints,
    programsAtRisk,
    rebalanceRecommendations
  };
}
