// UX-1 proposals: where every surface, section and setting lives in V11.0, and which package moves it.
// These are design proposals for the owner to confirm; everything measured lives in the data files, not here.

// ---- UX-3: Essentials (12 choices) and five goal-based groups that replace the 11 tabs ----------------------------
const ESSENTIALS = [
  { choice: 'Experience', keys: ['experienceMode'], why: 'Explorer / Nation / Full decides how much of the game is on screen.' },
  { choice: 'How to win', keys: ['winCondition'], why: 'The victory goal; locked while a match runs (V10.1).' },
  { choice: 'Game length', keys: ['totalDays'], why: 'Days on the calendar; locked while a match runs (V10.1).' },
  { choice: 'Actions per day', keys: ['actionLimitsEnabled', 'playerActionsPerDay'], why: 'The daily action budget and its on/off switch, as one choice.' },
  { choice: 'Rival difficulty', keys: ['(match state) gameState.aiDifficulty'], why: 'Q6: writes match state through SET_AI_DIFFICULTY, the path Quick Setup and the menu picker use (locked while a match runs). The settings key `aiDifficulty` is never written and stays internal.' },
  { choice: 'Keep my match safe', keys: ['matchRecoveryEnabled', 'warnBeforeUnloadEnabled'], why: 'Autosave & Resume and the leave-site warning: the V10.1 diagnosis ranked silent progress loss #3.' },
  { choice: 'How much help', keys: ['guidedLearning', 'guidedFirstRunEnabled', 'playerIntentOnboardingEnabled'], why: 'Q6: Guided Learning mode (Off … Teaching), the guided first match and the onboarding hints, as one choice.' },
  { choice: 'Rival turn speed', keys: ['rivalTurnPace'], why: 'Q6: how quickly the rival\'s turn is shown; takes the slot freed by folding Guided first match into How much help.' },
  { choice: 'Look', keys: ['visualMode', '(profile) theme'], why: 'Enhanced/classic look and the Dark/Light/Retro/System theme.' },
  { choice: 'Text size', keys: ['accessibilitySettings.textScaleMultiplier'], why: 'A−/A+ (V10.1).' },
  { choice: 'Motion', keys: ['reducedMotion'], why: 'Follow system / reduce / full motion.' },
  { choice: 'Sound', keys: ['soundEnabled', 'soundVolume'], why: 'Sound effects and volume, as one choice.' }
];

const GROUPS = {
  essentials: { label: '⭐ Essentials', goal: 'The 12 choices most players want; everything else is one click away.' },
  match: { label: '🎮 Match & rules', goal: 'Set up how a match plays: length, goal, actions, challenges, money, regions and content.' },
  rival: { label: '🤖 Your rival', goal: 'How strong your rival is, how it thinks and what it remembers.' },
  teams: { label: '👥 Teams & automation', goal: 'Team Mode, AI teammates, automation and oversight.' },
  help: { label: '🧭 Help, screen & sound', goal: 'Guidance, assistants, look, sound, accessibility and layout.' },
  tools: { label: '🔬 Records & tools', goal: 'Replays, records, diagnostics, balance tools and the reference library.' }
};

