#!/usr/bin/env python3
"""Fix broken identifiers after bulk transform."""
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]

FIXES = [
    ("V1020RpipeComplianceBand", "V1020RpipeComplianceBand"),
    ("ComplianceBand", "ComplianceBand"),
    ("complianceBand", "complianceBand"),
    ("complianceFromScore", "complianceFromScore"),
    ("complianceScore", "complianceScore"),
    ("pipelinePolicyFocus", "pipelinePolicyFocus"),
    ("regionalCompliance", "regionalCompliance"),
    ("RegionalCompliance", "RegionalCompliance"),
    ("V1020RpipeTransferSnapshot", "V1020RpipeTransferSnapshot"),
    ("pipelineSnapshots", "pipelineSnapshots"),
    ("Transfer", "Transfer"),
    ("commercialization-stack-bundle", "commercialization-stack-bundle"),
    ("commercializationStackDelayTurns", "commercializationStackDelayTurns"),
    ("commercializationStackGraphHash", "commercializationStackGraphHash"),
    ("commercializationStackPressure", "commercializationStackPressure"),
    ("V1020_RPIPE_mergeCommercializationStackEdges", "V1020_RPIPE_mergeCommercializationStackEdges"),
    ("GrantStackEdges", "GrantStackEdges"),
    ("commercializationStack", "commercializationStack"),
    ("fiscalFederalism", "fiscalFederalism"),
    ("FiscalFederalism", "FiscalFederalism"),
    ("ffed_", "ffed_"),
    ("V1018", "V1018"),
    (" — V1018 research pipeline", " — V1018 research pipeline"),
    ("Generate V1018 fiscal", "Generate V1018 fiscal"),
    ("compliance matrix", "compliance matrix"),
    ("complianceScore", "complianceScore"),
    ("LAB_TRANSFER_NODE", "LAB_TRANSFER_NODE"),
    ("lab-transfers/", "lab-transfers/"),
]


def main() -> None:
    bundle_old = ROOT / "generated" / "commercialization-stack-bundle.ts"
    bundle_new = ROOT / "generated" / "commercialization-stack-bundle.ts"
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
