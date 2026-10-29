#!/usr/bin/env python3
"""Agent 11 O10-231 wave 50 round 50 — pantheosis, evaporation, glorification."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def clone_module(src_name: str, dst_name: str, replacements: list[tuple[str, str]]) -> None:
    text = (SRC / src_name).read_text()
    for old, new in replacements:
        text = text.replace(old, new)
    (SRC / dst_name).write_text(text)


def main() -> None:
    clone_module(
        "regional-collapse-omni-singularity-panidealism.ts",
        "regional-collapse-omni-singularity-pantheosis.ts",
        [
            ("Pantheosis", "Pantheosis"),
            ("pantheosis", "pantheosis"),
            ("Panpsychism", "Pantheosis"),
            ("panpsychism", "pantheosis"),
            ("Attenuation", "Evaporation"),
            ("attenuation", "evaporation"),
            ("Consecration", "Glorification"),
            ("consecration", "glorification"),
            ("collapseOmniSingularityPanidealism", "collapseOmniSingularityPantheosis"),
            ("voidTotalErosionDissipation", "voidTotalErosionEvaporation"),
            ("existentialAbsoluteNullityBeatification", "existentialAbsoluteNullityGlorification"),
            ("panidealismScore", "pantheosisScore"),
            ("dissipationScore", "evaporationScore"),
            ("beatificationScore", "glorificationScore"),
            ("'pantheosis'", "'pantheosis'"),
            ("'complete_attenuation'", "'complete_evaporation'"),
            ("'total_consecration'", "'total_glorification'"),
        ],
    )

    clone_module(
        "interregional-void-total-erosion-dissipation.ts",
        "interregional-void-total-erosion-evaporation.ts",
        [
            ("Evaporation", "Evaporation"),
            ("evaporation", "evaporation"),
            ("Attenuation", "Evaporation"),
            ("attenuation", "evaporation"),
            ("Panpsychism", "Pantheosis"),
            ("panpsychism", "pantheosis"),
            ("voidTotalErosionDissipation", "voidTotalErosionEvaporation"),
            ("collapseOmniSingularityPanidealism", "collapseOmniSingularityPantheosis"),
            ("dissipationScore", "evaporationScore"),
            ("panidealismScore", "pantheosisScore"),
            ("'complete_attenuation'", "'complete_evaporation'"),
            ("'panidealism'", "'pantheosis'"),
            ("evaporating", "evaporating"),
            ("complete_evaporation", "complete_evaporation"),
        ],
    )

    clone_module(
        "settlement-existential-absolute-nullity-beatification.ts",
        "settlement-existential-absolute-nullity-glorification.ts",
        [
            ("Glorification", "Glorification"),
            ("glorification", "glorification"),
            ("Consecration", "Glorification"),
            ("consecration", "glorification"),
            ("Panpsychism", "Pantheosis"),
            ("panpsychism", "pantheosis"),
            ("existentialAbsoluteNullityBeatification", "existentialAbsoluteNullityGlorification"),
            ("collapseOmniSingularityPanidealism", "collapseOmniSingularityPantheosis"),
            ("beatificationScore", "glorificationScore"),
            ("panidealismScore", "pantheosisScore"),
            ("'panidealism'", "'pantheosis'"),
            ("'total_consecration'", "'total_glorification'"),
            ("glorifying", "glorifying"),
            ("total_glorification", "total_glorification"),
        ],
    )

    types = (SRC / "types.ts").read_text()
    types = types.replace(
        "export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.49' as const;",
        "export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.49' as const;",
    )
    types = types.replace(
        "  | 'existential_absolute_nullity_consecration';",
        "  | 'existential_absolute_nullity_consecration'\n"
        "  | 'collapse_omni_singularity_pantheosis'\n"
        "  | 'void_total_erosion_evaporation'\n"
        "  | 'existential_absolute_nullity_glorification';",
    )
    insert_after = """export interface OP10M_A11_ExistentialAbsoluteNullityConsecrationRow {
  regionId: OP10M_A11_RegionId;
  beatificationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityConsecrationBand;
  marks: string[];
  narrative: string;
}

"""
    new_types = """
export type OP10M_A11_CollapseOmniSingularityPantheosisBand = 'latent' | 'aligning' | 'total' | 'pantheosis';

