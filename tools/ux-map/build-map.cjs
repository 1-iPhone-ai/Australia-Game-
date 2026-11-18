// Builds V11.0_UX_MAP.md from the audit data in data/ (registries, AST scan, browser crawl, settings probe, path checks) and plan.cjs.
// Usage: node tools/ux-map/build-map.cjs [out.md]        (default: V11.0_UX_MAP.md at the repo root)
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(__dirname, 'data');
const OUT = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'V11.0_UX_MAP.md');
// The "today" facts are read from the V10.1 file as shipped. "(V9.9) australia-game-with-ai.tsx" in the repo is byte-identical to it;
// some facts are taken from fixed line ranges, so any other file is refused.
const BASE_FILE = path.join(ROOT, '(V9.9) australia-game-with-ai.tsx');
const BASE_MD5 = 'a7d56ae0e89666564909bacaaa7370df';
const baseBuf = fs.readFileSync(BASE_FILE);
if (crypto.createHash('md5').update(baseBuf).digest('hex') !== BASE_MD5) throw new Error(`${BASE_FILE} is not the V10.1 file the map was audited against (md5 ${BASE_MD5})`);
const baseSrc = baseBuf.toString('utf8');
const P = require('./plan.cjs');
const reg = require(path.join(DATA, 'registries-ux4.json')); // the module after UX-4 (registries-ux3.json keeps the module after UX-3)
reg.v101 = require(path.join(DATA, 'registries-v101.json')); // the UX-1 audit's V10.1 registries
const ast = require(path.join(DATA, 'ast.json'));
const gates = require(path.join(DATA, 'gates.json'));
const tryJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const crawl = (tryJson(path.join(DATA, 'browser', 'crawl-play.json')) || []).filter(x => x.outcome && !x.outcome.error);
const crawl3 = (tryJson(path.join(DATA, 'browser', 'crawl-extra.json')) || []).filter(x => x.outcome && !x.outcome.error);
const probe = tryJson(path.join(DATA, 'browser', 'probe-menu.json'));
const probeAllOn = tryJson(path.join(DATA, 'browser', 'probe-allon.json'));
// The all-on pass = gate switches on (the 51 switches that gate a settings control), run per tab in two parts.
const allOnParts = [tryJson(path.join(DATA, 'browser', 'probe-allon-trial.json')), tryJson(path.join(DATA, 'browser', 'probe-allon-rest.json'))].filter(Boolean);
if (probe) { delete probe.passes['advanced:allOn']; delete probe.passes['basic:allOn']; const merged = allOnParts.flatMap(x => (x.passes && x.passes['advanced:allOn']) || []); if (merged.length) probe.passes['advanced:allOn'] = merged; }
const paths = tryJson(path.join(DATA, 'browser', 'verify-paths.json'));
const extraFacts = tryJson(path.join(DATA, 'extra-facts.json')) || {};
const searchAll = tryJson(path.join(DATA, 'search-all-ux2.json')) || tryJson(path.join(DATA, 'search-all.json')) || {};

