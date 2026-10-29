import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type {
  NationalPriorityAlignment,
  NationalPriorityRankingContext,
} from '../types/national-priority.ts';
import type {
  MultiStageChoiceDefinition,
  PlayerActionBudget,
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
  StrategicValidationRequirement,
} from '../types/strategic-action.ts';
import {
  actionAlreadyCompleted,
  pendingTradeOffCount,
} from './commitment-journal.ts';
import { validatePrerequisites } from './action-prerequisites.ts';
import {
  canExecuteAfterCooldown,
} from './strategic-synergies.ts';
import { stakeholderOppositionIssues } from './stakeholder-coalition.ts';
import { mandateMilestoneIssues } from './mandate-gates.ts';
import { coalitionBalanceIssues } from './coalition-gates.ts';
import {
  coalitionCrisisStreakIssues,
  coalitionRecoveryStreakIssues,
} from './coalition-crisis-gates.ts';
import { coalitionVolatilityIssues } from './coalition-volatility-gates.ts';
import { coalitionStabilizationStreakIssues } from './coalition-stabilization-gates.ts';
import { coalitionLockInStreakIssues, coalitionVolatilityCapIssues } from './coalition-lock-in-gates.ts';
import { crossModuleSyncStreakIssues } from './cross-module-sync-gates.ts';
import { integratedCoalitionMaturityStreakIssues } from './coalition-integrated-maturity-gates.ts';
import { coalitionStewardshipStreakIssues } from './coalition-stewardship-gates.ts';
import { coalitionAnchoredGovernanceStreakIssues } from './coalition-anchored-governance-gates.ts';
import { coalitionInstitutionalPermanenceStreakIssues } from './coalition-institutional-permanence-gates.ts';
import { coalitionGenerationalContinuityStreakIssues } from './coalition-generational-continuity-gates.ts';
import { coalitionCivilizationalEnduranceStreakIssues } from './coalition-civilizational-endurance-gates.ts';
import { coalitionTranscendentLegacyStreakIssues } from './coalition-transcendent-legacy-gates.ts';
import { coalitionSovereignContinuumStreakIssues } from './coalition-sovereign-continuum-gates.ts';
import { coalitionEternalAscendanceStreakIssues } from './coalition-eternal-ascendance-gates.ts';
import { coalitionInfinitePersistenceStreakIssues } from './coalition-infinite-persistence-gates.ts';
import { coalitionPrimordialContinuityStreakIssues } from './coalition-primordial-continuity-gates.ts';
import { coalitionAbsoluteSanctityStreakIssues } from './coalition-absolute-sanctity-gates.ts';
import { coalitionUniversalImmortalityStreakIssues } from './coalition-universal-immortality-gates.ts';
import { coalitionCosmicPerpetuityStreakIssues } from './coalition-cosmic-perpetuity-gates.ts';
import { coalitionGalacticInfinityStreakIssues } from './coalition-galactic-infinity-gates.ts';
import { coalitionStellarTranscendenceStreakIssues } from './coalition-stellar-transcendence-gates.ts';
import { coalitionQuantumOmnipresenceStreakIssues } from './coalition-quantum-omnipresence-gates.ts';
import { coalitionMultiversalPersistenceStreakIssues } from './coalition-multiversal-persistence-gates.ts';
import { coalitionMetaversalContinuityStreakIssues } from './coalition-metaversal-continuity-gates.ts';
import { coalitionOmniversalSynthesisStreakIssues } from './coalition-omniversal-synthesis-gates.ts';
import { coalitionHyperversalHarmonizationStreakIssues } from './coalition-hyperversal-harmonization-gates.ts';
import { coalitionTranscendentOmniumStreakIssues } from './coalition-transcendent-omnium-gates.ts';
import { coalitionSupremeConvergenceStreakIssues } from './coalition-supreme-convergence-gates.ts';
import { coalitionApexTranscendenceStreakIssues } from './coalition-apex-transcendence-gates.ts';
import { coalitionZenithPerpetuityStreakIssues } from './coalition-zenith-perpetuity-gates.ts';
import { coalitionParagonInfinityStreakIssues } from './coalition-paragon-infinity-gates.ts';

