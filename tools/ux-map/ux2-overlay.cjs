// UX-2 overlay for the map: what package UX-2 changed, applied on top of the UX-1 audit of V10.1.
// The "today" columns keep describing V10.1 (from the UX-1 audit data and a saved copy of the V10.1 file); rows UX-2 added say so.
module.exports = (facts) => {
  const un = new Map((facts.unregistered || []).map(u => [u.id, u]));
  // Q4: the 28 new registry ids (27 windows + Find Anything); 'ask_drawer' keeps ask_game_ai.
  const PLAN = {
    help_shortcuts_modal: 'window', progress_dashboard: 'window', live_control_center: 'window', advanced_loans_modal: 'dock?', ai_tuning_lab: 'window',
    ai_pipeline_inspector: 'window', copilot_console: 'window', copilot_recommendations: 'window', copilot_proposal: 'decision', diagnostics_drawer: 'panel',
    auto_mode_activity_panel: 'window', leave_match_dialog: 'decision', confirmation_dialog: 'decision', load_preview_modal: 'decision', settings_simple_view: 'panel',
    settings_experience_view: 'panel', settings_preset_manager: 'window', settings_import_export: 'window', settings_view_filters: 'panel', main_menu: 'panel',
    game_over_screen: 'panel', diplomatic_breach_prompt: 'decision', safe_area_overlay: 'panel', diag2_overlay: 'panel', intent_panels: 'panel', intelligence_tabs: 'panel',
    lab_inspectors: 'panel', find_anything: 'window',
  };
  // The flags the V11.0 table maps to each new id (only while Find Anything is on); own-state windows are registered but not tracked.
  const TABLE_ON = {
    help_shortcuts_modal: ['showHelp'], progress_dashboard: ['showProgress'], live_control_center: ['showLiveControlCenter'], auto_mode_activity_panel: ['showAutoModeActivityPanel'],
    advanced_loans_modal: ['showAdvancedLoans'], copilot_console: ['showCoPilotModal'], copilot_recommendations: ['showCoPilotRecommendationsModal'], find_anything: ['showFindAnything'],
  };
  const NOT_TRACKED = {
    ai_tuning_lab: 'own state (setShowTuningLab): registered, not tracked', ai_pipeline_inspector: 'own state: registered, not tracked',
    copilot_proposal: 'a decision that waits for an answer: registered, not tracked (Escape must not dismiss it)', diagnostics_drawer: 'its flag or a setting opens it: registered, not tracked',
    leave_match_dialog: 'own state (v99LeaveMatchOpen): registered, not tracked', confirmation_dialog: 'confirmation state: registered, not tracked', load_preview_modal: 'load preview state: registered, not tracked',
  };
  const newIds = [...(facts.unregistered || []).map(u => u.id).filter(id => id !== 'ask_drawer'), 'find_anything'];
  const today = id => {
    if (id === 'find_anything') return { text: '🔎 Find (play-screen header or main menu) or Ctrl/⌘+K, once Find Anything is on (off by default): Settings › Interface & Accessibility › 🔎 Find Anything', clicks: '1 after switch' };
    const u = un.get(id); return { text: u ? u.opener : '?', clicks: u ? u.clicks : '?' };
  };
  const home = id => (id === 'find_anything' ? 'Header button and Ctrl/⌘+K (UX-6 turns it on by default)' : (un.get(id) || {}).home || '?');
  const pkg = id => (id === 'find_anything' ? 'UX-2 (new) · UX-6' : `UX-2 (id added) · ${String((un.get(id) || {}).pkg || '').replace(/^UX-2( · )?/, '') || '—'}`.replace(/ · —$/, ''));
  const SPLITS = [
    ['ask_game_ai', 'Ask the Game AI drawer', 'How to play & shortcuts → `help_shortcuts_modal` (`showHelp`)'],
    ['campaign_progression_modal', 'Campaign Progression window', 'Progress dashboard → `progress_dashboard` (`showProgress`)'],
    ['human_automation_dashboard', 'Human Automation dashboard', 'Live Control Center → `live_control_center` (`showLiveControlCenter`)'],
    ['activity_ledger', 'Game Activity Ledger dashboard', 'Auto Mode activity panel → `auto_mode_activity_panel` (`showAutoModeActivityPanel`)'],
    ['approval_dialog', 'Auto Mode proposal (its only live window)', 'nothing moves: the map\'s "Approval dialog" was the id\'s own name; its other three flags are never set (§12.2)'],
  ];
  const UNUSED = ['guardian_side_panel', 'developer_diagnostics_drawer', 'guardian_warning_modal', 'treasury_requests_dialog', 'governor_exception_dialog', 'double_or_nothing_modal', 'rescue_emergency_overlay', 'stats_modal'];
  return { newIds, PLAN, TABLE_ON, NOT_TRACKED, today, home, pkg, SPLITS, UNUSED };
};
