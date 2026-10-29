#!/usr/bin/env python3
"""Bundle Operation 10M Agent 07 modules for Agent 25 inline merge."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
MODULES = ROOT / "modules"
OUT = ROOT / "dist" / "section-20aw-agent07-bundle.ts"

ORDER = [
    "fiscal-outcomes/types.ts",
    "fiscal-outcomes/boundaries.ts",
    "fiscal-outcomes/tax-instruments.ts",
    "fiscal-outcomes/budget-envelopes.ts",
    "fiscal-outcomes/debt-outcomes.ts",
    "fiscal-outcomes/outcome-linkage.ts",
    "fiscal-outcomes/bridge-v1012.ts",
    "fiscal-outcomes/compute.ts",
    "fiscal-outcomes/gi-queries.ts",
    "fiscal-outcomes/catalog/policy-scenarios.ts",
    "fiscal-outcomes/self-tests.ts",
    "revenue-ledger/types.ts",
    "revenue-ledger/compute.ts",
    "infrastructure-financing/types.ts",
    "infrastructure-financing/compute.ts",
    "reconciliation/reconcile.ts",
    "reconciliation/self-tests.ts",
]


def strip_imports(text: str) -> str:
    lines = []
    for line in text.splitlines():
        if line.strip().startswith("import "):
            continue
        lines.append(line)
    return "\n".join(lines) + "\n"


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    chunks: list[str] = [
        "// AUTO-GENERATED — operation-10m/agent-07-public-finance/scripts/bundle-for-agent25.py\n",
        "// SECTION 20AW: V10.14 FISCAL POLICY + OP10M AGENT 07 EXTENSIONS\n",
    ]
    for rel in ORDER:
        path = MODULES / rel
        if not path.exists():
            raise SystemExit(f"missing {path}")
        body = strip_imports(path.read_text(encoding="utf-8"))
        chunks.append(f"\n// --- {rel} ---\n")
        chunks.append(body)
    OUT.write_text("".join(chunks), encoding="utf-8")
    print(f"wrote {OUT} ({len(OUT.read_text().splitlines())} lines)")


if __name__ == "__main__":
    main()
