#!/usr/bin/env python3
"""Transform copied v1016 tree into v1018 fiscal federalism naming."""
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1018-fiscal-federalism", "v1018-fiscal-federalism"),
    ("V1018_FFED", "V1018_FFED"),
    ("V1018Ffed", "V1018Ffed"),
    ("runV1018Ffed", "runV1018Ffed"),
    ("buildV1018Ffed", "buildV1018Ffed"),
    ("sanitizeV1018Ffed", "sanitizeV1018Ffed"),
    ("createEmptyV1018Ffed", "createEmptyV1018Ffed"),
    ("v1018Ffed", "v1018Ffed"),
    ("v1018_fiscal_federalism", "v1018_fiscal_federalism"),
    ("fiscal_federalism", "fiscal_federalism"),
    ("10.16.fiscal_federalism", "10.18.fiscal_federalism"),
    ("V10.18 Fiscal federalism", "V10.18 Fiscal federalism"),
    ("fiscal federalism", "fiscal federalism"),
    ("Fiscal federalism", "Fiscal federalism"),
    ("state–federal transfer", "state–federal transfer"),
    ("State–federal transfer", "State–federal transfer"),
    ("transfer", "transfer"),
    ("Transfer", "Transfer"),
    ("TRANSFER_", "TRANSFER_"),
    ("Transfer", "Transfer"),
    ("transfer", "transfer"),
    ("grant-stacks", "grant-stacks"),
    ("GRANT_STACK_", "GRANT_STACK_"),
    ("Grant stack", "Grant stack"),
    ("grantStack", "grantStack"),
    ("audit-trails", "audit-trails"),
    ("AUDIT_TRAIL_", "AUDIT_TRAIL_"),
    ("Compliance", "Compliance"),
    ("audit_trail", "audit_trail"),
    ("fiscal-federalism", "fiscal-federalism"),
    ("O6K-37", "O6K-37"),
    ("SECTION 20BI", "SECTION 20BI"),
    ("SECTION 20BI", "SECTION 20BI"),
    ("20BH state–federal transfer & audit_trail", "20BI transfers, grant stacks & compliances"),
    ("20BI", "20BI"),
    ("save.meta.v1018", "save.meta.v1018"),
    ("meta.v1018", "meta.v1018"),
    ("v1018FiscalFederalism", "v1018FiscalFederalism"),
    ("v1018.", "v1018."),
    ("8180", "8180"),
    ("8000 + t", "8000 + t"),
]

# Rename files and dirs (deepest first)
RENAMES: list[tuple[str, str]] = [
    ("generated/transfer-scenarios", "generated/transfer-scenarios"),
    ("generated/grant-stacks", "generated/grant-stacks"),
    ("audit-trails", "audit-trails"),
    ("engine/fiscal-federalism-utils.ts", "engine/fiscal-federalism-utils.ts"),
    ("engine/fiscal-federalism-orchestrator.ts", "engine/fiscal-federalism-orchestrator.ts"),
    ("self-tests/run-v1016-nres-self-tests.ts", "self-tests/run-v1018-ffed-self-tests.ts"),
    ("grant-stacks/graph-utils.ts", "grant-stacks/graph-utils.ts"),
    ("generated/transfer-registry.ts", "generated/transfer-registry.ts"),
    ("generated/grant-stack-bundle.ts", "generated/grant-stack-bundle.ts"),
]

PROP_TO_GRANT = re.compile(r"grant-(\d{3})\.ts")
NODE_TO_AUDIT = re.compile(r"node-(\d{2})\.ts")


def apply_replacements(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def main() -> None:
    for old_rel, new_rel in sorted(RENAMES, key=lambda x: -len(x[0])):
        old = ROOT / old_rel
        new = ROOT / new_rel
        if old.exists():
            new.parent.mkdir(parents=True, exist_ok=True)
            if new.exists():
                raise SystemExit(f"target exists: {new}")
            old.rename(new)

    # grant-*.ts -> grant-*.ts
    grant_dir = ROOT / "generated" / "grant-stacks"
    if grant_dir.is_dir():
        for p in sorted(grant_dir.glob("grant-*.ts")):
            p.rename(p.with_name(p.name.replace("grant-", "grant-")))

    audit_dir = ROOT / "audit-trails"
    if audit_dir.is_dir():
        for p in sorted(audit_dir.glob("node-*.ts")):
            p.rename(p.with_name(p.name.replace("node-", "audit-")))

    for path in list(ROOT.rglob("*")):
        if path.is_file() and path.suffix in {".ts", ".md", ".py"}:
            raw = path.read_text(encoding="utf-8")
            new_raw = apply_replacements(raw)
            new_raw = new_raw.replace("grant-", "grant-")
            new_raw = new_raw.replace("/audit-", "/audit-")
            new_raw = new_raw.replace("audit_", "audit_")
            if new_raw != raw:
                path.write_text(new_raw, encoding="utf-8")

    print("Transform complete.")


if __name__ == "__main__":
    main()
