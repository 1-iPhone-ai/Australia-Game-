import type { EvolvingPanelDefinition, ProgressionTier } from '../types/progression.js';

const launcher = (
  id: string,
  label: string,
  tier: ProgressionTier,
  unlock: EvolvingPanelDefinition['unlock'],
  navTarget?: string
): EvolvingPanelDefinition => ({
  id,
  label,
  description: `${label} unified launcher entry.`,
  category: 'core',
  kind: 'floating_widget',
  progressionTier: tier,
  unlock,
  navTarget,
  widgetId: `launcher_${id}`,
  railOrder: 100,
  tags: ['launcher'],
});

/** Unified interface launcher entries (V9.4 launcherSettings parity). */
export const LAUNCHER_PANELS: EvolvingPanelDefinition[] = [
  launcher('ask_game', 'Ask Game', 1, { minDay: 1 }, 'ask_game'),
  launcher('guardian', 'Guardian', 2, { minDay: 3, minInterfaceLevel: 'guided' }),
  launcher('ai_command', 'AI Command', 3, { minDay: 7, minInterfaceLevel: 'advanced' }),
  launcher('strategy_planner', 'Strategy Planner', 3, { minDay: 6, minInterfaceLevel: 'advanced' }),
  launcher('quick_actions', 'Quick Actions', 1, { minDay: 1 }),
  launcher('notifications', 'Notifications', 0, {}, undefined),
  launcher('tools', 'Tools Menu', 2, { minDay: 4, minInterfaceLevel: 'guided' }),
  launcher('mechanics_directory', 'Mechanics Directory', 0, {}, 'help'),
];

export const LAUNCHER_PANEL_BY_ID: Record<string, EvolvingPanelDefinition> = Object.fromEntries(
  LAUNCHER_PANELS.map(p => [p.id, p])
);

export function listLauncherPanelsForNavTarget(navTarget: string): EvolvingPanelDefinition[] {
  return LAUNCHER_PANELS.filter(p => p.navTarget === navTarget);
}
