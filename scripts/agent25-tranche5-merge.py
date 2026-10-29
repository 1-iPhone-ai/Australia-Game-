#!/usr/bin/env python3
"""Agent 25 tranche 5 — #288 #286 #301 + #282 shortcut; #289 verify."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
BR = "(V9.4) australia-game-with-ai.tsx"
ANCHOR = "// SECTION 21B:"


def git_text(ref: str, path: str = BR) -> str:
    return subprocess.check_output(
        ["git", "-C", str(ROOT), "show", f"{ref}:{path}"],
        text=True,
        errors="replace",
    )


def git_lines(ref: str, path: str = BR) -> list[str]:
    return git_text(ref, path).splitlines(keepends=True)


def strip_module_imports(src: str) -> str:
    out: list[str] = []
    skip = False
    for line in src.splitlines():
        st = line.strip()
        if st.startswith("import ") or st.startswith("export *"):
            skip = " from " in st and not st.endswith(";")
            continue
        if skip:
            if ";" in line:
                skip = False
            continue
        if " from './" in line or ' from "./' in line:
            continue
        out.append(line)
    return "\n".join(out)


def clean_orphan_import_lists(block: str) -> str:
    lines = block.splitlines()
    out: list[str] = []
    i = 0
    list_line = re.compile(r"^\s+(type\s+)?[\w]+\s*,?\s*$")
    while i < len(lines):
        line = lines[i]
        if list_line.match(line) and i + 1 < len(lines) and list_line.match(lines[i + 1]):
            while i < len(lines) and (list_line.match(lines[i]) or lines[i].strip() in {"}", "} from './types';", "} from \"./types\";"}):
                i += 1
            continue
        if "} from './" in line or '} from "./' in line or "} from '../" in line or '} from "../' in line:
            i += 1
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


def bundle_paths(ref: str, paths: list[str]) -> str:
    joined = "\n\n".join(strip_module_imports(git_text(ref, p)) for p in paths)
    return clean_orphan_import_lists(joined)


def insert_before(text: str, needle: str, block: str, label: str) -> str:
    if block.strip()[:100] in text:
        print(f"skip {label} (already present)")
        return text
    idx = text.index(needle)
    banner = (
        f"\n// ============================================================================\n"
        f"// Agent 25 tranche 5 — {label}\n"
        f"// ============================================================================\n"
    )
    return text[:idx] + banner + block + "\n" + text[idx:]


def namespace_agent03(block: str) -> str:
    # Avoid colliding with canonical SECTION 20X capability types on HEAD.
    repl = [
        ("export type CapabilityAdoptionLevel", "export type Agent03CapabilityAdoptionLevel"),
        ("CapabilityAdoptionLevel", "Agent03CapabilityAdoptionLevel"),
        ("export const CAPABILITY_ADOPTION_RANK", "export const AGENT03_CAPABILITY_ADOPTION_RANK"),
        ("CAPABILITY_ADOPTION_RANK", "AGENT03_CAPABILITY_ADOPTION_RANK"),
        ("export const CAPABILITY_MATURITY_RANK", "export const AGENT03_CAPABILITY_MATURITY_RANK"),
        ("CAPABILITY_MATURITY_RANK", "AGENT03_CAPABILITY_MATURITY_RANK"),
        ("export function runAgent03SelfTests", "export function runAgent03InnovationSelfTests"),
    ]
    for a, b in repl:
        block = block.replace(a, b)
    return block


def namespace_fiscal(block: str) -> str:
    tok = "FISCAL"
    block = re.sub(rf"V1014_(?!{tok}_)", f"V1014_{tok}_", block)
    block = re.sub(rf"V1014(?!(?:{tok}_))([A-Z])", rf"V1014_{tok}_\1", block)
    block = block.replace("export default FiscalOutcomesInspector;", "/* inlined inspector */")
    return block


def replace_acc17(text: str) -> str:
    # Branch ACC17..§15 span is stale (re-embeds Co-Pilot); canonical HEAD already ships ACC17 catalog.
    if "ACC17_PROJECT_TEMPLATE_CATALOG" in text:
        print("skip #301 ACC17 (catalog on HEAD; branch span is stale duplicate)")
    return text


def extend_emerging_capability_ids(text: str) -> str:
    extra = [
        "sovereign_ai_platforms",
        "clinical_translation_network",
        "quantum_sensing_industry",
        "defence_dual_use_pipeline",
    ]
    if all(x in text for x in extra):
        print("skip #286 capability id extension (present)")
        return text
    old = (
        "export type EmergingCapabilityId = 'advanced_logistics' | 'automated_mining' | "
        "'advanced_manufacturing' | 'grid_scale_storage' | 'advanced_water_systems' | "
        "'ai_compute_infrastructure' | 'precision_agriculture' | 'research_commercialization';"
    )
    new = (
        "export type EmergingCapabilityId = 'advanced_logistics' | 'automated_mining' | "
        "'advanced_manufacturing' | 'grid_scale_storage' | 'advanced_water_systems' | "
        "'ai_compute_infrastructure' | 'precision_agriculture' | 'research_commercialization' | "
        "'sovereign_ai_platforms' | 'clinical_translation_network' | 'quantum_sensing_industry' | "
        "'defence_dual_use_pipeline';"
    )
    if old not in text:
        raise SystemExit("EmergingCapabilityId anchor not found for #286")
    text = text.replace(old, new, 1)
    text = text.replace(
        "export const CAPABILITY_IDS: EmergingCapabilityId[] = ['advanced_logistics', 'automated_mining', 'advanced_manufacturing', 'grid_scale_storage', 'advanced_water_systems', 'ai_compute_infrastructure', 'precision_agriculture', 'research_commercialization'];",
        "export const CAPABILITY_IDS: EmergingCapabilityId[] = ['advanced_logistics', 'automated_mining', 'advanced_manufacturing', 'grid_scale_storage', 'advanced_water_systems', 'ai_compute_infrastructure', 'precision_agriculture', 'research_commercialization', 'sovereign_ai_platforms', 'clinical_translation_network', 'quantum_sensing_industry', 'defence_dual_use_pipeline'];",
        1,
    )
    print("extended EmergingCapabilityId (#286)")
    return text


def wire_shift_d_dashboard(text: str) -> str:
    marker = "const handleGlobalDiagnosticsShortcut = (e: KeyboardEvent) => {"
    if "showNationalRegionalDashboard: true, experienceLayer: 'intelligence'" in text and "e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'D' || e.code === 'KeyD')" in text:
        print("skip #282 Shift+D (present)")
        return text
    hook = """    const handleNationalDashboardShortcut = (e: KeyboardEvent) => {
      if (gameState.gameMode !== 'game') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'D' || e.code === 'KeyD')) {
        e.preventDefault();
        setUiState(prev => ({ ...prev, showNationalRegionalDashboard: !prev.showNationalRegionalDashboard, experienceLayer: 'intelligence' }));
      }
    };