const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = s => '`' + String(s).replace(/`/g, "'") + '`';
const fmtVal = v => { if (v === null) return 'null'; if (typeof v === 'string') { if (v.startsWith('{') || v.startsWith('[')) return v.length > 28 ? (v.startsWith('[') ? `[…${(JSON.parse(v) || []).length}]` : '{…}') : v; return JSON.stringify(v).length > 30 ? JSON.stringify(v).slice(0, 27) + '…"' : JSON.stringify(v); } return String(v); };

// ---------------------------------------------------------------------------------------------------------------------
// Base facts
const defaults = new Map(reg.defaults.map(d => [d.key, d]));
const profile = new Set(reg.profileScoped);
const NOT_PERSISTED = new Set(['deferredTransactions', 'v93RecentRare', 'guidedFirstRunEnabled', 'autoModeDiagnosticsDrawerOpen', 'infrastructureEnabled', 'aiDifficulty']);
const scopeOf = k => profile.has(k) ? (NOT_PERSISTED.has(k) ? 'profile (not stored)' : 'profile') : (k === 'showDayTransition' ? 'match (kept on device)' : 'match');
const inert = new Map([...reg.inert99.map(x => [x.key, { ...x, v: 'V9.9' }]), ...reg.inert101.map(x => [x.key, { ...x, v: 'V10.1' }])]);
const tabLabel = t => reg.tabLabels[t] || t;
const secById = new Map(reg.sections.map(s => [s.id, s]));
const C_ID = { V101_SETTINGS_HUB_SECTION_ID: 'gameplay.v101', V100_SETTINGS_HUB_SECTION_ID: 'gameplay.v100' };
const rendered = ast.sections.map(s => ({ ...s, id: C_ID[s.id] || s.id }));
const renderedIds = new Set(rendered.map(s => s.id));
const simpleKeys = new Map();
const SIMPLE = [['experienceMode', 'Match'], ['totalDays', 'Match'], ['winCondition', 'Match'], ['actionLimitsEnabled', 'Match'], ['playerActionsPerDay', 'Match'], ['challengeApproachesEnabled', 'Gameplay'], ['expandedChallengeContentEnabled', 'Gameplay'], ['dynamicWagerEnabled', 'Gameplay'], ['doubleOrNothingEnabled', 'Gameplay'], ['equipmentShopEnabled', 'Gameplay'], ['sabotageEnabled', 'Gameplay'], ['advancedLoansEnabled', 'Gameplay'], ['matchShapeEnabled', 'Gameplay'], ['opponentPersonalityEnabled', 'Rival'], ['adaptiveAiTauntsEnabled', 'Rival'], ['aiSpecialAbilitiesEnabled', 'Rival'], ['visualMode', 'Look & sound'], ['reducedMotion', 'Look & sound'], ['soundEnabled', 'Look & sound'], ['soundVolume', 'Look & sound'], ['showDayTransition', 'Look & sound'], ['guidedFirstRunEnabled', 'Help']];
SIMPLE.forEach(([k, g]) => simpleKeys.set(k, g));
const essentialKey = new Map(); P.ESSENTIALS.forEach((e, i) => e.keys.forEach(k => essentialKey.set(k.split('.')[0] === 'accessibilitySettings' ? k : k, { n: i + 1, choice: e.choice })));
const labCards = extraFacts.labCards || []; // [{title, tab, section|null, flag|null}]
const labBySection = new Map(); labCards.filter(c => c.section).forEach(c => { if (!labBySection.has(c.section)) labBySection.set(c.section, c.title); });
const labTabOnly = new Map(); labCards.filter(c => !c.section && c.tab).forEach(c => labTabOnly.set(c.tab, c.title));

// Settings path clicks (measured by verify-paths when present).
const tabClicks = {}; (paths ? paths.settingsTabs : []).forEach(t => { tabClicks[t.tab] = { clicks: t.steps.filter(Boolean).length, sections: t.sectionsVisible }; });
const MORE_TO_TAB = t => (tabClicks[t] ? tabClicks[t].clicks : (t === 'home' ? 3 : 4));

// Probe: which section actually renders a control for which key, in which view, and whether a parent switch must be on.
const probeHome = new Map(); // key -> [{section, views:Set, needsAllOn:bool}]
const probeUnchanged = []; const probeTimeouts = [];
if (probe) {
  for (const [pass, secs] of Object.entries(probe.passes)) {
    const [view, set] = pass.split(':');
    for (const sec of secs) for (const c of sec.controls) {
      if (c.timeout) { probeTimeouts.push(`${sec.section} #${c.index}`); continue; }
      if (!c.changed) continue;
      for (const ch of c.changed) for (const part of ch.split('|')) {
        const key = part.split('.')[0]; if (!defaults.has(key)) continue;
        const arr = probeHome.get(key) || []; let e = arr.find(x => x.section === sec.section); if (!e) { e = { section: sec.section, tab: sec.tab, views: new Set(), sets: new Set() }; arr.push(e); }
        e.views.add(view); e.sets.add(set); probeHome.set(key, arr);
      }
    }
  }
}
const probeSaw = k => probeHome.get(k) || [];
// A key is "behind a switch" when it got a working control only with the gate switches on AND is not itself a gate or feature switch
// (master switches that the default passes missed are timing misses, not gating).
const GATE_KEYS = new Set([...Object.keys(gates.gateSettings), ...(P.FEATURE_CARDS || []).flatMap(c => c.keys)]);
const gatedKeys = new Set([...probeHome.entries()].filter(([k, arr]) => arr.some(e => e.sets.has('allOn')) && !arr.some(e => e.sets.has('defaults')) && !GATE_KEYS.has(k)).map(([k]) => k));
const probeStats = { gatedCount: gatedKeys.size, controls: probe ? Object.values(probe.passes).reduce((a, secs) => a + secs.reduce((b, s) => b + s.controls.length, 0), 0) : 0, passes: probe ? Object.keys(probe.passes) : [] };

// AST: which keys are written in which rendered section (static, includes child components only where traced).
const astWrites = new Map();
for (const s of rendered) for (const w of s.writes) for (const k0 of w.keys) { const m = k0.match(/:([A-Za-z0-9_]+)$/); const k = (m ? m[1] : k0).split('.')[0]; if (!defaults.has(k)) continue; const arr = astWrites.get(k) || []; if (!arr.includes(s.id)) arr.push(s.id); astWrites.set(k, arr); }

// ---------------------------------------------------------------------------------------------------------------------
// Surfaces: flags, static openers, measured paths
const flagMapSrc = baseSrc.split('\n').slice(88469, 88522).join('\n'); // V10.1's table (the one still used while Find Anything is off)
const flagsBySurface = {}; for (const m of flagMapSrc.matchAll(/\{ flags: \[([^\]]+)\], surfaceId: '([a-z_]+)' \}/g)) flagsBySurface[m[2]] = m[1].split(',').map(x => x.trim().replace(/'/g, ''));
const best = {}; const bestFlag = {};
for (const x of [...crawl, ...crawl3]) {
  const o = x.outcome; const s = o.mgr && (o.mgr.modal || o.mgr.drawer || o.mgr.side);
  if (s && o.mgrChanged !== false) { if (!best[s] || best[s].path.length > x.path.length) best[s] = x; }
  for (const u of (o.ui || [])) { const m = u.match(/^(show[A-Za-z]+)=true/); if (m && (!bestFlag[m[1]] || bestFlag[m[1]].path.length > x.path.length)) bestFlag[m[1]] = x; }
}
const KEYS = { travel_modal: 'T', challenges_modal: 'C', market_modal: 'R', resource_market_modal: 'M', workshop_modal: 'W', negotiation_center: 'N', notification_drawer: 'H', campaign_progression_modal: 'P (Progress shares it while Find Anything is off)', ask_game_ai: 'Ctrl+K (Ask drawer, if on and Find Anything off); ? (Help shares it while Find Anything is off)', help_shortcuts_modal: '?', progress_dashboard: 'P', diagnostics_drawer: 'Ctrl+Alt+D', find_anything: 'Ctrl/⌘+K (while on)', ai_command_center_modal: 'Alt+C (if on)', save_load_modal: 'Ctrl+S saves (does not open)', rescue_emergency_overlay: 'Shift+Esc', settings_hub: '/ or Ctrl+F focuses its search' };
const LABEL_FIX = { 'v9-match-standing': '📊 Match standing ▸ (icon button)', '⋯': 'Quick bar ⋯', 'View All Actions': '⋯ More' };
const pathText = x => x.path.map((p, i) => (LABEL_FIX[p] && !(p === 'View All Actions' && x.path.length === 1)) ? LABEL_FIX[p] : p).map(p => p.replace(/\s+/g, ' ').trim().replace(/ H N$/, '').replace(/ [A-Z]$/, '').replace(/\$N/g, '$').replace(/\bN\b/g, '#').trim()).map(p => p.length > 34 ? p.slice(0, 32) + '…' : p).join(' › ');

// ---------------------------------------------------------------------------------------------------------------------
const L = []; const w = s => L.push(s);
module.exports = { L, w };
const UX2 = require('./ux2-overlay.cjs')(extraFacts);
P.SECTION_GROUP['interface.findAnything'] = P.SECTION_GROUP['interface.aiAssistants'];
P.SECTION_GROUP['interface.settingsLayers'] = P.SECTION_GROUP['interface.aiAssistants']; // UX-3: the layered Settings' own switch
P.SECTION_GROUP['interface.whatsInTheGame'] = P.SECTION_GROUP['interface.aiAssistants']; // UX-4: What's in the game's own switch
const extra = require('./build-map-body.cjs');
extra.build({ UX2, searchAll, gatedKeys, probeStats, baseSrc, P, reg, ast, gates, crawl, crawl3, probe, paths, extraFacts, defaults, profile, scopeOf, inert, tabLabel, secById, rendered, renderedIds, simpleKeys, essentialKey, labBySection, labTabOnly, labCards, MORE_TO_TAB, tabClicks, probeSaw, probeHome, probeTimeouts, astWrites, flagsBySurface, best, bestFlag, KEYS, pathText, esc, code, fmtVal, w });
require('./ux3-overlay.cjs')(L, { reg, P });
require('./ux4-overlay.cjs')(L, { reg, P });
fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log(`wrote ${OUT}: ${L.length} lines, ${fs.statSync(OUT).size} bytes`);