// Every settings section (86 indexed + the unindexed Balance Lab) -> its V11.0 group.
const SECTION_GROUP = {
  'home.dashboard': 'essentials', 'quickSetup.presets': 'essentials', 'quickSetup.core': 'match',
  'mechanicsDirectory.directory': 'tools', 'teamModeAi.overview': 'tools',
  'gameplay.core': 'match', 'gameplay.actionLimits': 'match', 'gameplay.actionOverride': 'match', 'gameplay.challengeRules': 'match', 'gameplay.expansions': 'match',
  'gameplay.matchVariety': 'match', 'gameplay.scenarioMode': 'match', 'gameplay.rivalryCampaign': 'match', 'gameplay.v101': 'match', 'gameplay.v100': 'match', 'gameplay.v99': 'match',
  'economy.winCondition': 'match', 'economy.matchShape': 'match', 'economy.loans': 'match',
  'competition.regionControl': 'match', 'competition.regionalStanding': 'match', 'competition.externalTerritories': 'match', 'competition.negotiations': 'match', 'competition.competitiveActions': 'match',
  'ai.settings': 'rival', 'aiStrategyLab.main': 'rival', 'aiTeams.strategySliders': 'rival', 'teamModeAi.aiThinkingAlgorithm': 'rival', 'teamModeAi.algorithmBuilder': 'rival',
  'ai.adaptive': 'rival', 'ai.memory': 'rival', 'ai.persistentMemory': 'rival', 'ai.opponentMind': 'rival', 'ai.communication': 'rival',
  'teamModeAi.teamBrain': 'teams', 'teamModeAi.competitiveAi': 'teams', 'teamModeAi.actionOverrides': 'teams', 'teamModeAi.sharedActionBank': 'teams', 'teamModeAi.actionLending': 'teams',
  'teamModeAi.teamPlans': 'teams', 'teamModeAi.reservations': 'teams', 'teamModeAi.threatTargeting': 'teams', 'teamModeAi.endgameAcceleration': 'teams', 'teamModeAi.emergencyActions': 'teams',
  'teamModeAi.teamInitiative': 'teams', 'teamModeAi.comboBonuses': 'teams', 'teamModeAi.cashVault': 'teams', 'teamModeAi.performanceSync2': 'teams', 'teamModeAi.parallelPlanning': 'teams',
  'teamModeAi.actionSequences': 'teams',
  'aiTeams.coPilot': 'help',
  'teamModeAi.actionApproval': 'teams', 'teamModeAi.actionRequirements': 'teams', 'advancedSystems.humanAutomation': 'teams', 'autoMode.main': 'teams', 'autoMode.advanced': 'teams',
  'teamModeAi.economyGovernor': 'teams', 'teamModeAi.treasury': 'teams', 'teamModeAi.overseer': 'teams', 'teamModeAi.governanceControlSurface': 'teams', 'teamModeAi.auditor': 'teams', 'advancedSystems.priority': 'teams',
  'advancedSystems.decisionTransparency': 'tools', 'advancedSystems.gameActivityLedger': 'tools', 'advancedSystems.aiPipelineInspector': 'tools', 'advancedSystems.diag2Overlay': 'tools',
  'advancedSystems.coPilotStartPhase': 'tools', 'advancedSystems.postMatchDebrief': 'tools', 'advancedSystems.replaySafety': 'tools', 'advancedSystems.balanceLab': 'tools',
  'interface.categoryNavigation': 'help', 'interface.startScreen': 'help', 'interface.floatingUi': 'help', 'interface.aiAssistants': 'help', 'interface.launcherDock': 'help',
  'interface.quickActionsVisibility': 'help', 'interface.layoutPresets': 'help', 'interface.modalSizes': 'help', 'interface.uiRescue': 'help', 'interface.safeAreaPreview': 'help',
  'interface.accessibility': 'help', 'interface.appearance': 'help', 'interface.firstRun': 'help', 'interface.mapSound': 'help', 'interface.changelog': 'help', 'interface.uxAssist': 'help', 'interface.notifications': 'help'
};

