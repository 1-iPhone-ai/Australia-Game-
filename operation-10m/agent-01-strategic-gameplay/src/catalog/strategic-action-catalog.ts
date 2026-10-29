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
};

export function getStrategicAction(id: string): StrategicActionDefinition | undefined {
  return STRATEGIC_ACTION_CATALOG[id];
}

export function listStrategicActions(): StrategicActionDefinition[] {
  return Object.values(STRATEGIC_ACTION_CATALOG);
}
