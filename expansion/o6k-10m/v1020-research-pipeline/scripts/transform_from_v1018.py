#!/usr/bin/env python3
"""Transform copied v1018 fiscal federalism tree into v1020 research pipeline (O6K-42)."""
from __future__ import annotations

import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parents[1]

DIR_RENAMES = [
    ("generated/transfer-scenarios", "generated/pipeline-scenarios"),
    ("generated/grant-stacks", "generated/commercialization-stacks"),
    ("grant-stacks", "commercialization-stacks"),
    ("audit-trails", "lab-transfers"),
]

FILE_RENAMES = [
    ("engine/fiscal-federalism-orchestrator.ts", "engine/research-pipeline-orchestrator.ts"),
    ("engine/fiscal-federalism-utils.ts", "engine/research-pipeline-utils.ts"),
    ("self-tests/run-v1018-ffed-self-tests.ts", "self-tests/run-v1020-rpipe-self-tests.ts"),
    ("generated/transfer-registry.ts", "generated/pipeline-registry.ts"),
    ("generated/grant-stack-bundle.ts", "generated/commercialization-stack-bundle.ts"),
    ("commercialization-stacks/graph-utils.ts", "commercialization-stacks/graph-utils.ts"),
    ("adapters/adapter-commercialization-20be.ts", "adapters/adapter-commercialization-20be.ts"),
    ("adapters/adapter-lab-transfer-20bj.ts", "adapters/adapter-lab-transfer-20bj.ts"),
]