// Keys DEFAULT_GAME_SETTINGS holds but the hub index does not: where they are set today and where they go.
const NOT_INDEXED = {
  opponentGenomeId: { today: 'AI Thinking & Algorithm section (rendered there, not indexed) and the AI Tuning Lab', group: 'rival', section: 'teamModeAi.aiThinkingAlgorithm', clicks: 2 },
  replaySmartCheckpointsEnabled: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  replayTurningPointDetectionEnabled: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  replayDeterministicValidationEnabled: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  replayWhatIfBranchingEnabled: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  replayDeveloperDiagnosticsEnabled: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  replayAutoOpenAtMatchEnd: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  replayDetailLevel: { today: 'AI Difficulty section (rendered there, not indexed)', group: 'tools', section: 'advancedSystems.replaySafety', clicks: 2 },
  playerIntentOnboardingEnabled: { today: 'INTELLIGENCE → Learn mode buttons ("Off" turns it off; any other mode on), set together with guidedLearning', group: 'essentials', section: null, clicks: 2 },
  playerIntentOnboardingDismissed: { today: 'internal list of dismissed onboarding cards (no control)', group: 'internal', section: null },
  playerIntentExplainRoutineActions: { today: 'INTELLIGENCE → Co-Pilot strip ("Skip routine sales")', group: 'help', section: 'aiTeams.coPilot', clicks: 1 },
  playerIntentExplainMode: { today: 'INTELLIGENCE → Co-Pilot strip ("High-impact only" / "Explain every action")', group: 'help', section: 'aiTeams.coPilot', clicks: 1 },
  guidedLearning: { today: 'INTELLIGENCE → Learn tab (Off / Minimal / Important tips / Learn as I play / Teaching)', group: 'essentials', section: null, clicks: 2 },
  nationalSystemsEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  industriesEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  infraNetworksEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  megaprojectsEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  nationalDevelopmentEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  innovationEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  systemicRiskEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  nationalPrioritiesEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  economicGeographyEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  workforceHumanCapitalEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  stateCapacityEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  publicFinanceEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  householdsEnabled: { today: 'Match Variety section (rendered there, not indexed)', group: 'match', section: 'gameplay.matchVariety', clicks: 2 },
  teamIntelligenceOsEnabled: { today: 'LAB → Team Intelligence 2.0 inspector ("ON" button); not in Settings', group: 'teams', section: null, clicks: 1 },
  teamOsAuthorityLevel: { today: 'LAB → Team Intelligence 2.0 inspector (Authority dropdown); not in Settings', group: 'teams', section: null, clicks: 1 },
  teamOsEnemyEnabled: { today: 'LAB → Team Intelligence 2.0 inspector ("Enemy Team OS" button); not in Settings', group: 'teams', section: null, clicks: 1 },
  teamOsFullInspectionEnabled: { today: 'LAB → Team Intelligence 2.0 inspector ("Full Inspection (debug)" button); not in Settings', group: 'teams', section: null, clicks: 1 }
};

// Keys that hold game/UI state rather than a player choice (kept, never shown as a control; travel with import/export only).
const INTERNAL_KEYS = new Set(['v93RecentRare', 'deferredTransactions', 'playerIntentOnboardingDismissed', 'smartSettingsProfile', 'autoModeDiagnosticsDrawerOpen', 'deterministicRngActive', 'aiDifficulty']);
// Why an internal key has no route (shown in §7).
const INTERNAL_NOTES = {
  deterministicRngActive: 'set only by presets (the Replay Studio "Determinism Audit" preset and the scenario presets, each with five other keys); nothing in the game reads it, so it has no effect, though it is not flagged "No effect in this version"',
  aiDifficulty: 'never written; the live difficulty is match state (`gameState.aiDifficulty`, SET_AI_DIFFICULTY), which Essentials #5 writes (Q6)'
};
// V11.0 home section when it differs from where the control is today (map corrections 2 and 4).
const HOME_SECTION_OVERRIDE = { teamModeAiSystemProfile: 'teamModeAi.competitiveAi', teamModeAiSystemsEnabled: 'teamModeAi.competitiveAi' };
// Q7: the switches of the version-named sections ("New in V9.9 / V10.0 / V10.1"), filed by goal; the version labels move to What\'s New.
const VERSION_REFILE = {
  matchJournalEnabled: ['match', 'Daily Challenge & Match Journal (new)'], dailyFixedRulesEnabled: ['match', 'Daily Challenge & Match Journal (new)'],
  classicRulesV100: ['match', 'Classic rules (new)'],
  rivalRacesEnabled: ['rival', 'Rival extras (new)'], rivalRecapEnabled: ['rival', 'Rival extras (new)'], classicRivalV99: ['rival', 'Classic rival (new)'],
  turnDigestEnabled: ['help', 'Turn summaries (new)'], classicStickyToasts: ['help', 'Classic look & feel (new)'], classicPlayScreenLayout: ['help', 'Classic look & feel (new)']
};
const VERSION_SECTIONS = ['gameplay.v99', 'gameplay.v100', 'gameplay.v101'];
// Keys indexed in several sections: the one that becomes the single V11.0 home (otherwise the first non-Quick-Setup section).
const PRIMARY_OVERRIDE = { negotiationMode: 'competition.negotiations', aiDeterministic: 'advancedSystems.replaySafety', aiReplayRecordingEnabled: 'advancedSystems.replaySafety', aiReplayMaxEvents: 'advancedSystems.replaySafety', teamDifficultyOverrides: 'teamModeAi.competitiveAi', overseerWinConditionCounterStrategyEnabled: 'teamModeAi.overseer', teamModeAiSystemProfile: 'interface.uxAssist' };