export interface OP10M_A11_CollapseOmniSingularityPantheosisRow {
  regionId: OP10M_A11_RegionId;
  pantheosisScore: number;
  band: OP10M_A11_CollapseOmniSingularityPantheosisBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionEvaporationBand = 'dormant' | 'evaporating' | 'total' | 'complete_evaporation';

export interface OP10M_A11_VoidTotalErosionEvaporationRow {
  regionId: OP10M_A11_RegionId;
  evaporationScore: number;
  band: OP10M_A11_VoidTotalErosionEvaporationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityGlorificationBand = 'trace' | 'glorifying' | 'absolute' | 'total_glorification';

export interface OP10M_A11_ExistentialAbsoluteNullityGlorificationRow {
  regionId: OP10M_A11_RegionId;
  glorificationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityGlorificationBand;
  marks: string[];
  narrative: string;
}

"""
    if "PantheosisBand" not in types:
        types = types.replace(insert_after, insert_after + new_types)

    types = types.replace(
        """  nationalExistentialAbsoluteNullityConsecrationIndex: number;
  summary: string;""",
        """  nationalExistentialAbsoluteNullityConsecrationIndex: number;
  collapseOmniSingularityPantheosis: OP10M_A11_CollapseOmniSingularityPantheosisRow[];
  nationalCollapseOmniSingularityPantheosisIndex: number;
  voidTotalErosionEvaporation: OP10M_A11_VoidTotalErosionEvaporationRow[];
  nationalVoidTotalErosionEvaporationIndex: number;
  existentialAbsoluteNullityGlorification: OP10M_A11_ExistentialAbsoluteNullityGlorificationRow[];
  nationalExistentialAbsoluteNullityGlorificationIndex: number;
  summary: string;""",
    )
    types = types.replace(
        """  lastExistentialAbsoluteNullityConsecrationIndex: number;
  inputHash: string;""",
        """  lastExistentialAbsoluteNullityConsecrationIndex: number;
  lastCollapseOmniSingularityPantheosisIndex: number;
  lastVoidTotalErosionEvaporationIndex: number;
  lastExistentialAbsoluteNullityGlorificationIndex: number;
  inputHash: string;""",
    )
    (SRC / "types.ts").write_text(types)

    comp = (SRC / "composite-recompute.ts").read_text()
    import_block = """
import {
  op10mA11CollapseOmniSingularityPantheosisEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityPantheosis,
  op10mA11RegionsWithCollapseSingularityPantheosis,
} from './regional-collapse-omni-singularity-pantheosis.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionEvaporation,
  op10mA11RegionsWithTotalErosionEvaporation,
  op10mA11VoidTotalErosionEvaporationEscalating,
} from './interregional-void-total-erosion-evaporation.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification,
  op10mA11ExistentialAbsoluteNullityGlorificationEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityGlorification,
} from './settlement-existential-absolute-nullity-glorification.ts';
"""
    if "pantheosis.ts" not in comp:
        comp = comp.replace(
            "} from './settlement-existential-absolute-nullity-consecration.ts';\n",
            "} from './settlement-existential-absolute-nullity-consecration.ts';\n" + import_block,
        )

    comp = comp.replace(
        "    lastExistentialAbsoluteNullityConsecrationIndex: 0,\n",
        "    lastExistentialAbsoluteNullityConsecrationIndex: 0,\n"
        "    lastCollapseOmniSingularityPantheosisIndex: 0,\n"
        "    lastVoidTotalErosionEvaporationIndex: 0,\n"
        "    lastExistentialAbsoluteNullityGlorificationIndex: 0,\n",
    )

    validation = """
  if (state.collapseOmniSingularityPantheosis.length !== 8) errs.push('collapse omni singularity pantheosis row count');
  if (state.voidTotalErosionEvaporation.length !== 8) errs.push('void total erosion evaporation row count');
  if (state.existentialAbsoluteNullityGlorification.length !== 8) errs.push('existential absolute nullity glorification row count');
  if (state.nationalCollapseOmniSingularityPantheosisIndex < 0 || state.nationalCollapseOmniSingularityPantheosisIndex > 100) errs.push('collapse omni singularity pantheosis index out of range');
  if (state.nationalVoidTotalErosionEvaporationIndex < 0 || state.nationalVoidTotalErosionEvaporationIndex > 100) errs.push('void total erosion evaporation index out of range');
  if (state.nationalExistentialAbsoluteNullityGlorificationIndex < 0 || state.nationalExistentialAbsoluteNullityGlorificationIndex > 100) errs.push('existential absolute nullity glorification index out of range');
