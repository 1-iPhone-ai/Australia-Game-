#!/usr/bin/env python3
"""Agent 11 O10-233 wave 51 round 51 — panmonism, sublimation, deification."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

PREV_SCHEMA = "10m.a11.composite.49"
NEXT_SCHEMA = "10m.a11.composite.50"


def clone_module(src_name: str, dst_name: str, replacements: list[tuple[str, str]]) -> None:
    text = (SRC / src_name).read_text()
    for old, new in replacements:
        text = text.replace(old, new)
    (SRC / dst_name).write_text(text)


def main() -> None:
    clone_module(
        "regional-collapse-omni-singularity-pantheosis.ts",
        "regional-collapse-omni-singularity-panmonism.ts",
        [
            ("Panmonism", "Panmonism"),
            ("panmonism", "panmonism"),
            ("Pantheosis", "Panmonism"),
            ("pantheosis", "panmonism"),
            ("Panidealism", "Pantheosis"),
            ("panidealism", "pantheosis"),
            ("Dissipation", "Evaporation"),
            ("dissipation", "evaporation"),
            ("Beatification", "Glorification"),
            ("beatification", "glorification"),
            ("collapseOmniSingularityPanidealism", "collapseOmniSingularityPantheosis"),
            ("voidTotalErosionDissipation", "voidTotalErosionEvaporation"),
            ("existentialAbsoluteNullityBeatification", "existentialAbsoluteNullityGlorification"),
            ("panidealismScore", "pantheosisScore"),
            ("dissipationScore", "evaporationScore"),
            ("beatificationScore", "glorificationScore"),
            ("'panidealism'", "'pantheosis'"),
            ("'complete_dissipation'", "'complete_evaporation'"),
            ("'total_beatification'", "'total_glorification'"),
        ],
    )

    clone_module(
        "interregional-void-total-erosion-evaporation.ts",
        "interregional-void-total-erosion-sublimation.ts",
        [
            ("Sublimation", "Sublimation"),
            ("sublimation", "sublimation"),
            ("Evaporation", "Sublimation"),
            ("evaporation", "sublimation"),
            ("Pantheosis", "Panmonism"),
            ("pantheosis", "panmonism"),
            ("voidTotalErosionEvaporation", "voidTotalErosionSublimation"),
            ("collapseOmniSingularityPanidealism", "collapseOmniSingularityPantheosis"),
            ("evaporationScore", "sublimationScore"),
            ("panidealismScore", "pantheosisScore"),
            ("'complete_evaporation'", "'complete_sublimation'"),
            ("'pantheosis'", "'panmonism'"),
            ("evaporating", "sublimating"),
            ("complete_sublimation", "complete_sublimation"),
        ],
    )

    clone_module(
        "settlement-existential-absolute-nullity-glorification.ts",
        "settlement-existential-absolute-nullity-deification.ts",
        [
            ("Deification", "Deification"),
            ("deification", "deification"),
            ("Glorification", "Deification"),
            ("glorification", "deification"),
            ("Pantheosis", "Panmonism"),
            ("pantheosis", "panmonism"),
            ("existentialAbsoluteNullityGlorification", "existentialAbsoluteNullityDeification"),
            ("collapseOmniSingularityPanidealism", "collapseOmniSingularityPantheosis"),
            ("glorificationScore", "deificationScore"),
            ("panidealismScore", "pantheosisScore"),
            ("'pantheosis'", "'panmonism'"),
            ("'total_glorification'", "'total_deification'"),
            ("glorifying", "deifying"),
            ("total_deification", "total_deification"),
        ],
    )

    types = (SRC / "types.ts").read_text()
    types = types.replace(
        f"export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '{PREV_SCHEMA}' as const;",
        f"export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '{NEXT_SCHEMA}' as const;",
    )
    types = types.replace(
        "  | 'existential_absolute_nullity_glorification';",
        "  | 'existential_absolute_nullity_glorification'\n"
        "  | 'collapse_omni_singularity_panmonism'\n"
        "  | 'void_total_erosion_sublimation'\n"
        "  | 'existential_absolute_nullity_deification';",
    )
    insert_after = """export interface OP10M_A11_ExistentialAbsoluteNullityGlorificationRow {
  regionId: OP10M_A11_RegionId;
  glorificationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityGlorificationBand;
  marks: string[];
  narrative: string;
}

"""
    new_types = """