// ---- UX-5: what happens to each registry surface ----------------------------------------------------------------------
// dock = a tab of the one docked side panel (the brief's five); dock? = proposed extra tab (owner to confirm, see Q3);
// decision = stays a blocking modal; window = stays a (tool) window, see Q3; panel = already non-modal, keeps its place.
const SURFACE_PLAN = {
  base_game: ['panel', 'Play screen, map always visible beside the docked panel', 'UX-5 · UX-6'],
  game_hud: ['panel', 'Header (unchanged); gains the visible 🔎 Find button', 'UX-2'],
  floating_widget_dock: ['panel', 'Unchanged (optional, off); card on "What\'s in the game"', 'UX-4'],
  guardian_floating_button: ['panel', 'Unchanged (optional, off); card on "What\'s in the game"', 'UX-4'],
  ai_command_center_widget: ['panel', 'Unchanged (optional, off); card on "What\'s in the game"', 'UX-4'],
  quick_actions: ['panel', 'Quick bar above the play card (unchanged)', 'UX-6'],
  quick_actions_reopen_handle: ['panel', 'Unchanged', 'UX-6'],
  notification_toasts: ['panel', 'Toast lane (unchanged)', 'UX-6'],
  unified_interface_launcher: ['panel', 'Unchanged (optional, off); card on "What\'s in the game"', 'UX-4'],
  guardian_status_panel: ['panel', 'Side drawer (unchanged)', 'UX-2'],
  guardian_side_panel: ['panel', 'No opener today: wire it to the Guardian card or merge into the Status Panel (Q4)', 'UX-2'],
  notification_drawer: ['panel', 'Side drawer (unchanged); Find Anything entry "History"', 'UX-2'],
  developer_diagnostics_drawer: ['panel', 'Register the real Diagnostics Drawer (Ctrl+Alt+D) under this id (Q4)', 'UX-2'],
  settings_hub: ['window', 'Settings rebuilt: Essentials + 5 goal groups + search + "show inactive"', 'UX-3'],
  major_transition_confirmation_modal: ['decision', 'Stays a blocking confirmation', 'UX-6 (restyle only)'],
  quick_actions_customizer: ['window', 'Stays a small window (customise the quick bar)', 'UX-2'],
  guardian_ai_center: ['window', 'Stays a window; Guardian card on "What\'s in the game"', 'UX-2 · UX-4'],
  ai_command_center_modal: ['window', 'Stays a window (optional, off)', 'UX-2 · UX-4'],
  ask_game_ai: ['window', 'Help + Ask: Help moves into Find Anything results; Ask drawer stays (optional)', 'UX-2'],
  strategy_planner: ['window', 'Stays a window', 'UX-2'],
  negotiation_center: ['dock?', 'Docked panel, extra tab "Negotiate" (Q3)', 'UX-5'],
  save_load_modal: ['decision', 'Stays a modal (a load replaces the match)', 'UX-6 (restyle only)'],
  replay_viewer: ['window', 'Stays a window; register with the surface manager (Q4)', 'UX-2'],
  activity_ledger: ['window', 'Stays a window', 'UX-2'],
  developer_diagnostics: ['window', 'Stays a window (developer)', 'UX-2'],
  overseer_dashboard: ['window', 'Stays a window (Team Mode)', 'UX-2 · UX-4'],
  auditor_dashboard: ['window', 'Stays a window (Team Mode)', 'UX-2 · UX-4'],
  human_automation_dashboard: ['window', 'Stays a window; Live Control Center gets its own id (Q4)', 'UX-2'],
  regional_contracts_modal: ['dock?', 'Docked panel, extra tab "Contracts" (Q3)', 'UX-5 · UX-4'],
  infrastructure_projects_modal: ['dock?', 'Docked panel, extra tab "Infrastructure" (Q3)', 'UX-5 · UX-4'],
  expeditions_relics_modal: ['dock?', 'Docked panel, extra tab "Expeditions" (Q3)', 'UX-5 · UX-4'],
  what_if_timelines_modal: ['window', 'Stays a window (optional)', 'UX-2 · UX-4'],
  crisis_management_modal: ['window', 'Stays a window (optional)', 'UX-2 · UX-4'],
  campaign_progression_modal: ['window', 'Stays a window; the Progress dashboard gets its own id (Q4)', 'UX-2 · UX-4'],
  fog_of_war_intel_modal: ['window', 'Stays a window (optional)', 'UX-2 · UX-4'],
  scenario_builder_modal: ['window', 'Stays a window', 'UX-2'],
  career_progression_modal: ['window', 'Stays a window', 'UX-2'],
  ai_rivalry_modal: ['window', 'Stays a window', 'UX-2'],
  travel_modal: ['dock', 'Docked panel tab "Travel"', 'UX-5'],
  challenges_modal: ['dock', 'Docked panel tab "Challenges"', 'UX-5'],
  market_modal: ['dock', 'Docked panel tab "Market" → Sell', 'UX-5'],
  resource_market_modal: ['dock', 'Docked panel tab "Market" → Buy (Q2)', 'UX-5'],
  shop_modal: ['dock?', 'Docked panel, extra tab "Shop" (Q3)', 'UX-5 · UX-4'],
  investments_modal: ['dock', 'Docked panel tab "Investments"', 'UX-5 · UX-4'],
  sabotage_modal: ['dock?', 'Docked panel, extra tab "Sabotage" (Q3)', 'UX-5 · UX-4'],
  stats_modal: ['window', 'No button opens it today (only an internal deep link): give it one, or fold into Progress (Q4)', 'UX-2'],
  workshop_modal: ['dock', 'Docked panel tab "Workshop"', 'UX-5'],
  campaign_select_modal: ['decision', 'Menu step (difficulty / scenario picker); unchanged', 'UX-6 (restyle only)'],
  end_game_modes: ['window', 'Stays a window', 'UX-2'],
  ai_stats: ['window', 'Stays a window', 'UX-2'],
  determinism_audit_modal: ['window', 'Stays a window (developer)', 'UX-2'],
  narrative_decision_modal: ['decision', 'Stays a blocking story decision', 'UX-6 (restyle only)'],
  approval_dialog: ['decision', 'Stays a blocking approval', 'UX-6 (restyle only)'],
  treasury_requests_dialog: ['decision', 'No opener today (registry only); decide wire or drop the id (Q4)', 'UX-2'],
  governor_exception_dialog: ['decision', 'No opener today (registry only); decide wire or drop the id (Q4)', 'UX-2'],
  guardian_warning_modal: ['decision', 'No opener today: warnings are inline; decide wire or drop the id (Q4)', 'UX-2'],
  save_migration_modal: ['window', 'Stays a window (save details)', 'UX-2'],
  dependency_auto_fix_modal: ['decision', 'Stays a blocking confirmation (Settings → Auto-Fix)', 'UX-3'],
  day_transition_overlay: ['decision', 'Stays (optional end-of-day summary)', 'UX-6 (restyle only)'],
  double_or_nothing_modal: ['decision', 'No modal exists: Double or Nothing is inline after a win; decide drop the id (Q4)', 'UX-2'],
  rescue_emergency_overlay: ['decision', 'Stays (Shift+Esc rescue)', '—']
};

