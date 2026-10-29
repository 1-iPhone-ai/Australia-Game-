#!/usr/bin/env python3
"""Agent 11 O10-235 wave 52 round 52 — pansophism, dissociation, apotheosis."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

PREV_SCHEMA = "10m.a11.composite.51"
NEXT_SCHEMA = "10m.a11.composite.51"


def clone_module(src_name: str, dst_name: str, replacements: list[tuple[str, str]]) -> None:
    text = (SRC / src_name).read_text()
    for old, new in replacements:
        text = text.replace(old, new)
    (SRC / dst_name).write_text(text)


def main() -> None:
    clone_module(
        "regional-collapse-omni-singularity-panmonism.ts",
        "regional-collapse-omni-singularity-pansophism.ts",
        [
            ("Pansophism", "Pansophism"),
            ("pansophism", "pansophism"),
            ("Pansophism", "Pansophism"),
            ("pansophism", "pansophism"),
            ("Pantheosis", "Pansophism"),
            ("pantheosis", "pansophism"),
            ("Evaporation", "Ionization"),
            ("evaporation", "ionization"),
            ("Glorification", "Apotheosis"),
            ("glorification", "apotheosis"),
            ("collapseOmniSingularityPantheosis", "collapseOmniSingularityPansophism"),
            ("voidTotalErosionEvaporation", "voidTotalErosionIonization"),
            ("existentialAbsoluteNullityGlorification", "existentialAbsoluteNullityApotheosis"),
            ("pantheosisScore", "pansophismScore"),
            ("evaporationScore", "ionizationScore"),
            ("glorificationScore", "apotheosisScore"),
            ("'pantheosis'", "'pansophism'"),
            ("'complete_evaporation'", "'complete_ionization'"),
            ("'total_glorification'", "'total_apotheosis'"),
            ("collapse omni singularity pansophism", "collapse omni singularity pansophism"),
        ],
    )

    clone_module(
        "interregional-void-total-erosion-ionization.ts",
        "interregional-void-total-erosion-dissociation.ts",
        [
            ("Dissociation", "Dissociation"),
            ("dissociation", "dissociation"),
            ("Ionization", "Dissociation"),
            ("ionization", "dissociation"),
            ("Pansophism", "Pansophism"),
            ("pansophism", "pansophism"),
            ("voidTotalErosionIonization", "voidTotalErosionDissociation"),
            ("collapseOmniSingularityPantheosis", "collapseOmniSingularityPansophism"),
            ("ionizationScore", "dissociationScore"),
            ("pantheosisScore", "pansophismScore"),
            ("'complete_ionization'", "'complete_dissociation'"),
            ("'pansophism'", "'pansophism'"),
            ("ionizing", "dissociating"),
            ("complete_dissociation", "complete_dissociation"),
            ("interregional void total erosion ionization", "interregional void total erosion dissociation"),
        ],
    )

    clone_module(
        "settlement-existential-absolute-nullity-deification.ts",
        "settlement-existential-absolute-nullity-apotheosis.ts",
        [
            ("Apotheosis", "Apotheosis"),
            ("apotheosis", "apotheosis"),
            ("Apotheosis", "Apotheosis"),
            ("apotheosis", "apotheosis"),
            ("Pansophism", "Pansophism"),
            ("pansophism", "pansophism"),
            ("existentialAbsoluteNullityApotheosis", "existentialAbsoluteNullityApotheosis"),
            ("collapseOmniSingularityPantheosis", "collapseOmniSingularityPansophism"),
            ("apotheosisScore", "apotheosisScore"),
            ("pantheosisScore", "pansophismScore"),
            ("'pansophism'", "'pansophism'"),
            ("'total_apotheosis'", "'total_apotheosis'"),
            ("apotheosizing", "apotheosizing"),
            ("total_apotheosis", "total_apotheosis"),
            ("existential absolute nullity apotheosis", "existential absolute nullity apotheosis"),
        ],
    )

    types = (SRC / "types.ts").read_text()
    types = types.replace(
        f"export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '{PREV_SCHEMA}' as const;",
        f"export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '{NEXT_SCHEMA}' as const;",
    )
    types = types.replace(
        "  | 'existential_absolute_nullity_apotheosis';",
        "  | 'existential_absolute_nullity_glorification'\n"
        "  | 'collapse_omni_singularity_pansophism'\n"
        "  | 'void_total_erosion_dissociation'\n"
        "  | 'existential_absolute_nullity_apotheosis';",
    )
    insert_after = """export interface OP10M_A11_ExistentialAbsoluteNullityApotheosisRow {
  regionId: OP10M_A11_RegionId;
  apotheosisScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityApotheosisBand;
  marks: string[];
  narrative: string;
}