export type OP10M_A11_CollapseOmniSingularityPanmonismBand = 'latent' | 'aligning' | 'total' | 'panmonism';

export interface OP10M_A11_CollapseOmniSingularityPanmonismRow {
  regionId: OP10M_A11_RegionId;
  panmonismScore: number;
  band: OP10M_A11_CollapseOmniSingularityPanmonismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionSublimationBand = 'dormant' | 'sublimating' | 'total' | 'complete_sublimation';

export interface OP10M_A11_VoidTotalErosionSublimationRow {
  regionId: OP10M_A11_RegionId;
  sublimationScore: number;
  band: OP10M_A11_VoidTotalErosionSublimationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityDeificationBand = 'trace' | 'deifying' | 'absolute' | 'total_deification';

export interface OP10M_A11_ExistentialAbsoluteNullityDeificationRow {
  regionId: OP10M_A11_RegionId;
  deificationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityDeificationBand;
  marks: string[];
  narrative: string;
}

"""
    if "PanmonismBand" not in types:
        types = types.replace(insert_after, insert_after + new_types)

    types = types.replace(
        """  nationalExistentialAbsoluteNullityGlorificationIndex: number;
  summary: string;""",
        """  nationalExistentialAbsoluteNullityGlorificationIndex: number;
  collapseOmniSingularityPanmonism: OP10M_A11_CollapseOmniSingularityPanmonismRow[];
  nationalCollapseOmniSingularityPanmonismIndex: number;
  voidTotalErosionSublimation: OP10M_A11_VoidTotalErosionSublimationRow[];
  nationalVoidTotalErosionSublimationIndex: number;
  existentialAbsoluteNullityDeification: OP10M_A11_ExistentialAbsoluteNullityDeificationRow[];
  nationalExistentialAbsoluteNullityDeificationIndex: number;
  summary: string;""",
    )
    types = types.replace(
        """  lastExistentialAbsoluteNullityGlorificationIndex: number;
  inputHash: string;""",
        """  lastExistentialAbsoluteNullityGlorificationIndex: number;
  lastCollapseOmniSingularityPanmonismIndex: number;
  lastVoidTotalErosionSublimationIndex: number;
  lastExistentialAbsoluteNullityDeificationIndex: number;
  inputHash: string;""",
    )
    (SRC / "types.ts").write_text(types)

    comp = (SRC / "composite-recompute.ts").read_text()
    import_block = """
import {
  op10mA11CollapseOmniSingularityPanmonismEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityPanmonism,
  op10mA11RegionsWithCollapseSingularityPanmonism,
} from './regional-collapse-omni-singularity-panmonism.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionSublimation,
  op10mA11RegionsWithTotalErosionSublimation,
  op10mA11VoidTotalErosionSublimationEscalating,
} from './interregional-void-total-erosion-sublimation.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityDeification,
  op10mA11ExistentialAbsoluteNullityDeificationEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityDeification,
} from './settlement-existential-absolute-nullity-deification.ts';
"""
    if "panmonism.ts" not in comp:
        comp = comp.replace(
            "} from './settlement-existential-absolute-nullity-glorification.ts';\n",
            "} from './settlement-existential-absolute-nullity-glorification.ts';\n" + import_block,
        )

    comp = comp.replace(
        "    lastExistentialAbsoluteNullityGlorificationIndex: 0,\n",
        "    lastExistentialAbsoluteNullityGlorificationIndex: 0,\n"
        "    lastCollapseOmniSingularityPanmonismIndex: 0,\n"
        "    lastVoidTotalErosionSublimationIndex: 0,\n"
        "    lastExistentialAbsoluteNullityDeificationIndex: 0,\n",
    )

    validation = """
  if (state.collapseOmniSingularityPanmonism.length !== 8) errs.push('collapse omni singularity panmonism row count');
  if (state.voidTotalErosionSublimation.length !== 8) errs.push('void total erosion sublimation row count');
  if (state.existentialAbsoluteNullityDeification.length !== 8) errs.push('existential absolute nullity deification row count');
  if (state.nationalCollapseOmniSingularityPanmonismIndex < 0 || state.nationalCollapseOmniSingularityPanmonismIndex > 100) errs.push('collapse omni singularity panmonism index out of range');
  if (state.nationalVoidTotalErosionSublimationIndex < 0 || state.nationalVoidTotalErosionSublimationIndex > 100) errs.push('void total erosion sublimation index out of range');
  if (state.nationalExistentialAbsoluteNullityDeificationIndex < 0 || state.nationalExistentialAbsoluteNullityDeificationIndex > 100) errs.push('existential absolute nullity deification index out of range');
