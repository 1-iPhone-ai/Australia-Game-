// UX-5 overlay for the map: what package UX-5 (the docked side panel) changed, applied on top of the UX-1 to UX-4 map.
// The "today" columns keep describing V10.1 (the UX-1 audit). The side panel's facts (its id, tabs, windows, the narrow-screen threshold and
// the plan lists suite v115dp walks) are read from the module by extract.mjs (reg.dock); check-map.mjs checks §4 against them.
module.exports = (L, ctx) => {
  const { reg } = ctx;
  const dock = reg.dock;
  if (!dock || !Array.isArray(dock.tabs) || dock.tabs.length !== 5 || dock.windows.length !== 6) throw new Error('ux5-overlay: the registries have no side panel (reg.dock): run extract.mjs on the file after UX-5');
  const at = (pred, from = 0, to = L.length) => { for (let i = from; i < to; i++) if (pred(L[i])) return i; return -1; };
  const must = (i, what) => { if (i < 0) throw new Error(`ux5-overlay: ${what} not found`); return i; };
  // Every replacement must change its line: a pattern that no longer matches fails the build instead of leaving stale text.
  const replaceLine = (pred, fn, what) => { const i = must(at(pred), what); const next = fn(L[i]); if (next === L[i]) throw new Error(`ux5-overlay: ${what} did not change`); L[i] = next; };
  const cells = l => l.split(/(?<!\\)\|/);
  const code = s => '`' + s + '`';
  const tabName = t => `${t.icon} ${t.label}`;
  const tabsText = dock.tabs.map(t => (t.id === 'market' ? `${tabName(t)} (💰 Sell and 🛍️ Buy inside)` : tabName(t))).join(', ');
  const winOf = id => dock.windows.find(w => w.surfaceId === id);
  const tabOfWin = w => dock.tabs.find(t => t.id === w.tab);

  // Measured after UX-5 (§2): the runners, the in-game LAB and the browser walk.
  const LAB_AFTER = '3,074 passed · 15 skipped · 0 failed of 3,089 (+39 passed and 1 skipped in `v115dp`: its rendered-markup check, which needs the test runners\' static renderer; the same console messages as UX-4)';
  const BROWSER_AFTER = '100 scripted steps, 99 passed and 1 skipped (a button the game state did not offer), no page errors. *Off*: in the same seeded match the six windows draw byte-identical DOM to UX-4 and behave the same (dialog, focus in, Tab trap, Escape, focus back). *On, 1280×900, solo*: every way in opens its tab (the action bar, the quick bar, C T R M W, the Market tab\'s remembered half, arrow keys, the Sell Market\'s and the Workshop\'s own links, 🧠 INTELLIGENCE and Ask answers\' buttons, Find Anything, What\'s in the game\'s cards); the header End Turn, the map and its toggle stay usable; the approach picker, Travel\'s confirmation and the End Turn question open over the panel and Escape closes them first; Tab leaves the panel (no trap); the rescue closes it; End Turn with the panel open; narrower than 1024 px the tab becomes its window and back; the switch\'s row. *Phone (390 px)* and *1280*, each in a solo and a Team Mode match: up to 16 ways in each (the keys, the quick bar, the action bar, Find Anything, What\'s in the game, 🧠 INTELLIGENCE) open windows on the phone and tabs at 1280 (60 steps). *Team Mode at 1280*: the ally and the rivals play with the panel open and its tabs come back on the player\'s turn. *The guided first match*: Travel, Challenges and Sell open; Buy, Workshop and Investments wait, dimmed, with the keys\' own words. Also the Light theme and the End Turn chip beside the panel.';

  // ---- Title and the status block ----------------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('# V11.0 UX Map'), () => "# V11.0 UX Map — packages UX-1 (audit), UX-2 (Find Anything), UX-3 (Settings layers), UX-4 (What's in the game) and UX-5 (Docked panel)", 'title');
  const s4 = must(at(l => l === '## Status after UX-4'), 'status after UX-4');
  L.splice(s4, 0,
    '## Status after UX-5',
    '',
    `- **Docked side panel** (off by default, ${code('dockedPanelEnabled')}, profile setting, in Settings › Interface & Accessibility › 📑 Side panel). Off, every window opens exactly as UX-4 delivered it (checked in Chromium: in the same seeded match the six windows draw byte-identical DOM and behave the same). On, in a match, on a screen at least ${dock.minWidth} px wide:`,
    `  - **one side panel beside the map** with an id of its own (${code(dock.surfaceId)}: a side panel the surface manager tracks and never counts as blocking) and five tabs: ${tabsText}. The page is padded so the panel sits beside the map instead of over it; the header, the map and End Turn stay usable.`,
    '  - **each tab draws its window\'s own content with its own handlers**: the window\'s element is built exactly as before and only drawn in the panel instead of over the page (`v115Dock.slot`); nothing is forked.',
    '  - **every way in opens the matching tab**: the buttons, C / T / R / M / W (R and M the two halves of Market), Find Anything, What\'s in the game\'s cards, 🧠 INTELLIGENCE, Ask answers and Co-Pilot "Open …" buttons, the guided first match\'s buttons and the windows\' own links. One tab at a time; the tab and Market\'s half are remembered for the session (interface state: a save never carries it).',
    '  - **not a dialog**: a labelled region with a tab list (← → Home End), focus in on open and back to the opener on close, no focus trap. C T R M W, G and Space work while it is open; Escape and the rescue close it; every window and decision (the 12 of V10.1 and the 5 UX-2 registered) opens over it; the End Turn chip and the toasts on the right move to its left.',
    `  - **narrower than ${dock.minWidth} px**, or outside a match, the six open as windows, as before.`,
    '- **The release check reports a row that could not run as skipped** (never a pass, never a failure): the panel\'s rendered-markup check needs the test runners\' static renderer, which the in-game LAB does not have.',
    '- **Self-tests:** 3,176 checks in 82 suites pass (3,136 in 81 before; +40 in `v115dp`), release check 157 of 157, Co-Pilot 85 of 85, strict TypeScript 0 errors. The rules stamp stays 1010, and old saves play move for move with all four V11.0 switches on.',
    '');

  // ---- Contents --------------------------------------------------------------------------------------------------------------------
  L.splice(must(at(l => l === '- Status after UX-4'), 'contents'), 0, '- Status after UX-5');
  L.splice(must(at(l => l === "- 18. UX-4: What's in the game — what changed"), 'contents 18') + 1, 0, '- 19. UX-5: Docked panel — what changed');
  replaceLine(l => l === '- 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2 + 1 in UX-4)', l => l.replace('+ 1 in UX-4)', '+ 1 in UX-4 + 1 in UX-5)'), 'contents 4');

  // ---- §2: after UX-5 --------------------------------------------------------------------------------------------------------------
  const b4 = must(at(l => l.startsWith('| Browser (Chromium, 1280×900) | 32 of 32 steps |')), '§2 UX-4 browser row');
  L.splice(b4 + 1, 0, '',
    '**After UX-5** (the same runners on the changed file; the UX-4 numbers may not drop):',
    '',
    '| Runner | After UX-4 | After UX-5 |',
    '|---|---|---|',
    `| Registry surfaces / settings / indexed sections | 90 / 602 / 89 | ${reg.surfaces.length} / ${reg.defaults.length} / ${reg.sections.length} |`,
    '| Registered + harness extras | 3,136 checks, 81 suites, all pass | 3,176 checks, 82 suites, all pass (+40 in `v115dp`; every other suite has the same checks) |',
    '| Registered suites only | 2,963 checks, 76 suites, all pass | 3,003 checks, 77 suites, all pass |',
    '| Release check | 156 of 156 (READY_WITH_WARNINGS, the same warnings) | 157 of 157 (READY_WITH_WARNINGS, the same warnings: K01–K03); without a static renderer too, with the panel suite\'s one skipped row reported as skipped |',
    '| Co-Pilot runner | 85 of 85 | 85 of 85 |',
    '| Strict TypeScript | 0 errors | 0 errors |',
    '| Suite registry integrity | ok (101 / 76) | ok (102 / 77) |',
    '| Find Anything index | 869 entries; 971 while What\'s in the game is on | 871 (+ the new switch and its section); 872 while the side panel is on (+ the panel); 974 with both on |',
    `| In-game LAB (no static renderer in the page) | 3,035 passed · 14 skipped · 0 failed of 3,049 | ${LAB_AFTER} |`,
    `| Browser (Chromium; Tailwind 3.4.17 built locally) | 34 of 34 steps | ${BROWSER_AFTER} |`);

  // ---- §4: the panel's id and the six windows -----------------------------------------------------------------------------------------
  replaceLine(l => l === '## 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2 + 1 in UX-4)', () => '## 4. Surfaces: the registry (61 V10.1 ids + 28 added in UX-2 + 1 in UX-4 + 1 in UX-5)', '§4 heading');
  replaceLine(l => l.startsWith("Rows 1–61 are V10.1's ids"), l => l.replace("row 90 is UX-4's What's in the game page.", "row 90 is UX-4's What's in the game page; row 91 is UX-5's side panel."), '§4 intro');
  const flags = dock.windows.map(w => code(w.flag)).join(' ');
  replaceLine(l => l.startsWith('| 91 | `docked_panel` |'), () => `| 91 | ${code(dock.surfaceId)} | Side Panel (Market, Challenges, Travel, Workshop, Investments) | panel | no | Once the side panel is on (off by default: Settings › Interface & Accessibility › 📑 Side panel), in a match on a screen at least ${dock.minWidth} px wide, every way in to its six windows opens it at their tab: the buttons, C T R M W, Find Anything (also its own "Side panel" result), What's in the game, 🧠 INTELLIGENCE and Co-Pilot "Open …" buttons | 1 after switch | C / T / R / M / W (while docked) | ${flags} (while docked; the six windows' ids keep their alias flags) | panel | Beside the map: five tabs (UX-6 turns it on by default) | UX-5 (new) · UX-6 |`, '§4 row 91');
  const s4a = must(at(l => l.startsWith('## 4. Surfaces')), '§4'); const s4b = must(at(l => l.startsWith('## 5. '), s4a), '§5');
  dock.windows.forEach(w => {
    const i = must(at(l => l.includes(`| ${code(w.surfaceId)} |`) && /^\| \d+ \|/.test(l), s4a, s4b), `§4 ${w.surfaceId}`);
    const c = cells(L[i]); const t = tabOfWin(w);
    c[11] = ` Side panel tab ${tabName(t)}${w.side ? ` › ${w.side === 'sell' ? '💰 Sell' : '🛍️ Buy'}` : ''} (switch on, ${dock.minWidth} px and wider); a window, as before, narrower or with the switch off `;
    c[12] = ` ${c[12].trim().replace(/^UX-5\b/, 'UX-5 (done)')} `;
    const next = c.join('|'); if (next === L[i]) throw new Error(`ux5-overlay: §4 ${w.surfaceId} did not change`); L[i] = next;
  });

  // ---- §6: the new section ---------------------------------------------------------------------------------------------------------
  replaceLine(l => /^\| \d+ \| `interface\.dockedPanel` \|/.test(l), l => l.replace(/\| UX-3 \|$/, '| UX-5 (new) |'), '§6 new section');

  // ---- §7: the new switch ----------------------------------------------------------------------------------------------------------
  const s7a = must(at(l => l.startsWith('## 7. Every setting')), '§7'); const s7b = must(at(l => l.startsWith('## 8. '), s7a), '§8');
  const r7 = must(at(l => l.startsWith('| `dockedPanelEnabled` |'), s7a, s7b), '§7 dockedPanelEnabled');
  { const c = cells(L[r7]); c[10] = ' UX-5 (new) · UX-6 '; const cur = c[11].trim(); c[11] = ` ${cur ? `${cur}; ` : ''}new in UX-5: the side panel, the six action windows of the map's "dock" plan as tabs beside the map (off by default until UX-6); the settings search finds it as a field `; L[r7] = c.join('|'); }

  // ---- §10: the keys -------------------------------------------------------------------------------------------------------------------
  const s10a = must(at(l => l.startsWith('## 10. Keyboard shortcuts')), '§10'); const s10b = must(at(l => l.startsWith('## 11.'), s10a), '§11');
  const keyRow = (prefix, fn, what) => { const i = must(at(l => l.startsWith(prefix), s10a, s10b), what); const c = cells(L[i]); fn(c); const next = c.join('|'); if (next === L[i]) throw new Error(`ux5-overlay: ${what} did not change`); L[i] = next; };
  keyRow('| C / T / R / M / W |', c => { c[5] = ` keep; done in UX-5: with the side panel on (${dock.minWidth} px and wider) they open its tabs, R and M the two halves of Market, and they work while it is open; narrower, the windows as before `; }, '§10 C T R M W');
  keyRow('| Escape |', c => { c[5] = ` ${c[5].trim()}; it closes the side panel too, after any window or decision open over it (UX-5) `; }, '§10 Escape');
  keyRow('| Shift+Escape', c => { c[5] = ` ${c[5].trim()}; the rescue closes the side panel (UX-5) `; }, '§10 rescue');
  keyRow('| ← → Home End | Move between PLAY', c => { c[5] = ` ${c[5].trim()}; the same keys move between the side panel's tabs while one has focus (UX-5) `; }, '§10 arrows');
  keyRow('| Tab / Shift+Tab |', c => { c[5] = ` ${c[5].trim()}; the side panel is not a dialog: no trap (UX-5) `; }, '§10 Tab');

  // ---- §12.6 and §13 -------------------------------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('- **Market** (sell, R) and **Resource Market** (buy, M) are two windows with near-identical names.'), l => `${l} *UX-5: with the side panel on they are the two halves of one 💰 Market tab (💰 Sell, 🛍️ Buy).*`, '§12.6 Market twins');
  const s13a = must(at(l => l.startsWith('## 13.')), '§13'); const s13b = must(at(l => l.startsWith('## 14.'), s13a), '§14');
  const qRow = (q, add) => { const i = must(at(l => l.startsWith(`| ${q} |`), s13a, s13b), `§13 ${q}`); const c = cells(L[i]); c[4] = ` ${c[4].trim()} ${add} `; L[i] = c.join('|'); };
  qRow('Q2', 'Done in UX-5 (§19).');
  qRow('Q3', 'Done in UX-5 (§19): the five tabs; the six action windows, Loans and the 24 tool windows unchanged.');

  // ---- §14 and §15 ---------------------------------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('| UX-5 Docked panels |'), l => l.replace('| UX-5 Docked panels | ', '| UX-5 Docked panels | **Done** (§19). Planned: '), '§14 UX-5');
  L.splice(must(at(l => l.startsWith("- UX-4's rebuild reads `data/registries-ux4.json`")), '§15 UX-4 bullet') + 1, 0,
    "- UX-5's rebuild reads `data/registries-ux5.json` (`extract.mjs` on the file after UX-5; it now also lists the side panel's tabs, windows and threshold, and the map's plan lists suite `v115dp` walks). `check-map.mjs` also checks §4's side panel row, the six windows' homes and the plan column against them.");

  // ---- §19 -------------------------------------------------------------------------------------------------------------------------------
  const w = s => L.push(s);
  w('');
  w('## 19. UX-5: Docked panel — what changed');
  w('');
  w("All new code is in SECTION 20BR (the panel: its switch, its id, the tabs, the one-tab rule, the view and the hook) and SECTION 20BS (the map walk and suite `v115dp`), between SECTION 20BQ and SECTION 21. Every in-place edit elsewhere is marked `// V11.0 (SECTION 20BR): …` or `(SECTION 20BS)`: 55 marked places (105 lines, 38 of them changing a line that was there) covering the switch's registration, the panel's id and its row in the surface manager's table, the one line in `updateUiState`, the keys, Escape and the rescue, the six windows' slots, the page's padding and the panel itself, the switch's row, Find Anything's result and phrase, the release check's skipped rows, and the counts older suites pin.");
  w('');
  w('| Area | What changed | Off (default) |');
  w('|---|---|---|');
  [
    ['Switch', "`dockedPanelEnabled` (boolean, false, profile, remembered between visits, never in a save) in Settings › Interface & Accessibility › 📑 Side panel; in the Co-Pilot catalog; found by the settings search; homed in 🧭 Help, screen & sound with the other V11.0 switches.", 'off'],
    ['The panel', `A side panel with an id of its own, ${code(dock.surfaceId)} (tier 5, the side-drawer zone, never blocking, no backdrop; Escape closes it), fixed at the right edge, ${code(dock.width)} wide, drawn at z ${dock.z}: under every window and decision (their overlays start at z 50) and over the page. The play screen is padded by the panel's width while it is open, so it sits beside the map. A slim header (*Side panel* and ✕) and five tabs: ${tabsText}. Market shows its two halves as a second tab list.`, 'not drawn; no padding, no style element'],
    ['One logic', "A tab draws its window's own content: each of the six windows' elements is built exactly as before and handed to `v115Dock.slot`, which gives it back untouched unless the panel is docked; docked, the window's header, body and footer (the very same elements, with the very same handlers) are drawn in the tab panel and the backdrop and the dialog box (`role=\"dialog\"`, `aria-modal`, the focus trap) are left out.", 'the very same element'],
    ['One tab at a time', "Every way in sets the window's own flag through `updateUiState`, which hands each update to `v115DockNormalize`: docked, the window just opened stays open and the others close; its tab and Market's half are remembered in the interface state (`v115DockTab`, `v115DockSide`) for the session. A save carries only the theme from the interface state, so it never carries the panel.", 'the very same state object'],
    ['Tabs follow the buttons', "A tab can open exactly when its window's button could: on the player's turn, what the guided first match has unlocked (the same words as the refused key), and Investments while regional investments are on (otherwise dimmed, saying where its switch is). A dimmed tab is focusable, says why (tooltip and `aria-describedby`) and shows the reason when pressed.", '—'],
    ['Keys', 'Docked, the six windows are not modals, so they hold no key back: C T R M W open their tabs (a window\'s own key still closes it), G toggles the map, Space ends the turn. Behind a real window or decision only Escape acts, as before. ← → Home End move between tabs (automatic activation; ↑ ↓ stay the page\'s).', "V10.1's key rules"],
    ['Focus', 'A labelled region (`role="region"`, "Side panel") with a tab list, not a dialog: focus moves to the selected tab when the panel opens and when its tab changes from outside, follows the selection from a tab, stays where the player works in the content, never leaves a window or decision open over the panel, and goes back to the opener when the panel closes. Tab moves on out of the panel (no trap).', '—'],
    ['Escape, the rescue, decisions', 'The surface manager tracks the panel as its open side panel, so Escape closes it after any window or decision open over it; while docked, the challenge approach picker (a z-50 popup that V10.1 drew under the Challenges window) opens over the panel and Escape closes it first. Rescue the screen also lowers Investments\' flag while docked (V10.1\'s rescue leaves it up).', "V10.1's Escape order and rescue"],
    ['Narrow screens', `Narrower than ${dock.minWidth} px (a \`matchMedia\` listener, only while the switch is on), or outside a match, the six open as windows, as before; an open tab becomes its window when the screen narrows, and the panel again when it widens. The panel's own Find Anything result then opens the window last open.`, '—'],
    ['Find Anything', 'While the switch is on the panel is a result of its own ("Side panel", 871 → 872 entries); "side panel", "docked panel" and "sidebar" put it first, and while the switch is off its switch. The six windows\' results open their tabs through their own routes.', 'the very same index'],
    ['Release check', "A row that could not run (`skipped: true`) is reported as skipped by the release check too: the suite's detail says \"(N skipped)\", the row is neither a pass nor a failure, and a suite where nothing ran does not pass. (V10.1's rendered-markup rows keep their raw pass with a SKIPPED: note, as the LAB shows them.)", 'no suite reports a skipped row in the runners'],
    ['Self-tests', "Suite `v115dp` (40 checks): the switch's default, scope and registration; off and narrow change nothing (the same objects, the very same element); the five tabs over the six windows, which keep their ids; the panel's id and its row in the table; a side panel in the manager, nothing blocking; one tab at a time; every opener, Find Anything's results and the five cards that open one of the six; one way through `updateUiState` (read from the source); the keys; R and M; the guided first match; Investments and the turn; the region, the tab lists, arrow keys, focus and no trap; the same content and handlers; Escape, the approach picker and the rescue; decisions and windows on top; nothing blocked; narrow screens; the session memory and no save; Find Anything's result; the switch's row; the map walk; labels; no clock and no random draw; rules stamp 1010 and old saves move for move; the rendered markup; Team Mode; the release check's skipped rows.", '—'],
  ].forEach(r => w(`| ${r[0]} | ${r[1]} | ${r[2]} |`));
  w('');
  w('**Every way in, docked** (each was a window in V10.1 and still is with the switch off or on a narrow screen):');
  w('');
  w('| Way in | Opens |');
  w('|---|---|');
  [
    ['Action bar and full action bar: 🎯 Challenges, ✈️ Travel, 💰 Market, 🛍️ Resource Market, 🔨 Workshop, 🏦 Investments', 'their tabs (Market › Sell, Market › Buy)'],
    ['Quick bar: 🎯 Challenges, 🗺️ Explore, 💰 Sell Resources, 🛍️ Resource Market, 🏦 Investments', 'their tabs'],
    ['Keys C, T, R, M, W', 'Challenges, Travel, Market › Sell, Market › Buy, Workshop'],
    ['Find Anything: the six windows\' results; "Side panel"', 'their tabs; the tab last open'],
    ["What's in the game: Challenge approaches, More challenges, Procedural Challenges, Bigger wagers (Open Challenges); Regional investments (Open Investments)", 'Challenges; Investments'],
    ['🧠 INTELLIGENCE, the win-race chip, Why?, Ask answers and Co-Pilot "Open …" buttons (`openIntentNav`)', 'the tab they name'],
    ['The guided first match: its buttons for what it has unlocked', 'their tabs; the rest wait, dimmed'],
    ["The windows' own links: the Sell Market's Workshop buttons, the Workshop's Open Market, the map's region preview Travel", 'Workshop; Market › Buy; Travel'],
    ['Ask deep links, the character abilities (Market Insight, Scout Ahead)', 'Market › Buy, Workshop, Travel; Market › Sell, Travel'],
  ].forEach(r => w(`| ${r[0]} | ${r[1]} |`));
  w('');
  w('**Where the brief, the map and the file disagreed (and what UX-5 did).**');
  w('');
  w(`- *"The 12 blocking decisions"*: the 12 are V10.1's ids the map marks *decision*; UX-2 registered 5 more (Co-Pilot proposal, Leave match, confirmations, load preview, diplomatic breach). All ${dock.decisions.length} open over the panel (\`v115dp_27\` walks them with the ${dock.actionWindows.length - 1} action windows, Loans and the ${dock.toolWindows.length} tool windows, which stay as they were). Five of the 12 never open in V10.1 (§11.1).`);
  w('- *Five tabs, one of them off by default*: Investments is a tab of its own, dimmed while regional investments are off, saying where to turn them on. It never opens the Investments window while they are off.');
  w('- *Co-Pilot "Do It"*: a card\'s Do It carries out its action by hand (travel, a sale, a purchase) and opens no window; its navigation buttons ("Open Market" and the like) and the Intelligence and Ask buttons do, through `openIntentNav`, and those open the tabs. *The guided first match* opens no window itself: it decides which buttons (and so which tabs) it shows.');
  w("- *The approach picker*: in V10.1 it opens under the Challenges window (z 50 under z 500) and Escape closes the window instead. Docked it opens over the panel and Escape closes it first; as windows, V10.1's order is kept.");
  w("- *The rescue*: V10.1's rescue lowers five of the six flags but not Investments'; docked, the rescue lowers all six, so it always closes the panel. Off, the rescue is V10.1's.");
  w('- *The release check and skipped rows*: it counted a skipped row (`passed: false, skipped: true`) as a failure, so a check that cannot run in the LAB (no static renderer) would have failed the suite; it now reports it as skipped.');
  w('');
  w("**Deferred (not this package):** the six action windows (Negotiations, Contracts, Infrastructure, Expeditions, Shop, Sabotage) and Loans as extra tabs, and the 24 tool windows (Q3: a later round). The optional floating widgets (off by default) keep their own positions and may sit over the panel's lower corner; the classic layout's floating quick bar is centred on the window, not on the page beside the panel. The remembered tab lasts while the page is open (not across a reload). With the switch off, Escape with the approach picker open keeps V10.1's order. UX-6 turns the panel on by default and adds the classic switch.");
};