# Order matters: longer / more specific tokens first.
TEXT_REPLACEMENTS = [
    ("v1018-fiscal-federalism", "v1020-research-pipeline"),
    ("v1018_fiscal_federalism", "v1020_research_pipeline"),
    ("v1018.fiscal_federalism", "v1020.research_pipeline"),
    ("v1018FiscalFederalism", "v1020ResearchPipeline"),
    ("run-v1018-ffed-self-tests", "run-v1020-rpipe-self-tests"),
    ("runV1018FfedSelfTestsForLab", "runV1020RpipeSelfTestsForLab"),
    ("runV1018FfedSelfTests", "runV1020RpipeSelfTests"),
    ("buildV1018FfedTurnInputFromGameStateStub", "buildV1020RpipeTurnInputFromGameStateStub"),
    ("buildV1018FfedTurnInputFromGameState", "buildV1020RpipeTurnInputFromGameState"),
    ("sanitizeV1018FfedPersisted", "sanitizeV1020RpipePersisted"),
    ("createEmptyV1018FfedPersisted", "createEmptyV1020RpipePersisted"),
    ("runV1018FfedTurn", "runV1020RpipeTurn"),
    ("v1018FfedSelfTestCheck", "v1020RpipeSelfTestCheck"),
    ("v1018FfedInputHash", "v1020RpipeInputHash"),
    ("v1018_ffed_", "v1020_rpipe_"),
    ("v1016_ffed_", "v1020_rpipe_"),
    ("V1018_FFED_GENERATED_GRANT_STACK_EDGES", "V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES"),
    ("V1018_FFED_grantStackGraphHash", "V1020_RPIPE_commercializationStackGraphHash"),
    ("V1018_FFED_mergeGrantStackEdges", "V1020_RPIPE_mergeCommercializationStackEdges"),
    ("V1018_FFED_ALL_TRANSFER_SCENARIO_IDS", "V1020_RPIPE_ALL_PIPELINE_SCENARIO_IDS"),
    ("V1018_FFED_evaluateTransferBatch", "V1020_RPIPE_evaluatePipelineBatch"),
    ("V1018_FFED_listActiveTransferScenarioIds", "V1020_RPIPE_listActivePipelineScenarioIds"),
    ("V1018_FFED_runTransferScenarioRegressionSweep", "V1020_RPIPE_runPipelineScenarioRegressionSweep"),
    ("V1018_FFED_TRANSFER_SCENARIO_", "V1020_RPIPE_PIPELINE_SCENARIO_"),
    ("V1018_FFED_AUDIT_NODE_", "V1020_RPIPE_LAB_TRANSFER_NODE_"),
    ("V1018_FFED_GRANT_STACK_", "V1020_RPIPE_COMMERCIALIZATION_STACK_"),
    ("readV1018Ffed", "readV1020Rpipe"),
    ("computeV1018Ffed", "computeV1020Rpipe"),
    ("applyV1018Ffed", "applyV1020Rpipe"),
    ("V1018Ffed", "V1020Rpipe"),
    ("V1018_FFED", "V1020_RPIPE"),
    ("fiscal-federalism-orchestrator", "research-pipeline-orchestrator"),
    ("fiscal-federalism-utils", "research-pipeline-utils"),
    ("federalismPolicyFocus", "pipelinePolicyFocus"),
    ("fiscalHeadroom", "researchHeadroom"),
    ("grant-stack-bundle", "commercialization-stack-bundle"),
    ("grant-stack-bundle.ts", "commercialization-stack-bundle.ts"),
    ("grant-stack-bundle", "commercialization-stack-bundle"),
    ("grant-stack-graph", "commercialization_stack_graph"),
    ("grantStackIndex", "commercializationStackIndex"),
    ("grantStack", "commercializationStack"),
    ("grant-stack", "commercialization-stack"),
    ("grant_stack", "commercialization_stack"),
    ("GRANT_STACK", "COMMERCIALIZATION_STACK"),
    ("Grant stack", "Commercialization stack"),
    ("grant stacks", "commercialization stacks"),
    ("grant stack", "commercialization stack"),
    ("transfer-registry", "pipeline-registry"),
    ("transfer-scenarios", "pipeline-scenarios"),
    ("transfer_snapshots", "pipeline_snapshots"),
    ("transferSnapshots", "pipelineSnapshots"),
    ("Transfer snapshot", "Pipeline snapshot"),
    ("transfer snapshot", "pipeline snapshot"),
    ("TRANSFER_SCENARIO", "PIPELINE_SCENARIO"),
    ("transfer scenario", "pipeline scenario"),
    ("Transfer scenario", "Pipeline scenario"),
    ("transfer_", "pipeline_"),
    ("audit-trails", "lab-transfers"),
    ("audit_trail", "lab_transfer"),
    ("audit-trail", "lab-transfer"),
    ("AUDIT_TRAIL", "LAB_TRANSFER"),
    ("AUDIT_NODE", "LAB_TRANSFER_NODE"),
    ("audit_", "lab_transfer_"),
    ("activeComplianceNodeIds", "activeLabTransferNodeIds"),
    ("Compliance node", "Lab transfer node"),
    ("compliance node", "lab transfer node"),
    ("fiscal_federalism", "research_pipeline"),
    ("fiscal federalism", "research pipeline"),
    ("Fiscal federalism", "Research pipeline"),
    ("fiscal-federalism", "research-pipeline"),
    ("10.18.fiscal_federalism", "10.20.research_pipeline"),
    ("V10.18 Fiscal federalism", "V10.20 Research pipeline"),
    ("V10.18", "V10.20"),
    ("10.18.", "10.20."),
    ("SECTION 20BJ", "SECTION 20BL"),
    ("SECTION 20BI", "SECTION 20BL"),
    ("20BJ transfers", "20BL research pipeline"),
    ("20BI transfers", "20BL research pipeline"),
    ("O6K-37", "O6K-42"),
    ("save.meta.v1018", "save.meta.v1020"),
    ("meta.v1018", "meta.v1020"),
    ("8180", "10200"),
    ("8000 + t", "10200 + t"),
    ("grant-stacks/", "commercialization-stacks/"),
    ("../grant-stacks/", "../commercialization-stacks/"),
    ("from '../generated/grant-stack-bundle'", "from '../generated/commercialization-stack-bundle'"),
    ("from './grant-stack-bundle'", "from './commercialization-stack-bundle'"),
    ("from './transfer-registry'", "from './pipeline-registry'"),
    ("from '../generated/transfer-registry'", "from '../generated/pipeline-registry'"),
    ("adapter-v1014-supply-20bb.ts", "adapter-v1014-supply-20bb.ts"),
    ("adapter-crosswire-hub.ts", "adapter-crosswire-hub.ts"),
]