// Keys whose goal differs from their section's group.
const GROUP_OVERRIDE = { teamModeAiSystemProfile: 'teams', teamModeAiSystemsEnabled: 'teams', teamBrainModeV63: 'teams' };
module.exports = { ESSENTIALS, GROUPS, SECTION_GROUP, NOT_INDEXED, INTERNAL_KEYS, INTERNAL_NOTES, HOME_SECTION_OVERRIDE, VERSION_REFILE, VERSION_SECTIONS, SURFACE_PLAN, PRIMARY_OVERRIDE, GROUP_OVERRIDE };

// ---- UX-4: one card per optional feature (its real switch; what it needs, from the code) ---------------------------------
const NATIONAL = [['nationalSystemsEnabled', 'National Systems & Networks'], ['industriesEnabled', 'Industries & Supply Chains'], ['infraNetworksEnabled', 'Strategic Infrastructure Networks'], ['megaprojectsEnabled', 'National Megaprojects'], ['nationalDevelopmentEnabled', 'National Development Strategy'], ['innovationEnabled', 'Innovation & Emerging Capabilities'], ['systemicRiskEnabled', 'Resilience & Systemic Risk'], ['nationalPrioritiesEnabled', 'Dynamic National Priorities'], ['economicGeographyEnabled', 'Regional Competition & Economic Geography'], ['workforceHumanCapitalEnabled', 'Workforce, Skills & Human Capital'], ['stateCapacityEnabled', 'Adaptive Governance & State Capacity'], ['publicFinanceEnabled', 'Public Finance & National Budget'], ['householdsEnabled', 'Households & Living Standards']];
const FEATURE_CARDS = [
  // Play & content
  { card: 'Challenge approaches', keys: ['challengeApproachesEnabled'], needs: 'next match' },
  { card: 'More challenges', keys: ['expandedChallengeContentEnabled'], needs: 'next match' },
  { card: 'Procedural challenges', keys: ['proceduralChallengesEnabled'], needs: 'next match' },
  { card: 'Dynamic wagers', keys: ['dynamicWagerEnabled'], needs: '—' },
  { card: 'Double or Nothing', keys: ['doubleOrNothingEnabled'], needs: 'a challenge win' },
  { card: 'Equipment Shop', keys: ['equipmentShopEnabled'], needs: 'a shop region (button shows there)' },
  { card: 'Regional Investments', keys: ['investmentsEnabled'], needs: '—' },
  { card: 'Sabotage', keys: ['sabotageEnabled'], needs: 'a competitive mode (not Single Player)' },
  { card: 'Bank loans', keys: ['advancedLoansEnabled'], needs: 'access mode not "AI only"' },
  { card: 'Negotiations', keys: ['negotiationMode'], needs: '—' },
  { card: 'Regional contracts', keys: ['regionalContractsEnabled'], needs: '—' },
  { card: 'State infrastructure', keys: ['stateInfrastructureEnabled', 'infrastructureEnabled'], needs: '—' },
  { card: 'Expeditions & relics', keys: ['expeditionsRelicsEnabled', 'expeditionModeEnabled'], needs: '—' },
  { card: 'External territories', keys: ['externalTerritoriesEnabled'], needs: '—' },
  { card: 'Regional standing', keys: ['regionalStandingEnabled'], needs: '—' },
  { card: 'Fog of war', keys: ['fogOfWarEnabled'], needs: '—' },
  { card: 'What-If timelines', keys: ['whatIfTimelinesEnabled'], needs: 'a replay recording for branches' },
  { card: 'Crises', keys: ['dynamicCrisesEnabled', 'dynamicCrisisChainsEnabled'], needs: '—' },
  { card: 'Campaign mode', keys: ['campaignModeEnabled', 'campaignEngineEnabled'], needs: '—' },
  { card: 'Career progression', keys: ['careerProgressionEnabled'], needs: '—' },
  { card: 'AI rivalry', keys: ['aiRivalryEnabled'], needs: '—' },
  { card: 'Story decisions (Narrative Engine)', keys: ['narrativeEngineEnabled'], needs: 'a V10.1 match' },
  { card: 'Scenario mode', keys: ['scenarioModeEnabled'], needs: '—' },
  { card: 'Dynamic situations', keys: ['v93ContentEnabled'], needs: 'next match' },
  { card: 'Secret objectives & Final Stretch', keys: ['matchShapeEnabled'], needs: 'next match' },
  { card: 'The Long Rivalry (campaign)', keys: ['rivalryCampaignEnabled'], needs: '—' },
  { card: 'Rival Races', keys: ['rivalRacesEnabled'], needs: 'next match' },
  { card: 'Daily Challenge (fixed rules)', keys: ['dailyFixedRulesEnabled'], needs: 'Match Journal on' },
  ...NATIONAL.map(([k, l]) => ({ card: l, keys: [k], needs: 'Experience: Nation or Full; next match' })),
  // Rival
  { card: 'Rival personality', keys: ['opponentPersonalityEnabled'], needs: 'next match' },
  { card: 'Rival taunts', keys: ['adaptiveAiTauntsEnabled'], needs: '—' },
  { card: 'Rival special abilities', keys: ['aiSpecialAbilitiesEnabled'], needs: '—' },
  { card: 'Rival Recap', keys: ['rivalRecapEnabled'], needs: '—' },
  { card: 'Adaptive AI', keys: ['adaptiveAiEnabled'], needs: '—' },
  { card: 'AI memory', keys: ['aiMemoryEnabled'], needs: '—' },
  { card: 'Persistent AI memory', keys: ['aiPersistentMemoryEnabled'], needs: '—' },
  { card: 'AI Strategy Lab', keys: ['aiStrategyLabEnabled'], needs: '—' },
  { card: 'AI Algorithm Builder', keys: ['aiAlgorithmBuilderEnabled'], needs: '—' },
  // Safety & records
  { card: 'Autosave & Resume', keys: ['matchRecoveryEnabled'], needs: 'browser storage' },
  { card: 'Leave-site warning', keys: ['warnBeforeUnloadEnabled'], needs: '—' },
  { card: 'Match Journal & Daily Seed', keys: ['matchJournalEnabled'], needs: 'browser storage' },
  { card: 'Turn Digest', keys: ['turnDigestEnabled'], needs: '—' },
  { card: 'Day summary screen', keys: ['showDayTransition'], needs: '—' },
  { card: 'Replay recording', keys: ['aiReplayRecordingEnabled'], needs: '—' },
  { card: 'Activity Ledger', keys: ['gameActivityLedgerEnabled'], needs: '—' },
  { card: 'Decision transparency', keys: ['decisionTransparencyEnabled'], needs: '—' },
  { card: 'Post-match debrief', keys: ['postMatchDebriefEnabled'], needs: '—' },
  // Helpers & screen
  { card: 'Guardian AI', keys: ['showGuardianFloatingButton', 'enableGuardianSidePanelAccess'], needs: 'Guardian enabled (guardianAiSettings.enabled)' },
  { card: 'AI Command Center', keys: ['aiCommandCenterUiEnabled'], needs: '—' },
  { card: 'Ask the Game AI drawer', keys: ['askGameAiUiEnabled'], needs: '—' },
  { card: 'AI Tuning Lab', keys: ['aiTuningLabUiEnabled'], needs: '—' },
  { card: 'Human automation', keys: ['humanAutomationEnabled'], needs: '—' },
  { card: 'Auto Mode', keys: ['autoModeEnabled'], needs: '—' },
  { card: 'UX Assist Pack', keys: ['uxAssistPackEnabled'], needs: '—' },
  { card: 'Interactive map', keys: ['interactiveMapEnabled'], needs: 'UX Assist Pack (or the Guided level)' },
  { card: 'Win-condition coach', keys: ['winConditionCoachEnabled'], needs: 'UX Assist Pack (or the Guided level)' },
  { card: 'Settings presets', keys: ['settingsPresetsEnabled'], needs: '—' },
  { card: 'AI Action Pipeline Inspector', keys: ['aiPipelineInspectorEnabled'], needs: 'Team Mode for the map button; LAB card any time' },
  { card: 'DIAG-2 overlay', keys: ['diag2OverlayEnabled'], needs: '—' },
  { card: 'Balance Lab', keys: ['balanceLabEnabled'], needs: '—' },
  // Classic switches (compatibility)
  { card: 'Classic rules (V10.0)', keys: ['classicRulesV100'], needs: 'next match' },
  { card: 'Classic rival (V9.9)', keys: ['classicRivalV99'], needs: 'next match' },
  { card: 'Classic sticky toasts', keys: ['classicStickyToasts'], needs: '—' },
  { card: 'Classic play-screen layout', keys: ['classicPlayScreenLayout'], needs: '—' },
  // Team Mode
  { card: 'Team Mode AI systems', keys: ['teamModeAiSystemsEnabled'], needs: 'Team Mode match' },
  { card: 'Team Competitive AI', keys: ['teamCompetitiveAiEnabled'], needs: 'Team Mode match' },
  { card: 'Team Brain', keys: ['teamBrainV63Enabled'], needs: 'Team Mode match' },
  { card: 'Team Intelligence OS', keys: ['teamIntelligenceOsEnabled', 'teamOsEnemyEnabled'], needs: 'Team Mode match' },
  { card: 'Team Economy Governor', keys: ['teamEconomyGovernorEnabled'], needs: 'Team Mode match' },
  { card: 'Team Treasury', keys: ['teamTreasuryEnabled'], needs: 'Team Mode match' },
  { card: 'Team AI Overseer', keys: ['teamAiOverseerSystemEnabled', 'teamAiOverseerDashboardEnabled'], needs: 'Team Mode + Team Competitive AI' },
  { card: 'AI Operations Auditor', keys: ['teamAiAuditorSystemEnabled', 'teamAiAuditorDashboardEnabled'], needs: 'Team Mode + Team Competitive AI' },
  { card: 'Governance control surface', keys: ['governanceControlSurfaceEnabled'], needs: 'Team Mode match' },
  { card: 'Strategic command', keys: ['teamAiStrategicCommandEnabled'], needs: 'Team Mode match' },
  { card: 'Shared action bank', keys: ['teamActionBankEnabled'], needs: 'Team Competitive AI' },
  { card: 'Action lending', keys: ['teamAiActionLendingEnabled'], needs: 'Team Competitive AI' },
  { card: 'AI action overrides', keys: ['teamAiActionOverridesEnabled'], needs: 'Team Competitive AI' },
  { card: 'Teammate action sequences', keys: ['teamAiActionSequencesEnabled'], needs: 'Team Competitive AI' },
  { card: 'Plan commitment', keys: ['teamAiPlanCommitmentEnabled'], needs: 'Team Competitive AI' },
  { card: 'Threat targeting', keys: ['teamAiThreatTargetingEnabled'], needs: 'Team Competitive AI' },
  { card: 'Endgame acceleration', keys: ['teamAiEndgameAccelerationEnabled'], needs: 'Team Competitive AI' },
  { card: 'Emergency actions', keys: ['teamAiEmergencyActionsEnabled'], needs: 'Team Competitive AI' },
  { card: 'Team initiative', keys: ['teamInitiativeEnabled'], needs: 'Team Competitive AI' },
  { card: 'Combo bonuses', keys: ['teamComboBonusesEnabled'], needs: 'Team Competitive AI' },
  { card: 'Ratcheting cash vault', keys: ['teamCashVaultEnabled'], needs: 'Team Competitive AI' },
  { card: 'Teammate performance sync 2.0', keys: ['teammatePerformanceSync2Enabled'], needs: 'Team Mode match' },
  { card: 'Parallel planning', keys: ['parallelAiPlanningEnabled'], needs: 'Team Mode match' },
  { card: 'AI action approval', keys: ['aiActionApprovalEnabled'], needs: 'Team Mode match' },
  { card: 'Action requirements', keys: ['actionRequirementsEnabled'], needs: 'Team Mode match' }
];
module.exports.FEATURE_CARDS = FEATURE_CARDS;
