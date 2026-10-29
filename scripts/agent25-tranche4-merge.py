#!/usr/bin/env python3
"""Agent 25 tranche 4 — inline remaining Operation 600K fleet slices."""
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


def slice_v94(ref: str, start_prefix: str, end_prefix: str = ANCHOR) -> str:
    lines = git_lines(ref)
    s = next(i for i, l in enumerate(lines) if l.startswith(start_prefix))
    e = next(i for i, l in enumerate(lines[s + 1 :], s + 1) if l.startswith(end_prefix))
    return "".join(lines[s:e])


def namespace_v1014_block(block: str, token: str, section_label: str) -> str:
    block = re.sub(r"^// SECTION 20AG:", f"// SECTION {section_label}:", block, count=1, flags=re.M)
    tok = token
    tok_l = token.lower()
    block = re.sub(rf"V1014_(?!{tok}_)", f"V1014_{tok}_", block)
    block = re.sub(
        rf"V1014(?!(?:{tok}_))([A-Z])",
        rf"V1014_{tok}_\1",
        block,
    )
    block = re.sub(
        rf"\bv1014(?!(?:{tok_l}))([a-zA-Z])",
        rf"v1014{tok_l}\1",
        block,
    )
    return block


def insert_before(text: str, needle: str, block: str, label: str) -> str:
    marker = block.strip()[:120]
    if marker in text:
        print(f"skip {label} (already present)")
        return text
    idx = text.index(needle)
    banner = (
        f"\n// ============================================================================\n"
        f"// Agent 25 tranche 4 inline — {label}\n"
        f"// ============================================================================\n"
    )
    return text[:idx] + banner + block + "\n" + text[idx:]