export function evaluateRequirements(
  requirements: StrategicValidationRequirement[] | undefined,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  action?: Pick<
    StrategicActionDefinition,
    'apCost' | 'cashCost' | 'treasuryCost' | 'minApproval'
  >,
  state?: StrategicGameplayState,
  options?: { maxPendingTradeOffs?: number },
): StrategicValidationIssue[] {
  const issues: StrategicValidationIssue[] = [];
  const econ = contracts.economy.snapshot();
  const gov = contracts.government.snapshot();
  const pop = contracts.population.snapshot();
  const tech = contracts.tech.snapshot();

  if (action) {
    if (budget.actionsUsedThisTurn + action.apCost > budget.actionsPerTurn) {
      issues.push({
        code: 'AP_EXHAUSTED',
        message: 'Not enough action points remaining this turn.',
        requirement: { kind: 'directive_slot_available' },
      });
    }
    if (!contracts.economy.canAfford(action.cashCost, action.treasuryCost)) {
      issues.push({
        code: 'INSUFFICIENT_FUNDS',
        message: 'Cash or treasury cannot cover this action.',
        requirement: { kind: 'min_cash', amount: action.cashCost },
      });
    }
    if (gov.approvalRating < action.minApproval) {
      issues.push({
        code: 'LOW_APPROVAL',
        message: `Approval ${gov.approvalRating} below required ${action.minApproval}.`,
        requirement: { kind: 'min_approval', rating: action.minApproval },
      });
    }
  }

  for (const req of requirements ?? []) {
    switch (req.kind) {
      case 'min_cash':
        if (econ.cashOnHand < req.amount) {
          issues.push({
            code: 'MIN_CASH',
            message: `Need at least $${req.amount} cash.`,
            requirement: req,
          });
        }
        break;
      case 'min_treasury':
        if (econ.treasuryReserve < req.amount) {
          issues.push({
            code: 'MIN_TREASURY',
            message: `Treasury reserve below ${req.amount}.`,
            requirement: req,
          });
        }
        break;
      case 'min_approval':
        if (gov.approvalRating < req.rating) {
          issues.push({
            code: 'MIN_APPROVAL',
            message: `Approval must be at least ${req.rating}.`,
            requirement: req,
          });
        }
        break;
      case 'max_affordability_stress':
        if (pop.affordabilityStress > req.max) {
          issues.push({
            code: 'POPULATION_STRESS',
            message: 'Household affordability stress is too high for this path.',
            requirement: req,
          });
        }
        break;
      case 'tech_readiness':
        if (!contracts.tech.meetsPrerequisite(req.track, req.min)) {
          issues.push({
            code: 'TECH_NOT_READY',
            message: `${req.track} readiness below ${req.min}.`,
            requirement: req,
          });
        }
        break;
      case 'no_investment_lockout':
        if (econ.investmentLockout) {
          issues.push({
            code: 'INVESTMENT_LOCKOUT',
            message: 'Markets are in investment lockout.',
            requirement: req,
          });
        }
        break;
      case 'directive_slot_available':
        if (!contracts.government.canIssueDirective(0)) {
          issues.push({
            code: 'NO_DIRECTIVE_SLOT',
            message: 'No governance directive capacity remaining.',
            requirement: req,
          });
        }
        break;
      case 'max_pending_tradeoffs':
        if (state && pendingTradeOffCount(state) >= req.max) {
          issues.push({
            code: 'TOO_MANY_PENDING_TRADEOFFS',
            message: `Cannot schedule more than ${req.max} delayed trade-offs.`,
            requirement: req,
          });
        }
        break;
      case 'action_not_yet_completed':
        if (state && !actionAlreadyCompleted(state, req.actionId)) {
          issues.push({
            code: 'PREREQUISITE_ACTION',
            message: `Requires completing ${req.actionId} first.`,
            requirement: req,
          });
        }
        break;
      case 'mandate_milestone':
        if (state) {
          issues.push(
            ...mandateMilestoneIssues(
              {
                id: '_gate',
                title: '',
                category: 'governance',
                apCost: 0,
                cashCost: 0,
                treasuryCost: 0,
                minApproval: 0,
                alignedPriorities: [],
                conflictingPriorities: [],
                immediateEffects: {},
                delayedTradeOffs: [],
                tags: [],
                requiredMandateMilestones: [
                  { priorityId: req.priorityId, milestoneId: req.milestoneId },
                ],
              },
              state,
            ),
          );
        }
        break;
      case 'min_coalition_balance':
        if (state) {
          issues.push(
            ...coalitionBalanceIssues(
              {
                id: '_gate',
                title: '',
                category: 'governance',
                apCost: 0,
                cashCost: 0,
                treasuryCost: 0,
                minApproval: 0,
                alignedPriorities: [],
                conflictingPriorities: [],
                immediateEffects: {},
                delayedTradeOffs: [],
                tags: [],
                minCoalitionBalanceIndex: req.minIndex,
              },
              state,
            ),
          );
        }
        break;
      case 'max_coalition_balance':
        if (state) {
          issues.push(
            ...coalitionBalanceIssues(
              {
                id: '_gate',
                title: '',
                category: 'governance',
                apCost: 0,
                cashCost: 0,
                treasuryCost: 0,
                minApproval: 0,
                alignedPriorities: [],
                conflictingPriorities: [],
                immediateEffects: {},
                delayedTradeOffs: [],
                tags: [],
                maxCoalitionBalanceIndex: req.maxIndex,
              },
              state,
            ),
          );
        }
        break;
      default:
        break;
    }
  }

  return issues;
}