"""
    if marker not in text:
        raise SystemExit("diagnostics shortcut anchor missing")
    text = text.replace(marker, hook + "    " + marker, 1)
    text = text.replace(
        "window.addEventListener('keydown', handleGlobalDiagnosticsShortcut);",
        "window.addEventListener('keydown', handleNationalDashboardShortcut);\n    window.addEventListener('keydown', handleGlobalDiagnosticsShortcut);",
        1,
    )
    text = text.replace(
        "window.removeEventListener('keydown', handleGlobalDiagnosticsShortcut);",
        "window.removeEventListener('keydown', handleNationalDashboardShortcut);\n      window.removeEventListener('keydown', handleGlobalDiagnosticsShortcut);",
        1,
    )
    print("wired #282 Shift+D national dashboard toggle")
    return text


def main() -> None:
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())

    text = replace_acc17(text)

    ref07 = "origin/cursor/agent-07-government-finance-21a3"
    fiscal_paths = [
        "expansion/agent-07/v10-14-fiscal-outcomes/types.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/boundaries.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/tax-instruments.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/budget-envelopes.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/debt-outcomes.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/outcome-linkage.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/compute.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/bridge-v1012.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/gi-queries.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/catalog/policy-scenarios.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/self-tests.ts",
        "expansion/agent-07/v10-14-fiscal-outcomes/react/FiscalOutcomesInspector.tsx",
    ]
    fiscal = namespace_fiscal(
        "// SECTION 20AW: V10.14 FISCAL POLICY INSTRUMENTS & OUTCOME LINKAGE (Agent 07)\n"
        + bundle_paths(ref07, fiscal_paths)
    )
    text = insert_before(text, ANCHOR, fiscal, "#288 fiscal outcomes")

    ref03 = "origin/cursor/agent-03-tech-research-5f9f"
    a03_paths = [
        "expansion/agent-03/types.ts",
        "expansion/agent-03/core/readiness-graph.ts",
        "expansion/agent-03/core/commercialization-pathways.ts",
        "expansion/agent-03/core/extended-capabilities.ts",
        "expansion/agent-03/core/institutions-catalog.ts",
        "expansion/agent-03/core/productivity-bridge.ts",
        "expansion/agent-03/core/progression-unlocks.ts",
        "expansion/agent-03/core/gi-ui-hooks.ts",
        "expansion/agent-03/tests/agent03-self-tests.ts",
    ]
    a03 = namespace_agent03(
        "// SECTION 20AX: V10.5 INNOVATION COMMERCIALIZATION EXPANSION (Agent 03)\n"
        + bundle_paths(ref03, a03_paths)
    )
    text = insert_before(text, ANCHOR, a03, "#286 agent-03 commercialization")
    text = extend_emerging_capability_ids(text)

    lab = """  { id: 'v1014_fiscal', label: 'V10.14 Fiscal outcomes (Agent 07)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014FiscalOutcomesSelfTests() },
  { id: 'a03_innovation', label: 'Agent 03 innovation commercialization', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runAgent03InnovationSelfTests() },
"""
    if "v1014_fiscal" not in text:
        text = text.replace("  { id: 'agent05_events',", lab + "  { id: 'agent05_events',", 1)

    text = wire_shift_d_dashboard(text)

    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
