// Body of V11.0_UX_MAP.md. Called by build-map.cjs with every data set already loaded.
exports.build = (D) => {
  const { UX2, P, reg, gates, crawl, probe, paths, defaults, scopeOf, inert, tabLabel, secById, rendered, renderedIds, simpleKeys, essentialKey, labBySection, labTabOnly, labCards, MORE_TO_TAB, probeSaw, probeTimeouts, astWrites, flagsBySurface, best, bestFlag, KEYS, pathText, esc, code, fmtVal, w } = D;
  const G = P.GROUPS;
  const grp = g => (G[g] ? G[g].label : g === 'internal' ? 'internal (no control)' : g);
  const facts = D.extraFacts;

  // ---- per-setting model ----------------------------------------------------------------------------------------------
  const sectionsOfKey = new Map(); reg.sections.forEach(s => s.fieldKeys.forEach(k => { const a = sectionsOfKey.get(k) || []; a.push(s.id); sectionsOfKey.set(k, a); }));
  // Measured 2-click routes into each hub tab (crawl: ⋯ More / View All Actions items; LAB cards), else More › Settings › Advanced › tab.
  const TAB_ROUTE = {
    home: [3, 'More › Settings › Advanced Settings'], quickSetup: [2, 'LAB › Quick Setup & Presets'], mechanicsDir: [2, 'LAB › Mechanics Directory'],
    gameplay: [2, 'LAB › Core Gameplay'], economy: [MORE_TO_TAB('economy'), 'More › Settings › Advanced › Economy & Money'], competition: [MORE_TO_TAB('competition'), 'More › Settings › Advanced › Competition & Regions'],
    aiTeams: [2, 'More › 🧠'], automation: [2, 'More › 🤖 Automation'], oversight: [2, 'More › 🏛️ Governance'], replayDiag: [2, 'More › 🎬 Replay'], interfaceAcc: [2, 'LAB › Interface & Accessibility']
  };
  const secRoute = id => { const sec = secById.get(id) || (id === 'advancedSystems.balanceLab' ? { tab: 'replayDiag' } : null); if (!sec) return [null, '']; const lab = labBySection.get(id); return lab ? [2, `LAB › ${lab}`] : TAB_ROUTE[sec.tab]; };
  // Static gating of each key's control inside its section (from the parsed JSX conditions).
  const gating = new Map();
  for (const s of rendered) for (const wr of s.writes) for (const k0 of wr.keys) {
    const m = k0.match(/:([A-Za-z0-9_]+)$/); const k = (m ? m[1] : k0).split('.')[0]; if (!defaults.has(k)) continue;
    const adv = wr.conds.some(c => /settingsViewMode\s*===\s*'advanced'/.test(c));
    const needs = [...new Set(wr.conds.flatMap(c => [...c.matchAll(/gameSettings\??\.([A-Za-z0-9_]+)/g)].map(x => x[1])).filter(x => x !== k && defaults.has(x) && defaults.get(x).type === 'boolean'))];
    const key = `${k}@${s.id}`; const prev = gating.get(key);
    // a key is advanced-only / gated only if EVERY write site in that section is
    if (!prev) gating.set(key, { adv, needs }); else gating.set(key, { adv: prev.adv && adv, needs: prev.needs.filter(x => needs.includes(x)) });
  }
  const misfiled = (facts.misfiled || []);
  const misByKey = new Map(misfiled.map(m => [m.k, m]));
  const ELSEWHERE_ROUTE = { 'Guardian AI Center window': [2, 'LAB › Guardian AI Center'], 'Activity Ledger window': [3, 'LAB › Game Activity Ledger › tab'], 'AI Command Center widget': [null, 'AI Command Center widget (off by default)'] };
  const settingRows = reg.defaults.map(d => {
    const k = d.key; const idx = sectionsOfKey.get(k) || []; const ni = P.NOT_INDEXED[k]; const mis = misByKey.get(k);
    const primary = (P.PRIMARY_OVERRIDE && P.PRIMARY_OVERRIDE[k]) || (idx.length > 1 && idx[0] === 'quickSetup.core' ? idx[1] : idx[0]) || (ni && ni.section) || null;
    let group = essentialKey.has(k) ? 'essentials' : ni ? ni.group : (primary ? P.SECTION_GROUP[primary] : null);
    if (P.INTERNAL_KEYS.has(k) || (mis && mis.verdict === 'internal')) group = 'internal';
    if (P.GROUP_OVERRIDE && P.GROUP_OVERRIDE[k]) group = P.GROUP_OVERRIDE[k];
    const HOME_FOLLOWS_INDEX = new Set(['ledgerDiagnosticsEnabled']); // its control sits in AI Difficulty by accident; the ledger section is its real home
    const homeSection = (mis && mis.verdict === 'control elsewhere' && mis.whereSection && P.SECTION_GROUP[mis.whereSection] && !HOME_FOLLOWS_INDEX.has(k)) ? mis.whereSection : ((ni && ni.section) || primary);
    if (homeSection && homeSection !== primary && P.SECTION_GROUP[homeSection] && group !== 'essentials' && !(P.GROUP_OVERRIDE && P.GROUP_OVERRIDE[k])) group = P.SECTION_GROUP[homeSection];
    let homeSectionFinal = homeSection;
    if (P.HOME_SECTION_OVERRIDE && P.HOME_SECTION_OVERRIDE[k]) { homeSectionFinal = P.HOME_SECTION_OVERRIDE[k]; if (group !== 'essentials') group = P.SECTION_GROUP[homeSectionFinal]; }
    const refile = P.VERSION_REFILE && P.VERSION_REFILE[k];
    if (refile && group !== 'essentials') group = refile[0];
    // Where the control is today (the section a player opens through More › Settings), for the "via More" column.
    const NI_CTRL = { 'AI Difficulty section': 'ai.settings', 'Match Variety section': 'gameplay.matchVariety', 'AI Thinking & Algorithm section': 'teamModeAi.aiThinkingAlgorithm' };
    const niCtrl = ni ? Object.entries(NI_CTRL).find(([p]) => String(ni.today).startsWith(p)) : null;
    const ctrlSection = (mis && mis.whereSection && secById.has(mis.whereSection)) ? mis.whereSection : niCtrl ? niCtrl[1] : (mis && /elsewhere|no control|reset only|internal/.test(mis.verdict)) ? null : (ni ? null : primary);
    let clicks = null; let how = ''; const notes = [];
    if (simpleKeys.has(k)) { clicks = 2; how = `More › Settings (Simple: ${simpleKeys.get(k)})`; }
    else if (mis && mis.whereSection && secById.has(mis.whereSection)) { const r = secRoute(mis.whereSection); clicks = r[0]; how = r[1]; }
    else if (mis && /elsewhere/.test(mis.verdict)) { const r = ELSEWHERE_ROUTE[mis.where] || (secById.has(mis.whereSection) ? secRoute(mis.whereSection) : [null, mis.where]); clicks = r[0]; how = r[1]; }
    else if (mis && /no control|reset only|internal/.test(mis.verdict)) { clicks = null; how = mis.verdict; }
    else if (ni) { clicks = ni.clicks != null ? ni.clicks : (ni.section && secById.has(ni.section) ? secRoute(ni.section)[0] : null); how = ni.today; }
    else if (primary) { const r = secRoute(primary); clicks = r[0]; how = r[1]; }
    if (group === 'internal') { clicks = null; how = 'internal: no route'; }
    const g = primary ? gating.get(`${k}@${primary}`) : null;
    if (g && g.adv && clicks != null && !simpleKeys.has(k)) { clicks += 1; how += ' › Advanced view'; notes.push('advanced view only'); }
    if (g && g.needs.length) notes.push(`shown when ${g.needs.map(x => '`' + x + '`').join(' + ')} on`);
    if (inert.has(k)) notes.push(`inactive (${inert.get(k).v})`);
    if (['winCondition', 'totalDays', 'aiDifficulty'].includes(k)) notes.push('locked while a match runs (V101_LOCKED_RULE_KEYS); changes wait for the next match');
    if (P.INTERNAL_NOTES && P.INTERNAL_NOTES[k]) notes.push(P.INTERNAL_NOTES[k]);
    if (!idx.length) notes.push('not in hub index');
    // UX-4: only a key the search run covered can be "not found" (search-all-ux2.json predates settingsLayersEnabled and whatsInTheGameEnabled; the hub's search finds both as fields).
    if (D.searchAll && Object.prototype.hasOwnProperty.call(D.searchAll, k) && !D.searchAll[k]) notes.push('settings search cannot find it');
    if (idx.length > 1) notes.push(`also indexed in ${idx.slice(1).join(', ')}`);
    if (mis) notes.push(mis.verdict + (mis.where && !/no control|reset only|internal/.test(mis.verdict) ? `: ${mis.where}` : ''));
    if (D.gatedKeys && D.gatedKeys.has(k) && !(g && g.needs.length)) notes.push('control appears once its parent switch is on (probe)');
    let homeText = group === 'essentials' ? `⭐ Essentials #${(essentialKey.get(k) || { n: '?' }).n} "${(essentialKey.get(k) || { choice: '?' }).choice}"` : grp(group);
    if (group && group !== 'essentials' && group !== 'internal') { if (refile) homeText += ` › ${refile[1]}`; else { const sec = homeSectionFinal; if (sec && secById.has(sec)) homeText += ` › ${secById.get(sec).title}`; } }
    // Correction 5: the route a player finds without knowing a LAB shortcut, through More › Settings.
    let viaMore;
    if (group === 'internal') viaMore = '—';
    else if (simpleKeys.has(k)) viaMore = 'More › Settings (Simple view) — 2';
    else if (ctrlSection && secById.has(ctrlSection)) { const tb = secById.get(ctrlSection).tab; const gg = gating.get(`${k}@${ctrlSection}`); viaMore = `More › Settings › Advanced Settings${tb === 'home' ? '' : ' › ' + tabLabel(tb)}${gg && gg.adv ? ' › Advanced view' : ''} — ${MORE_TO_TAB(tb) + (gg && gg.adv ? 1 : 0)}`; }
    else if (group === 'internal' || (mis && /no control|reset only|internal/.test(mis.verdict))) viaMore = '—';
    else viaMore = 'not through More › Settings';
    if (inert.has(k)) homeText += ' (show inactive)';
    return { k, d, idx, primary, group, clicks, how, notes, ni, homeText, viaMore };
  });
  // ---- 0. Title -------------------------------------------------------------------------------------------------------
  w('# V11.0 UX Map — "Find Anything" round, packages UX-1 and UX-2');
  w('');
  w('**UX-1** audited `(V10.1) australia-game-with-ai.tsx` as shipped (282,211 lines, md5 `a7d56ae0e89666564909bacaaa7370df`): every number in the *today* columns was read from the file\'s own registries or measured by driving the real game in Chromium; nothing is estimated unless it says *derived*. **UX-2** (Find Anything) then changed the file; what it changed is in §16 and marked in the tables (*UX-2* in *Moves in*, the 28 new ids in §4, the new section and setting in §6 and §7). The *today* columns still describe V10.1 with Find Anything off, which is exactly how V11.0 behaves until UX-6 turns it on. This map is the input for UX-3 to UX-6 and for the test that walks it (`v110fa` walks every id below).');
  w('');
  // ---- At a glance (computed) ---------------------------------------------------------------------------------------------
  const oneClick = Object.values(best).filter(x => x.path.length === 1).length;
  const twoClick = Object.values(best).filter(x => x.path.length === 2).length;
  const mis = (facts.misfiled || []);
  const notIdxN = settingRows.filter(r => !r.idx.length).length;
  w('## Status after UX-2');
  w('');
  w(`- **Find Anything** (off by default, \`findAnythingEnabled\`, profile setting): one search box over every surface and window in §4 and §5 (the 8 unused ids aside), ${reg.sections.length + 1} settings sections, all ${reg.defaults.length} settings (by name or key, including the 29 the settings search misses), 17 shortcut groups, 48 LAB cards and Ask. Ctrl/⌘+K and a 🔎 Find button open it; results open through the buttons\' own calls (§16).`);
  w(`- **Registry (Q4):** the 61 V10.1 ids are kept; 28 ids added (27 windows from §5, and Find Anything); the 8 ids nothing opens are marked \`not used in V10.1\`; the shared ids each keep one window while Find Anything is on (§12.1).`);
  w('- **Version:** GAME_VERSION 11.0.0, a new save-ladder rung that changes nothing, rules stamp still 1010; matches, saves and replays play move for move.');
  w('- **Self-tests:** 3,056 checks in 79 suites pass (3,015 in 78 before; +41 in `v110fa`), release check 154 of 154, Co-Pilot 85 of 85, strict TypeScript 0 errors. The LAB now shows skipped checks as skipped (Q8).');
  w('');
  w('## At a glance (V10.1, the UX-1 audit)');
  w('');
  w(`- **Surfaces.** Of the 61 registry surfaces, ${oneClick} open in one click from the play screen and ${twoClick} more in two (measured); the rest are always on screen (the play view, HUD, quick bar, toasts), appear only after a switch or an event, or never open: **8 ids have no opener at all** (§11.1) and **5 ids are shared by two different windows** (§12.1). **28 real windows and panels have no id** (§5), so the surface manager, Escape and the rescue cannot see them.`);
  w('- **Settings navigation.** *More › ⚙️ Settings* opens the **Simple** view (22 choices). The hub is one more click; its tabs are 2 clicks away through a ⋯ More shortcut or a LAB card, except **Economy & Money and Competition & Regions, which take 4**.');
  const notFound = Object.entries(D.searchAll || {}).filter(([, v]) => !v).length;
  w(`- **Settings you cannot find.** The game\'s own settings search (\`searchSettingsHub\`, run for every key) finds ${599 - notFound} of 599; the **${notFound} it cannot find** are the keys missing from the hub index — 12 of the 13 national-system switches and 7 replay switches that are on screen in other sections, the Team OS switches in LAB and the Guided Learning choices in INTELLIGENCE (§11.5).`);
  w(`- **Settings you cannot change.** ${mis.filter(m => m.verdict === 'no control found').length} indexed settings have **no control anywhere** and ${mis.filter(m => m.verdict === 'reset only').length} only a reset touches (§11.3); ${mis.filter(m => m.verdict === 'control elsewhere').length} have their control somewhere other than where search sends you — the Guardian AI Center window, the Activity Ledger window or another section (§11.4).`);
  w('- **Duplicates.** 15 settings are indexed in more than one section; the 22 Simple-view settings each have a second control in the hub; ⋯ More and *View All Actions* open the same popover; *More › 🎬 Replay* opens replay **settings**, not the Replay Studio (§12).');
  w('- **Shortcuts.** 17 shortcut groups; **Ctrl+K is already taken** by the optional Ask the Game AI drawer (Q5); an Alt+S Strategy Planner hotkey exists but is never wired.');
  w('- **The brief\'s numbers** all match the file except the self-test baseline (Q1). §13 lists the eight questions and the decisions the UX-2 brief gave.');
  w('');
  w('## Contents');
  ['Status after UX-2', 'At a glance (V10.1, the UX-1 audit)', '1. How to read this map', '2. The numbers, checked against the brief', '3. How the game is navigated today', '4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2)', '5. Windows and panels the registry did not know (ids since UX-2)', '6. Settings sections', '7. Every setting (600 keys)', '8. Nested settings (32 objects, 302 fields)', '9. Preferences that are not settings keys', '10. Keyboard shortcuts', '11. Unreachable today', '12. Duplicated today', '13. Where the file and the brief disagree — questions', '14. Worklists per package', '15. How this map was made', '16. UX-2: Find Anything — what changed'].forEach(t => w(`- ${t}`));
  w('');

  // ---- 1. Conventions -------------------------------------------------------------------------------------------------
  w('## 1. How to read this map');
  w('');
  w('**Starting point for every click count:** a fresh browser, the guided first match skipped with *Skip tutorial — open the full game* (not counted), V10.1 defaults, an AI Opponent match on the **PLAY** layer, 1280×800. A click is one press; scrolling and typing are not clicks. Keyboard alternatives are listed separately.');
  w('');
  w('- **measured** — the path was replayed from a fresh page in Chromium and the game\'s own surface manager (`window.__GLOBAL_UI_SURFACE_MANAGER__`) or UI state confirmed the result.');
  w('- **derived** — computed from the code (the opener\'s conditions) plus a measured base path, because the default state hides it (e.g. a feature that is off).');
  w('- **Moves in** names the package that changes the item\'s home. Every row also gets a Find Anything entry in **UX-2**; that is not repeated per row. **UX-6** restyles everything and adds the classic switch that restores the V10.1 home shown in the *today* column.');
  w('- **V11.0 group** is the proposed UX-3 home: ' + Object.values(G).map(g => g.label).join(' · ') + '.');
  w('- **ids are the contract.** The UX-2+ walk test should iterate the ids in sections 4–10 and assert each is still reachable; ids never change in this round.');
  w('');

  // ---- 2. Numbers ------------------------------------------------------------------------------------------------------
  const R1 = reg.v101; // the brief's numbers are about V10.1
  const nBool = R1.defaults.filter(d => d.type === 'boolean'); const nOff = nBool.filter(d => d.value === false).length;
  const idxUnique = new Set(R1.sections.flatMap(s => s.fieldKeys));
  const modalCount = R1.surfaces.filter(s => s.category === 'modal').length; const blockCount = R1.surfaces.filter(s => s.isBlocking).length;
  w('## 2. The numbers, checked against the brief');
  w('');
  w('| Item | Brief | In the file | |');
  w('|---|---|---|---|');
  w(`| UI_SURFACE_REGISTRY surfaces | 61 | ${R1.surfaces.length} | ✅ |`);
  w(`| …of which modals | 45 | ${modalCount} | ✅ |`);
  w(`| …of which block the screen | 47 | ${blockCount} (45 modals + 2 overlays) | ✅ |`);
  w(`| DEFAULT_GAME_SETTINGS top-level keys | 599 | ${R1.defaults.length} | ✅ |`);
  w(`| …switches (booleans) | 321 | ${nBool.length} | ✅ |`);
  w(`| …switches off by default | 200 | ${nOff} | ✅ |`);
  w(`| SETTINGS_HUB_SECTION_INDEX sections / tabs | 86 / 11 | ${R1.sections.length} / ${R1.tabsOrder.length} | ✅ |`);
  w(`| …AI & Team Operations sections | 27 | ${R1.sections.filter(s => s.tab === 'aiTeams').length} | ✅ |`);
  w(`| …unique fields indexed | 569 | ${idxUnique.size} | ✅ |`);
  w(`| Settings flagged "No effect in this version" | 20 | ${R1.inert99.length} + ${R1.inert101.length} = ${R1.inert99.length + R1.inert101.length} | ✅ |`);
  w(`| Top layers / experience modes | 3 / 3 | PLAY · INTELLIGENCE · LAB / ${R1.expModes.map(m => m.id || m.mode || m.value).join(' · ')} | ✅ |`);
  w(`| Strict TypeScript errors | 0 | 0 (\`tsc --strict\` on this file, 52 s) | ✅ |`);
  w(`| Co-Pilot runner | 85 of 85 | ${R1.copilot.passed} of ${R1.copilot.totalTests} | ✅ |`);
  w(`| Self-test baseline | 2,957 checks, 80 suites | **does not match** — see Q1 | ⚠️ |`);
  w('');
  w('Self-test totals measured on this file (headless runner `tools/selftest/node-run.mjs --file "(V10.1) …"` and the in-game LAB runner):');
  w('');
  w('| Runner | Suites | Checks | Result |');
  w('|---|---|---|---|');
  w('| Registered suites (`V95_EXISTING_SUITES`) | 73 | 2,842 | 2,842 pass |');
  w('| Registered + harness extras (`--extras`: v95own, v96em-direct, gi2-async, gi21-async, v96-fidelity-async) | 78 | 3,015 | 3,015 pass |');
  w('| Release check (`runV95ReleaseCheck("full")`) | — | 153 | 153 pass, READY_WITH_WARNINGS |');
  w('| In-game LAB button (`runV101LabProgressive`) | 73 + release-own + 2 async | 2,928 | 2,928 "pass", of which 4 rows are SKIPPED-reported-as-pass |');
  w('| Co-Pilot runner (`runCoPilotDevSelfTests`) | 9 categories | 85 | 85 pass |');
  w('| Suite registry integrity (`tools/selftest/registry-integrity.mjs`) | 98 exported / 73 registered | — | ok |');
  w('');
  w('**After UX-2** (the same runners on the changed file; the Q1 baseline may not drop):');
  w('');
  w('| Runner | Before (V10.1) | After UX-2 |');
  w('|---|---|---|');
  w(`| Registry surfaces / settings / indexed sections | ${R1.surfaces.length} / ${R1.defaults.length} / ${R1.sections.length} | ${reg.surfaces.length} / ${reg.defaults.length} / ${reg.sections.length} |`);
  w('| Registered + harness extras (Q1 baseline) | 3,015 checks, 78 suites, all pass | 3,056 checks, 79 suites, all pass (+41 in `v110fa`) |');
  w('| Registered suites only | 2,842 checks, 73 suites | 2,883 checks, 74 suites, all pass |');
  w('| Release check | 153 of 153 | 154 of 154 (READY_WITH_WARNINGS, the same warnings) |');
  w('| Co-Pilot runner | 85 of 85 | 85 of 85 |');
  w('| Strict TypeScript | 0 errors | 0 errors |');
  w('| Suite registry integrity | ok (98 / 73) | ok (99 / 74) |');
  w('| In-game LAB (no static renderer in the page) | 2,928 shown as passed, 14 of them really skipped | 2,955 passed · 14 skipped · 0 failed of 2,969 (counted the V10.1 way: 2,969 of 2,969) |');
  w('');

  // ---- 3. Navigation ---------------------------------------------------------------------------------------------------
  w('## 3. How the game is navigated today');
  w('');
  w('The containers everything else hangs off. Clicks are from the starting point in §1.');
  w('');
  w('| Container | How to open | Clicks | What is inside |');
  w('|---|---|---|---|');
  const navRows = [
    ['PLAY layer (default)', 'already open', '0', 'Header (layers, Co-Pilot control bar), HUD (day, actions, cash, win race, End Turn), quick bar (Challenges, Explore, Resource Market, Emergency Loan, ⋯ tools, ✕), play card (Current Focus, Situation, Recommended Action, other options, *View All Actions*), system breakdown, match standing, **action bar** (Save / Load, Challenges, Travel, Market, End Turn, Workshop, Resource Market, Contracts, Progress, character ability, **⋯ More**), region panel, map with region preview and the **map footer** buttons (Scenarios, Career, Diplomacy, Migration, Determinism + optional feature buttons)'],
    ['⋯ More (action bar)', 'click *⋯ More*', '1', 'MORE · BUILD & COMPETE: Negotiations, Governance, 🧠 (AI & team settings — icon only), Automation, Replay, Diagnostics, ⚙️ Settings, ❓ Help, 📜 History, 🚪 Leave match (the last three are below the fold at 1280×800)'],
    ['INTELLIGENCE layer', 'click *🧠 INTELLIGENCE* (or any *Why?*, *What If?*, *View Plan*, *Change Goal*, the win-race chip)', '1', '10 sub-tabs (Ask, Learn, Situations, Strategy, Situation, World, Team, Rivals, Diplomacy, What-If), Ask chips, Guided Learning mode, Learn centre, Background AI workspace, contextual actions, Co-Pilot control modes and explain options, *Open Activity Ledger*'],
    ['LAB layer', 'click *🧪 LAB*', '1', `${labCards.length} cards in 8 groups: ${labCards.filter(c => c.tab).length} open Settings (30 on an exact section, 3 on a tab), ${labCards.filter(c => c.flag).length} open a window (3 disabled until their switch is on); then the technical Co-Pilot state, *Run self-tests* and 17 inspectors`],
    ['Settings (Simple view)', 'More › ⚙️ Settings', '2', '22 choices in 5 groups (Match, Gameplay, Rival, Look & sound, Help); *Show all* → Advanced'],
    ['Settings (Advanced = the hub)', 'More › Settings › ⚙️ Advanced Settings', '3', '11 tabs, 86 indexed sections, search (`/` or Ctrl+F), basic/advanced view switch, presets, filters'],
    ['Settings (Game Experience view)', 'More › Settings › 🎮 Game Experience', '3', 'Experience profile / plan screen'],
    ['Main menu', '⋯ More › 🚪 Leave match › Leave without saving (or Save & leave, which downloads the match first)', '3', 'Theme (Dark/Light/Retro/System), character, name, experience mode, 6 game modes, Save / Load, Settings, "Press ? for how to play"'],
    ['Floating widgets', 'off by default — turned on in Settings', '—', 'Guardian button, AI Command Center widget, Ask button/drawer, Unified Launcher, Widget Dock'],
    ['Keyboard', '—', '0', 'see §10']
  ];
  navRows.forEach(r => w(`| ${r.map(esc).join(' | ')} |`));
  w('');

  // ---- 4. Surfaces ------------------------------------------------------------------------------------------------------
  w('## 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2)');
  w('');
  w('Rows 1–61 are V10.1\'s ids (kept, Q4); rows 62–89 are the ids UX-2 added (Q4): 27 windows that had none (§5) and Find Anything. A new id\'s *Flags* are the ones the V11.0 table maps to it while Find Anything is on (\"registered, not tracked\" = its state is not an interface flag, so it has an id for Find Anything and the walk test but the surface manager does not track it). Ids marked *not used in V10.1* open nothing (§11.1).');
  w('');
  w('*Kind*: panel / widget / toast / launcher / drawer / modal / overlay as registered. *Opens today*: the shortest measured path (**m**) or the code path (**d**). *Flags*: the `uiState` flags the surface manager maps to the id. *Plan*: dock = a tab of the UX-5 side panel; dock? = proposed extra tab (Q3); decision = stays a blocking modal; window = stays a window (Q3); panel = already non-modal.');
  w('');
  w('| # | id | Name | Kind | Blocks | Opens today | Clicks | Keys | Flags | Plan | V11.0 home | Moves in |');
  w('|---|---|---|---|---|---|---|---|---|---|---|---|');
  const surfaceTodayStatic = facts.surfaceToday || {};
  const SPLIT_IDS = new Map(UX2.SPLITS.map(r => [r[0], r[2]]));
  reg.surfaces.forEach((s, i) => {
    if (UX2.newIds.includes(s.key)) {
      const t = UX2.today(s.key); const flags = UX2.TABLE_ON[s.key] ? UX2.TABLE_ON[s.key].map(f => code(f)).join(' ') + ' (table on)' : esc(UX2.NOT_TRACKED[s.key] || 'registered, not tracked (a screen or an inline panel)');
      w(`| ${i + 1} | ${code(s.key)} | ${esc(s.name)} | ${s.category} | ${s.isBlocking ? 'yes' : 'no'} | ${esc(t.text)} | ${esc(t.clicks)} | ${esc(KEYS[s.key] || '')} | ${flags} | ${UX2.PLAN[s.key] || 'window'} | ${esc(UX2.home(s.key))} | ${esc(UX2.pkg(s.key))} |`);
      return;
    }
    const b = best[s.key]; const plan = P.SURFACE_PLAN[s.key] || ['?', '?', '?'];
    let today = '', clicks = '';
    if (b) { today = `${pathText(b)} (m)`; clicks = String(b.path.length); }
    if (surfaceTodayStatic[s.key]) { const st = surfaceTodayStatic[s.key]; if (!b || st.prefer) { today = st.text; clicks = st.clicks; } else if (st.also) today += `; ${st.also}`; }
    if (!today) { today = 'see §11 (no opener found)'; clicks = '—'; }
    if (UX2.UNUSED.includes(s.key)) today += ' · marked not used in V10.1 (UX-2, Q4)';
    const splitNote = SPLIT_IDS.has(s.key) ? ` · table on: ${SPLIT_IDS.get(s.key)}` : '';
    w(`| ${i + 1} | ${code(s.key)} | ${esc(s.name)} | ${s.category} | ${s.isBlocking ? 'yes' : 'no'} | ${esc(today)} | ${clicks} | ${esc(KEYS[s.key] || '')} | ${(flagsBySurface[s.key] || []).map(f => code(f)).join(' ')}${esc(splitNote)} | ${plan[0]} | ${esc(plan[1])} | ${plan[2]} |`);
  });
  w('');

  // ---- 5. Unregistered windows --------------------------------------------------------------------------------------------
  w('## 5. Windows and panels the registry did not know (ids since UX-2)');
  w('');
  w('Real, reachable UI that V10.1 drew without a `UI_SURFACE_REGISTRY` id (the surface manager could not see it, so Escape, the rescue and shortcut suppression treated it as absent unless a fallback existed). **UX-2 gave each an id (Q4)**: the id is in the first column, and *Id now* shows where it is registered (§4). The Ask drawer is the live window behind the shared id `ask_game_ai`, so it keeps that id.');
  w('');
  w('| Id | What it is | Opened by today | Clicks | State | Id now (UX-2) | V11.0 home | Moves in |');
  w('|---|---|---|---|---|---|---|---|');
  (facts.unregistered || []).forEach(u => w(`| ${code(u.id)} | ${esc(u.what)} | ${esc(u.opener)} | ${esc(u.clicks)} | ${esc(u.state)} | ${u.id === 'ask_drawer' ? code('ask_game_ai') + ' (kept)' : code(u.id) + (UX2.TABLE_ON[u.id] ? ' (tracked while Find Anything is on)' : ' (registered)')} | ${esc(u.home)} | ${u.pkg} |`));
  w('');

  // ---- 6. Sections --------------------------------------------------------------------------------------------------------
  w('## 6. Settings sections');
  w('');
  w(`${reg.sections.length} indexed sections plus 1 rendered section the index does not list (Balance Lab). *Clicks* = the shortest measured route from the play screen: a ⋯ More shortcut or a LAB card opens Settings directly on a tab (2 clicks), otherwise More › Settings (opens on the Simple view) › ⚙️ Advanced Settings › tab (4; Settings Home 3). Scrolling within a tab is not a click; sections start expanded (\`startSettingsCategoryCollapsed\` is off).`);
  w('');
  w('| # | Section id | Title | Tab today | Fields | Clicks | Shortest route (measured) | Via More › Settings | V11.0 group | Moves in |');
  w('|---|---|---|---|---|---|---|---|---|---|');
  let n = 0;
  reg.tabsOrder.forEach(t => {
    reg.sections.filter(s => s.tab === t).forEach(s => {
      n++; const r = secRoute(s.id);
      w(`| ${n} | ${code(s.id)} | ${esc(s.title)} | ${esc(tabLabel(t))} | ${s.fieldKeys.length} | ${r[0]} | ${esc(r[1])} | ${MORE_TO_TAB(t)} | ${P.VERSION_SECTIONS && P.VERSION_SECTIONS.includes(s.id) ? 'dissolved (Q7): each switch filed by goal; the label moves to What\'s New' : grp(P.SECTION_GROUP[s.id])} | ${s.id === 'interface.findAnything' ? 'UX-2 (new) · UX-3' : s.id === 'interface.settingsLayers' ? 'UX-3 (new)' : 'UX-3'} |`);
    });
  });
  w(`| ${n + 1} | ${code('advancedSystems.balanceLab')} | 🧪 Balance Lab & Simulation Sandbox (not indexed) | Replay & Diagnostics | 0 (a tool panel) | 2 | More › 🎬 Replay | ${MORE_TO_TAB('replayDiag')} | ${grp('tools')} | UX-3 |`);
  w('');
  w('**Proposed groups (UX-3).** ' + Object.entries(G).filter(([k]) => k !== 'essentials').map(([k, g]) => `**${g.label}** — ${g.goal} (${Object.values(P.SECTION_GROUP).filter(x => x === k).length} sections)`).join(' · '));
  w('');
  w('**Essentials page (12 choices).**');
  w('');
  w('| # | Choice | Keys | Why |');
  w('|---|---|---|---|');
  P.ESSENTIALS.forEach((e, i) => w(`| ${i + 1} | ${esc(e.choice)} | ${e.keys.map(code).join(', ')} | ${esc(e.why)} |`));
  w('');

  // ---- 7. Every setting -----------------------------------------------------------------------------------------------------
  w(`## 7. Every setting (${reg.defaults.length} keys)`);
  w('');
  w('Ordered by today\'s tab and section; keys not in the index come last. *Scope*: **match** = a save carries it; **profile** = the player\'s, kept on this device (`V99_PERSISTED_PROFILE_SETTING_KEYS`), never taken from a save; *profile (not stored)* = profile-scoped but not remembered between visits. *Clicks*: to reach the control from the play screen by the shortest measured route (Simple view 2; a ⋯ More shortcut or LAB card 2; More › Settings › Advanced › tab 4), +1 where the code shows the control only in the hub\'s Advanced view. "Shown when X on" means the control appears only after another switch is on (from the code\'s own conditions, confirmed by the probe where it ran). *Notes*: inactive = flagged "No effect in this version" (goes behind UX-3\'s *show inactive* toggle).');
  w('');
  w('| Key | Type | Default | Scope | Today: indexed home | Clicks | Shortest route to its control | Via More › Settings (no shortcut) | V11.0 home | Moves in | Notes |');
  w('|---|---|---|---|---|---|---|---|---|---|---|');
  const order = []; const seenK = new Set();
  reg.tabsOrder.forEach(t => reg.sections.filter(s => s.tab === t).forEach(s => s.fieldKeys.forEach(k => { if (!seenK.has(k)) { seenK.add(k); order.push(k); } })));
  reg.defaults.forEach(d => { if (!seenK.has(d.key)) { seenK.add(d.key); order.push(d.key); } });
  const rowByKey = new Map(settingRows.map(r => [r.k, r]));
  const featureCard = new Map(); (P.FEATURE_CARDS || []).forEach(c => c.keys.forEach(k => featureCard.set(k, c.card)));
  order.forEach(k => {
    const r = rowByKey.get(k); const d = r.d;
    const where = r.idx.length ? `${tabLabel(secById.get(r.idx[0]).tab)} › ${esc(secById.get(r.idx[0]).title)}${simpleKeys.has(k) ? ' · Simple: ' + simpleKeys.get(k) : ''}` : (r.ni ? esc(r.ni.today) : 'nowhere (state)');
    const home = esc(r.homeText);
    const moves = (k === 'findAnythingEnabled' ? ['UX-2 (new)', 'UX-3', 'UX-6'] : k === 'settingsLayersEnabled' ? ['UX-3 (new)', 'UX-6'] : [r.group === 'internal' ? '—' : 'UX-3'].concat(featureCard.has(k) ? ['UX-4'] : [])).join(' · ');
    const notes = [...r.notes]; if (featureCard.has(k)) notes.push(`card: ${featureCard.get(k)}`);
    if (k === 'findAnythingEnabled') notes.push('new in UX-2: Find Anything (off by default until UX-6); the settings search finds it as a field');
    if (k === 'settingsLayersEnabled') notes.push('new in UX-3: the layered Settings — Essentials and five goal groups (off by default until UX-6); the settings search finds it as a field');
    w(`| ${code(k)} | ${d.type} | ${esc(fmtVal(d.value))} | ${scopeOf(k)} | ${where} | ${r.clicks == null ? '—' : r.clicks} | ${esc(r.how)} | ${esc(r.viaMore)} | ${home} | ${moves} | ${esc(notes.join('; '))} |`);
  });
  w('');

  // ---- 8. Nested ------------------------------------------------------------------------------------------------------------
  w('## 8. Nested settings (32 objects, 302 fields)');
  w('');
  w('Each object is one key in §7 (same scope and home); its fields are listed so the walk test can assert none is dropped.');
  w('');
  w('| Object key | Fields | Count |');
  w('|---|---|---|');
  reg.defaults.filter(d => d.type === 'object').forEach(d => w(`| ${code(d.key)} | ${d.nestedKeys.length ? d.nestedKeys.map(x => code(x)).join(', ') : '(empty map, filled at run time)'} | ${d.nestedKeys.length} |`));
  w('');

  // ---- 9. Preferences outside settings ----------------------------------------------------------------------------------------
  w('## 9. Preferences that are not settings keys');
  w('');
  w('| Preference | Stored in | Set today | Clicks | V11.0 home | Moves in |');
  w('|---|---|---|---|---|---|');
  (facts.otherPrefs || []).forEach(p => w(`| ${esc(p.name)} | ${esc(p.store)} | ${esc(p.today)} | ${esc(p.clicks)} | ${esc(p.home)} | ${p.pkg} |`));
  w('');

  // ---- 10. Shortcuts --------------------------------------------------------------------------------------------------------
  w('## 10. Keyboard shortcuts');
  w('');
  w('| Keys | Does | Active when | Source | V11.0 |');
  w('|---|---|---|---|---|');
  const SC_UX2 = {
    'Ctrl/⌘+K': { does: 'Find Anything while `findAnythingEnabled` is on (Q5); otherwise, as in V10.1, toggles the Ask the Game AI drawer', when: 'always (Find Anything on); `askGameAiUiEnabled` on and Find Anything off (Ask)', src: 'useV110FindAnything; the V10.1 effect stands down (v110AskDrawerKeyActive)', v11: 'done in UX-2 (Q5): Ask is a Find Anything result' },
    '?': { v11: 'keep; Help is a Find Anything result (UX-2), with its own id while Find Anything is on' },
    'Alt+S': { v11: 'still dormant; Find Anything lists it and opens the planner the way the Launcher does (UX-2)' },
  };
  (facts.shortcuts || []).forEach(s => { const o = { ...s, ...(SC_UX2[s.keys] || {}) }; w(`| ${esc(o.keys)} | ${esc(o.does)} | ${esc(o.when)} | ${esc(o.src)} | ${esc(o.v11)} |`); });
  w('');

  // ---- 11-15 ----------------------------------------------------------------------------------------------------------------
  const routesBySurface = {}; for (const x of D.crawl) { const o = x.outcome; const sid = o.mgr && (o.mgr.modal || o.mgr.drawer); if (!sid || o.mgrChanged === false) continue; const label = x.path.map(p => p.replace(/\s+/g, ' ').replace(/\$N/g, '$').trim().slice(0, 26)).join(' › '); (routesBySurface[sid] = routesBySurface[sid] || []); if (!routesBySurface[sid].includes(label)) routesBySurface[sid].push(label); }
  const probeStats = D.probeStats || { gatedCount: 0, controls: 0 };
  require('./build-map-tail.cjs').build(D, { settingRows, misfiled, probeStats, gatedKeys: D.gatedKeys, routesBySurface });
  w('');
};