export function validateAction(
  action: StrategicActionDefinition,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  extraRequirements: StrategicValidationRequirement[] = [],
  state?: StrategicGameplayState,
  options?: { maxPendingTradeOffs?: number },
): StrategicValidationIssue[] {
  const issues = evaluateRequirements(
    extraRequirements,
    contracts,
    budget,
    action,
    state,
    options,
  );

  if (state && action.repeatable === false && actionAlreadyCompleted(state, action.id)) {
    issues.push({
      code: 'ALREADY_COMPLETED',
      message: `${action.title} cannot be repeated.`,
      requirement: { kind: 'action_not_yet_completed', actionId: action.id },
    });
  }

  const maxPending =
    action.requiresMaxPendingTradeOffs ?? options?.maxPendingTradeOffs;
  if (state && maxPending !== undefined && pendingTradeOffCount(state) >= maxPending) {
    issues.push({
      code: 'TOO_MANY_PENDING_TRADEOFFS',
      message: `Delayed trade-off queue full (max ${maxPending}).`,
      requirement: { kind: 'max_pending_tradeoffs', max: maxPending },
    });
  }

  if (state) {
    issues.push(...stakeholderOppositionIssues(action, contracts, state));
    issues.push(...mandateMilestoneIssues(action, state));
    issues.push(...coalitionBalanceIssues(action, state));
    issues.push(...coalitionCrisisStreakIssues(action, state));
    issues.push(...coalitionRecoveryStreakIssues(action, state));
    issues.push(...coalitionVolatilityIssues(action, state));
    issues.push(...coalitionStabilizationStreakIssues(action, state));
    issues.push(...coalitionLockInStreakIssues(action, state));
    issues.push(...coalitionVolatilityCapIssues(action, state));
    issues.push(...crossModuleSyncStreakIssues(action, state));
    issues.push(...integratedCoalitionMaturityStreakIssues(action, state));
    issues.push(...coalitionStewardshipStreakIssues(action, state));
    issues.push(...coalitionAnchoredGovernanceStreakIssues(action, state));
    issues.push(...coalitionInstitutionalPermanenceStreakIssues(action, state));
    issues.push(...coalitionGenerationalContinuityStreakIssues(action, state));
    issues.push(...coalitionCivilizationalEnduranceStreakIssues(action, state));
    issues.push(...coalitionTranscendentLegacyStreakIssues(action, state));
    issues.push(...coalitionSovereignContinuumStreakIssues(action, state));
    issues.push(...coalitionEternalAscendanceStreakIssues(action, state));
    issues.push(...coalitionInfinitePersistenceStreakIssues(action, state));
    issues.push(...coalitionPrimordialContinuityStreakIssues(action, state));
    issues.push(...coalitionAbsoluteSanctityStreakIssues(action, state));
    issues.push(...coalitionUniversalImmortalityStreakIssues(action, state));
    issues.push(...coalitionCosmicPerpetuityStreakIssues(action, state));
    issues.push(...coalitionGalacticInfinityStreakIssues(action, state));
    issues.push(...coalitionStellarTranscendenceStreakIssues(action, state));
    issues.push(...coalitionQuantumOmnipresenceStreakIssues(action, state));
    issues.push(...coalitionMultiversalPersistenceStreakIssues(action, state));
    issues.push(...coalitionMetaversalContinuityStreakIssues(action, state));
    issues.push(...coalitionOmniversalSynthesisStreakIssues(action, state));
    issues.push(...coalitionHyperversalHarmonizationStreakIssues(action, state));
    issues.push(...coalitionTranscendentOmniumStreakIssues(action, state));
    issues.push(...coalitionSupremeConvergenceStreakIssues(action, state));
    issues.push(...coalitionApexTranscendenceStreakIssues(action, state));
    issues.push(...coalitionZenithPerpetuityStreakIssues(action, state));
    issues.push(...coalitionParagonInfinityStreakIssues(action, state));
    issues.push(...validatePrerequisites(state, action));
    if (!canExecuteAfterCooldown(state, action.id)) {
      issues.push({
        code: 'COOLDOWN_ACTIVE',
        message: `${action.title} is on cooldown.`,
        requirement: { kind: 'action_not_yet_completed', actionId: action.id },
      });
    }
  }

  return issues;
}