"""
    if "pantheosis row count" not in comp:
        comp = comp.replace(
            "  if (state.nationalExistentialAbsoluteNullityConsecrationIndex < 0 || state.nationalExistentialAbsoluteNullityConsecrationIndex > 100) errs.push('existential absolute nullity consecration index out of range');\n",
            "  if (state.nationalExistentialAbsoluteNullityConsecrationIndex < 0 || state.nationalExistentialAbsoluteNullityConsecrationIndex > 100) errs.push('existential absolute nullity consecration index out of range');\n"
            + validation,
        )

    compute_block = """
  const collapseOmniSingularityPantheosisOut = op10mA11ComputeRegionalCollapseOmniSingularityPantheosis({
    collapseOmniSingularityPanidealism: collapseOmniSingularityPanidealismOut.rows,
    voidTotalErosionDissipation: voidTotalErosionDissipationOut.rows,
    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
  });

  const voidTotalErosionEvaporationOut = op10mA11ComputeInterregionalVoidTotalErosionEvaporation({
    voidTotalErosionDissipation: voidTotalErosionDissipationOut.rows,
    collapseOmniSingularityPanidealism: collapseOmniSingularityPanidealismOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityGlorificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification({
    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
    collapseOmniSingularityPanidealism: collapseOmniSingularityPanidealismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
    if "collapseOmniSingularityPantheosisOut" not in comp:
        comp = comp.replace(
            """  const existentialAbsoluteNullityBeatificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration({
    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const derivedRaw""",
            """  const existentialAbsoluteNullityBeatificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration({
    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
            + compute_block
            + """
  const derivedRaw""",
        )

    derived_insert_marker = """      existentialAbsoluteNullityBeatificationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;"""

    derived_block = """
  const singularityPantheosis = op10mA11RegionsWithCollapseSingularityPantheosis(
    collapseOmniSingularityPantheosisOut.rows,
  );
  if (
    singularityPantheosis.length >= 2 ||
    collapseOmniSingularityPantheosisOut.nationalIndex >= 82 ||
    op10mA11CollapseOmniSingularityPantheosisEscalating(
      collapseOmniSingularityPantheosisOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityPantheosisIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_pantheosis',
      singularityPantheosis.slice(0, 5),
      `Regional collapse omni singularity pantheosis (index ${collapseOmniSingularityPantheosisOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityPantheosisOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  const erosionEvaporation = op10mA11RegionsWithTotalErosionEvaporation(voidTotalErosionEvaporationOut.rows);
  if (
    erosionEvaporation.length >= 2 ||
    voidTotalErosionEvaporationOut.nationalIndex >= 81 ||
    op10mA11VoidTotalErosionEvaporationEscalating(
      voidTotalErosionEvaporationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionEvaporationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_evaporation',
      erosionEvaporation.slice(0, 5),
      `Interregional void total erosion evaporation (index ${voidTotalErosionEvaporationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionEvaporationOut.nationalIndex >= 91 ? 'major' : 'meaningful',
    );
  }

  const nullityGlorification = op10mA11RegionsWithTotalAbsoluteNullityGlorification(
    existentialAbsoluteNullityGlorificationOut.rows,
  );
  if (
    nullityGlorification.length >= 2 ||
    existentialAbsoluteNullityGlorificationOut.nationalIndex >= 83 ||
    op10mA11ExistentialAbsoluteNullityGlorificationEscalating(
      existentialAbsoluteNullityGlorificationOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityGlorificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_glorification',
      nullityGlorification.slice(0, 5),
      `Settlement existential absolute nullity glorification (index ${existentialAbsoluteNullityGlorificationOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityGlorificationOut.nationalIndex >= 93 ? 'major' : 'meaningful',
    );
  }
"""
    if "singularityPantheosis" not in comp:
        comp = comp.replace(
            derived_insert_marker,
            """      existentialAbsoluteNullityBeatificationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }
"""
            + derived_block
            + """
  base.revision += 1;""",
            1,
        )

    comp = comp.replace(
        "  base.lastExistentialAbsoluteNullityConsecrationIndex = existentialAbsoluteNullityBeatificationOut.nationalIndex;\n  base.inputHash",
        "  base.lastExistentialAbsoluteNullityConsecrationIndex = existentialAbsoluteNullityBeatificationOut.nationalIndex;\n"
        "  base.lastCollapseOmniSingularityPantheosisIndex = collapseOmniSingularityPantheosisOut.nationalIndex;\n"
        "  base.lastVoidTotalErosionEvaporationIndex = voidTotalErosionEvaporationOut.nationalIndex;\n"
        "  base.lastExistentialAbsoluteNullityGlorificationIndex = existentialAbsoluteNullityGlorificationOut.nationalIndex;\n"
        "  base.inputHash",
    )

    comp = comp.replace(
        "${existentialAbsoluteNullityBeatificationOut.nationalIndex}`,",
        "${existentialAbsoluteNullityBeatificationOut.nationalIndex}:${collapseOmniSingularityPantheosisOut.nationalIndex}:${voidTotalErosionEvaporationOut.nationalIndex}:${existentialAbsoluteNullityGlorificationOut.nationalIndex}`,",
    )

    comp = comp.replace(
        """    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
    nationalExistentialAbsoluteNullityConsecrationIndex: existentialAbsoluteNullityBeatificationOut.nationalIndex,
    summary:""",
        """    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
    nationalExistentialAbsoluteNullityConsecrationIndex: existentialAbsoluteNullityBeatificationOut.nationalIndex,
    collapseOmniSingularityPantheosis: collapseOmniSingularityPantheosisOut.rows,
    nationalCollapseOmniSingularityPantheosisIndex: collapseOmniSingularityPantheosisOut.nationalIndex,
    voidTotalErosionEvaporation: voidTotalErosionEvaporationOut.rows,
    nationalVoidTotalErosionEvaporationIndex: voidTotalErosionEvaporationOut.nationalIndex,
    existentialAbsoluteNullityGlorification: existentialAbsoluteNullityGlorificationOut.rows,
    nationalExistentialAbsoluteNullityGlorificationIndex: existentialAbsoluteNullityGlorificationOut.nationalIndex,
    summary:""",
    )

    comp = comp.replace(
        "nullity consecration ${existentialAbsoluteNullityBeatificationOut.nationalIndex}.`,",
        "nullity consecration ${existentialAbsoluteNullityBeatificationOut.nationalIndex}; omni pantheosis ${collapseOmniSingularityPantheosisOut.nationalIndex}; erosion evaporation ${voidTotalErosionEvaporationOut.nationalIndex}; nullity glorification ${existentialAbsoluteNullityGlorificationOut.nationalIndex}.`,",
    )

    (SRC / "composite-recompute.ts").write_text(comp)

    idx = (SRC / "index.ts").read_text()
    if "pantheosis.ts" not in idx:
        idx = idx.replace(
            "export * from './settlement-existential-absolute-nullity-consecration.ts';\n",
            "export * from './settlement-existential-absolute-nullity-consecration.ts';\n"
            "export * from './regional-collapse-omni-singularity-pantheosis.ts';\n"
            "export * from './interregional-void-total-erosion-evaporation.ts';\n"
            "export * from './settlement-existential-absolute-nullity-glorification.ts';\n",
        )
        (SRC / "index.ts").write_text(idx)

    st = (SRC / "self-tests.ts").read_text()
    st = st.replace(
        "composite.state.schemaVersion === '10m.a11.composite.47'",
        "composite.state.schemaVersion === '10m.a11.composite.49'",
    )
    imports = """
import { op10mA11ComputeRegionalCollapseOmniSingularityPantheosis } from './regional-collapse-omni-singularity-pantheosis.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionEvaporation } from './interregional-void-total-erosion-evaporation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification } from './settlement-existential-absolute-nullity-glorification.ts';
"""
    if "Pantheosis" not in st:
        st = st.replace(
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration } from './settlement-existential-absolute-nullity-consecration.ts';\n",
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration } from './settlement-existential-absolute-nullity-consecration.ts';\n"
            + imports,
        )

    wave50_tests = """
  const collapseOmniSingularityPantheosis = op10mA11ComputeRegionalCollapseOmniSingularityPantheosis({
    collapseOmniSingularityPanidealism: composite.state.collapseOmniSingularityPanidealism,
    voidTotalErosionDissipation: composite.state.voidTotalErosionDissipation,
    existentialAbsoluteNullityBeatification: composite.state.existentialAbsoluteNullityBeatification,
  });
  push(out, 'a11_438', composite.state.collapseOmniSingularityPantheosis.length === 8 && composite.state.nationalCollapseOmniSingularityPantheosisIndex === collapseOmniSingularityPantheosis.nationalIndex, `omni pantheosis ${composite.state.nationalCollapseOmniSingularityPantheosisIndex}`);

  const voidTotalErosionEvaporation = op10mA11ComputeInterregionalVoidTotalErosionEvaporation({
    voidTotalErosionDissipation: composite.state.voidTotalErosionDissipation,
    collapseOmniSingularityPanidealism: composite.state.collapseOmniSingularityPanidealism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_439', composite.state.voidTotalErosionEvaporation.length === 8 && composite.state.nationalVoidTotalErosionEvaporationIndex === voidTotalErosionEvaporation.nationalIndex, `erosion evaporation ${composite.state.nationalVoidTotalErosionEvaporationIndex}`);

  const existentialAbsoluteNullityGlorification = op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification({
    existentialAbsoluteNullityBeatification: composite.state.existentialAbsoluteNullityBeatification,
    collapseOmniSingularityPanidealism: composite.state.collapseOmniSingularityPanidealism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_440', composite.state.existentialAbsoluteNullityGlorification.length === 8 && composite.state.nationalExistentialAbsoluteNullityGlorificationIndex === existentialAbsoluteNullityGlorification.nationalIndex, `nullity glorification ${composite.state.nationalExistentialAbsoluteNullityGlorificationIndex}`);

  push(out, 'a11_441', composite.state.collapseOmniSingularityPantheosis.every((p) => p.narrative.includes('collapse omni singularity pantheosis')), composite.state.collapseOmniSingularityPantheosis[0]?.band ?? 'none');
  push(out, 'a11_442', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_pantheosis') || composite.state.collapseOmniSingularityPantheosis.some((p) => p.band === 'total' || p.band === 'pantheosis'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_443', composite.derived.some((d) => d.kind === 'void_total_erosion_evaporation') || composite.state.voidTotalErosionEvaporation.some((e) => e.band === 'total' || e.band === 'complete_evaporation'), composite.state.voidTotalErosionEvaporation[0]?.band ?? 'none');
  push(out, 'a11_444', composite.persisted.lastVoidTotalErosionEvaporationIndex === composite.state.nationalVoidTotalErosionEvaporationIndex, `persisted evaporation ${composite.persisted.lastVoidTotalErosionEvaporationIndex}`);
  push(out, 'a11_445', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_glorification') || composite.state.existentialAbsoluteNullityGlorification.some((c) => c.band === 'absolute' || c.band === 'total_glorification'), composite.state.existentialAbsoluteNullityGlorification[0]?.band ?? 'none');
  push(out, 'a11_446', composite.state.existentialAbsoluteNullityGlorification.every((c) => c.narrative.includes('existential absolute nullity glorification')), composite.state.existentialAbsoluteNullityGlorification[0]?.band ?? 'none');
"""
    if "a11_438" not in st:
        st = st.replace(
            "  push(out, 'a11_428', composite.state.existentialAbsoluteNullityBeatification.every((c) => c.narrative.includes('existential absolute nullity consecration')), composite.state.existentialAbsoluteNullityBeatification[0]?.band ?? 'none');\n\n  return out;",
            "  push(out, 'a11_428', composite.state.existentialAbsoluteNullityBeatification.every((c) => c.narrative.includes('existential absolute nullity consecration')), composite.state.existentialAbsoluteNullityBeatification[0]?.band ?? 'none');"
            + wave50_tests
            + "\n  return out;",
        )
    (SRC / "self-tests.ts").write_text(st)

    harness_path = SRC / "integration/regional-regression-harness.ts"
    harness = harness_path.read_text()
    if "collapseOmniSingularityPantheosisIndex" not in harness:
        harness = harness.replace(
            "  existentialAbsoluteNullityBeatificationIndex: number;\n",
            "  existentialAbsoluteNullityBeatificationIndex: number;\n"
            "  collapseOmniSingularityPantheosisIndex: number;\n"
            "  voidTotalErosionEvaporationIndex: number;\n"
            "  existentialAbsoluteNullityGlorificationIndex: number;\n",
        )
        harness = harness.replace(
            "      existentialAbsoluteNullityBeatificationIndex: out.state.nationalExistentialAbsoluteNullityConsecrationIndex,\n",
            "      existentialAbsoluteNullityBeatificationIndex: out.state.nationalExistentialAbsoluteNullityConsecrationIndex,\n"
            "      collapseOmniSingularityPantheosisIndex: out.state.nationalCollapseOmniSingularityPantheosisIndex,\n"
            "      voidTotalErosionEvaporationIndex: out.state.nationalVoidTotalErosionEvaporationIndex,\n"
            "      existentialAbsoluteNullityGlorificationIndex: out.state.nationalExistentialAbsoluteNullityGlorificationIndex,\n",
        )
        harness = harness.replace(
            "  const nullityConsecrationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityBeatificationIndex >= 8 && s.existentialAbsoluteNullityBeatificationIndex <= 100,\n"
            "  );\n",
            "  const nullityConsecrationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityBeatificationIndex >= 8 && s.existentialAbsoluteNullityBeatificationIndex <= 100,\n"
            "  );\n"
            "  const omniPantheosisStable = snapshots.every(\n"
            "    (s) => s.collapseOmniSingularityPantheosisIndex >= 8 && s.collapseOmniSingularityPantheosisIndex <= 100,\n"
            "  );\n"
            "  const erosionEvaporationStable = snapshots.every(\n"
            "    (s) => s.voidTotalErosionEvaporationIndex >= 8 && s.voidTotalErosionEvaporationIndex <= 100,\n"
            "  );\n"
            "  const nullityGlorificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityGlorificationIndex >= 8 && s.existentialAbsoluteNullityGlorificationIndex <= 100,\n"
            "  );\n",
        )
        harness = harness.replace(
            "    nullityConsecrationStable;",
            "    nullityConsecrationStable &&\n    omniPantheosisStable &&\n    erosionEvaporationStable &&\n    nullityGlorificationStable;",
        )
        harness = harness.replace(
            "nullity consecration ${snapshots[snapshots.length - 1].existentialAbsoluteNullityBeatificationIndex}`",
            "nullity glorification ${snapshots[snapshots.length - 1].existentialAbsoluteNullityGlorificationIndex}`",
        )
        harness_path.write_text(harness)

    readme = ROOT / "README.md"
    text = readme.read_text()
    if "round 50" not in text:
        text = re.sub(
            r"\*\*Scale wave round 48 \(O10-227\):\*\*[^\n]+\n",
            "**Scale wave round 50 (O10-231):** regional collapse omni singularity pantheosis, interregional void total erosion evaporation, settlement existential absolute nullity glorification (schema `10m.a11.composite.48`).\n",
            text,
            count=1,
        )
        readme.write_text(text)

    integration = ROOT / "INTEGRATION.md"
    intext = integration.read_text()
    if "round 50" not in intext:
        intext = intext.replace(
            "### Scale wave round 48 (O10-227, schema `10m.a11.composite.47`)",
            "### Scale wave round 50 (O10-231, schema `10m.a11.composite.48`)\n\n"
            "- **Regional collapse omni singularity pantheosis** — panpsychism × attenuation × consecration (`op10mA11ComputeRegionalCollapseOmniSingularityPantheosis`)\n"
            "- **Interregional void total erosion evaporation** — attenuation × panpsychism × void front (`op10mA11ComputeInterregionalVoidTotalErosionEvaporation`)\n"
            "- **Settlement existential absolute nullity glorification** — consecration × panpsychism × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification`)\n"
            "- Derived events: `collapse_omni_singularity_pantheosis`, `void_total_erosion_evaporation`, `existential_absolute_nullity_glorification`\n\n"
            "### Scale wave round 48 (O10-227, schema `10m.a11.composite.47`)",
        )
        integration.write_text(intext)

    print("wave 50 round 50 patches applied")


if __name__ == "__main__":
    main()
