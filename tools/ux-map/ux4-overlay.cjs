// UX-4 overlay for the map: what package UX-4 (What's in the game) changed, applied on top of the UX-1/UX-2/UX-3 map.
// The "today" columns keep describing V10.1 (the UX-1 audit). The V11.0 home column stays UX-3's apart from one fix (the Balance Lab's
// three settings), and §7's "card:" notes now name each card the way the page does (reg.cards, read from the module by extract.mjs).
module.exports = (L, ctx) => {
  const { reg } = ctx;
  const at = (pred, from = 0, to = L.length) => { for (let i = from; i < to; i++) if (pred(L[i])) return i; return -1; };
  const must = (i, what) => { if (i < 0) throw new Error(`ux4-overlay: ${what} not found`); return i; };
  // Every replacement must change its line: a pattern that no longer matches fails the build instead of leaving stale text.
  const replaceLine = (pred, fn, what) => { const i = must(at(pred), what); const next = fn(L[i]); if (next === L[i]) throw new Error(`ux4-overlay: ${what} did not change`); L[i] = next; };
  const cells = l => l.split(/(?<!\\)\|/);
  const code = s => '`' + s + '`';

  // ---- The cards, as the game files and names them ---------------------------------------------------------------------------------------
  const cards = reg.cards || [];
  const cardKeys = cards.flatMap(c => c.keys);
  if (cards.length !== 101 || new Set(cardKeys).size !== 109 || cardKeys.length !== 109) throw new Error(`ux4-overlay: expected 101 cards over 109 keys in the registries, found ${cards.length} over ${cardKeys.length}`);
  const cardOfKey = new Map(); cards.forEach(c => c.keys.forEach(k => cardOfKey.set(k, c)));
  const GROUP = { match: '🎮 Match & rules', rival: '🤖 Your rival', teams: '👥 Teams & automation', help: '🧭 Help, screen & sound', tools: '🔬 Records & tools' };
  const cardsIn = g => cards.filter(c => c.group === g).length;
  const renamed = cards.filter(c => c.name !== c.map).length;
  const twoSwitch = cards.filter(c => c.keys.length > 1);
  const windows = cards.filter(c => c.window).length;

  // Measured after UX-4 (§2): the runners and the browser walk.
  const LAB_AFTER = '3,035 passed · 14 skipped · 0 failed of 3,049 (the same console messages as UX-3)';
  const BROWSER_AFTER = "34 of 34 steps, no page errors. Off: nothing new in the More menu, on the play screen or in the action bar, and the switch's row is OFF in Settings. On (turned on in that row): the page is a labelled dialog over Settings, with its count, filter and goal groups. In a solo match the Teams gate holds 24 cards back (77 shown); in a Team Mode match there is no gate (101). A card's switch writes through Settings' own control, both ways, and its home link and window open. Also covered: parent switches and the Explorer gate, the read-only switches, the main menu's described needs, Find Anything's results, the Settings group bar's entry, the full action bar's entry, and a reload. With every switch off, the play screen, the More menu, Settings' simple view and the main menu read exactly as in UX-3; each Settings tab differs only in counts that include the new switch, plus its own row.";

  // ---- Title and the status block ----------------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('# V11.0 UX Map'), () => "# V11.0 UX Map — packages UX-1 (audit), UX-2 (Find Anything), UX-3 (Settings layers) and UX-4 (What's in the game)", 'title');
  const s3 = must(at(l => l === '## Status after UX-3'), 'status after UX-3');
  L.splice(s3, 0,
    '## Status after UX-4',
    '',
    "- **What's in the game** (off by default, `whatsInTheGameEnabled`, profile setting, in Settings › Interface & Accessibility › 🧩 What's in the game). Off, the game is exactly what UX-3 delivered plus this one row. On, a window with an id of its own (`whats_in_the_game`) shows:",
    `  - **${cards.length} cards over ${cardKeys.length} switch keys**, one for each feature §7 marks *card:*, under the five goal groups (${Object.keys(GROUP).map(g => `${GROUP[g]} ${cardsIn(g)}`).join(' · ')}), with an All / On / Off filter and a count of how many are on. The 13 national cards are built from \`EXPERIENCE_SYSTEM_REGISTRY\`.`,
    `  - **Each card** names the feature from the shared label table (a card with one switch by that switch; the ${twoSwitch.length} cards with two switches by a feature name in the same table) and says in one plain sentence what it does and whether it is on. It shows its real switch, which writes through the very call its control in Settings makes; the 3 switches no control changes are shown read-only. It lists what the feature needs (a parent switch, an experience mode, Team Mode, a match), each marked met or not, links to the feature's home in Settings and, while the feature is on, opens its window (${windows} cards have one).`,
    '  - **Team cards follow the Teams gate** of the layered Settings: until a Team Mode match runs or Competitive AI is on, 24 team cards wait (the page says so), while Competitive AI, Auto Mode and Human automation show. The page has no *Show inactive*: none of its switches is a setting with no effect.',
    '  - **Ways in:** 🧩 on the main menu, in ⋯ More and the full action bar, on the Settings group bar (layers on), on the switch\'s own row, and in Find Anything. There every card is a result, and "features" or "what\'s in the game" open the page.',
    '- **Labels:** "Travel Discipline" and "Floating UI Conflict Control" each named two settings; the companions are now *Travel Discipline Strength* and *Floating UI Conflict Control Options*. The two settings still titled with their key in words are now *Auto Mode Master Switch* and *Directive Budget Limit*. These are label-table changes: the classic Settings rows keep their titles.',
    '- **The Balance Lab\'s three settings** are homed in 🔬 Records & tools › ⚖️ Balance Lab, where their controls are, instead of 🤖 Your rival › Strategy Lab Presets, which has none (Your rival 104 → 101, Records & tools 62 → 65).',
    '- **Self-tests:** 3,136 checks in 81 suites pass (3,096 in 80 before; +40 in `v114wg`), release check 156 of 156, Co-Pilot 85 of 85, strict TypeScript 0 errors. The rules stamp stays 1010, and old saves play move for move with all three V11.0 switches on.',
    '');

  // ---- Contents --------------------------------------------------------------------------------------------------------------------
  L.splice(must(at(l => l === '- Status after UX-3'), 'contents'), 0, '- Status after UX-4');
  L.splice(must(at(l => l === '- 17. UX-3: Settings layers — what changed'), 'contents 17') + 1, 0, "- 18. UX-4: What's in the game — what changed");
  replaceLine(l => l === '- 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2)', l => l.replace('28 added in UX-2)', '28 added in UX-2 + 1 in UX-4)'), 'contents 4');
  replaceLine(l => /^- 7\. Every setting \(\d+ keys\)$/.test(l), () => `- 7. Every setting (${reg.defaults.length} keys)`, 'contents 7');

  // ---- Keep UX-2's and UX-3's own numbers where they describe those packages (the generator now reads the UX-4 module) -------------------
  replaceLine(l => l.startsWith('- **Find Anything** (off by default, `findAnythingEnabled`'), l => l.replace(/\d+ settings sections, all \d+ settings/, '88 settings sections, all 600 settings'), 'UX-2 status numbers');
  replaceLine(l => l.startsWith('| UX-2 Find Anything | **Done** (§16).'), l => l.replace(/\+ \d+ sections \+ \d+ settings/, '+ 88 sections + 600 settings'), '§14 UX-2 numbers');
  replaceLine(l => l.startsWith('| UX-3 Settings layers |'), l => l.replace(/Planned: \d+ sections/, 'Planned: 89 sections').replace(/counts: help \d+,/, 'counts: help 62,'), '§14 UX-3 planned numbers');

  // ---- §2: after UX-4 --------------------------------------------------------------------------------------------------------------
  const b3 = must(at(l => l.startsWith('| Browser (Chromium, 1280×900) | — |')), '§2 UX-3 browser row');
  L.splice(b3 + 1, 0, '',
    '**After UX-4** (the same runners on the changed file; the UX-3 numbers may not drop):',
    '',
    '| Runner | After UX-3 | After UX-4 |',
    '|---|---|---|',
    '| Registry surfaces / settings / indexed sections | 89 / 601 / 88 | 90 / 602 / 89 |',
    '| Registered + harness extras | 3,096 checks, 80 suites, all pass | 3,136 checks, 81 suites, all pass (+40 in `v114wg`; every other suite has the same checks) |',
    '| Registered suites only | 2,923 checks, 75 suites, all pass | 2,963 checks, 76 suites, all pass |',
    '| Release check | 155 of 155 (READY_WITH_WARNINGS, the same warnings) | 156 of 156 (READY_WITH_WARNINGS, the same warnings) |',
    '| Co-Pilot runner | 85 of 85 | 85 of 85 |',
    '| Strict TypeScript | 0 errors | 0 errors |',
    '| Suite registry integrity | ok (100 / 75) | ok (101 / 76) |',
    `| Find Anything index | 867 entries | 869 (+ the new switch and its section); ${869 + 1 + cards.length} while the page is on (+ the page and its ${cards.length} cards) |`,
    `| In-game LAB (no static renderer in the page) | 2,995 passed · 14 skipped · 0 failed of 3,009 | ${LAB_AFTER} |`,
    `| Browser (Chromium, 1280×900) | 32 of 32 steps | ${BROWSER_AFTER} |`);

  // ---- §4: the page's id ---------------------------------------------------------------------------------------------------------------
  replaceLine(l => l === '## 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2)', () => '## 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2 + 1 in UX-4)', '§4 heading');
  replaceLine(l => l.startsWith("Rows 1–61 are V10.1's ids"), l => l.replace('27 windows that had none (§5) and Find Anything.', "27 windows that had none (§5) and Find Anything; row 90 is UX-4's What's in the game page."), '§4 intro');
  replaceLine(l => l.startsWith('| 90 | `whats_in_the_game` |'), () => "| 90 | `whats_in_the_game` | What's in the Game | modal | yes | 🧩 What's in the game (main menu, ⋯ More, the full action bar, the Settings group bar, the switch's row) or a Find Anything result, once the page is on (off by default): Settings › Interface & Accessibility › 🧩 What's in the game | 2 after switch (⋯ More › 🧩); 1 on the main menu |  | `showWhatsInTheGame` (tracked while the switch is on) | window | Main menu, ⋯ More, the Settings group bar and Find Anything (UX-6 turns it on by default) | UX-4 (new) · UX-6 |", '§4 row 90');

  // ---- §6: the new section, and the Balance Lab now homes its settings ---------------------------------------------------------------
  replaceLine(l => /^\| \d+ \| `interface\.whatsInTheGame` \|/.test(l), l => l.replace(/\| UX-3 \|$/, '| UX-4 (new) |'), '§6 new section');
  replaceLine(l => /^\| \d+ \| `advancedSystems\.balanceLab` \|/.test(l), l => l.replace('| 0 (a tool panel) |', '| 0 (a tool panel; since UX-4 the home of the 3 Balance Lab settings) |').replace(/\| UX-3 \|$/, '| UX-3 · UX-4 |'), '§6 Balance Lab');

  // ---- §7 ----------------------------------------------------------------------------------------------------------------------------
  const s7a = must(at(l => l.startsWith('## 7. Every setting')), '§7'); const s7b = must(at(l => l.startsWith('## 8. '), s7a), '§8');
  // c[1] key · c[9] V11.0 home · c[10] moves in · c[11] notes
  const editRow = (key, fn) => {
    const i = must(at(l => l.startsWith('| `' + key + '` |'), s7a, s7b), `§7 ${key}`);
    const c = cells(L[i]); fn(c); const next = c.join('|');
    if (next === L[i]) throw new Error(`ux4-overlay: §7 ${key} did not change`);
    L[i] = next;
  };
  const addNote = (c, note) => { const cur = c[11].trim(); c[11] = ` ${cur ? `${cur}; ` : ''}${note} `; };
  replaceLine(l => l.startsWith("Ordered by today's tab and section;"), l => `${l} *card:* names the feature's card on UX-4's What's in the game page as the page names it (the UX-1 working name follows where it differs).`, '§7 intro');

  // The card notes: every card switch has one, naming its card as the page does; nothing else has one.
  let marked = 0;
  for (let i = s7a; i < s7b; i++) {
    if (!L[i].startsWith('| `')) continue;
    const c = cells(L[i]); const key = c[1].trim().replace(/`/g, '');
    const m = c[11].match(/card: ([^;]+?)\s*(?=;|$)/); const card = cardOfKey.get(key);
    if (!m && !card) continue;
    if (!m || !card) throw new Error(`ux4-overlay: §7 ${key}: ${m ? 'a card note but no card in the game' : 'a card in the game but no card note'}`);
    if (m[1] !== card.map) throw new Error(`ux4-overlay: §7 ${key}: card "${m[1]}" here, "${card.map}" in the game`);
    c[11] = c[11].replace(`card: ${m[1]}`, `card: ${card.name}${card.name !== card.map ? ` (UX-1: ${card.map})` : ''}`);
    L[i] = c.join('|'); marked++;
  }
  if (marked !== cardKeys.length) throw new Error(`ux4-overlay: ${marked} card notes in §7, ${cardKeys.length} card switches in the game`);

  editRow('whatsInTheGameEnabled', c => { c[10] = ' UX-4 (new) · UX-6 '; addNote(c, "new in UX-4: What's in the game, a card for every optional feature (off by default until UX-6); the settings search finds it as a field"); });

  // The Balance Lab's home (the user's decision for this package): where its controls are.
  [
    ['balanceLabEnabled', "the Activity Ledger window's Balance Lab tab; with the layers on, a row in the Balance Lab writes through its call"],
    ['balanceLabSandboxMode', "the Activity Ledger window's Balance Lab tab; with the layers on, a row in the Balance Lab writes through its call"],
    ['balanceLabAutoStressTracking', "the Balance Lab panel's own switch"],
  ].forEach(([k, control]) => editRow(k, c => {
    c[9] = ' 🔬 Records & tools › ⚖️ Balance Lab ';
    c[10] = ' UX-3 · UX-4 ';
    addNote(c, `UX-4: homed in the Balance Lab, where its control is (${control}); Strategy Lab Presets has no control for it`);
  }));

  // The labels (label table only: the classic Settings rows keep their titles).
  [
    ['teamBrainTravelDisciplineEnabled', 'label: Travel Discipline (UX-4: its strength, `teamBrainTravelDiscipline`, has a label of its own)'],
    ['teamBrainTravelDiscipline', 'label (UX-4): Travel Discipline Strength, was Travel Discipline like its switch'],
    ['conflictControlEnabled', 'label: Floating UI Conflict Control (UX-4: its options, `conflictControlSettings`, have a label of their own)'],
    ['conflictControlSettings', 'label (UX-4): Floating UI Conflict Control Options, was Floating UI Conflict Control like its switch'],
    ['autoModeEnabled', 'label (UX-4): Auto Mode Master Switch, was its key in words (Auto Mode Enabled)'],
    ['directiveBudgetEnabled', 'label (UX-4): Directive Budget Limit, was its key in words (Directive Budget Enabled)'],
  ].forEach(([k, note]) => editRow(k, c => addNote(c, note)));

  // ---- §12.6: the label twins ---------------------------------------------------------------------------------------------------------
  const t6 = must(at(l => l === '### 12.6 Confusing twins'), '§12.6');
  let t6end = must(at(l => l.startsWith('## 13.'), t6), '§13'); while (L[t6end - 1] === '') t6end--;
  L.splice(t6end, 0, '- **Travel Discipline** and **Floating UI Conflict Control** each named a switch and its companion (the strength; the options object). *UX-4: the companions are Travel Discipline Strength and Floating UI Conflict Control Options in the shared label table, which the layered rows, the read-only list, Find Anything and the cards use; the classic Settings rows keep their titles.*');

  // ---- §14 and §15 ----------------------------------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith("| UX-4 What's in the game |"), l => l.replace("| UX-4 What's in the game | ", "| UX-4 What's in the game | **Done** (§18). Planned: "), '§14 UX-4');
  L.splice(must(at(l => l.startsWith('- UX-1 did not modify the game file')), '§15 last bullet') + 1, 0,
    "- UX-4's rebuild reads `data/registries-ux4.json` (`extract.mjs` on the file after UX-4; it now also lists the 101 cards with the names the page shows). `check-map.mjs` checks §4's plan columns and every *card:* note in §7 against the running module, and `check-homes.mjs` checks the V11.0 home column.");

  // ---- §18 -------------------------------------------------------------------------------------------------------------------------------
  const w = s => L.push(s);
  w('');
  w("## 18. UX-4: What's in the game — what changed");
  w('');
  w("All new code is in SECTION 20BP (the page, its cards, its switch and its ways in) and SECTION 20BQ (the Balance Lab's home and suite `v114wg`), between SECTION 20BO and SECTION 21. Every in-place edit elsewhere is marked `// V11.0 (SECTION 20BP): …` or `(SECTION 20BQ)`: 49 marked lines covering the switch's registration, the window's id and table entry, the Find Anything kind and search, the entry buttons, the label table's first lookup, the Balance Lab's home, and the counts that older suites pin.");
  w('');
  w('| Area | What changed | Off (default) |');
  w('|---|---|---|');
  [
    ['Switch', "`whatsInTheGameEnabled` (boolean, false, profile, remembered between visits, never in a save) in Settings › Interface & Accessibility › 🧩 What's in the game, with an *Open* button once it is on; in the Co-Pilot catalog; found by the settings search.", 'off'],
    ['The page', "A window with its own id, `whats_in_the_game` (tier 6 like Settings, drawn one step above it and below decisions). The surface manager tracks `showWhatsInTheGame` only while the switch is on, and Escape closes the page. It is a labelled dialog: a heading, the All / On / Off filter (a radio group), the count of features on among the cards shown (\"16 of 77 features are on\" in a fresh solo match, where the Teams gate holds 24 back; \"… of 101\" once it opens), then the cards under the five goal groups in Settings' order.", '—'],
    ['Cards', `${cards.length} over ${cardKeys.length} switch keys: §7's *card:* marks, in the map's order; the 13 national cards are built from \`EXPERIENCE_SYSTEM_REGISTRY\`. Each card shows its name (a one-switch card takes its switch's label; a two-switch card takes a feature name from the same table), one plain sentence, On / Off / *On · not active yet*, its switches, its needs, ⚙️ Settings (its home) and, while it is on, *Open …* its window (${windows} cards).`, '—'],
    ['Switches', "Each writes through its Settings control's own call: the section's tracked call with that section's title, the labelled `updateGameSetting` call, or the panel's handler. Team Brain moves to the mode its toggle moves to, Persistent AI memory runs its own toggle (consent and storage), and Auto Mode drives the master toggle Settings shows. Switches that Settings moves together move together (Crises with Crisis chains, Campaign Mode with Campaign chapters), and with the layers on, Autosave & Resume and the leave-site warning write through Essentials. The 3 switches no control changes are shown read-only with their value: the infrastructure master switch and Expedition Mode, which only presets set, and the Overseer dashboard, which only a reset sets. No default changes.", '—'],
    ['Needs', "A parent switch (the map's \"shown when … on\"): the card's switch waits for it, greyed out, its tooltip and `aria-describedby` pointing at that need, which the card lists once. The experience: the national switches wait for Nation or Full, and the 12 sub-systems also for National Systems. In a match, a rival, Team Mode or a V10.1 match; on the main menu these are described, not checked. Bank loans open to you, and the Guardian switched on. Secret objectives & Final Stretch, Daily Challenge (fixed rules) and Classic rules (V10.0) say they apply when a match starts, and a rule a running match locks says the change waits for the next match.", '—'],
    ['Groups and the gate', `The five goal groups (${Object.keys(GROUP).map(g => `${GROUP[g].split(' ')[0]} ${cardsIn(g)}`).join(' · ')}). Team cards follow the Teams gate of the layered Settings: until a Team Mode match runs or Competitive AI is on, 24 wait (the page says how many), while Competitive AI, Auto Mode and Human automation show. There is no *Show inactive* (the user's decision), because none of the ${cardKeys.length} switches is a setting with no effect.`, '—'],
    ['Ways in', "🧩 *What's in the game* on the main menu (after 🔎 Find), in ⋯ More (before Leave) and the full action bar (after Settings), on the Settings group bar (layers on), on the switch's own row (*Open*), and in Find Anything.", "the switch's row only"],
    ['Find Anything', `A new result kind, *Feature* (ranked between the Essentials and the shortcuts). While the page is on, the index gains the page and its ${cards.length} cards (869 → ${869 + 1 + cards.length}; 869 = UX-3's 867 + the new switch and its section). A card result opens the page at that card, whatever the filter. "features" and "what's in the game" put the page first, and while it is off, its switch. A question-shaped "what's in the game?" no longer puts Ask first; Ask stays in the list, and other questions are unchanged.`, 'the very same index; the two phrases find the switch'],
    ['Labels', 'Two pairs of twins split, two key-titled settings named, the new switch labelled and 8 feature names added (below). Label table only.', 'the label table is read by Find Anything and the layered Settings, both off by default; the classic rows keep their titles'],
    ['Balance Lab', "The three Balance Lab settings' home (below).", 'the classic Settings is unchanged; Find Anything (off by default) opens the Balance Lab section'],
    ['Self-tests', `Suite \`v114wg\` (40 checks). It covers the switch's default, scope and registration, and that off changes nothing (the same index, table and state objects). It checks that the ${cards.length} cards cover the map, the national cards come from the registry, names come from the label table, and each card has one sentence, a home and a goal group. It reads every write path from the game's own source (108 of ${cardKeys.length}; Auto Mode has a check of its own) and covers flips, pairs, Essentials, Auto Mode, Team Brain, persistent memory and the read-only switches. It covers parent, experience and match needs, the next match and locks, no default changes, the groups, the filter and count, the Teams gate, no *Show inactive*, links to homes and windows, and the ways in. For Find Anything: results, phrases and card routes. Then the window id and the manager, the dialog's semantics, the map walk (every id of §4–§10 still there and reachable), the labels and the Balance Lab's home. Last: no clock and no random draw, rules stamp 1010, real V9.7, V9.8 and V10.0 saves move for move with all three V11.0 switches on, the status words and the switch's row.`, '—'],
  ].forEach(r => w(`| ${r[0]} | ${r[1]} | ${r[2]} |`));
  w('');
  w(`**The ${cards.length} cards** as the page names and files them. *UX-1* is the working name §7 used before UX-4, shown where it differs (${renamed} cards). *Window* is what the card opens while the feature is on.`);
  w('');
  w('| # | Card | UX-1 | Switch keys | Group | Window |');
  w('|---|---|---|---|---|---|');
  cards.forEach((c, i) => w(`| ${i + 1} | ${c.name} | ${c.name !== c.map ? c.map : ''} | ${c.keys.map(code).join(', ')} | ${GROUP[c.group]} | ${c.window || '—'} |`));
  w('');
  w('**Labels** (the shared label table, `v113SettingLabel`, which UX-4\'s entries now head). No two of the 602 settings share a label (`v114wg_34`).');
  w('');
  w('| Key | After UX-3 | After UX-4 |');
  w('|---|---|---|');
  [
    ['teamBrainTravelDisciplineEnabled', 'Travel Discipline', 'Travel Discipline (kept)'],
    ['teamBrainTravelDiscipline', 'Travel Discipline', 'Travel Discipline Strength'],
    ['conflictControlEnabled', 'Floating UI Conflict Control', 'Floating UI Conflict Control (kept)'],
    ['conflictControlSettings', 'Floating UI Conflict Control', 'Floating UI Conflict Control Options'],
    ['autoModeEnabled', 'Auto Mode Enabled', 'Auto Mode Master Switch'],
    ['directiveBudgetEnabled', 'Directive Budget Enabled', 'Directive Budget Limit'],
    ['whatsInTheGameEnabled', '— (new)', "What's in the game"],
  ].forEach(r => w(`| ${code(r[0])} | ${r[1]} | ${r[2]} |`));
  w(`| ${code('feature:<card>')} (${twoSwitch.length}, the two-switch cards) | — | ${twoSwitch.map(c => c.name).join(' · ')} |`);
  w('');
  w("**The Balance Lab's home.** `balanceLabEnabled`, `balanceLabSandboxMode` and `balanceLabAutoStressTracking` were homed in 🤖 Your rival › Strategy Lab Presets (where the hub index files them), which draws no control for any of them. Their controls are the Activity Ledger window's Balance Lab tab and, for Auto-Stress Tracking, the Balance Lab panel in Replay & Diagnostics. UX-4 homes all three in 🔬 Records & tools › ⚖️ Balance Lab. With the layered Settings on, two rows there write through the window's own calls (`updateGameSetting` with its labels and section); Find Anything opens that section in the classic Settings too. Your rival goes from 104 to 101 settings and Records & tools from 62 to 65 (the new switch takes Help, screen & sound from 63 to 64).");
  w('');
  w('**Where the brief, the map and the file disagreed (and what UX-4 did).**');
  w('');
  w('- *Show inactive on the page*: none of the 109 card switches is one of the 20 settings with no effect, so a toggle would hide nothing. The page has none (the user\'s decision); the 20 stay behind *Show inactive* in the layered Settings and in Find Anything.');
  w(`- *Card names*: the map's card names were UX-1 working names, not labels from the table. The page names a one-switch card by its switch's label and gives the ${twoSwitch.length} two-switch cards a feature name in the same table (the user's decision); ${renamed} of the ${cards.length} differ, and §7's notes now carry the page's name.`);
  w('- *The Balance Lab*: the map and UX-3 homed its three settings in a section with no control for them. UX-4 homes them where their controls are (the user\'s decision).');
  w('- *The twins*: label table only (the user\'s decision). Classic Settings still titles both rows "Travel Discipline" and both "Floating UI Conflict Control".');
  w('- *Auto Mode*: the map files the card under the top-level `autoModeEnabled`, but the toggle Settings shows and the Auto Mode panels read `autoModeSettings.autoModeEnabled` (with `.enabled`). The card drives and reads that toggle, as Settings does, and leaves the top-level key as it was (only the old Auto Mode boundaries code writes it).');
  w('- *"Next match"*: UX-1\'s working notes (`plan.cjs`) say 22 card features take effect at the next match. The code reads 20 of them as the settings stand: the 13 national systems through `isSystemVisible` every turn, the classic rival through `v100RivalPolicyActive`, and the rival\'s personality, the challenge board, the challenge approaches, the dynamic situations and the races where they are used. The secret objectives are dealt when a match starts, and Classic rules (V10.0) stamps a new match; those two cards, and Daily Challenge (fixed rules), say they apply when a match starts.');
  w('- *Corrected*: §7 said the settings search cannot find `settingsLayersEnabled`. That came from search data older than the key; the search finds it as a field. The builder now marks only keys the search run covered.');
  w('');
  w('**Deferred (not this package):** docked panels (UX-5); turning the page, the layers and Find Anything on by default, and the classic switch (UX-6). The classic Settings rows keep the twin titles. In the classic Settings the Balance Lab section still draws only Auto-Stress Tracking; its other two switches stay in the Activity Ledger window, on the card and, with the layers on, as rows in the section. The top-level `autoModeEnabled` key keeps its row and its one writer.');
};