def apply_text(s: str) -> str:
    for old, new in TEXT_REPLACEMENTS:
        s = s.replace(old, new)
    return s


def main() -> None:
    for old_rel, new_rel in sorted(DIR_RENAMES, key=lambda x: -len(x[0])):
        old = ROOT / old_rel
        new = ROOT / new_rel
        if old.exists():
            new.parent.mkdir(parents=True, exist_ok=True)
            if new.exists():
                shutil.rmtree(new)
            old.rename(new)

    for old_rel, new_rel in FILE_RENAMES:
        old = ROOT / old_rel
        new = ROOT / new_rel
        if old.exists() and old != new:
            new.parent.mkdir(parents=True, exist_ok=True)
            if new.exists():
                new.unlink()
            old.rename(new)

    comm_dir = ROOT / "generated" / "commercialization-stacks"
    if comm_dir.is_dir():
        for p in sorted(comm_dir.glob("grant-*.ts")):
            p.rename(p.with_name(p.name.replace("grant-", "commercialization-")))

    lab_dir = ROOT / "lab-transfers"
    if lab_dir.is_dir():
        for p in sorted(lab_dir.glob("audit-*.ts")):
            p.rename(p.with_name(p.name.replace("audit-", "lab-transfer-")))

    scen_dir = ROOT / "generated" / "pipeline-scenarios"
    if scen_dir.is_dir():
        pass  # keep scenario-*.ts names

    for path in list(ROOT.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix not in {".ts", ".md", ".py"}:
            continue
        if "scripts/transform_from_v1018.py" in str(path):
            continue
        raw = path.read_text(encoding="utf-8")
        new_raw = apply_text(raw)
        new_raw = new_raw.replace("commercialization-commercialization-", "commercialization-")
        new_raw = new_raw.replace("lab_transfer_lab_transfer_", "lab_transfer_")
        if new_raw != raw:
            path.write_text(new_raw, encoding="utf-8")

    # Dedicated commercialization + lab-transfer adapter stubs (from cross-wire copies)
    supply = ROOT / "adapters" / "adapter-v1014-supply-20bb.ts"
    comm = ROOT / "adapters" / "adapter-commercialization-20be.ts"
    lab = ROOT / "adapters" / "adapter-lab-transfer-20bj.ts"
    if supply.exists() and not comm.exists():
        text = apply_text(supply.read_text(encoding="utf-8"))
        text = text.replace("SECTION 20BB", "SECTION 20BE — commercialization bridge")
        text = text.replace("supply chain depth", "AI fidelity / commercialization depth")
        text = text.replace("Supply20bb", "Commercialization20be")
        text = text.replace("supply20bb", "aiFidelity20be")
        text = text.replace("BottleneckOverrides", "CommercializationOverrides")
        text = text.replace("bottleneckDelta", "commercializationDelta")
        comm.write_text(text, encoding="utf-8")
    if supply.exists() and not lab.exists():
        text = apply_text(supply.read_text(encoding="utf-8"))
        text = text.replace("SECTION 20BB", "SECTION 20BJ — lab transfer bridge")
        text = text.replace("supply chain depth", "fiscal federalism lab transfer depth")
        text = text.replace("Supply20bb", "LabTransfer20bj")
        text = text.replace("supply20bb", "fiscalFederalism20bj")
        text = text.replace("BottleneckOverrides", "LabTransferOverrides")
        text = text.replace("bottleneckDelta", "labTransferDelta")
        lab.write_text(text, encoding="utf-8")

    print("Transform complete.")


if __name__ == "__main__":
    main()
