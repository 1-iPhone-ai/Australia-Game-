// UX-3 overlay for the map: what package UX-3 (Settings layers + Find Anything fixes) changed, applied on top of the UX-1/UX-2 map.
// The "today" columns keep describing V10.1 (the UX-1 audit); the V11.0 home columns are now built (with settingsLayersEnabled on).
module.exports = (L, ctx) => {
  const at = (pred, from = 0) => { for (let i = from; i < L.length; i++) if (pred(L[i])) return i; return -1; };
  const must = (i, what) => { if (i < 0) throw new Error(`ux3-overlay: ${what} not found`); return i; };
  const replaceLine = (pred, fn, what) => { const i = must(at(pred), what); L[i] = fn(L[i]); };

  // ---- Title and the status block ----------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('# V11.0 UX Map'), () => '# V11.0 UX Map — packages UX-1 (audit), UX-2 (Find Anything) and UX-3 (Settings layers)', 'title');
  const s2 = must(at(l => l === '## Status after UX-2'), 'status after UX-2');
  L.splice(s2, 0,
    '## Status after UX-3',
    '',
    '- **Settings layers** (off by default, `settingsLayersEnabled`, profile setting, in Settings › Interface & Accessibility › 🗂️ Settings Layout). Off, Settings is exactly what UX-2 delivered plus this one row (checked in the browser: every tab draws the same sections, controls and words, apart from the counts that now include the new switch). On:',
    '  - **⭐ Essentials** takes the Simple view\'s place: the 12 choices of §6, each writing through the call the game already uses (the Simple view\'s handler, `SET_AI_DIFFICULTY` for the rival\'s difficulty, the Learn tab\'s mode change, the theme switch, the Text size row). A rule a running V10.1 match locks says so and that the change waits for the next match.',
    '  - **Five goal groups** replace the 11 tabs (🎮 Match & rules 100 · 🤖 Your rival 104 · 👥 Teams & automation 251 · 🧭 Help, screen & sound 63 · 🔬 Records & tools 62; Essentials 15; 6 internal). Every section is drawn as it was; the settings search still searches everything and shows each hit in its home.',
    '  - **One home per setting** (the V11.0 home column of §7): 7 sections are dissolved into their settings\' homes, 5 blocks of controls are drawn in their home instead of where they were, 29 rows give a home to settings whose control lived in a window, the LAB or a version section (each writes through that control\'s own call), and 11 duplicate or misplaced controls are not drawn away from home.',
    '  - **Teams & automation** shows the Team Mode AI master switch and the three solo sections (Auto Mode, Human Player Automation, Priority Resolution — 24 settings) until a Team Mode match runs or `teamCompetitiveAiEnabled` is on; then all 27 sections and the Team Intelligence OS rows.',
    '  - **Show inactive** reveals the 20 settings with no effect in this version and `deterministicRngActive` (8 have a control in a section; the other 13 have none in Settings and appear in the read-only list); **🔒 Set by presets** lists, read-only with their value, the 55 settings no control in Settings changes: 44 with no control, `deterministicRngActive`, 5 only a reset changes, and 5 with no effect that nothing draws (two Adaptive AI values, three replay switches only Replay Studio\'s presets set).',
    '- **Find Anything fixes:** matching only at the start of words (a squashed key only from its start: "tent" and "rain" now find no setting; UX-2 returned 15 each), the everyday words of the brief, one label table (329 settings whose title was their key in words now have written labels; never "Ai"), the 12 Essentials as results, results that open the new homes while the layers are on, and Ctrl/⌘+K in the Help window while Find Anything is on.',
    '- **Self-tests:** 3,096 checks in 80 suites pass (3,056 in 79 before; +40 in `v113sl`), release check 155 of 155, Co-Pilot 85 of 85, strict TypeScript 0 errors; the rules stamp stays 1010 and old saves play move for move with both switches on.',
    '');

  // ---- Contents -----------------------------------------------------------------------------------------------------------
  const c2 = must(at(l => l === '- Status after UX-2'), 'contents');
  L.splice(c2, 0, '- Status after UX-3');
  const c16 = must(at(l => l === '- 16. UX-2: Find Anything — what changed'), 'contents 16');
  L.splice(c16 + 1, 0, '- 17. UX-3: Settings layers — what changed');

  // ---- Keep UX-2's own numbers where they describe UX-2 (the generator now reads the UX-3 module) ---------------------------------------
  replaceLine(l => l.startsWith('- **Find Anything** (off by default, `findAnythingEnabled`'), l => l.replace('89 settings sections, all 601 settings', '88 settings sections, all 600 settings'), 'UX-2 status numbers');
  replaceLine(l => l.startsWith('| UX-2 Find Anything | **Done** (§16).'), l => l.replace('+ 89 sections + 601 settings', '+ 88 sections + 600 settings'), '§14 UX-2 numbers');
  replaceLine(l => l.startsWith('| UX-3 Settings layers |'), l => l.replace('Planned: 89 sections', 'Planned: 88 sections').replace('counts: help 63,', 'counts: help 62,'), '§14 UX-3 planned numbers');
  replaceLine(l => l.startsWith('| Registry surfaces / settings / indexed sections | 61 / 599 / 86 |'), () => '| Registry surfaces / settings / indexed sections | 61 / 599 / 86 | 89 / 600 / 87 |', '§2 UX-2 registry row');
  const lab = must(at(l => l.startsWith('| In-game LAB (no static renderer in the page) |')), '§2 LAB row');
  L.splice(lab + 1, 0, '',
    '**After UX-3** (the same runners on the changed file; the UX-2 numbers may not drop):',
    '',
    '| Runner | After UX-2 | After UX-3 |',
    '|---|---|---|',
    '| Registry surfaces / settings / indexed sections | 89 / 600 / 87 | 89 / 601 / 88 |',
    '| Registered + harness extras | 3,056 checks, 79 suites, all pass | 3,096 checks, 80 suites, all pass (+40 in `v113sl`) |',
    '| Registered suites only | 2,883 checks, 74 suites | 2,923 checks, 75 suites, all pass |',
    '| Release check | 154 of 154 | 155 of 155 (READY_WITH_WARNINGS, the same warnings) |',
    '| Co-Pilot runner | 85 of 85 | 85 of 85 |',
    '| Strict TypeScript | 0 errors | 0 errors |',
    '| Suite registry integrity | ok (99 / 74) | ok (100 / 75) |',
    '| In-game LAB (no static renderer in the page) | 2,955 passed · 14 skipped · 0 failed of 2,969 | 2,995 passed · 14 skipped · 0 failed of 3,009 (the same console messages as UX-2) |',
    '| Browser (Chromium, 1280×900) | — | 32 of 32 steps: off by default, the switch\'s row, Essentials writes, every group, the Teams gate in a solo match and in a Team Mode match, Show inactive, moved blocks, Find Anything\'s fixes, Help; no page errors. With the switch off every Settings tab draws the same sections, controls and words as UX-2 (bar the counts that include the new switch, and its own row). |');

  // ---- §1: the group column is now built ---------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('- **V11.0 group** is the proposed UX-3 home:'), l => l.replace('is the proposed UX-3 home:', 'is the UX-3 home (built: Settings shows it once `settingsLayersEnabled` is on, §17):'), '§1 group bullet');

  // ---- §6: the groups are built ---------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('**Proposed groups (UX-3).**'), l => `${l} Built in UX-3 (§17): the dissolved sections draw their settings in their homes; the Balance Lab is under Records & tools.`, '§6 groups');

  // ---- §7: deterministicRngActive now has a home (the brief: treat it like the settings with no effect) ------------------------
  replaceLine(l => l.startsWith('| `deterministicRngActive` |'), l => {
    const c = l.split(/(?<!\\)\|/);
    c[9] = ' 🔬 Records & tools › Replay Safety & Compatibility (show inactive; 🔒 Set by presets) ';
    c[10] = ' UX-3 ';
    c[11] = `${c[11].replace(/\s+$/, '')}; UX-3: behind Show inactive like the 20 settings with no effect, and listed read-only under Set by presets `;
    return c.join('|');
  }, '§7 deterministicRngActive');

  // ---- §12.4: the theme (correction) ---------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('- The **theme** is set on the main menu only;'), () => '- The **theme** is set on the main menu *and* in Settings › Interface & Accessibility › Appearance (Dark / Light / Retro / System); both write the same profile theme. *Corrected in UX-3: the UX-1 audit missed the Appearance buttons.* UX-3\'s ⭐ Essentials › Look is a third place and writes it the same way.', '§12.4 theme');

  // ---- §14: UX-3 done ------------------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('| UX-3 Settings layers |'), l => l.replace('| UX-3 Settings layers | ', '| UX-3 Settings layers | **Done** (§17). Planned: '), '§14 UX-3');

  // ---- §17 --------------------------------------------------------------------------------------------------------------------
  const w = s => L.push(s);
  w('');
  w('## 17. UX-3: Settings layers — what changed');
  w('');
  w('All new code is in SECTION 20BN (the layered Settings) and SECTION 20BO (Find Anything\'s fixes, the label table, the suite) between SECTION 20BM and SECTION 21. Every in-place edit elsewhere is marked `// V11.0 (SECTION 20BN): …` or `(SECTION 20BO)`; most wrap one control in `v113Keep(key, section) && (…)` or one block in `v113Place(blockId, () => …)`, which draw exactly as before while the switch is off.');
  w('');
  w('| Area | What changed | Off (default) |');
  w('|---|---|---|');
  [
    ['Switch', '`settingsLayersEnabled` (boolean, false, profile, remembered between visits, never in a save) in Settings › Interface & Accessibility › 🗂️ Settings Layout; in the Co-Pilot catalog; found by the settings search. The group bar\'s *Classic tabs* turns it off and lands on the nearest classic tab.', 'off'],
    ['⭐ Essentials', 'The Simple view\'s place (the top switcher reads ⭐ Essentials · 🎮 Game Experience · 🗂️ All settings). Experience, How to win, Game length, Actions per day, Rival difficulty, Keep my match safe, How much help, Rival turn speed, Look (look + theme), Text size, Motion, Sound. Rival difficulty shows and writes the match\'s difficulty (`gameState.aiDifficulty` via `SET_AI_DIFFICULTY`, never the unused `aiDifficulty` key) and is locked with "Changes apply to your next match" while a V10.1 match runs; How to win and Game length show the V10.1 lock note. How much help and INTELLIGENCE › Learn now call one function (`v113LearningModeSettings`, the same write).', 'the Simple view, unchanged'],
    ['Five groups', 'A group bar in place of the 11 tabs, with counts, *Show inactive (21)* and *Classic tabs*. Which sections show follows §6\'s group column; a search hit shows in its home with the group as its chip. Opening Settings at a setting (a LAB card, Find Anything, a "go to" link) lands in that setting\'s group.', '11 tabs, unchanged'],
    ['Teams gate', 'The user\'s decision for this package: team keys only. Until a Team Mode match runs or `teamCompetitiveAiEnabled` is on, the group shows a gate card with the master switch, then Auto Mode, Auto Mode Advanced, Human Player Automation and Priority Resolution (24 settings); the other 227 settings and the Team Intelligence OS rows appear once either is on.', '—'],
    ['Inactive', 'The 20 settings V9.9/V10.1 found have no effect, and `deterministicRngActive`, are drawn only with *Show inactive* on: 8 have a control in a section (3 scenario switches, AI-vs-AI memory, Priority Transparency, Explanation Depth, Projected Outcome — its options stay reachable while the switch is hidden — and Governance Veto uses); the other 13 have no control in Settings (two of them, the Adaptive AI ceiling and learning rate, had none anywhere — the map listed them under Adaptive AI) and appear in the read-only list.', 'drawn as before'],
    ['Set by presets', 'Each group ends with a read-only list of its settings that no control in Settings changes, with their value now: the 44 with no control, the 5 only a reset changes (marked so), and — behind Show inactive — `deterministicRngActive` and the 5 settings with no effect that nothing draws. 55 in all; no control was built for any of them.', '—'],
    ['Find Anything', 'Word starts only (a squashed key from its start, 3 letters or more); the everyday words (easy / hard / harder / difficulty, speed / fast / slow, music / mute, restart / new game / new match / exit, theme / dark mode, days, hint); 12 Essentials results (867 entries, was 853 + the new switch and section); with the layers on a setting\'s result names its group and opens its home; one label table (`v113SettingLabel`) shared by the layered rows, the read-only list and Find Anything, with written labels for the 329 settings whose title was the key in words.', 'Find Anything itself is off by default (UX-2)'],
    ['Help window', 'Lists Ctrl/⌘+K (Find Anything) while Find Anything is on.', 'unchanged'],
    ['Self-tests', 'Suite `v113sl` (40 checks): the switch\'s default, scope and home; V10.1\'s 599 defaults and the profile and match lists unchanged (fingerprints); the map walk (all 601 settings, one home each; all 89 sections grouped; the group counts); Essentials (12 choices, each control\'s write path, difficulty as match state and its lock, the theme, the Learn function); groups, the Teams gate, Show inactive, the read-only list; moved blocks, kept controls, rows writing like the originals; search and navigation landing; Find Anything (word starts, squashed keys, everyday words, one label table, real labels, Essentials results, layered routes, Help Ctrl/⌘+K); no clock and no random draw; rules stamp 1010 and old saves move for move with both switches on.', '—'],
  ].forEach(r => w(`| ${r[0]} | ${r[1]} | ${r[2]} |`));
  w('');
  w('**Where each thing moved (with the layered Settings on).** Keys, defaults, scopes and saved values never change; switching the layers off puts every control back where §7\'s *today* column says.');
  w('');
  w('| From (V11.0 after UX-2) | To (layered) | How |');
  w('|---|---|---|');
  [
    ['Quick Setup & Presets › Quick Setup (dissolved)', 'Difficulty → ⭐ Rival difficulty (match state); Game Length, Victory Goal, Action Limits → ⭐ Essentials; UX Assist Pack → 🧭 UX Assist Features; Team Mode AI Profile → 👥 Competitive AI; Team Brain Mode → 👥 Team Brain', 'each home already had a control (or Essentials does)'],
    ['Interface › 🎓 Guided First Match (dissolved) and its twin in Accessibility', '⭐ How much help', 'Essentials writes through the same handler (`wp8SetGuidedFirstRun`); the Accessibility twin is hidden'],
    ['Interface › Map, Look & Sound (dissolved)', '⭐ Look, Motion, Sound', 'Essentials (the Simple view\'s handler)'],
    ['Competition › Competitive Actions (dissolved)', 'Sabotage → 🎮 Gameplay Expansions; Region-majority rush → 🤖 AI Difficulty', 'both homes already had the control'],
    ['Gameplay › ✨ New in V10.1 / V10.0 / V9.9 (dissolved, Q7)', 'Rival Recap, Rival Races → 🤖 🏁 Rival extras; Fixed-rules Daily, Match Journal → 🎮 📅 Daily Challenge & Match Journal; Classic rules (V10.0) → 🎮 🏛️ Classic rules; Classic rival (V9.9) → 🤖 Classic rival; Turn Digest → 🧭 🧾 Turn summaries; Classic toasts and layout → 🧭 🎨 Classic look & feel; Autosave & Resume, Warn before closing, Rival turn pace → ⭐ Essentials; "Don\'t ask me again" reset → 🎮 ✋ Confirmation questions', 'rows that write through each old section\'s tracked call'],
    ['AI Difficulty: Deterministic AI, AI RNG seed, world randomness and seed, replay recording (with its event cap and export)', '🔬 Replay Safety & Compatibility', 'the block itself is drawn there ("moved here from AI Difficulty")'],
    ['AI Difficulty: Replay Studio, presets and options', '🔬 Replay Safety & Compatibility', 'the block itself'],
    ['Adaptive AI: Overseer win-condition counter-strategies', '👥 Team AI Overseer', 'the block itself'],
    ['UX Assist Features: Team Mode AI systems switch and profile', '👥 Competitive AI', 'a row (same `updateGameSetting` call) and the profile block itself'],
    ['Win Condition & Cash-Out: Victory Goal, the negotiation switch; Region Control: Victory Goal, Cash-out', 'not drawn there (homes: ⭐ How to win; 🎮 Negotiations; 🎮 Win Condition & Cash-Out)', 'the homes have their own controls'],
    ['Win Condition & Cash-Out: the extra negotiation options (advanced view)', '🎮 Negotiations & Cash Transfers', 'the block itself (three of its options repeat the section\'s own; deferred, see below)'],
    ['Core Gameplay: Game length, Player actions per day; Action Limits: the switch and Max Actions (Human)', '⭐ Game length, Actions per day', 'not drawn there'],
    ['Action Limits: Max Actions (AI)', '🎮 Core Gameplay (AI actions per day)', 'not drawn there; the same key'],
    ['Guardian AI Center window: 7 presentation switches', '🧭 Human Co-Pilot AI & Takeover Controls', 'rows writing as the window does (`setGameSettings`); the window keeps its own'],
    ['AI Command Center widget settings; INTELLIGENCE › Co-Pilot explanations', '🧭 Human Co-Pilot AI & Takeover Controls', 'an "Open the AI Command Center" row; the explanation choice writes both keys as the INTELLIGENCE tab does'],
    ['Activity Ledger window: diagnostics, auto-prune, retention, export compression; AI Scorecard switches', '🔬 Game Activity Ledger; 🤖 AI Difficulty', 'rows (same `updateGameSetting` calls, labels and sections)'],
    ['LAB › Team Intelligence inspector: Team OS, authority, enemy OS, full inspection', '👥 🧠 Team Intelligence OS', 'rows (the LAB\'s tracked call; "not false" reads as on, as there)'],
    ['Directive budget, directives per turn, escalation cost; Preserve replay determinism', '👥 Team AI Overseer; 👥 Auto Mode Advanced', 'their controls were already there; Find Anything now opens them there'],
    ['The theme (main menu, Appearance)', '⭐ Look', 'the same profile theme write'],
  ].forEach(r => w(`| ${r[0]} | ${r[1]} | ${r[2]} |`));
  w('');
  w('**Where the brief, the map and the file disagreed (and what UX-3 did).**');
  w('');
  w('- *The 45 settings with no control* (§11.3) include `aiDifficulty`, but the map\'s own home for it (§7) is *internal*: it is never written, not even by a preset, and the brief replaces it with match state. UX-3 keeps it internal; `deterministicRngActive`, which only presets set, is the 45th row of the read-only list (behind Show inactive).');
  w('- *The 227 titles that were only the key in words*: counted the way UX-2 builds titles there are 329; all 329 have written labels.');
  w('- *Group counts*: Help, screen & sound is 63 with the new switch, and Records & tools 62 with `deterministicRngActive` (the brief: 62 and 61).');
  w('- *The theme* lives in the profile record and also in Settings › Appearance (§12.4 corrected).');
  w('');
  w('**Deferred (not this package):** feature cards (UX-4), docked panels (UX-5), turning the layers and Find Anything on by default and the classic switch (UX-6). In Negotiations & Cash Transfers the moved "more negotiation options" block repeats three of the section\'s own options (both write the same `negotiationOptions` fields); merging the two lists is left for UX-6\'s restyle. The 45 settings with no control still have none (by the brief).');
};
