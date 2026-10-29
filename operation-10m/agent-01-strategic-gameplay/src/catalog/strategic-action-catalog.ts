import type { MultiStageChoiceDefinition } from '../types/strategic-action.ts';
import type { StrategicActionDefinition } from '../types/strategic-action.ts';

export const STRATEGIC_ACTION_CATALOG: Record<string, StrategicActionDefinition> = {
  'sga_water_grid_upgrade': {
    id: 'sga_water_grid_upgrade',
    title: 'National Water Grid Upgrade',
    category: 'investment',
    apCost: 2,
    cashCost: 50_000,
    treasuryCost: 200_000,
    minApproval: 45,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: ['economic_diversification'],
    tags: ['infrastructure', 'national_priority'],
    repeatable: false,
    immediateEffects: {
      economy: {
        cashDelta: -50_000,
        treasuryDelta: -200_000,
        ledgerNote: 'Up-front capital for water grid tranche.',
      },
      government: { approvalDelta: 3, directiveSlotsDelta: 1 },
      population: { essentialAccessDelta: 4, publicStabilityDelta: 2 },
      tech: { readinessDelta: { renewable_energy: 5 } },
    },
    delayedTradeOffs: [
      {
        label: 'Maintenance levy hits households',
        warning: 'In 3 days: affordability stress rises while debt is serviced.',
        effects: {
          economy: { debtDelta: 75_000, netWorthMultiplier: 0.98 },
          population: { affordabilityStressDelta: 6 },
          government: { approvalDelta: -1 },
        },
      },
    ],
  },
  'sga_supply_chain_buffer': {
    id: 'sga_supply_chain_buffer',
    title: 'Strategic Supply Chain Buffer',
    category: 'trade_off',
    apCost: 1,
    cashCost: 25_000,
    treasuryCost: 100_000,
    minApproval: 40,
    alignedPriorities: ['supply_chain_security', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['logistics', 'buffer'],
    immediateEffects: {
      economy: {
        cashDelta: -25_000,
        treasuryDelta: -100_000,
        priceMultiplierFactor: 0.95,
      },
      population: { essentialAccessDelta: 2 },
      tech: { momentumDelta: 3 },
    },
    delayedTradeOffs: [
      {
        label: 'Warehouse carrying costs',
        warning: 'Storage fees reduce treasury reserve next week.',
        effects: {
          economy: { treasuryDelta: -40_000 },
          government: { regulatoryBurdenDelta: 2 },
        },
      },
    ],
  },
  'sga_tech_accelerator': {
    id: 'sga_tech_accelerator',
    title: 'Technology Competitiveness Accelerator',
    category: 'research',
    apCost: 2,
    cashCost: 80_000,
    treasuryCost: 50_000,
    minApproval: 50,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: ['water_security'],
    tags: ['innovation'],
    repeatable: false,
    immediateEffects: {
      economy: { cashDelta: -80_000, treasuryDelta: -50_000 },
      tech: {
        researchDelta: 120,
        readinessDelta: {
          digital_infrastructure: 8,
          advanced_manufacturing: 6,
        },
        momentumDelta: 10,
      },
      government: { approvalDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Brain-drain pressure on essential services',
        warning: 'Skilled migration toward tech hubs strains regional access.',
        effects: {
          population: {
            migrationDelta: -3,
            essentialAccessDelta: -2,
            affordabilityStressDelta: 3,
          },
        },
      },
    ],
  },
  'sga_freight_corridor_modernization': {
    id: 'sga_freight_corridor_modernization',
    title: 'Freight Corridor Modernization',
    category: 'investment',
    apCost: 2,
    cashCost: 40_000,
    treasuryCost: 180_000,
    minApproval: 42,
    alignedPriorities: ['freight_modernization', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['infrastructure', 'logistics'],
    repeatable: false,
    immediateEffects: {
      economy: { cashDelta: -40_000, treasuryDelta: -180_000, priceMultiplierFactor: 0.92 },
      government: { approvalDelta: 2, regulatoryBurdenDelta: 1 },
      population: { essentialAccessDelta: 1, publicStabilityDelta: 1 },
      tech: { readinessDelta: { advanced_manufacturing: 4 } },
    },
    delayedTradeOffs: [
      {
        label: 'Corridor disruption during upgrades',
        warning: 'Short-term freight delays increase market prices.',
        effects: {
          economy: { priceMultiplierFactor: 1.08, treasuryDelta: -25_000 },
          population: { affordabilityStressDelta: 4 },
        },
      },
    ],
  },
  'sga_energy_resilience_reserve': {
    id: 'sga_energy_resilience_reserve',
    title: 'Energy Resilience Reserve',
    category: 'governance',
    apCost: 1,
    cashCost: 20_000,
    treasuryCost: 120_000,
    minApproval: 38,
    alignedPriorities: ['energy_resilience', 'water_security'],
    conflictingPriorities: ['technology_competitiveness'],
    tags: ['energy', 'reserve'],
    repeatable: true,
    requiresMaxPendingTradeOffs: 7,
    immediateEffects: {
      economy: { cashDelta: -20_000, treasuryDelta: -120_000 },
      government: { approvalDelta: 4, directiveSlotsDelta: 1 },
      population: { essentialAccessDelta: 3 },
      tech: { readinessDelta: { renewable_energy: 6 }, momentumDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Reserve storage operating costs',
        warning: 'Ongoing O&M draws from treasury.',
        effects: { economy: { treasuryDelta: -30_000 } },
      },
    ],
  },
  'sga_economic_diversification_pilot': {
    id: 'sga_economic_diversification_pilot',
    title: 'Economic Diversification Pilot',
    category: 'investment',
    apCost: 1,
    cashCost: 35_000,
    treasuryCost: 75_000,
    minApproval: 44,
    alignedPriorities: ['economic_diversification', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['pilot', 'industry'],
    repeatable: false,
    immediateEffects: {
      economy: { cashDelta: -35_000, treasuryDelta: -75_000, netWorthMultiplier: 1.01 },
      tech: {
        researchDelta: 40,
        readinessDelta: { advanced_manufacturing: 5, biotech: 3 },
      },
      population: { migrationDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Pilot sunset review',
        warning: 'Failed sectors require relief spending.',
        effects: {
          economy: { treasuryDelta: -50_000 },
          government: { approvalDelta: -2, reliefClaimsDelta: 3 },
          population: { publicStabilityDelta: -2 },
        },
      },
      {
        label: 'Supply chain rebalancing',
        warning: 'Secondary logistics strain after pivot.',
        effects: {
          population: { affordabilityStressDelta: 2 },
          economy: { priceMultiplierFactor: 1.04 },
        },
      },
    ],
  },
};

export const MULTI_STAGE_CHOICE_CATALOG: Record<string, MultiStageChoiceDefinition> = {
  'msc_water_commitment': {
    choiceId: 'msc_water_commitment',
    title: 'Commit to Water Security',
    linkedActionId: 'sga_water_grid_upgrade',
    entryStageId: 'stage_scope',
    stages: [
      {
        stageId: 'stage_scope',
        prompt: 'Choose the scope of the water grid intervention.',
        options: [
          {
            optionId: 'scope_regional',
            label: 'Regional tranche only',
            description: 'Lower cost, slower security gains.',
            nextStageId: 'stage_finance',
            requirements: [{ kind: 'min_cash', amount: 30_000 }],
          },
          {
            optionId: 'scope_national',
            label: 'National backbone',
            description: 'Full grid upgrade path.',
            nextStageId: 'stage_finance',
            requirements: [
              { kind: 'min_cash', amount: 50_000 },
              { kind: 'min_treasury', amount: 150_000 },
            ],
          },
        ],
      },
      {
        stageId: 'stage_finance',
        prompt: 'Select financing — each path has different delayed costs.',
        options: [
          {
            optionId: 'finance_bonds',
            label: 'Issue recovery bonds',
            description: 'Spread cost; higher delayed debt load.',
            nextStageId: 'stage_confirm',
            requirements: [{ kind: 'min_approval', rating: 45 }],
          },
          {
            optionId: 'finance_treasury',
            label: 'Direct treasury draw',
            description: 'Immediate fiscal hit, cleaner long-term books.',
            nextStageId: 'stage_confirm',
            requirements: [{ kind: 'directive_slot_available' }],
          },
        ],
      },
      {
        stageId: 'stage_confirm',
        prompt: 'Confirm execution — maintenance levy will apply in 3 days.',
        options: [
          {
            optionId: 'confirm_execute',
            label: 'Execute upgrade',
            description: 'Commit to consequential investment.',
            nextStageId: null,
            resolvesActionId: 'sga_water_grid_upgrade',
            requirements: [{ kind: 'max_affordability_stress', max: 85 }],
          },
          {
            optionId: 'confirm_abort',
            label: 'Defer',
            description: 'Exit without spending.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
  'msc_freight_corridor': {
    choiceId: 'msc_freight_corridor',
    title: 'Freight Corridor Commitment',
    linkedActionId: 'sga_freight_corridor_modernization',
    entryStageId: 'freight_route',
    stages: [
      {
        stageId: 'freight_route',
        prompt: 'Select primary corridor to modernize.',
        options: [
          {
            optionId: 'route_inland',
            label: 'Inland rail spine',
            description: 'Higher upfront cost, stronger supply chain redundancy.',
            nextStageId: 'freight_risk',
            requirements: [{ kind: 'min_treasury', amount: 120_000 }],
          },
          {
            optionId: 'route_coastal',
            label: 'Coastal highway upgrade',
            description: 'Faster delivery wins; less redundancy.',
            nextStageId: 'freight_risk',
            requirements: [{ kind: 'min_cash', amount: 25_000 }],
          },
        ],
      },
      {
        stageId: 'freight_risk',
        prompt: 'Accept disruption risk during construction?',
        options: [
          {
            optionId: 'risk_accept',
            label: 'Accept short-term disruption',
            description: 'Proceed knowing delayed price shock is likely.',
            nextStageId: 'freight_confirm',
            requirements: [{ kind: 'max_pending_tradeoffs', max: 6 }],
          },
          {
            optionId: 'risk_mitigate',
            label: 'Fund mitigation contracts',
            description: 'Higher immediate spend, smoother trade profile.',
            nextStageId: 'freight_confirm',
            requirements: [
              { kind: 'min_cash', amount: 45_000 },
              { kind: 'no_investment_lockout' },
            ],
          },
        ],
      },
      {
        stageId: 'freight_confirm',
        prompt: 'Confirm corridor modernization.',
        options: [
          {
            optionId: 'freight_execute',
            label: 'Execute modernization',
            description: 'Commit freight investment.',
            nextStageId: null,
            resolvesActionId: 'sga_freight_corridor_modernization',
            requirements: [{ kind: 'min_approval', rating: 42 }],
          },
          {
            optionId: 'freight_defer',
            label: 'Defer',
            description: 'Exit without commitment.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
};

export function getStrategicAction(id: string): StrategicActionDefinition | undefined {
  return STRATEGIC_ACTION_CATALOG[id];
}

export function listStrategicActions(): StrategicActionDefinition[] {
  return Object.values(STRATEGIC_ACTION_CATALOG);
}
