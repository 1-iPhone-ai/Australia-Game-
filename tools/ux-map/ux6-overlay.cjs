// UX-6 overlay for the map: what package UX-6 (the switch-over) changed, applied on top of the UX-1 to UX-5 map.
// The "today" columns keep describing V10.1 (the UX-1 audit). The switch-over's facts (the four defaults, the classic switch, its section,
// home and label) are read from the module by extract.mjs (reg.switchOver); the browser results from data/browser/ux6-hardening.json.
const fs = require('fs');
const path = require('path');
module.exports = (L, ctx) => {
  const { reg } = ctx;
  const so = reg.switchOver;
  if (!so || !Array.isArray(so.layoutKeys) || so.layoutKeys.length !== 4) throw new Error('ux6-overlay: the registries have no switch-over (reg.switchOver): run extract.mjs on the file after UX-6');
  if (!so.layoutKeys.every(k => so.layoutDefaults[k] === true) || so.classicDefault !== false) throw new Error('ux6-overlay: the registries do not have the four switches on and the classic switch off by default');
  const H = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'browser', 'ux6-hardening.json'), 'utf8'));
  const at = (pred, from = 0, to = L.length) => { for (let i = from; i < to; i++) if (pred(L[i])) return i; return -1; };
  const must = (i, what) => { if (i < 0) throw new Error(`ux6-overlay: ${what} not found`); return i; };
  // Every replacement must change its line: a pattern that no longer matches fails the build instead of leaving stale text.
  const replaceLine = (pred, fn, what) => { const i = must(at(pred), what); const next = fn(L[i]); if (next === L[i]) throw new Error(`ux6-overlay: ${what} did not change`); L[i] = next; };
  const cells = l => l.split(/(?<!\\)\|/);
  const code = s => '`' + s + '`';
  const KEY = so.classicKey;
  const LABEL = so.label;

  // ---- Title, §0 intro and the status block -----------------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('# V11.0 UX Map'), () => "# V11.0 UX Map — packages UX-1 (audit), UX-2 (Find Anything), UX-3 (Settings layers), UX-4 (What's in the game), UX-5 (Docked panel) and UX-6 (Switch-over)", 'title');
  replaceLine(l => l.startsWith('**UX-1** audited'), l => l.replace('which is exactly how V11.0 behaves until UX-6 turns it on.', 'which is exactly how V11.0 behaves with the classic layout on (UX-6).'), 'intro');
  const s5 = must(at(l => l === '## Status after UX-5'), 'status after UX-5');
  L.splice(s5, 0,
    '## Status after UX-6',
    '',
    `- **The new layout is on by default.** The four V11.0 switches (${so.layoutKeys.map(code).join(', ')}) default to on: a new player starts with 🔎 Find Anything, ⭐ Essentials and the five goal groups, 🧩 What's in the game and the 📑 side panel. No other default changed (V10.1's 599 defaults keep their fingerprint).`,
    `- **A returning player is moved once.** A browser with a first-run record or stored preferences gets the four switches set on, once, and a one-time notice on the main menu that names the classic switch; a small record (${code(so.storageKey)}) remembers the move and the notice, so after that the player's own choices stick (an "off" is stored now that it differs from the default).`,
    `- **One classic switch**, ${code(KEY)} (${LABEL}; profile, off by default, never in a save). While it is on, the four predicates read false and the game looks and works as V10.1 did; the four switches' stored values are kept, so turning it off brings back what the player had. It is on the main menu (in both layouts), in ⭐ Essentials, in Find Anything ("classic", "old layout", "v10.1") and in the classic view's Settings › Interface & Accessibility › ${so.sectionTitle}.`,
    '- **One look for the new screens** (SECTION 20BT): shared spacing, type sizes (rem or the 11 px the Text size setting scales), button shapes and a keyboard-only focus ring for Find Anything, Essentials and the group bar, What\'s in the game and the side panel. The classic layout is untouched.',
    '- **Clean-ups carried from UX-3 to UX-5:** Negotiations lists each option once in the layered view; the floating widgets, the classic quick bar and the turn pill make room for the side panel; "dock" finds the side panel; a setting opened from Find Anything lands on its row; the side panel\'s two effects list complete dependencies (no lint suppression); with the classic layout off the twins read the label table (Travel Discipline Strength; Floating UI Conflict Control Options).',
    `- **Self-tests:** ${H.totals.after} (${H.totals.before} before; +40 in ${code('v116so')}; 28 older checks updated, none removed), release check ${H.release.after}, Co-Pilot 85 of 85, strict TypeScript 0 errors. The rules stamp stays 1010, and real V9.7, V9.8, V10.0 and V10.1 saves play the same three days as the V10.1 build itself, with the classic layout on and off.`,
    '');

  // ---- Contents ------------------------------------------------------------------------------------------------------------------------------
  L.splice(must(at(l => l === '- Status after UX-5'), 'contents'), 0, '- Status after UX-6');
  L.splice(must(at(l => l === '- 19. UX-5: Docked panel — what changed'), 'contents 19') + 1, 0, '- 20. UX-6: Switch-over — what changed');

  // ---- §1: what "UX-6" means in the Moves in column -------------------------------------------------------------------------------------------
  replaceLine(l => l.includes('**UX-6** restyles everything and adds the classic switch'), l => l.replace(/\*\*UX-6\*\* restyles everything and adds the classic switch that restores the V10\.1 home shown in the \*today\* column\./,
    "**UX-6** turned the new layout on by default, restyled the four new V11.0 screens (the brief: new screens only, the classic layout untouched) and added the classic switch that restores the V10.1 home shown in the *today* column; a *UX-6* in *Moves in* on a V10.1 window means the classic switch brings its V10.1 look back, not a restyle."), '§1 UX-6');

  // ---- §2: after UX-6 -----------------------------------------------------------------------------------------------------------------------------
  const b5 = must(at(l => l.startsWith('| Browser (Chromium; Tailwind 3.4.17 built locally) | 34 of 34 steps |')), '§2 UX-5 browser row');
  L.splice(b5 + 1, 0, '',
    '**After UX-6** (the same runners on the changed file; the UX-5 numbers may not drop):',
    '',
    '| Runner | After UX-5 | After UX-6 |',
    '|---|---|---|',
    `| Registry surfaces / settings / indexed sections | 91 / 603 / 90 | ${reg.surfaces.length} / ${reg.defaults.length} / ${reg.sections.length} |`,
    `| Registered + harness extras | 3,176 checks, 82 suites, all pass | ${H.totals.after} (+40 in \`v116so\`; 28 older checks updated for the new defaults and counts, none removed) |`,
    `| Registered suites only | 3,003 checks, 77 suites, all pass | ${H.totals.registeredAfter} |`,
    `| Release check | 157 of 157 (READY_WITH_WARNINGS, the same warnings: K01–K03) | ${H.release.after} |`,
    '| Co-Pilot runner | 85 of 85 | 85 of 85 |',
    '| Strict TypeScript | 0 errors | 0 errors |',
    `| Suite registry integrity | ok (102 / 77) | ${H.integrity} |`,
    `| Find Anything index | 871 entries; 974 with the page and the panel on | ${so.findEntries} entries (+ the classic switch and its section); ${so.findEntriesAllOn} as a new player has it (the page, its 101 cards and the panel are on by default) |`,
    `| Browser (Chromium; Tailwind 3.4.17 built locally) | 100 scripted steps, 99 passed and 1 skipped | ${H.browserSummary} |`);

  // ---- §4: the three new-layout ids are on by default now -----------------------------------------------------------------------------------------
  replaceLine(l => /^\| 89 \| `find_anything` \|/.test(l), l => l.replace('once Find Anything is on (off by default)', 'while Find Anything is on (on by default since UX-6; off with the classic layout)').replace('Header button and Ctrl/⌘+K (UX-6 turns it on by default)', 'Header button and Ctrl/⌘+K (on by default since UX-6)').replace(/\| UX-2 \(new\) · UX-6 \|$/, '| UX-2 (new) · UX-6 (on by default) |'), '§4 find_anything');
  replaceLine(l => /^\| 90 \| `whats_in_the_game` \|/.test(l), l => l.replace('once the page is on (off by default)', 'while the page is on (on by default since UX-6; off with the classic layout)').replace('(UX-6 turns it on by default)', '(on by default since UX-6)').replace(/\| UX-4 \(new\) · UX-6 \|$/, '| UX-4 (new) · UX-6 (on by default) |'), '§4 whats_in_the_game');
  replaceLine(l => /^\| 91 \| `docked_panel` \|/.test(l), l => l.replace('Once the side panel is on (off by default: Settings › Interface & Accessibility › 📑 Side panel)', 'While the side panel is on (on by default since UX-6; off with the classic layout: Settings › Interface & Accessibility › 📑 Side panel)').replace('Beside the map: five tabs (UX-6 turns it on by default)', 'Beside the map: five tabs (on by default since UX-6)').replace(/\| UX-5 \(new\) · UX-6 \|$/, '| UX-5 (new) · UX-6 (on by default) |'), '§4 docked_panel');

  // ---- §6: the classic switch's section -------------------------------------------------------------------------------------------------------------
  replaceLine(l => /^\| \d+ \| `interface\.classicLayout` \|/.test(l), l => { const c = cells(l); c[9] = ' ⭐ Essentials (the layered view dissolves the section: its one switch lives in ⭐ Essentials) '; c[10] = ' UX-6 (new) '; return c.join('|'); }, '§6 classic section');
  ['interface.findAnything', 'interface.settingsLayers', 'interface.whatsInTheGame', 'interface.dockedPanel'].forEach(id => replaceLine(l => new RegExp(`^\\| \\d+ \\| \`${id.replace('.', '\\.')}\` \\|`).test(l), l => { const c = cells(l); c[10] = ` ${c[10].trim()} · UX-6 (on by default) `; return c.join('|'); }, `§6 ${id}`));

  // ---- §7: the classic switch, the four switches and the twins -----------------------------------------------------------------------------------
  const s7a = must(at(l => l.startsWith('## 7. Every setting')), '§7'); const s7b = must(at(l => l.startsWith('## 8. '), s7a), '§8');
  const row7 = (key, fn) => { const i = must(at(l => l.startsWith(`| ${code(key)} |`), s7a, s7b), `§7 ${key}`); const c = cells(L[i]); fn(c); const next = c.join('|'); if (next === L[i]) throw new Error(`ux6-overlay: §7 ${key} did not change`); L[i] = next; };
  const addNote = (c, note) => { const cur = c[11].trim(); c[11] = ` ${cur ? `${cur}; ` : ''}${note} `; };
  row7(KEY, c => { c[9] = ' ⭐ Essentials (the classic switch, after the 12 choices) '; c[10] = ' UX-6 (new) '; addNote(c, `new in UX-6: the classic layout, which holds the four V11.0 switches off and keeps their values; on the main menu (both layouts), in ⭐ Essentials, in Find Anything and in the classic view's Settings › Interface & Accessibility › ${so.sectionTitle}; the settings search finds it as a field`); });
  so.layoutKeys.forEach(k => row7(k, c => { c[10] = ` ${c[10].trim()} · UX-6 (on by default) `; addNote(c, 'on by default since UX-6 (it was off); the classic layout holds it off and keeps its value'); }));
  [['teamBrainTravelDiscipline', 'Travel Discipline Strength'], ['conflictControlSettings', 'Floating UI Conflict Control Options']].forEach(([k, label]) => row7(k, c => addNote(c, `UX-6: with the classic layout off, its drawn row (or change label) reads the label table, "${label}"; the classic layout keeps V10.1's title`)));

  // ---- §10: Ctrl/⌘+K ------------------------------------------------------------------------------------------------------------------------------
  const s10a = must(at(l => l.startsWith('## 10. Keyboard shortcuts')), '§10'); const s10b = must(at(l => l.startsWith('## 11.'), s10a), '§11');
  { const i = must(at(l => l.startsWith('| Ctrl/⌘+K |'), s10a, s10b), '§10 Ctrl/⌘+K'); const c = cells(L[i]); c[5] = ` ${c[5].trim()}; on by default since UX-6; with the classic layout on it is V10.1's key again (the Ask drawer, if that is on) `; L[i] = c.join('|'); }

  // ---- §12.6, §14, §15, and the deferred notes of §17 and §19 ---------------------------------------------------------------------------------------
  replaceLine(l => l.startsWith('- **Travel Discipline** and **Floating UI Conflict Control** each named a switch and its companion'), l => `${l} *UX-6 (the user's decision: the twins only): with the classic layout off the drawn rows read the label table too — the Team Brain slider says Travel Discipline Strength and the Floating UI row's change label says Floating UI Conflict Control Options; with it on, V10.1's titles.*`, '§12.6 twins');
  replaceLine(l => l.startsWith('| UX-6 Switch-over |'), l => l.replace('| UX-6 Switch-over | ', '| UX-6 Switch-over | **Done** (§20). Planned: '), '§14 UX-6');
  L.splice(must(at(l => l.startsWith("- UX-5's rebuild reads `data/registries-ux5.json`")), '§15 UX-5 bullet') + 1, 0,
    "- UX-6's rebuild reads `data/registries-ux6.json` (`extract.mjs` on the file after UX-6; it now also lists the switch-over: the four defaults, the classic switch, its section, home and label, and the Find Anything counts) and `data/browser/ux6-hardening.json` (the browser checks and timings, §20). `check-map.mjs` also checks the classic switch's §7 row, its §6 section and the four defaults.");
  replaceLine(l => l.startsWith('**Deferred (not this package):** feature cards (UX-4), docked panels (UX-5), turning the layers and Find Anything on by default'), l => `${l} *UX-6: the two lists are merged in the layered view (each option once) and the layers and Find Anything are on by default (§20).*`, '§17 deferred');
  replaceLine(l => l.startsWith('**Deferred (not this package):** docked panels (UX-5); turning the page'), l => `${l} *UX-6: on by default, the classic switch added, and the twins' drawn rows read the label table with the classic layout off (§20).*`, '§18 deferred');
  replaceLine(l => l.startsWith('**Deferred (not this package):** the six action windows'), l => `${l} *UX-6: the floating widgets, the classic quick bar and turn pill make room for the panel, the panel is on by default and the classic switch is added (§20); the six action windows, Loans and the 24 tool windows still wait for a later round.*`, '§19 deferred');

  // ---- §20 ---------------------------------------------------------------------------------------------------------------------------------------------
  const w = s => L.push(s);
  w('');
  w('## 20. UX-6: Switch-over — what changed');
  w('');
  w(`All new code is in SECTION 20BT (one look for the new screens), SECTION 20BU (the switch-over: defaults, the one move and notice, the classic switch, the twins, What's New), SECTION 20BV (the clean-ups carried from UX-3 to UX-5) and SECTION 20BW (a real V10.1 save, the map walk in both layouts and suite \`v116so\`), between SECTION 20BS and SECTION 21. Every in-place edit elsewhere is marked \`// V11.0 (SECTION 20BT)\` to \`(SECTION 20BW)\`: ${H.marks.lines} marked lines (${H.marks.places}).`);
  w('');
  w('| Area | What changed | Classic layout on |');
  w('|---|---|---|');
  [
    ['Defaults', `${so.layoutKeys.map(code).join(', ')} default to on (DEFAULT_GAME_SETTINGS and the Co-Pilot catalog; the four sections' chip says *On by default*). No other default changed: V10.1's 599 defaults keep their fingerprint.`, 'all four read as off'],
    ['The one move', `${code('v116BootSwitchOver')} runs once per session on the settings the profile store produced. No record and a returning player (a first-run record or stored preferences): the four switches are set on, the record says *moved*, and the main menu shows the notice. No record and a new player: nothing moves, the record says *new*. A record: nothing moves again. The notice is marked seen when the main menu draws it. Blocked or failing storage never throws (a blocked profile starts new, with no notice).`, '—'],
    ['The notice', `A labelled region at the top of the main menu: what the new layout is, and "Prefer how V10.1 looked? Turn on 🕰️ ${LABEL}" with where the switch is. *Keep the new layout* (or Escape inside it) closes it; *Use the classic layout* turns the classic switch on.`, '—'],
    ['The classic switch', `${code(KEY)} (boolean, false, profile, remembered between visits, never in a save; Co-Pilot catalog; settings search). Read inside the four predicates (${['v110FindAnythingOn', 'v113LayersOn', 'v114PageOn', 'v115DockOn'].map(code).join(', ')}), so every V11.0 screen goes off at once: no Find Anything (Ctrl/⌘+K is V10.1's again), the Simple view and the 11 tabs, no What's in the game, no side panel, V10.1's surface table. The four switches' values are never touched. Turning it on or off closes the V11.0 windows that were open and says where the switch is.`, '—'],
    ['Where the classic switch is', `The main menu (in both layouts: the way back), ⭐ Essentials (after the 12 choices; its home in the layered view), Find Anything ("classic", "classic layout", "old layout", "v10.1" put it first; a layered result opens Essentials at its row), and the classic view's Settings › Interface & Accessibility › ${so.sectionTitle}, which lists the four switches it holds off with the player's own choice for each.`, 'the main menu and Settings › Interface & Accessibility'],
    ['The twins (item 4, the twins only)', 'With the classic layout off, the Team Brain toggle and slider read the label table (the slider: *Travel Discipline Strength*) and the Floating UI row and its options object\'s change label read it too (*Floating UI Conflict Control Options*).', "V10.1's titles"],
    ['One look', "SECTION 20BT's shared styles on Find Anything, ⭐ Essentials and the group bar (and the layered rows and blocks), What's in the game and the side panel: one type scale (rem sizes and the 11 px the Text size setting scales; the panel's 10.5 px tab labels and the 10 px chips and notes are 11 px now), one button shape in three sizes and an icon button, one spacing for heads, bands, cards and options, and one focus ring (keyboard focus only, sky-600, 2 px out). The selected result and the card Find Anything opened share the same mark. White text on green is green-700 and the counts on coloured buttons are drawn at full strength (4.5:1 or better in every theme); the side panel's card is drawn solid (Retro's card is 90% opaque and the panel has no dimmed backdrop behind it), so the old windows' text reads in the panel as it does in its own window.", 'not drawn'],
    ['a. Negotiations', 'In the layered view the moved "more negotiation options" block leaves out the three options the section draws itself (auto-accept, counter-offer suggestions, confirm expensive proposals): six options, each once, all writing the same `negotiationOptions` fields as before.', "V10.1's two lists"],
    ['b. Room for the panel', "While the panel is open, its style element also moves the Ask and Guardian buttons, the Widget Dock and the notification lane to its left and centres the classic layout's floating quick bar and turn pill on the page beside it. A widget the player dragged, or Floating UI Conflict Control placed, keeps its place.", 'no panel'],
    ['c. "dock"', 'Finds the side panel (the panel while its switch is on, its switch while it is off) as well as the Widget Dock.', 'no Find Anything'],
    ['d. The exact row', "A setting opened from Find Anything or the settings search lands on its row: its ⭐ Essentials choice, or the row around one of its titles that holds a control (v116FindRow); only when no title matches does it land on the section's top, as before.", "V10.1's landing"],
    ['e. The panel\'s effects', '`useV115DockedPanel` reads its latest props through a ref, so both effects list every dependency they read; the two `eslint-disable-line react-hooks/exhaustive-deps` comments are gone (checked with eslint-plugin-react-hooks: 0 warnings, against 2 in UX-5 once its suppressions are ignored).', '—'],
    ["What's New", "V11.0's entry for the whole round (UX-2 to UX-6) leads the list; UX-2's own lines stay in the file.", 'the same'],
    ['Self-tests', 'Suite `v116so` (40 checks): the four defaults and nothing else; the classic switch (scope, catalog, section, home, label); classic on = V10.1\'s very objects (tables, state, shortcut list, Find Anything results, Ctrl/⌘+K, the hub); its stored values kept; the switch-over (new player, returning player moved once, the notice once, choices that stick, who is returning, hostile records, blocked storage); the notice, the main menu switch, the Essentials and Settings rows; Find Anything; the twins; the shared styles, contrast and the four screens; the clean-ups a to e; the map walk in both layouts; What\'s New; registration; the effects that follow the classic switch; no clock and no random draw; rules stamp 1010; real V9.7, V9.8, V10.0 and V10.1 saves move for move against the V10.1 build\'s own results.', '—'],
  ].forEach(r => w(`| ${r[0]} | ${r[1]} | ${r[2]} |`));
  w('');
  w('**Older checks updated** (they pinned the four defaults off, or counts the new switch moves; each keeps its meaning, marked `V11.0 (SECTION 20BU)`):');
  w('');
  w('| Check | What changed |');
  w('|---|---|');
  H.olderChecks.forEach(([id, why]) => w(`| ${code(id)} | ${why} |`));
  w('');
  w('**Checked in Chromium** (the real game, built by Vite in production mode and served as fixed files, so nothing reloads during a run; the V10.1 build and the UX-5 build (f60a72d) built the same way for comparison; Tailwind 3.4.17 built locally because its CDN is unreachable here):');
  w('');
  w('| Check | Result |');
  w('|---|---|');
  H.browser.forEach(([name, result]) => w(`| ${name} | ${result} |`));
  w('');
  w(`**Opening times** (${H.timingsNote}):`);
  w('');
  w('| Build | Settings | Find Anything | What\'s in the game |');
  w('|---|---|---|---|');
  H.timings.forEach(([label, s, f, c]) => w(`| ${label} | ${s} | ${f} | ${c} |`));
  w('');
  w('**Where the brief, the map and the file disagreed (and what UX-6 did).**');
  w('');
  H.disagreements.forEach(d => w(`- ${d}`));
  w('');
  w(`**Still open:** ${H.open}`);
};
