import type {
  Acc17ProjectTemplate,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
  ResolvedObjective,
} from '../types/command-center-types.ts';
import {
  AGENT17_BASE_TEMPLATE_CATALOG,
  AGENT17_PROJECT_TEMPLATE_CATALOG,
} from './templates.ts';
import { AGENT17_DEEP_TEMPLATE_CATALOG } from './deep-templates.ts';
import { defaultObjectiveResolver } from './ops-state.ts';

export interface Agent17TemplateRoute {
  category: string;
  keywords: string[];
  templateIds: string[];
  priority: number;
}

export const AGENT17_TEMPLATE_ROUTE_TABLE: Agent17TemplateRoute[] = [
  {
    category: 'economy',
    keywords: ['cash', 'liquidity', 'debt', 'treasury', 'loan'],
    templateIds: ['agent17_tpl_economy_liquidity', 'agent17_tpl_deep_capital_program', 'agent17_tpl_debt_recovery'],
    priority: 10,
  },
  {
    category: 'trade',
    keywords: ['trade', 'market', 'arbitrage', 'sell', 'buy'],
    templateIds: ['agent17_tpl_trade_arbitrage', 'agent17_tpl_regional_recovery'],
    priority: 9,
  },
  {
    category: 'team',
    keywords: ['team', 'treasury', 'synergy', 'alignment'],
    templateIds: ['agent17_tpl_team_synergy', 'agent17_tpl_automation_oversight'],
    priority: 8,
  },
  {
    category: 'recovery',
    keywords: ['recover', 'supply', 'restock', 'crisis', 'blocked'],
    templateIds: [
      'agent17_tpl_recovery',
      'agent17_tpl_supply_deep_recovery',
      'agent17_tpl_crisis_stabilization',
    ],
    priority: 11,
  },
  {
    category: 'intelligence',
    keywords: ['strategy', 'gi3', 'planner', 'objective', 'plan'],
    templateIds: ['agent17_tpl_gi3_strategy', 'agent17_tpl_automation_oversight'],
    priority: 7,
  },
  {
    category: 'diplomacy',
    keywords: ['diplomacy', 'negotiation', 'rival', 'standing', 'treaty'],
    templateIds: ['agent17_tpl_diplomatic_depth'],
    priority: 6,
  },
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ');
}

export function inferAgent17ObjectiveCategory(
  objective: ResolvedObjective | null,
  state: Agent17GameStateSlice
): string {
  if (!objective?.title) return 'general';
  const blob = normalizeText(
    [objective.title, objective.description || '', objective.sourceType || ''].join(' ')
  );
  let best = { category: 'general', score: 0 };
  for (const route of AGENT17_TEMPLATE_ROUTE_TABLE) {
    let score = 0;
    for (const kw of route.keywords) {
      if (blob.includes(kw)) score += 1;
    }
    if (state.gi3Strategy?.headline && route.category === 'intelligence') score += 1;
    if (score > best.score) best = { category: route.category, score };
  }
  return best.score > 0 ? best.category : 'general';
}

export function rankAgent17TemplateCandidates(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): { matchedCategory: string; candidateTemplateIds: string[] } {
  const objective = defaultObjectiveResolver(state, settings, actorId);
  const matchedCategory = inferAgent17ObjectiveCategory(objective, state);
  const route = AGENT17_TEMPLATE_ROUTE_TABLE.find(r => r.category === matchedCategory);
  const fallbackIds = AGENT17_BASE_TEMPLATE_CATALOG.slice(0, 3).map(t => t.id);
  const candidateTemplateIds = route?.templateIds?.length
    ? [...route.templateIds]
    : fallbackIds;
  const cash = state.player?.money ?? state.actorsById?.[actorId]?.money ?? 0;
  if (cash < 500) {
    candidateTemplateIds.unshift('agent17_tpl_deep_capital_program');
  }
  const unique: string[] = [];
  for (const id of candidateTemplateIds) {
    if (!unique.includes(id) && AGENT17_PROJECT_TEMPLATE_CATALOG.some(t => t.id === id)) {
      unique.push(id);
    }
  }
  return { matchedCategory, candidateTemplateIds: unique.slice(0, 6) };
}

export function pickAgent17TemplateForCategory(category: string): Acc17ProjectTemplate | null {
  const route = AGENT17_TEMPLATE_ROUTE_TABLE.find(r => r.category === category);
  const id = route?.templateIds?.[0];
  if (!id) return null;
  return AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === id) ?? null;
}

export function summarizeAgent17CatalogDepth(): {
  templateCount: number;
  deepTemplateCount: number;
  maxStepCount: number;
} {
  const templateCount = AGENT17_PROJECT_TEMPLATE_CATALOG.length;
  const deepTemplateCount = AGENT17_DEEP_TEMPLATE_CATALOG.length;
  const maxStepCount = AGENT17_PROJECT_TEMPLATE_CATALOG.reduce(
    (max, t) => Math.max(max, t.stepBlueprints.length),
    0
  );
  return { templateCount, deepTemplateCount, maxStepCount };
}
