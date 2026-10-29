#!/usr/bin/env python3
"""Transform copied v1016 tree into v1018 research pipeline naming."""
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1020-research-pipeline", "v1020-research-pipeline"),
    ("V1020_RPIPE", "V1020_RPIPE"),
    ("V1020Rpipe", "V1020Rpipe"),
    ("runV1020Rpipe", "runV1020Rpipe"),
    ("buildV1020Rpipe", "buildV1020Rpipe"),
    ("sanitizeV1020Rpipe", "sanitizeV1020Rpipe"),
    ("createEmptyV1020Rpipe", "createEmptyV1020Rpipe"),
    ("v1018Ffed", "v1018Ffed"),
    ("v1020_research_pipeline", "v1020_research_pipeline"),
    ("research_pipeline", "research_pipeline"),
    ("10.16.research_pipeline", "10.20.research_pipeline"),
    ("V10.20 Research pipeline", "V10.20 Research pipeline"),
    ("research pipeline", "research pipeline"),
    ("Research pipeline", "Research pipeline"),
    ("state–federal transfer", "state–federal transfer"),
    ("State–federal transfer", "State–federal transfer"),
    ("transfer", "transfer"),
    ("Transfer", "Transfer"),
    ("TRANSFER_", "TRANSFER_"),
    ("Transfer", "Transfer"),
    ("transfer", "transfer"),
    ("commercialization-stacks", "commercialization-stacks"),
    ("COMMERCIALIZATION_STACK_", "COMMERCIALIZATION_STACK_"),
    ("Commercialization stack", "Commercialization stack"),
    ("commercializationStack", "commercializationStack"),
    ("lab-transfers", "lab-transfers"),
    ("LAB_TRANSFER_", "LAB_TRANSFER_"),
    ("Compliance", "Compliance"),
    ("lab_transfer", "lab_transfer"),
    ("research-pipeline", "research-pipeline"),
    ("O6K-42", "O6K-42"),
    ("SECTION 20BL", "SECTION 20BL"),
    ("SECTION 20BL", "SECTION 20BL"),
    ("20BH state–federal transfer & lab_transfer", "20BL research pipeline, commercialization stacks & compliances"),
    ("20BI", "20BI"),
    ("save.meta.v1020", "save.meta.v1020"),
    ("meta.v1020", "meta.v1020"),
    ("v1020ResearchPipeline", "v1020ResearchPipeline"),
    ("v1018.", "v1018."),
    ("10200", "10200"),
    ("10200 + t", "10200 + t"),
]

# Rename files and dirs (deepest first)
RENAMES: list[tuple[str, str]] = [
    ("generated/pipeline-scenarios", "generated/pipeline-scenarios"),
    ("generated/commercialization-stacks", "generated/commercialization-stacks"),
    ("lab-transfers", "lab-transfers"),
    ("engine/research-pipeline-utils.ts", "engine/research-pipeline-utils.ts"),
    ("engine/research-pipeline-orchestrator.ts", "engine/research-pipeline-orchestrator.ts"),
    ("self-tests/run-v1016-nres-self-tests.ts", "self-tests/run-v1020-rpipe-self-tests.ts"),
    ("commercialization-stacks/graph-utils.ts", "commercialization-stacks/graph-utils.ts"),
    ("generated/pipeline-registry.ts", "generated/pipeline-registry.ts"),
    ("generated/commercialization-stack-bundle.ts", "generated/commercialization-stack-bundle.ts"),
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
    grant_dir = ROOT / "generated" / "commercialization-stacks"
    if grant_dir.is_dir():
        for p in sorted(grant_dir.glob("grant-*.ts")):
            p.rename(p.with_name(p.name.replace("grant-", "grant-")))

    lab_transfer_dir = ROOT / "lab-transfers"
    if lab_transfer_dir.is_dir():
        for p in sorted(lab_transfer_dir.glob("node-*.ts")):
            p.rename(p.with_name(p.name.replace("node-", "audit-")))

    for path in list(ROOT.rglob("*")):
        if path.is_file() and path.suffix in {".ts", ".md", ".py"}:
            raw = path.read_text(encoding="utf-8")
            new_raw = apply_replacements(raw)
            new_raw = new_raw.replace("grant-", "grant-")
            new_raw = new_raw.replace("/audit-", "/audit-")
            new_raw = new_raw.replace("lab_transfer_", "lab_transfer_")
            if new_raw != raw:
                path.write_text(new_raw, encoding="utf-8")

    print("Transform complete.")


if __name__ == "__main__":
    main()