"""
    new_types = """
export type OP10M_A11_CollapseOmniSingularityPansophismBand = 'latent' | 'aligning' | 'total' | 'pansophism';

export interface OP10M_A11_CollapseOmniSingularityPansophismRow {
  regionId: OP10M_A11_RegionId;
  pansophismScore: number;
  band: OP10M_A11_CollapseOmniSingularityPansophismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionDissociationBand = 'dormant' | 'dissociating' | 'total' | 'complete_dissociation';

export interface OP10M_A11_VoidTotalErosionDissociationRow {
  regionId: OP10M_A11_RegionId;
  dissociationScore: number;
  band: OP10M_A11_VoidTotalErosionDissociationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityApotheosisBand = 'trace' | 'apotheosizing' | 'absolute' | 'total_apotheosis';

export interface OP10M_A11_ExistentialAbsoluteNullityApotheosisRow {
  regionId: OP10M_A11_RegionId;
  apotheosisScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityApotheosisBand;
  marks: string[];
  narrative: string;
}

"""
    if "PansophismBand" not in types:
        types = types.replace(insert_after, insert_after + new_types)

    types = types.replace(
        """  nationalExistentialAbsoluteNullityApotheosisIndex: number;
  collapseOmniSingularityPansophism: OP10M_A11_CollapseOmniSingularityPansophismRow[];
  nationalCollapseOmniSingularityPansophismIndex: number;
  voidTotalErosionDissociation: OP10M_A11_VoidTotalErosionDissociationRow[];
  nationalVoidTotalErosionDissociationIndex: number;
  existentialAbsoluteNullityApotheosis: OP10M_A11_ExistentialAbsoluteNullityApotheosisRow[];
  nationalExistentialAbsoluteNullityApotheosisIndex: number;
  summary: string;""",
        """  nationalExistentialAbsoluteNullityGlorificationIndex: number;
  collapseOmniSingularityPansophism: OP10M_A11_CollapseOmniSingularityPansophismRow[];
  nationalCollapseOmniSingularityPansophismIndex: number;
  voidTotalErosionDissociation: OP10M_A11_VoidTotalErosionDissociationRow[];
  nationalVoidTotalErosionDissociationIndex: number;
  existentialAbsoluteNullityApotheosis: OP10M_A11_ExistentialAbsoluteNullityApotheosisRow[];
  nationalExistentialAbsoluteNullityApotheosisIndex: number;
  summary: string;""",
    )
    types = types.replace(
        """  lastExistentialAbsoluteNullityApotheosisIndex: number;
  lastCollapseOmniSingularityPansophismIndex: number;
  lastVoidTotalErosionDissociationIndex: number;
  lastExistentialAbsoluteNullityApotheosisIndex: number;
  inputHash: string;""",
        """  lastExistentialAbsoluteNullityGlorificationIndex: number;
  lastCollapseOmniSingularityPansophismIndex: number;
  lastVoidTotalErosionDissociationIndex: number;
  lastExistentialAbsoluteNullityApotheosisIndex: number;
  inputHash: string;""",
    )
    (SRC / "types.ts").write_text(types)

    comp = (SRC / "composite-recompute.ts").read_text()
    import_block = """
import {
  op10mA11CollapseOmniSingularityPansophismEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityPansophism,
  op10mA11RegionsWithCollapseSingularityPansophism,
} from './regional-collapse-omni-singularity-pansophism.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionDissociation,
  op10mA11RegionsWithTotalErosionDissociation,
  op10mA11VoidTotalErosionDissociationEscalating,
} from './interregional-void-total-erosion-dissociation.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityApotheosis,
  op10mA11ExistentialAbsoluteNullityApotheosisEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityApotheosis,
} from './settlement-existential-absolute-nullity-apotheosis.ts';
"""
    if "pansophism.ts" not in comp:
        comp = comp.replace(
            "} from './settlement-existential-absolute-nullity-glorification.ts';\n",
            "} from './settlement-existential-absolute-nullity-glorification.ts';\n" + import_block,
        )

    comp = comp.replace(
        "    lastExistentialAbsoluteNullityGlorificationIndex: 0,\n",
        "    lastExistentialAbsoluteNullityGlorificationIndex: 0,\n"
        "    lastCollapseOmniSingularityPansophismIndex: 0,\n"
        "    lastVoidTotalErosionDissociationIndex: 0,\n"
        "    lastExistentialAbsoluteNullityApotheosisIndex: 0,\n",
    )

    validation = """
  if (state.collapseOmniSingularityPansophism.length !== 8) errs.push('collapse omni singularity pansophism row count');
  if (state.voidTotalErosionDissociation.length !== 8) errs.push('void total erosion dissociation row count');
  if (state.existentialAbsoluteNullityApotheosis.length !== 8) errs.push('existential absolute nullity apotheosis row count');
  if (state.nationalCollapseOmniSingularityPansophismIndex < 0 || state.nationalCollapseOmniSingularityPansophismIndex > 100) errs.push('collapse omni singularity pansophism index out of range');
  if (state.nationalVoidTotalErosionDissociationIndex < 0 || state.nationalVoidTotalErosionDissociationIndex > 100) errs.push('void total erosion dissociation index out of range');
  if (state.nationalExistentialAbsoluteNullityApotheosisIndex < 0 || state.nationalExistentialAbsoluteNullityApotheosisIndex > 100) errs.push('existential absolute nullity apotheosis index out of range');