"""
    if "panmonism row count" not in comp:
        comp = comp.replace(
            "  if (state.nationalExistentialAbsoluteNullityGlorificationIndex < 0 || state.nationalExistentialAbsoluteNullityGlorificationIndex > 100) errs.push('existential absolute nullity glorification index out of range');\n",
            "  if (state.nationalExistentialAbsoluteNullityGlorificationIndex < 0 || state.nationalExistentialAbsoluteNullityGlorificationIndex > 100) errs.push('existential absolute nullity glorification index out of range');\n"
            + validation,
        )

    compute_block = """
  const collapseOmniSingularityPanmonismOut = op10mA11ComputeRegionalCollapseOmniSingularityPanmonism({
    collapseOmniSingularityPantheosis: collapseOmniSingularityPantheosisOut.rows,
    voidTotalErosionEvaporation: voidTotalErosionEvaporationOut.rows,
    existentialAbsoluteNullityGlorification: existentialAbsoluteNullityGlorificationOut.rows,
  });

  const voidTotalErosionSublimationOut = op10mA11ComputeInterregionalVoidTotalErosionSublimation({
    voidTotalErosionEvaporation: voidTotalErosionEvaporationOut.rows,
    collapseOmniSingularityPantheosis: collapseOmniSingularityPantheosisOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityDeificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityDeification({
    existentialAbsoluteNullityGlorification: existentialAbsoluteNullityGlorificationOut.rows,
    collapseOmniSingularityPantheosis: collapseOmniSingularityPantheosisOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
    if "collapseOmniSingularityPanmonismOut" not in comp:
        comp = comp.replace(
            """  const existentialAbsoluteNullityGlorificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification({
    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
    collapseOmniSingularityPanidealism: collapseOmniSingularityPanidealismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const derivedRaw""",
            """  const existentialAbsoluteNullityGlorificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification({
    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
    collapseOmniSingularityPanidealism: collapseOmniSingularityPanidealismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
            + compute_block
            + """
  const derivedRaw""",
        )

    derived_insert_marker = """      existentialAbsoluteNullityGlorificationOut.nationalIndex >= 93 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;"""

    derived_block = """
  const singularityPanmonism = op10mA11RegionsWithCollapseSingularityPanmonism(
    collapseOmniSingularityPanmonismOut.rows,
  );
  if (
    singularityPanmonism.length >= 2 ||
    collapseOmniSingularityPanmonismOut.nationalIndex >= 82 ||
    op10mA11CollapseOmniSingularityPanmonismEscalating(
      collapseOmniSingularityPanmonismOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityPanmonismIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_panmonism',
      singularityPanmonism.slice(0, 5),
      `Regional collapse omni singularity panmonism (index ${collapseOmniSingularityPanmonismOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityPanmonismOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  const erosionSublimation = op10mA11RegionsWithTotalErosionSublimation(voidTotalErosionSublimationOut.rows);
  if (
    erosionSublimation.length >= 2 ||
    voidTotalErosionSublimationOut.nationalIndex >= 81 ||
    op10mA11VoidTotalErosionSublimationEscalating(
      voidTotalErosionSublimationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionSublimationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_sublimation',
      erosionSublimation.slice(0, 5),
      `Interregional void total erosion sublimation (index ${voidTotalErosionSublimationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionSublimationOut.nationalIndex >= 91 ? 'major' : 'meaningful',
    );
  }

  const nullityDeification = op10mA11RegionsWithTotalAbsoluteNullityDeification(
    existentialAbsoluteNullityDeificationOut.rows,
  );
  if (
    nullityDeification.length >= 2 ||
    existentialAbsoluteNullityDeificationOut.nationalIndex >= 83 ||
    op10mA11ExistentialAbsoluteNullityDeificationEscalating(
      existentialAbsoluteNullityDeificationOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityDeificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_deification',
      nullityDeification.slice(0, 5),
      `Settlement existential absolute nullity deification (index ${existentialAbsoluteNullityDeificationOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityDeificationOut.nationalIndex >= 93 ? 'major' : 'meaningful',
    );
  }
"""
    if "singularityPanmonism" not in comp:
        comp = comp.replace(
            derived_insert_marker,
            derived_insert_marker.replace(
                "  base.revision += 1;",
                derived_block + "\n  base.revision += 1;",
            ),
            1,
        )

    comp = comp.replace(
        "  base.lastExistentialAbsoluteNullityGlorificationIndex = existentialAbsoluteNullityGlorificationOut.nationalIndex;\n  base.inputHash",
        "  base.lastExistentialAbsoluteNullityGlorificationIndex = existentialAbsoluteNullityGlorificationOut.nationalIndex;\n"
        "  base.lastCollapseOmniSingularityPanmonismIndex = collapseOmniSingularityPanmonismOut.nationalIndex;\n"
        "  base.lastVoidTotalErosionSublimationIndex = voidTotalErosionSublimationOut.nationalIndex;\n"
        "  base.lastExistentialAbsoluteNullityDeificationIndex = existentialAbsoluteNullityDeificationOut.nationalIndex;\n"
        "  base.inputHash",
    )

    comp = comp.replace(
        "${existentialAbsoluteNullityGlorificationOut.nationalIndex}`,",
        "${existentialAbsoluteNullityGlorificationOut.nationalIndex}:${collapseOmniSingularityPanmonismOut.nationalIndex}:${voidTotalErosionSublimationOut.nationalIndex}:${existentialAbsoluteNullityDeificationOut.nationalIndex}`,",
    )

    comp = comp.replace(
        """    existentialAbsoluteNullityGlorification: existentialAbsoluteNullityGlorificationOut.rows,
    nationalExistentialAbsoluteNullityGlorificationIndex: existentialAbsoluteNullityGlorificationOut.nationalIndex,
    summary:""",
        """    existentialAbsoluteNullityGlorification: existentialAbsoluteNullityGlorificationOut.rows,
    nationalExistentialAbsoluteNullityGlorificationIndex: existentialAbsoluteNullityGlorificationOut.nationalIndex,
    collapseOmniSingularityPanmonism: collapseOmniSingularityPanmonismOut.rows,
    nationalCollapseOmniSingularityPanmonismIndex: collapseOmniSingularityPanmonismOut.nationalIndex,
    voidTotalErosionSublimation: voidTotalErosionSublimationOut.rows,
    nationalVoidTotalErosionSublimationIndex: voidTotalErosionSublimationOut.nationalIndex,
    existentialAbsoluteNullityDeification: existentialAbsoluteNullityDeificationOut.rows,
    nationalExistentialAbsoluteNullityDeificationIndex: existentialAbsoluteNullityDeificationOut.nationalIndex,
    summary:""",
    )

    comp = comp.replace(
        "nullity glorification ${existentialAbsoluteNullityGlorificationOut.nationalIndex}.`,",
        "nullity glorification ${existentialAbsoluteNullityGlorificationOut.nationalIndex}; omni panmonism ${collapseOmniSingularityPanmonismOut.nationalIndex}; erosion sublimation ${voidTotalErosionSublimationOut.nationalIndex}; nullity deification ${existentialAbsoluteNullityDeificationOut.nationalIndex}.`,",
    )

    (SRC / "composite-recompute.ts").write_text(comp)

    idx = (SRC / "index.ts").read_text()
    if "panmonism.ts" not in idx:
        idx = idx.replace(
            "export * from './settlement-existential-absolute-nullity-glorification.ts';\n",
            "export * from './settlement-existential-absolute-nullity-glorification.ts';\n"
            "export * from './regional-collapse-omni-singularity-panmonism.ts';\n"
            "export * from './interregional-void-total-erosion-sublimation.ts';\n"
            "export * from './settlement-existential-absolute-nullity-deification.ts';\n",
        )
        (SRC / "index.ts").write_text(idx)

    st = (SRC / "self-tests.ts").read_text()
    st = st.replace(
        f"composite.state.schemaVersion === '{PREV_SCHEMA}'",
        f"composite.state.schemaVersion === '{NEXT_SCHEMA}'",
    )
    imports = """
import { op10mA11ComputeRegionalCollapseOmniSingularityPanmonism } from './regional-collapse-omni-singularity-panmonism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionSublimation } from './interregional-void-total-erosion-sublimation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityDeification } from './settlement-existential-absolute-nullity-deification.ts';
"""
    if "Panmonism" not in st:
        st = st.replace(
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification } from './settlement-existential-absolute-nullity-glorification.ts';\n",
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification } from './settlement-existential-absolute-nullity-glorification.ts';\n"
            + imports,
        )

    wave51_tests = """
  const collapseOmniSingularityPanmonism = op10mA11ComputeRegionalCollapseOmniSingularityPanmonism({
    collapseOmniSingularityPantheosis: composite.state.collapseOmniSingularityPantheosis,
    voidTotalErosionEvaporation: composite.state.voidTotalErosionEvaporation,
    existentialAbsoluteNullityGlorification: composite.state.existentialAbsoluteNullityGlorification,
  });
  push(out, 'a11_447', composite.state.collapseOmniSingularityPanmonism.length === 8 && composite.state.nationalCollapseOmniSingularityPanmonismIndex === collapseOmniSingularityPanmonism.nationalIndex, `omni panmonism ${composite.state.nationalCollapseOmniSingularityPanmonismIndex}`);

  const voidTotalErosionSublimation = op10mA11ComputeInterregionalVoidTotalErosionSublimation({
    voidTotalErosionEvaporation: composite.state.voidTotalErosionEvaporation,
    collapseOmniSingularityPantheosis: composite.state.collapseOmniSingularityPantheosis,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_448', composite.state.voidTotalErosionSublimation.length === 8 && composite.state.nationalVoidTotalErosionSublimationIndex === voidTotalErosionSublimation.nationalIndex, `erosion sublimation ${composite.state.nationalVoidTotalErosionSublimationIndex}`);

  const existentialAbsoluteNullityDeification = op10mA11ComputeSettlementExistentialAbsoluteNullityDeification({
    existentialAbsoluteNullityGlorification: composite.state.existentialAbsoluteNullityGlorification,
    collapseOmniSingularityPantheosis: composite.state.collapseOmniSingularityPantheosis,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_449', composite.state.existentialAbsoluteNullityDeification.length === 8 && composite.state.nationalExistentialAbsoluteNullityDeificationIndex === existentialAbsoluteNullityDeification.nationalIndex, `nullity deification ${composite.state.nationalExistentialAbsoluteNullityDeificationIndex}`);

  push(out, 'a11_450', composite.state.collapseOmniSingularityPanmonism.every((p) => p.narrative.includes('collapse omni singularity panmonism')), composite.state.collapseOmniSingularityPanmonism[0]?.band ?? 'none');
  push(out, 'a11_451', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_panmonism') || composite.state.collapseOmniSingularityPanmonism.some((p) => p.band === 'total' || p.band === 'panmonism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_452', composite.derived.some((d) => d.kind === 'void_total_erosion_sublimation') || composite.state.voidTotalErosionSublimation.some((e) => e.band === 'total' || e.band === 'complete_sublimation'), composite.state.voidTotalErosionSublimation[0]?.band ?? 'none');
  push(out, 'a11_453', composite.persisted.lastVoidTotalErosionSublimationIndex === composite.state.nationalVoidTotalErosionSublimationIndex, `persisted sublimation ${composite.persisted.lastVoidTotalErosionSublimationIndex}`);
  push(out, 'a11_454', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_deification') || composite.state.existentialAbsoluteNullityDeification.some((c) => c.band === 'absolute' || c.band === 'total_deification'), composite.state.existentialAbsoluteNullityDeification[0]?.band ?? 'none');
  push(out, 'a11_455', composite.state.existentialAbsoluteNullityDeification.every((c) => c.narrative.includes('existential absolute nullity deification')), composite.state.existentialAbsoluteNullityDeification[0]?.band ?? 'none');
"""
    if "a11_447" not in st:
        st = st.replace(
            "  push(out, 'a11_446', composite.state.existentialAbsoluteNullityGlorification.every((c) => c.narrative.includes('existential absolute nullity glorification')), composite.state.existentialAbsoluteNullityGlorification[0]?.band ?? 'none');\n\n  return out;",
            "  push(out, 'a11_446', composite.state.existentialAbsoluteNullityGlorification.every((c) => c.narrative.includes('existential absolute nullity glorification')), composite.state.existentialAbsoluteNullityGlorification[0]?.band ?? 'none');"
            + wave51_tests
            + "\n  return out;",
        )
    (SRC / "self-tests.ts").write_text(st)

    harness_path = SRC / "integration/regional-regression-harness.ts"
    harness = harness_path.read_text()
    if "collapseOmniSingularityPanmonismIndex" not in harness:
        harness = harness.replace(
            "  existentialAbsoluteNullityGlorificationIndex: number;\n",
            "  existentialAbsoluteNullityGlorificationIndex: number;\n"
            "  collapseOmniSingularityPanmonismIndex: number;\n"
            "  voidTotalErosionSublimationIndex: number;\n"
            "  existentialAbsoluteNullityDeificationIndex: number;\n",
        )
        harness = harness.replace(
            "      existentialAbsoluteNullityGlorificationIndex: out.state.nationalExistentialAbsoluteNullityGlorificationIndex,\n",
            "      existentialAbsoluteNullityGlorificationIndex: out.state.nationalExistentialAbsoluteNullityGlorificationIndex,\n"
            "      collapseOmniSingularityPanmonismIndex: out.state.nationalCollapseOmniSingularityPanmonismIndex,\n"
            "      voidTotalErosionSublimationIndex: out.state.nationalVoidTotalErosionSublimationIndex,\n"
            "      existentialAbsoluteNullityDeificationIndex: out.state.nationalExistentialAbsoluteNullityDeificationIndex,\n",
        )
        harness = harness.replace(
            "  const nullityGlorificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityGlorificationIndex >= 8 && s.existentialAbsoluteNullityGlorificationIndex <= 100,\n"
            "  );\n",
            "  const nullityGlorificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityGlorificationIndex >= 8 && s.existentialAbsoluteNullityGlorificationIndex <= 100,\n"
            "  );\n"
            "  const omniPanmonismStable = snapshots.every(\n"
            "    (s) => s.collapseOmniSingularityPanmonismIndex >= 8 && s.collapseOmniSingularityPanmonismIndex <= 100,\n"
            "  );\n"
            "  const erosionSublimationStable = snapshots.every(\n"
            "    (s) => s.voidTotalErosionSublimationIndex >= 8 && s.voidTotalErosionSublimationIndex <= 100,\n"
            "  );\n"
            "  const nullityDeificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityDeificationIndex >= 8 && s.existentialAbsoluteNullityDeificationIndex <= 100,\n"
            "  );\n",
        )
        harness = harness.replace(
            "    nullityGlorificationStable;",
            "    nullityGlorificationStable &&\n    omniPanmonismStable &&\n    erosionSublimationStable &&\n    nullityDeificationStable;",
        )
        harness = harness.replace(
            "nullity glorification ${snapshots[snapshots.length - 1].existentialAbsoluteNullityGlorificationIndex}`",
            "nullity deification ${snapshots[snapshots.length - 1].existentialAbsoluteNullityDeificationIndex}`",
        )
        harness_path.write_text(harness)

    readme = ROOT / "README.md"
    text = readme.read_text()
    if "round 51" not in text:
        text = re.sub(
            r"\*\*Scale wave round 50 \(O10-231\):\*\*[^\n]+\n",
            "**Scale wave round 51 (O10-233):** regional collapse omni singularity panmonism, interregional void total erosion sublimation, settlement existential absolute nullity deification (schema `10m.a11.composite.50`).\n",
            text,
            count=1,
        )
        readme.write_text(text)

    integration = ROOT / "INTEGRATION.md"
    intext = integration.read_text()
    if "round 51" not in intext:
        intext = intext.replace(
            "### Scale wave round 50 (O10-231, schema `10m.a11.composite.48`)",
            "### Scale wave round 51 (O10-233, schema `10m.a11.composite.50`)\n\n"
            "- **Regional collapse omni singularity panmonism** — pantheosis × evaporation × glorification (`op10mA11ComputeRegionalCollapseOmniSingularityPanmonism`)\n"
            "- **Interregional void total erosion sublimation** — evaporation × pantheosis × void front (`op10mA11ComputeInterregionalVoidTotalErosionSublimation`)\n"
            "- **Settlement existential absolute nullity deification** — glorification × pantheosis × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityDeification`)\n"
            "- Derived events: `collapse_omni_singularity_panmonism`, `void_total_erosion_sublimation`, `existential_absolute_nullity_deification`\n\n"
            "### Scale wave round 50 (O10-231, schema `10m.a11.composite.48`)",
        )
        integration.write_text(intext)

    print("wave 51 round 51 patches applied")


if __name__ == "__main__":
    main()
