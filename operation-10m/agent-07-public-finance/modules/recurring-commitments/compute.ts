import type { NationalBudgetEnvelope, V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type {
  RecurringCommitmentDefinition,
  RecurringCommitmentsSchedule
} from './types';
import { RECURRING_COMMITMENTS_SCHEMA } from './types';

export const DEFAULT_RECURRING_COMMITMENTS: RecurringCommitmentDefinition[] = [
  {
    id: 'rc_core_admin',
    title: 'Core administration & services baseline',
    kind: 'core_services',
    cadence: 'every_turn',
    loadPointsPerPulse: 4,
    envelopeCategory: 'core_services',
    mandatory: true,
    expiryTurn: null,
    regionIds: []
  },
  {
    id: 'rc_network_maintenance',
    title: 'Network maintenance contracts',
    kind: 'maintenance_contract',
    cadence: 'every_turn',
    loadPointsPerPulse: 3,
    envelopeCategory: 'maintenance_backlog',
    mandatory: true,
    expiryTurn: null,
    regionIds: []
  },
  {
    id: 'rc_regional_transfers',
    title: 'Indexed regional transfers',
    kind: 'indexed_transfer',
    cadence: 'every_2_turns',
    loadPointsPerPulse: 5,
    envelopeCategory: 'regional_development',
    mandatory: false,
    expiryTurn: null,
    regionIds: ['NSW', 'VIC', 'QLD']
  },
  {
    id: 'rc_sovereign_coupon',
    title: 'Sovereign debt coupon strip',
    kind: 'debt_coupon',
    cadence: 'every_turn',
    loadPointsPerPulse: 2,
    envelopeCategory: 'debt_service_reserve',
    mandatory: true,
    expiryTurn: null,
    regionIds: []
  }
];

function cadenceDue(def: RecurringCommitmentDefinition, turn: number): boolean {
  if (def.expiryTurn !== null && turn > def.expiryTurn) return false;
  if (def.cadence === 'every_turn') return true;
  if (def.cadence === 'every_2_turns') return turn % 2 === 0;
  if (def.cadence === 'annual') return turn % 12 === 0;
  return true;
}

function scaleLoad(def: RecurringCommitmentDefinition, v1012: V1012FiscalSnapshot): number {
  let load = def.loadPointsPerPulse;
  if (def.kind === 'maintenance_contract') {
    load += Math.round(v1012.maintenanceLoad * 0.08);
  }
  if (def.kind === 'debt_coupon' && v1012.debtEnabled) {
    load += Math.round(v1012.debtServiceLoad * 0.15);
  }
  if (v1012.pressure === 'critical') load = Math.round(load * 1.05);
  return load;
}

export function scheduleRecurringCommitments(
  turn: number,
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope,
  definitions: RecurringCommitmentDefinition[] = DEFAULT_RECURRING_COMMITMENTS
): RecurringCommitmentsSchedule {
  const pulses = definitions
    .filter(d => cadenceDue(d, turn))
    .map(d => {
      const loadPoints = scaleLoad(d, v1012);
      const line = envelope.lines.find(l => l.category === d.envelopeCategory);
      const skipped = Boolean(line && line.flexPoints < loadPoints && !d.mandatory);
      return {
        commitmentId: d.id,
        turn,
        loadPoints: skipped ? 0 : loadPoints,
        envelopeCategory: d.envelopeCategory,
        skipped,
        explanation: skipped
          ? `${d.title} deferred — insufficient flex in ${d.envelopeCategory}.`
          : `${d.title} pulses ${loadPoints} pts (${d.cadence}).`
      };
    });

  const mandatoryLoad = pulses
    .filter(p => {
      const def = definitions.find(d => d.id === p.commitmentId);
      return def?.mandatory && !p.skipped;
    })
    .reduce((s, p) => s + p.loadPoints, 0);

  const totalLoadThisTurn = pulses.reduce((s, p) => s + p.loadPoints, 0);
  const discretionaryLoad = totalLoadThisTurn - mandatoryLoad;

  const warnings: string[] = [];
  if (mandatoryLoad > envelope.totalCapacityPoints * 0.35) {
    warnings.push('Mandatory recurring load exceeds 35% of envelope capacity — rebalance recommended.');
  }
  if (pulses.some(p => p.skipped)) {
    warnings.push('One or more discretionary recurring pulses skipped due to envelope flex.');
  }

  const overlapsEnvelopeCommitted = envelope.lines.some(line => {
    const pulseLoad = pulses
      .filter(p => p.envelopeCategory === line.category && !p.skipped)
      .reduce((s, p) => s + p.loadPoints, 0);
    return pulseLoad + line.committedPoints > line.allocatedPoints * 1.15;
  });

  if (overlapsEnvelopeCommitted) {
    warnings.push('Recurring pulses plus committed envelope exceed category guard (115%).');
  }

  return {
    schemaVersion: RECURRING_COMMITMENTS_SCHEMA,
    turn,
    pulses,
    totalLoadThisTurn,
    mandatoryLoad,
    discretionaryLoad,
    overlapsEnvelopeCommitted,
    warnings
  };
}
