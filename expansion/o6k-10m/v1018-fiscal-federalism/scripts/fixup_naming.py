#!/usr/bin/env python3
"""Fix broken identifiers after bulk transform."""
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]

FIXES = [
    ("V1018FfedComplianceBand", "V1018FfedComplianceBand"),
    ("ComplianceBand", "ComplianceBand"),
    ("complianceBand", "complianceBand"),
    ("complianceFromScore", "complianceFromScore"),
    ("complianceScore", "complianceScore"),
    ("federalismPolicyFocus", "federalismPolicyFocus"),
    ("regionalCompliance", "regionalCompliance"),
    ("RegionalCompliance", "RegionalCompliance"),
    ("V1018FfedTransferSnapshot", "V1018FfedTransferSnapshot"),
    ("transferSnapshots", "transferSnapshots"),
    ("Transfer", "Transfer"),
    ("grant-stack-bundle", "grant-stack-bundle"),
    ("grantStackDelayTurns", "grantStackDelayTurns"),
    ("grantStackGraphHash", "grantStackGraphHash"),
    ("grantStackPressure", "grantStackPressure"),
    ("V1018_FFED_mergeGrantStackEdges", "V1018_FFED_mergeGrantStackEdges"),
    ("GrantStackEdges", "GrantStackEdges"),
    ("grantStack", "grantStack"),
    ("fiscalFederalism", "fiscalFederalism"),
    ("FiscalFederalism", "FiscalFederalism"),
    ("ffed_", "ffed_"),
    ("V1018", "V1018"),
    (" — V1018 fiscal federalism", " — V1018 fiscal federalism"),
    ("Generate V1018 fiscal", "Generate V1018 fiscal"),
    ("compliance matrix", "compliance matrix"),
    ("complianceScore", "complianceScore"),
    ("AUDIT_NODE", "AUDIT_NODE"),
    ("audit-trails/", "audit-trails/"),
]


def main() -> None:
    bundle_old = ROOT / "generated" / "grant-stack-bundle.ts"
    bundle_new = ROOT / "generated" / "grant-stack-bundle.ts"
    if bundle_old.exists() and not bundle_new.exists():
        bundle_old.rename(bundle_new)
    elif bundle_old.exists() and bundle_new.exists():
        bundle_old.unlink()

    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in {".ts", ".md", ".py"}:
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        for old, new in FIXES:
            text = text.replace(old, new)
        # fix spaced type names from "Compliance"
        text = re.sub(r"Compliance", "Compliance", text)
        text = re.sub(r"compliance", "compliance", text)
        if text != orig:
            path.write_text(text, encoding="utf-8")
    print("Fixup done.")


if __name__ == "__main__":
    main()