export function validateChoiceOption(
  choice: MultiStageChoiceDefinition,
  stageId: string,
  optionId: string,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
): StrategicValidationIssue[] {
  const stage = choice.stages.find((s) => s.stageId === stageId);
  const option = stage?.options.find((o) => o.optionId === optionId);
  if (!stage || !option) {
    return [
      {
        code: 'UNKNOWN_CHOICE',
        message: 'Invalid choice stage or option.',
        requirement: { kind: 'min_cash', amount: 0 },
      },
    ];
  }
  return evaluateRequirements(option.requirements, contracts, budget);
}

export function scoreNationalPriorityAlignment(
  action: StrategicActionDefinition,
  ctx: NationalPriorityRankingContext | null,
): NationalPriorityAlignment | null {
  if (!ctx || ctx.priorities.length === 0) return null;
  const primary = ctx.priorities.find((p) => p.isPrimary) ?? ctx.priorities[0];
  if (action.conflictingPriorities.includes(primary.id)) {
    return {
      score: -25,
      band: 'conflict',
      reason: `Undermines primary priority: ${primary.title}.`,
      priorityId: primary.id,
    };
  }
  if (action.alignedPriorities.includes(primary.id)) {
    const urgencyBoost =
      primary.urgency === 'critical'
        ? 20
        : primary.urgency === 'urgent'
          ? 12
          : primary.urgency === 'important'
            ? 6
            : 2;
    return {
      score: 15 + urgencyBoost,
      band: 'strong',
      reason: `Directly supports ${primary.title}.`,
      priorityId: primary.id,
    };
  }
  if (action.alignedPriorities.length > 0) {
    return {
      score: 8,
      band: 'moderate',
      reason: 'Supports a secondary national priority.',
      priorityId: action.alignedPriorities[0],
    };
  }
  return {
    score: 0,
    band: 'none',
    reason: 'No strong link to current national priorities.',
    priorityId: primary.id,
  };
}