"""
    if "pansophism row count" not in comp:
        comp = comp.replace(
            "  if (state.nationalExistentialAbsoluteNullityGlorificationIndex < 0 || state.nationalExistentialAbsoluteNullityGlorificationIndex > 100) errs.push('existential absolute nullity glorification index out of range');\n",
            "  if (state.nationalExistentialAbsoluteNullityGlorificationIndex < 0 || state.nationalExistentialAbsoluteNullityGlorificationIndex > 100) errs.push('existential absolute nullity glorification index out of range');\n"
            + validation,
        )

    compute_block = """
  const collapseOmniSingularityPansophismOut = op10mA11ComputeRegionalCollapseOmniSingularityPansophism({
    collapseOmniSingularityPanmonism: collapseOmniSingularityPanmonismOut.rows,
    voidTotalErosionIonization: voidTotalErosionIonizationOut.rows,
    existentialAbsoluteNullityDeification: existentialAbsoluteNullityDeificationOut.rows,
  });

  const voidTotalErosionDissociationOut = op10mA11ComputeInterregionalVoidTotalErosionDissociation({
    voidTotalErosionIonization: voidTotalErosionIonizationOut.rows,
    collapseOmniSingularityPanmonism: collapseOmniSingularityPanmonismOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityApotheosisOut = op10mA11ComputeSettlementExistentialAbsoluteNullityApotheosis({
    existentialAbsoluteNullityDeification: existentialAbsoluteNullityDeificationOut.rows,
    collapseOmniSingularityPanmonism: collapseOmniSingularityPanmonismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
    if "collapseOmniSingularityPansophismOut" not in comp:
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

    derived_insert_marker = """      existentialAbsoluteNullityDeificationOut.nationalIndex >= 93 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;"""

    derived_block = """
  const singularityPansophism = op10mA11RegionsWithCollapseSingularityPansophism(
    collapseOmniSingularityPansophismOut.rows,
  );
  if (
    singularityPansophism.length >= 2 ||
    collapseOmniSingularityPansophismOut.nationalIndex >= 82 ||
    op10mA11CollapseOmniSingularityPansophismEscalating(
      collapseOmniSingularityPansophismOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityPansophismIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_pansophism',
      singularityPansophism.slice(0, 5),
      `Regional collapse omni singularity pansophism (index ${collapseOmniSingularityPansophismOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityPansophismOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  const erosionDissociation = op10mA11RegionsWithTotalErosionDissociation(voidTotalErosionDissociationOut.rows);
  if (
    erosionDissociation.length >= 2 ||
    voidTotalErosionDissociationOut.nationalIndex >= 81 ||
    op10mA11VoidTotalErosionDissociationEscalating(
      voidTotalErosionDissociationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionDissociationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_dissociation',
      erosionDissociation.slice(0, 5),
      `Interregional void total erosion dissociation (index ${voidTotalErosionDissociationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionDissociationOut.nationalIndex >= 91 ? 'major' : 'meaningful',
    );
  }

  const nullityApotheosis = op10mA11RegionsWithTotalAbsoluteNullityApotheosis(
    existentialAbsoluteNullityApotheosisOut.rows,
  );
  if (
    nullityApotheosis.length >= 2 ||
    existentialAbsoluteNullityApotheosisOut.nationalIndex >= 83 ||
    op10mA11ExistentialAbsoluteNullityApotheosisEscalating(
      existentialAbsoluteNullityApotheosisOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityApotheosisIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_apotheosis',
      nullityApotheosis.slice(0, 5),
      `Settlement existential absolute nullity apotheosis (index ${existentialAbsoluteNullityApotheosisOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityApotheosisOut.nationalIndex >= 93 ? 'major' : 'meaningful',
    );
  }
"""
    if "singularityPansophism" not in comp:
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
        "  base.lastCollapseOmniSingularityPansophismIndex = collapseOmniSingularityPansophismOut.nationalIndex;\n"
        "  base.lastVoidTotalErosionDissociationIndex = voidTotalErosionDissociationOut.nationalIndex;\n"
        "  base.lastExistentialAbsoluteNullityApotheosisIndex = existentialAbsoluteNullityApotheosisOut.nationalIndex;\n"
        "  base.inputHash",
    )

    comp = comp.replace(
        "${existentialAbsoluteNullityGlorificationOut.nationalIndex}`,",
        "${existentialAbsoluteNullityGlorificationOut.nationalIndex}:${collapseOmniSingularityPansophismOut.nationalIndex}:${voidTotalErosionDissociationOut.nationalIndex}:${existentialAbsoluteNullityApotheosisOut.nationalIndex}`,",
    )

    comp = comp.replace(
        """    existentialAbsoluteNullityDeification: existentialAbsoluteNullityDeificationOut.rows,
    nationalExistentialAbsoluteNullityGlorificationIndex: existentialAbsoluteNullityGlorificationOut.nationalIndex,
    summary:""",
        """    existentialAbsoluteNullityDeification: existentialAbsoluteNullityDeificationOut.rows,
    nationalExistentialAbsoluteNullityGlorificationIndex: existentialAbsoluteNullityGlorificationOut.nationalIndex,
    collapseOmniSingularityPansophism: collapseOmniSingularityPansophismOut.rows,
    nationalCollapseOmniSingularityPansophismIndex: collapseOmniSingularityPansophismOut.nationalIndex,
    voidTotalErosionDissociation: voidTotalErosionDissociationOut.rows,
    nationalVoidTotalErosionDissociationIndex: voidTotalErosionDissociationOut.nationalIndex,
    existentialAbsoluteNullityApotheosis: existentialAbsoluteNullityApotheosisOut.rows,
    nationalExistentialAbsoluteNullityApotheosisIndex: existentialAbsoluteNullityApotheosisOut.nationalIndex,
    summary:""",
    )

    comp = comp.replace(
        "nullity glorification ${existentialAbsoluteNullityGlorificationOut.nationalIndex}.`,",
        "nullity glorification ${existentialAbsoluteNullityGlorificationOut.nationalIndex}; omni pansophism ${collapseOmniSingularityPansophismOut.nationalIndex}; erosion dissociation ${voidTotalErosionDissociationOut.nationalIndex}; nullity apotheosis ${existentialAbsoluteNullityApotheosisOut.nationalIndex}.`,",
    )

    (SRC / "composite-recompute.ts").write_text(comp)

    idx = (SRC / "index.ts").read_text()
    if "pansophism.ts" not in idx:
        idx = idx.replace(
            "export * from './settlement-existential-absolute-nullity-glorification.ts';\n",
            "export * from './settlement-existential-absolute-nullity-glorification.ts';\n"
            "export * from './regional-collapse-omni-singularity-pansophism.ts';\n"
            "export * from './interregional-void-total-erosion-dissociation.ts';\n"
            "export * from './settlement-existential-absolute-nullity-apotheosis.ts';\n",
        )
        (SRC / "index.ts").write_text(idx)

    st = (SRC / "self-tests.ts").read_text()
    st = st.replace(
        f"composite.state.schemaVersion === '{PREV_SCHEMA}'",
        f"composite.state.schemaVersion === '{NEXT_SCHEMA}'",
    )
    imports = """
import { op10mA11ComputeRegionalCollapseOmniSingularityPansophism } from './regional-collapse-omni-singularity-pansophism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionDissociation } from './interregional-void-total-erosion-dissociation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityApotheosis } from './settlement-existential-absolute-nullity-apotheosis.ts';
"""
    if "Pansophism" not in st:
        st = st.replace(
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification } from './settlement-existential-absolute-nullity-glorification.ts';\n",
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification } from './settlement-existential-absolute-nullity-glorification.ts';\n"
            + imports,
        )

    wave51_tests = """
  const collapseOmniSingularityPansophism = op10mA11ComputeRegionalCollapseOmniSingularityPansophism({
    collapseOmniSingularityPantheosis: composite.state.collapseOmniSingularityPantheosis,
    voidTotalErosionEvaporation: composite.state.voidTotalErosionEvaporation,
    existentialAbsoluteNullityGlorification: composite.state.existentialAbsoluteNullityGlorification,
  });
  push(out, 'a11_456', composite.state.collapseOmniSingularityPansophism.length === 8 && composite.state.nationalCollapseOmniSingularityPansophismIndex === collapseOmniSingularityPansophism.nationalIndex, `omni pansophism ${composite.state.nationalCollapseOmniSingularityPansophismIndex}`);

  const voidTotalErosionDissociation = op10mA11ComputeInterregionalVoidTotalErosionDissociation({
    voidTotalErosionEvaporation: composite.state.voidTotalErosionEvaporation,
    collapseOmniSingularityPantheosis: composite.state.collapseOmniSingularityPantheosis,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_457', composite.state.voidTotalErosionDissociation.length === 8 && composite.state.nationalVoidTotalErosionDissociationIndex === voidTotalErosionDissociation.nationalIndex, `erosion dissociation ${composite.state.nationalVoidTotalErosionDissociationIndex}`);

  const existentialAbsoluteNullityApotheosis = op10mA11ComputeSettlementExistentialAbsoluteNullityApotheosis({
    existentialAbsoluteNullityGlorification: composite.state.existentialAbsoluteNullityGlorification,
    collapseOmniSingularityPantheosis: composite.state.collapseOmniSingularityPantheosis,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_458', composite.state.existentialAbsoluteNullityApotheosis.length === 8 && composite.state.nationalExistentialAbsoluteNullityApotheosisIndex === existentialAbsoluteNullityApotheosis.nationalIndex, `nullity apotheosis ${composite.state.nationalExistentialAbsoluteNullityApotheosisIndex}`);

  push(out, 'a11_459', composite.state.collapseOmniSingularityPansophism.every((p) => p.narrative.includes('collapse omni singularity pansophism')), composite.state.collapseOmniSingularityPansophism[0]?.band ?? 'none');
  push(out, 'a11_460', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_pansophism') || composite.state.collapseOmniSingularityPansophism.some((p) => p.band === 'total' || p.band === 'pansophism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_461', composite.derived.some((d) => d.kind === 'void_total_erosion_dissociation') || composite.state.voidTotalErosionDissociation.some((e) => e.band === 'total' || e.band === 'complete_dissociation'), composite.state.voidTotalErosionDissociation[0]?.band ?? 'none');
  push(out, 'a11_462', composite.persisted.lastVoidTotalErosionDissociationIndex === composite.state.nationalVoidTotalErosionDissociationIndex, `persisted dissociation ${composite.persisted.lastVoidTotalErosionDissociationIndex}`);
  push(out, 'a11_463', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_apotheosis') || composite.state.existentialAbsoluteNullityApotheosis.some((c) => c.band === 'absolute' || c.band === 'total_apotheosis'), composite.state.existentialAbsoluteNullityApotheosis[0]?.band ?? 'none');
  push(out, 'a11_464', composite.state.existentialAbsoluteNullityApotheosis.every((c) => c.narrative.includes('existential absolute nullity apotheosis')), composite.state.existentialAbsoluteNullityApotheosis[0]?.band ?? 'none');
"""
    if "a11_456" not in st:
        st = st.replace(
            "  push(out, 'a11_464', composite.state.existentialAbsoluteNullityGlorification.every((c) => c.narrative.includes('existential absolute nullity glorification')), composite.state.existentialAbsoluteNullityGlorification[0]?.band ?? 'none');\n\n  return out;",
            "  push(out, 'a11_464', composite.state.existentialAbsoluteNullityGlorification.every((c) => c.narrative.includes('existential absolute nullity glorification')), composite.state.existentialAbsoluteNullityGlorification[0]?.band ?? 'none');"
            + wave51_tests
            + "\n  return out;",
        )
    (SRC / "self-tests.ts").write_text(st)

    harness_path = SRC / "integration/regional-regression-harness.ts"
    harness = harness_path.read_text()
    if "collapseOmniSingularityPansophismIndex" not in harness:
        harness = harness.replace(
            "  existentialAbsoluteNullityGlorificationIndex: number;\n",
            "  existentialAbsoluteNullityGlorificationIndex: number;\n"
            "  collapseOmniSingularityPansophismIndex: number;\n"
            "  voidTotalErosionDissociationIndex: number;\n"
            "  existentialAbsoluteNullityApotheosisIndex: number;\n",
        )
        harness = harness.replace(
            "      existentialAbsoluteNullityGlorificationIndex: out.state.nationalExistentialAbsoluteNullityGlorificationIndex,\n",
            "      existentialAbsoluteNullityGlorificationIndex: out.state.nationalExistentialAbsoluteNullityGlorificationIndex,\n"
            "      collapseOmniSingularityPansophismIndex: out.state.nationalCollapseOmniSingularityPansophismIndex,\n"
            "      voidTotalErosionDissociationIndex: out.state.nationalVoidTotalErosionDissociationIndex,\n"
            "      existentialAbsoluteNullityApotheosisIndex: out.state.nationalExistentialAbsoluteNullityApotheosisIndex,\n",
        )
        harness = harness.replace(
            "  const nullityGlorificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityGlorificationIndex >= 8 && s.existentialAbsoluteNullityGlorificationIndex <= 100,\n"
            "  );\n",
            "  const nullityGlorificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityGlorificationIndex >= 8 && s.existentialAbsoluteNullityGlorificationIndex <= 100,\n"
            "  );\n"
            "  const omniPansophismStable = snapshots.every(\n"
            "    (s) => s.collapseOmniSingularityPansophismIndex >= 8 && s.collapseOmniSingularityPansophismIndex <= 100,\n"
            "  );\n"
            "  const erosionDissociationStable = snapshots.every(\n"
            "    (s) => s.voidTotalErosionDissociationIndex >= 8 && s.voidTotalErosionDissociationIndex <= 100,\n"
            "  );\n"
            "  const nullityApotheosisStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityApotheosisIndex >= 8 && s.existentialAbsoluteNullityApotheosisIndex <= 100,\n"
            "  );\n",
        )
        harness = harness.replace(
            "    nullityGlorificationStable;",
            "    nullityGlorificationStable &&\n    omniPansophismStable &&\n    erosionDissociationStable &&\n    nullityApotheosisStable;",
        )
        harness = harness.replace(
            "nullity glorification ${snapshots[snapshots.length - 1].existentialAbsoluteNullityGlorificationIndex}`",
            "nullity apotheosis ${snapshots[snapshots.length - 1].existentialAbsoluteNullityApotheosisIndex}`",
        )
        harness_path.write_text(harness)

    readme = ROOT / "README.md"
    text = readme.read_text()
    if "round 52" not in text:
        text = re.sub(
            r"\*\*Scale wave round 50 \(O10-231\):\*\*[^\n]+\n",
            "**Scale wave round 52 (O10-235):** regional collapse omni singularity pansophism, interregional void total erosion dissociation, settlement existential absolute nullity apotheosis (schema `10m.a11.composite.51`).\n",
            text,
            count=1,
        )
        readme.write_text(text)

    integration = ROOT / "INTEGRATION.md"
    intext = integration.read_text()
    if "round 52" not in intext:
        intext = intext.replace(
            "### Scale wave round 50 (O10-231, schema `10m.a11.composite.48`)",
            "### Scale wave round 52 (O10-235, schema `10m.a11.composite.51`)\n\n"
            "- **Regional collapse omni singularity pansophism** — pantheosis × evaporation × glorification (`op10mA11ComputeRegionalCollapseOmniSingularityPansophism`)\n"
            "- **Interregional void total erosion dissociation** — evaporation × pantheosis × void front (`op10mA11ComputeInterregionalVoidTotalErosionDissociation`)\n"
            "- **Settlement existential absolute nullity apotheosis** — glorification × pantheosis × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityApotheosis`)\n"
            "- Derived events: `collapse_omni_singularity_pansophism`, `void_total_erosion_dissociation`, `existential_absolute_nullity_apotheosis`\n\n"
            "### Scale wave round 50 (O10-231, schema `10m.a11.composite.48`)",
        )
        integration.write_text(intext)

    print("wave 52 round 52 patches applied")


if __name__ == "__main__":
    main()