def main() -> None:
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())

    v1014_slices: list[tuple[str, str, str, str]] = [
        ("#302 macro", "origin/cursor/macro-economy-v1014-9a83", "MACRO", "20AG"),
        ("#305 financial stability", "origin/cursor/agent-10-macro-financial-stability-04ff", "FINSTAB", "20AO"),
        ("#303 strategic decisions", "origin/cursor/agent-01-strategic-depth-212d", "STRATEGIC", "20AH"),
        ("#290 private sector", "origin/cursor/op600-agent-08-private-sector-9382", "PRIVATE", "20AI"),
        ("#292 labor", "origin/cursor/agent-09-labor-demographics-819e", "LABOR", "20AJ"),
        ("#293 forecast lab", "origin/cursor/agent-21-forecast-policy-lab-278a", "FORECAST", "20AQ"),
        ("#298 transport", "origin/cursor/infrastructure-transport-600k-aa66", "TRANSPORT", "20AR"),
    ]

    # Insert in reverse so macro ends up first among new blocks (closest to existing 20AP ... 21B)
    for label, ref, token, sec in reversed(v1014_slices):
        raw = slice_v94(ref, "// SECTION 20AG:")
        block = namespace_v1014_block(raw, token, sec)
        text = insert_before(text, ANCHOR, block, label)

    # #299 cities module
    mod11 = git_text(
        "origin/cursor/city-regional-intercity-31b5",
        "expansion/o6k/agent-11-division-c-v1014-city-regional-intercity.tsx",
    )
    mod11 = namespace_v1014_block(mod11.replace("// SECTION 20AG:", "// SECTION 20AK:", 1), "CITIES", "20AK")
    text = insert_before(text, ANCHOR, mod11, "#299 cities 20AK")

    # #296 Agent 05 fragment
    a05 = git_text("origin/cursor/agent-05-dynamic-events-05a4", "agent05-conditional-events.fragment.tsx")
    a05_hdr = "// SECTION 20AS: AGENT 05 — DYNAMIC EVENTS, CRISIS CHAINS & SIMULATION CONTENT\n"
    text = insert_before(text, ANCHOR, a05_hdr + a05, "#296 Agent 05")

    # #284 trade module (20AT — not 20AP; public services owns 20AP)
    trade = git_text(
        "origin/cursor/trade-diplomacy-global-600k-fd4b",
        "operation-600k/modules/agent-15-global-trade-diplomacy-linkage.tsx",
    )
    trade_block = (
        "// SECTION 20AT: AGENT 15 — GLOBAL TRADE–DIPLOMACY LINKAGE (Operation 600K)\n" + trade
    )
    text = insert_before(text, ANCHOR, trade_block, "#284 trade")

    # #294 team intelligence 3.0
    ti3 = git_text(
        "origin/cursor/agent-18-team-intelligence-4ea3",
        "operation-600k/agent-18/team-intelligence-3.0-coordination.tsx",
    )
    ti3 = ti3.replace("import ", "// import ")
    text = insert_before(
        text,
        ANCHOR,
        "// SECTION 20AU: TEAM INTELLIGENCE 3.0 (Agent 18)\n" + ti3,
        "#294 team intel",
    )

    # #297 flagship UI
    ui22 = git_text(
        "origin/cursor/evolving-flagship-ui-62f7",
        "feature-sections/agent-22-evolving-flagship-ui.tsx",
    )
    text = insert_before(text, ANCHOR, ui22, "#297 Agent 22 UI")

    # Agent 05 content registry wiring
    if "AGENT05_DILEMMA_REGISTRY" in text and "...AGENT05_DILEMMA_REGISTRY" not in text:
        text = text.replace(
            "export const CONTENT_TEMPLATE_REGISTRY: ContentTemplateBase[] = [...CONTRACT_TEMPLATE_REGISTRY, ...DILEMMA_TEMPLATE_REGISTRY, ...CRISIS_CONTENT_REGISTRY, ...WORLD_EVENT_REGISTRY];",
            "export const CONTENT_TEMPLATE_REGISTRY: ContentTemplateBase[] = [...CONTRACT_TEMPLATE_REGISTRY, ...DILEMMA_TEMPLATE_REGISTRY, ...AGENT05_DILEMMA_REGISTRY, ...CRISIS_CONTENT_REGISTRY, ...AGENT05_CRISIS_CONTENT_REGISTRY_V2, ...WORLD_EVENT_REGISTRY, ...AGENT05_WORLD_EVENT_REGISTRY];",
            1,
        )
        text = text.replace(
            "export const DILEMMA_TEMPLATE_BY_ID: Record<string, DilemmaTemplate> = Object.fromEntries(DILEMMA_TEMPLATE_REGISTRY.map(t => [t.id, t]));",
            "export const DILEMMA_TEMPLATE_BY_ID: Record<string, DilemmaTemplate> = Object.fromEntries([...DILEMMA_TEMPLATE_REGISTRY, ...AGENT05_DILEMMA_REGISTRY].map(t => [t.id, t]));",
            1,
        )
        text = text.replace(
            "export const CRISIS_TEMPLATE_BY_ID: Record<string, CrisisContentTemplate> = Object.fromEntries(CRISIS_CONTENT_REGISTRY.map(t => [t.id, t]));",
            "export const CRISIS_TEMPLATE_BY_ID: Record<string, CrisisContentTemplate> = Object.fromEntries([...CRISIS_CONTENT_REGISTRY, ...AGENT05_CRISIS_CONTENT_REGISTRY_V2].map(t => [t.id, t]));",
            1,
        )
        text = text.replace(
            "export const WORLD_EVENT_BY_ID: Record<string, WorldEventTemplate> = Object.fromEntries(WORLD_EVENT_REGISTRY.map(t => [t.id, t]));",
            "export const WORLD_EVENT_BY_ID: Record<string, WorldEventTemplate> = Object.fromEntries([...WORLD_EVENT_REGISTRY, ...AGENT05_WORLD_EVENT_REGISTRY].map(t => [t.id, t]));",
            1,
        )
        print("wired Agent05 content registries")

    # LAB suite entries (minimal)
    lab_hook = """  { id: 'agent05_events', label: 'Agent 05 dynamic events & chains', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => { const r = runAgent05ConditionalSelfTests(); return [{ id: 'agent05', name: 'Agent 05 self-tests', passed: r.failures.length === 0, detail: r.failures.join('; ') || 'ok' }]; } },
"""
    if "agent05_events" not in text and "v1014_public_services" in text:
        text = text.replace(
            "  { id: 'v1014_public_services',",
            lab_hook + "  { id: 'v1014_public_services',",
            1,
        )
        print("added LAB agent05_events")

    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
