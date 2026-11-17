// Sections 11-15 of V11.0_UX_MAP.md: unreachable, duplicated, questions, worklists, method.
const fs = require('fs');
exports.build = (D, M) => {
  const { P, reg, crawl, flagsBySurface, best, esc, code, w, labCards } = D;
  const { settingRows, misfiled, probeStats, gatedKeys, routesBySurface, sectionClicks } = M;
  const lines = D.baseSrc.split('\n'); // the V10.1 file as shipped (the "today" facts are about it)
  const fnAt = new Array(lines.length); let cur = ''; for (let i = 0; i < lines.length; i++) { const m = lines[i].match(/^(export )?(async )?function ([A-Za-z0-9_]+)|^(export )?const ([A-Za-z0-9_]+) *[:=]/); if (m) cur = m[3] || m[5]; fnAt[i] = cur; }
  const flagSetInGame = flag => { const re = new RegExp(`\\b${flag}\\s*:\\s*(true|!|[a-zA-Z(\\[])`); for (let i = 0; i < lines.length; i++) { if (i >= 88465 && i <= 88525) continue; if (i >= 227560 && i <= 227625) continue; if (re.test(lines[i]) && !/:\s*false/.test(lines[i].split(flag)[1] || '') && !/SelfTest|DevTest|Tests$|^V\d+_|^v\d+\w*(Flag|Patch)\w*$/.test(fnAt[i]) && !/^\s*(\/\/|\*)/.test(lines[i]) && !/:\s*boolean/.test(lines[i])) return i + 1; } return 0; };

  // ---- 11. Unreachable --------------------------------------------------------------------------------------------------
  w('## 11. Unreachable today');
  w('');
  w('### 11.1 Registry surfaces nothing in game code opens');
  w('');
  w('Each was checked three ways: no button in the crawl reached it, no game-code line sets any of its flags (self-tests excluded), and no `openSurface()` call names it.');
  w('');
  w('| id | What happens instead | Proposal (Q4) | UX-2 |');
  w('|---|---|---|---|');
  const phantom = [
    ['guardian_side_panel', 'The Guardian button\'s "side panel" style opens `guardian_status_panel`; `showGuardianSidePanel` is never set.', 'Keep the id; point it at the Status Panel (alias) so nothing that names it breaks.'],
    ['developer_diagnostics_drawer', 'The real Diagnostics Drawer (Ctrl+Alt+D, LAB card, More › Diagnostics) uses `showAutoModeDiagnosticsDrawer`, which the registry does not map.', 'Map `showAutoModeDiagnosticsDrawer` to this id.'],
    ['guardian_warning_modal', 'Guardian warnings render inline (`GuardianInlineWarning` beside End Turn, travel, sell, contracts, infrastructure, expeditions). Only a self-test sets the flag.', 'Keep the id (blocking warnings may come back); mark it "not used" in the walk test.'],
    ['treasury_requests_dialog', 'Treasury requests are handled in the Team Treasury settings and Overseer dashboard; none of the three flags is set.', 'Keep the id; mark "not used".'],
    ['governor_exception_dialog', 'Governor exceptions are recorded in team state (`team.governorExceptions`) with no dialog; none of the three flags is set.', 'Keep the id; mark "not used".'],
    ['double_or_nothing_modal', 'Double or Nothing is a notification plus an inline choice after a challenge win.', 'Keep the id; mark "not used".'],
    ['rescue_emergency_overlay', 'Shift+Esc runs the UI rescue directly; no overlay opens.', 'Keep the id; mark "not used".'],
    ['stats_modal', '`showStats` is set by an Ask-the-Game-AI deep link (tab "player"), but nothing renders it: the flag opens nothing.', 'Wire the deep link to the Progress dashboard, or give Stats a renderer.']
  ];
  phantom.forEach(r => w(`| ${code(r[0])} | ${esc(r[1])} | ${esc(r[2])} | kept, marked \`not used in V10.1\`; never a Find Anything result |`));
  w('');
  w('### 11.2 UI with a renderer but no opener');
  w('');
  w('- **Auto Mode activity panel** — rendered when `uiState.showAutoModeActivityPanel` is true (line 281492), but no game code sets it; the registry lists the flag as an alias of `activity_ledger`.');
  w('- **Alt+S Strategy Planner hotkey** — `useStrategyPlannerHotkey` (line 21941) is defined and never called.');
  w('- **UX-2:** the Auto Mode activity panel has its own id (`auto_mode_activity_panel`) and a Find Anything result that opens it when Auto Mode is on; Alt+S is listed in Find Anything, whose result opens the planner the way the Launcher does (the key itself is still not wired).');
  w('');
  w('### 11.3 Settings with no direct control anywhere');
  w('');
  const noCtl = misfiled.filter(m => m.verdict === 'no control found');
  const resetOnly = misfiled.filter(m => m.verdict === 'reset only');
  const internal = misfiled.filter(m => m.verdict === 'internal');
  w(`These keys are in the hub index, but neither their section\'s code (nor the components it renders, nor the key lists those use) mentions them, and a whole-file scan finds no game-code write outside defaults, presets, resets, migrations and self-tests. They can change only through a preset, an experience plan, an import or a save. **${noCtl.length} keys**, plus **${resetOnly.length}** that only a reset/restore button touches and **${internal.length}** that are internal state:`);
  w('');
  w('| Key | Indexed in | Default | Note |');
  w('|---|---|---|---|');
  [...noCtl, ...resetOnly, ...internal].forEach(m => { const d = reg.defaults.find(x => x.key === m.k); w(`| ${code(m.k)} | ${code(m.section)} | ${esc(D.fmtVal(d.value))} | ${m.verdict}${m.where ? ' — ' + esc(m.where) : ''} |`); });
  w('');
  w('UX-3 must give each a control or say why not; the walk test should treat them as "no control in V10.1" rather than lost.');
  w('');
  w('### 11.4 Settings whose control is not where the index says');
  w('');
  const elsewhere = misfiled.filter(m => m.verdict === 'control elsewhere');
  w(`Search sends the player to the indexed section, but the control lives somewhere else (${elsewhere.length} keys):`);
  w('');
  w('| Key | Indexed in | Control actually in |');
  w('|---|---|---|');
  elsewhere.forEach(m => w(`| ${code(m.k)} | ${code(m.section)} | ${esc(m.where)} |`));
  w('');
  w('### 11.5 Not searchable today');
  w('');
  const notIdx = settingRows.filter(r => !r.idx.length);
  const sa = D.searchAll || {}; const nf = Object.entries(sa).filter(([, v]) => !v).map(([k]) => k); const asField = Object.values(sa).filter(v => v && v.as === 'field').length;
  w(`- **Measured:** the game\'s own \`searchSettingsHub\` was run for every key (by its name, its name split into words, and its label). It finds **${599 - nf.length} of 599** — ${asField} as their own result, ${599 - nf.length - asField} only through their section. It **cannot find ${nf.length}**: ${nf.map(code).join(', ')}.`);
  w(`- **${notIdx.length} settings are not in \`SETTINGS_HUB_SECTION_INDEX\`** (the ${nf.length} above plus \`nationalSystemsEnabled\`, which Match Variety\'s keywords happen to match). Their real homes are in §7: the 13 national-system switches are rendered in Match Variety, 7 replay switches in AI Difficulty.`);
  w('- **The Balance Lab section** (`advancedSystems.balanceLab`, Replay & Diagnostics) is rendered but not indexed.');
  w('- **UX-2:** Find Anything finds every one of the 600 settings by its key (first result) and by each of its labels, the 29 above included (key first, label in the top 10; `v110fa_19` to `v110fa_21`), and the Balance Lab section. Each opens where its control really is (§11.4 routes are used), and a setting with no control says so in its result (§11.3).');
  w(`- **Settings that live only outside Settings:** the four Team OS keys (LAB › Team Intelligence 2.0 inspector), \`guidedLearning\` and the three \`playerIntent*\` choices (INTELLIGENCE), the Guardian button keys (Guardian AI Center window), the ledger housekeeping keys (Activity Ledger window).`);
  w('');
  w('### 11.6 Hidden until something else is switched on');
  w('');
  w(`- **Settings controls:** ${probeStats.gatedCount} keys got a working control only after the 51 switches that gate settings controls were turned on (probe pass *advanced, gates on*); the code\'s own conditions mark more ("shown when … on" in §7). They are reachable, one or more switches later.`);
  w('- **Play-screen entry points off by default:** the floating Guardian button, AI Command Center widget and modal, Ask drawer, Unified Launcher, Widget Dock (the only route to the Strategy Planner), and the map-footer buttons for contracts, infrastructure, expeditions, crises, fog of war, What-If and campaign.');
  w('- **Disabled LAB cards until a switch is on:** AI Tuning Lab, AI Command Center, AI Action Pipeline Inspector.');
  w('- **Team Mode only:** the Overseer, Auditor and Pipeline buttons on the map footer need a Team Mode match plus 2–3 team switches (the LAB cards open the dashboards in any match).');
  w('');

  // ---- 12. Duplicated ----------------------------------------------------------------------------------------------------
  w('## 12. Duplicated today');
  w('');
  w('### 12.1 One surface id, two different windows');
  w('');
  w('| id | Window A | Window B (shares the id) | UX-2 (Q4), while Find Anything is on |');
  w('|---|---|---|---|');
  const splitById = new Map(D.UX2.SPLITS.map(r => [r[0], r]));
  [['campaign_progression_modal', 'Campaign Progression (map footer, campaign on)', 'Progress dashboard (📊 Progress, P) via `showProgress`'],
    ['human_automation_dashboard', 'Human Automation dashboard', 'Live Control Center via `showLiveControlCenter`'],
    ['ask_game_ai', 'Ask the Game AI drawer (`showAskGameAi`)', 'How to play & shortcuts help (`showHelp`, More › Help, ?)'],
    ['activity_ledger', 'Game Activity Ledger dashboard', 'Auto Mode activity panel (`showAutoModeActivityPanel`, never opened)'],
    ['approval_dialog', 'Approval dialog', 'Auto Mode proposal modal (`showAutoModeProposalModal`)']].forEach(r => { const sp = splitById.get(r[0]); w(`| ${code(r[0])} | ${esc(r[1])} | ${esc(r[2])} | keeps ${esc(sp[1])}; ${esc(sp[2])} |`); });
  w('');
  w('With Find Anything off the table is V10.1\'s, unchanged (the very same array; `v110fa_14`). The split is gated so that turning UX-2 on is the only way the stacking ids change before UX-6.');
  w('');
  w('### 12.2 Alias flags nothing sets');
  w('');
  const aliasDead = []; Object.entries(flagsBySurface).forEach(([sid, flags]) => flags.forEach(f => { if (!flagSetInGame(f)) aliasDead.push([sid, f]); }));
  w(`${aliasDead.length} of the flags in the surface manager\'s table (\`syncWithUIState\`) are never set by game code; they are harmless but make the table look larger than the UI:`);
  w('');
  const bySid = {}; aliasDead.forEach(([s, f]) => { (bySid[s] = bySid[s] || []).push(f); });
  Object.entries(bySid).forEach(([s, fs2]) => w(`- ${code(s)}: ${fs2.map(code).join(', ')}`));
  w('');
  w('### 12.3 Settings indexed in more than one section');
  w('');
  w('| Key | Sections | Proposed single home |');
  w('|---|---|---|');
  settingRows.filter(r => r.idx.length > 1).forEach(r => w(`| ${code(r.k)} | ${r.idx.map(code).join(', ')} | ${esc(r.homeText)} |`));
  w('');
  w('### 12.4 Same setting, two controls');
  w('');
  w('- The 22 **Simple view** settings also have a control in the hub (§7 lists both).');
  w('- `experienceMode` is set on the main menu *and* in Settings (Match Variety, Simple view).');
  w('- The **theme** is set on the main menu only; the Appearance section holds `teamOverviewDensity`, not the theme.');
  w('');
  w('### 12.5 Same destination, many entry points (keep them — list for UX-2 so search shows one result per destination)');
  w('');
  w('| Destination | Measured routes (1–2 clicks) |');
  w('|---|---|');
  const fixLbl = x => x.replace(/^v9-match-standing$/, '📊 Match standing ▸').replace(/^Most Money: \$ vs \$/, 'win-race chip').replace(/^View All Actions › /, '⋯ More › ').replace(/ \(N\)| \(N new\)| \(N\/N\)/g, '').replace(/ [A-Z]$/, '');
  Object.entries(routesBySurface).filter(([, r]) => r.length >= 3).sort((a, b) => b[1].length - a[1].length).forEach(([s, r]) => { const rr = [...new Set(r.map(x => x.split(' › ').map(fixLbl).join(' › ')))]; w(`| ${code(s)} | ${rr.length}: ${esc(rr.slice(0, 8).join(' · '))}${rr.length > 8 ? ' …' : ''} |`); });
  w('');
  w('### 12.6 Confusing twins');
  w('');
  w('- **More › 🎬 Replay** opens the replay *settings* (Replay & Diagnostics tab); the Replay Studio itself opens from Save / Load, What-If, the result screen or a replay file.');
  w('- **More › 🔬 Diagnostics** opens the same settings tab *and* the Diagnostics Drawer.');
  w('- **Market** (sell, R) and **Resource Market** (buy, M) are two windows with near-identical names.');
  w('- **⋯ More** and **View All Actions** open the same popover.');
  w('- Three different "Settings" entry points open three different views: More › Settings (Simple), LAB › Full Settings Hub (Simple), the More shortcuts and LAB cards (Advanced, a tab).');
  w('');

  // ---- 13. Questions --------------------------------------------------------------------------------------------------------
  w('## 13. Where the file and the brief disagree — questions');
  w('');
  const Q = [
    ['Q1', 'Self-test baseline', 'The brief says 2,957 checks across 80 suites. This file gives 2,842 checks in 73 registered suites; 3,015 in 78 with the harness extras; 2,928 from the in-game LAB button; plus release check 153/153 and Co-Pilot 85/85 — all passing. Which runner should "none may drop" be measured with? (Proposal: node-run `--extras` = 3,015/78, plus release 153 and Co-Pilot 85, all recorded in each package report.)'],
    ['Q2', 'One "Market" tab', 'UX-5 names five tabs; the game has two market windows (Market = sell, Resource Market = buy). Proposal: one Market tab with Sell and Buy inside.'],
    ['Q3', 'Modals that are not decisions', '"Modals remain only for decisions that must block", but UX-5 names five tabs. 30 other registry windows are modal today without being decisions (table §4: 6 action windows marked dock?, 24 tool windows marked window). Proposal: UX-5 docks the five, adds the six action windows (Shop, Sabotage, Contracts, Infrastructure, Expeditions, Negotiations) plus Loans as extra tabs, and makes the 24 tool windows non-blocking windows; or keep them modal and leave them to a later round. Your call changes UX-5\'s size by about 3×.'],
    ['Q4', 'Ids that open nothing, windows without ids', '8 registry ids never open (§11.1), 5 ids are shared by two windows (§12.1) and 28 real windows have no id (§5). "Lose nothing" suggests keeping every id. Proposal: keep all 61, add ids for the unregistered windows in UX-2, and let the walk test mark the 8 as "not used in V10.1" instead of failing.'],
    ['Q5', 'Ctrl+K', 'Ctrl/⌘+K already toggles the Ask the Game AI drawer when `askGameAiUiEnabled` is on (off by default). Proposal: Ctrl+K opens Find Anything; Ask becomes a Find Anything result (and keeps its floating button). Alternative: Find Anything uses Ctrl+Shift+F or "/" when focus is on the page.'],
    ['Q6', 'Essentials', 'Proposed 12 choices in §6 (it adds Autosave, the leave warning, Guided Learning, theme and text size, which today sit outside the Simple view, and moves 11 feature switches from the Simple view to "What\'s in the game"). Confirm or edit.'],
    ['Q7', 'Version-named sections', 'Settings has "✨ New in V9.9 / V10.0 / V10.1" sections. Proposal: UX-3 files each switch under its goal group (Autosave → Essentials, Rival Recap → Your rival, …) and UX-4 gives each a card; the version labels move to the What\'s New page.'],
    ['Q8', 'Skipped checks', 'The existing LAB runner reports 4 SKIPPED rows as `passed: true` (detail "SKIPPED: …"). New UX suites will report skips as skipped as the brief requires; should UX-2 also change the existing LAB runner, or leave V10.1 behaviour alone?']
  ];
  const DEC = {
    Q1: 'Baseline = 3,015 checks in 78 suites (registered + `--extras`), release check 153 of 153, Co-Pilot 85 of 85, strict TypeScript 0 errors. After UX-2: 3,056 / 79, 154 / 154, 85 / 85, 0.',
    Q2: 'One Market tab with Sell and Buy inside; R and M open the right half (UX-5).',
    Q3: 'UX-5 docks the five named tabs only; the six action windows and Loans wait; the 24 tool windows stay as they are.',
    Q4: 'Keep all 61 ids; add ids for the unregistered windows; give the 5 shared ids one window each; mark the 8 dead ids "not used in V10.1". Done in UX-2 (§4, §5, §12.1).',
    Q5: 'Ctrl/⌘+K opens Find Anything when it is on; when off, Ctrl/⌘+K behaves as today. Ask becomes a Find Anything result. Done in UX-2.',
    Q6: 'Essentials approved with three edits: Rival difficulty writes match state (SET_AI_DIFFICULTY); Guided first match and playerIntentOnboardingEnabled fold into "How much help"; the freed slot becomes Rival turn speed (rivalTurnPace). (UX-3)',
    Q7: 'Each switch filed under its goal group; version labels move to What\'s New. UX-2\'s own switch follows it (Interface & Accessibility › 🔎 Find Anything; V11.0 is in What\'s New).',
    Q8: 'The LAB runner reports skips as skipped. Done in UX-2: 14 LAB rows that passed silently or "SKIPPED-as-pass" now count as skipped.',
  };
  w('| # | Topic | Detail (UX-1) | Decision (UX-2 brief) |');
  w('|---|---|---|---|');
  Q.forEach(q => w(`| ${q[0]} | ${esc(q[1])} | ${esc(q[2])} | ${esc(DEC[q[0]])} |`));
  w('');

  // ---- 14. Worklists ------------------------------------------------------------------------------------------------------
  w('## 14. Worklists per package');
  w('');
  const cnt = k => Object.values(P.SURFACE_PLAN).filter(p => p[0] === k).length;
  const groupCounts = {}; settingRows.forEach(r => { groupCounts[r.group || 'unassigned'] = (groupCounts[r.group || 'unassigned'] || 0) + 1; });
  w('| Package | What it moves (from this map) |');
  w('|---|---|');
  w(`| UX-2 Find Anything | **Done** (§16). Planned: one index over ${reg.v101.surfaces.length} registry surfaces + ${(D.extraFacts.unregistered || []).length} unregistered windows/panels (§5) + ${reg.sections.length + 1} sections + ${reg.defaults.length} settings + ${(D.extraFacts.shortcuts || []).length} shortcuts + the ${labCards.length} LAB cards and ${'11'} action-bar actions. Every result opens through the button\'s own path (the LAB cards already use \`navigateToSettings(tab, section)\` and flag patches — reuse those). Also: ids for §5, decide §11.1 (Q4), Ctrl+K (Q5). |`);
  w(`| UX-3 Settings layers | ${reg.sections.length + 1} sections → ⭐ Essentials + 5 groups (counts: ${Object.entries(groupCounts).map(([g, c]) => `${g} ${c}`).join(', ')} keys); ${D.inert.size} inactive keys behind *show inactive*; homes for ${notIdx.length} unindexed keys; real homes for the ${elsewhere.length} misfiled keys (§11.4); one home for the ${settingRows.filter(r => r.idx.length > 1).length} duplicates (§12.3); the ${noCtl.length} keys with no control (§11.3). Keys, defaults and scopes unchanged. |`);
  w(`| UX-4 What's in the game | ${P.FEATURE_CARDS.length} cards over ${P.FEATURE_CARDS.flatMap(c => c.keys).length} switch keys (marked "card:" in §7), each with its real switch and its needs; builds on \`EXPERIENCE_SYSTEM_REGISTRY\` for the national systems. No default changes. |`);
  w(`| UX-5 Docked panels | ${cnt('dock')} windows → 5 tabs (Market Sell/Buy, Challenges, Travel, Workshop, Investments); ${cnt('dock?')} more proposed (Q3); ${cnt('decision')} stay blocking decisions; ${cnt('window')} tool windows per Q3; keyboard: C/T/R/M/W open the tabs; dialogs keep V10.1 focus trap and Escape. |`);
  w('| UX-6 Switch-over | The classic switch must restore exactly the *today* column of §3–§10: header layers and control bar, quick bar, play card, action bar with ⋯ More (11 items), map footer, LAB cards, Settings Simple/Game Experience/Advanced with 11 tabs, every shortcut. |');
  w('');

  // ---- 15. Method ------------------------------------------------------------------------------------------------------------
  w('## 15. How this map was made');
  w('');
  w('- **Registries** were read from the running module (the file bundled by `tools/selftest/node-eval.mjs`), not from text: `UI_SURFACE_REGISTRY`, `SETTINGS_HUB_SECTION_INDEX`, `SETTINGS_HUB_TAB_ORDER/LABELS`, `DEFAULT_GAME_SETTINGS`, `V99/V101_INERT_SETTINGS`, `V95_MATCH/PROFILE_SCOPED_SETTING_KEYS`, `SIMPLE_SETTINGS`, `EXPERIENCE_MODE_OPTIONS`, `V95_EXISTING_SUITES`.');
  w('- **Code scans** used the TypeScript parser on the whole file: every `<SettingsSection>` and the keys its controls write, every `updateUiState` call that opens something (with its button and conditions), every settings write in game code, and which keys each section\'s code mentions.');
  w(`- **Browser runs** (Chromium, the real game via Vite, Tailwind 3.4.17 built locally because the CDN is unreachable from the sandbox): a breadth-first click crawl from the play screen (${crawl.filter(x => x.path.length === 1).length} one-click and ${crawl.filter(x => x.path.length === 2).length} two-click paths, each replayed from a fresh page, reading \`window.__GLOBAL_UI_SURFACE_MANAGER__\` and the game\'s UI state); a settings probe that flipped ${probeStats.controls} controls in the hub (advanced and basic views with defaults, and the advanced view with the 51 gating switches on) and recorded which key each one wrote, restoring the setting after each (212 distinct keys got a working control; a control that changed nothing is never taken as proof of a missing control — the "no control" verdicts in §11.3 rest on the code scans); a path check of all 11 tabs and every LAB card; 24 targeted scenarios (a switch turned on, then the path clicked). Clicks that change the match (Do It, End Turn, travel, buy/sell, loans, Leave) were never used as steps except Leave for the menu route.`);
  w('- **Not covered:** Team Mode matches (Team surfaces are derived from code), event-only surfaces (story decisions, approvals, day summary), the Game Experience plan flow, and touch input.');
  w('- UX-1 did not modify the game file (md5 before and after: `a7d56ae0e89666564909bacaaa7370df`). UX-2 changed it (§16); the *today* columns were kept from the UX-1 audit of the original file, and the map was re-checked against the changed module (`check-map.mjs`: every registry id, section, setting and nested field is listed once).');
  w('');

  // ---- 16. UX-2 ------------------------------------------------------------------------------------------------------------------
  w('## 16. UX-2: Find Anything — what changed');
  w('');
  w('All new code is in SECTION 20BL (foundations, ids) and SECTION 20BM (Find Anything) between SECTION 20BK and SECTION 21; every in-place edit elsewhere is marked `// V11.0 (SECTION 20Bx): …` (most are one or two lines; the largest is the call in the main component that hands the game\'s own handlers to Find Anything). Everything new is off until UX-6 (one profile setting, `findAnythingEnabled`, read with `=== true`).');
  w('');
  w('| Area | What changed | Off (default) |');
  w('|---|---|---|');
  [
    ['Version', 'GAME_VERSION 11.0.0 (label V11.0); `migrateSaveTo1100` rung (changes nothing); rules stamp stays 1010; V10.1\'s What\'s New keeps its label written out; V11.0 leads What\'s New.', 'n/a: always'],
    ['Switch', '`findAnythingEnabled` (boolean, false, profile, persisted between visits, never in a save) in Settings › Interface & Accessibility › 🔎 Find Anything (Q7); in the Co-Pilot catalog; found by the settings search.', 'off'],
    ['Find Anything', 'Dialog (combobox over a listbox, focus in and back, Esc closes, ↑↓ PgUp PgDn, Enter opens) from 🔎 Find in the play header or on the main menu, or Ctrl/⌘+K anywhere. Index of 853 entries: 8 actions (End turn, Save, Leave match, Clear notifications, Rescue the screen, Map, Text size, the Ask drawer) and 92 screens and panels (covering 80 surface ids: every used V10.1 id and every window of §5), 17 shortcut groups, 48 LAB cards, 88 settings sections, 600 settings; plus Ask the game for any text (first when it reads like a question). A result opens through the button\'s own call (interface flags, `navigateToSettings` with the field, the LAB card\'s `onOpen`, the game\'s handlers, the Ask box); one that cannot open says why (no match yet, not your turn, a switch that is off: Enter then opens that switch, the guided first match).', 'no button, no key listener, nothing rendered'],
    ['Ctrl/⌘+K (Q5)', 'Opens Find Anything; the V10.1 Ask-drawer key stands down while Find Anything is on.', 'exactly V10.1'],
    ['Registry (Q4)', '28 ids added (27 windows + `find_anything`); 8 ids marked `not used in V10.1`; with Find Anything on the manager\'s table gives Help, Progress, Live Control Center and the Auto Mode panel their own ids and tracks Loans, the Co-Pilot console and recommendations; those windows read their stacking from their own id.', 'V10.1\'s table, the very same array'],
    ['LAB (Q8)', 'A row that did not run is shown as skipped (– and "N skipped"), never as a pass; the 10 rendered-markup checks that used to return true without a renderer now say SKIPPED; the async-suite skip row says skipped; source-scan skips are marked too.', 'n/a: always'],
    ['Self-tests', 'Suite `v110fa` (41 checks): version and rung, old saves load and play move for move with the switch on and off, the switch\'s scope and home, the map walk (61 surfaces, 28 windows, 87 sections, 599 settings + 1, 17 shortcuts, 48 LAB cards), every setting found by key and by label, ranking, Ask, availability, the router, the dialog\'s semantics, keys, no clock and no random draws, Q8.', '—'],
  ].forEach(r => w(`| ${esc(r[0])} | ${esc(r[1])} | ${esc(r[2])} |`));
  w('');
  w('**Deferred (not this package):** the docked panels (UX-5), the settings layers and Essentials (UX-3), feature cards (UX-4), turning Find Anything on by default and the classic switch (UX-6). Alt+S stays unwired (Find Anything has a result for it). The LAB list\'s duplicate React keys (97 console warnings in V10.1 and after) are untouched.');
};
