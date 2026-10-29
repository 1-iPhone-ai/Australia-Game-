#!/usr/bin/env python3
"""Agent 11 O10-229 wave 49 round 49 — panidealism, dissipation, beatification."""
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
        "regional-collapse-omni-singularity-panpsychism.ts",
        "regional-collapse-omni-singularity-panidealism.ts",
        [
            ("Panpsychism", "Panidealism"),
            ("panpsychism", "panidealism"),
            ("Panentheism", "Panpsychism"),
            ("panentheism", "panpsychism"),
            ("Enervation", "Attenuation"),
            ("enervation", "attenuation"),
            ("Sanctification", "Consecration"),
            ("sanctification", "consecration"),
            ("collapseOmniSingularityPanentheism", "collapseOmniSingularityPanpsychism"),
            ("voidTotalErosionEnervation", "voidTotalErosionAttenuation"),
            ("existentialAbsoluteNullitySanctification", "existentialAbsoluteNullityConsecration"),
            ("panentheismScore", "panpsychismScore"),
            ("enervationScore", "attenuationScore"),
            ("sanctificationScore", "consecrationScore"),
            ("'panentheism'", "'panpsychism'"),
            ("'complete_enervation'", "'complete_attenuation'"),
            ("'total_sanctification'", "'total_consecration'"),
        ],
    )

    clone_module(
        "interregional-void-total-erosion-attenuation.ts",
        "interregional-void-total-erosion-dissipation.ts",
        [
            ("Attenuation", "Dissipation"),
            ("attenuation", "dissipation"),
            ("Enervation", "Attenuation"),
            ("enervation", "attenuation"),
            ("Panentheism", "Panpsychism"),
            ("panentheism", "panpsychism"),
            ("voidTotalErosionEnervation", "voidTotalErosionAttenuation"),
            ("collapseOmniSingularityPanentheism", "collapseOmniSingularityPanpsychism"),
            ("enervationScore", "attenuationScore"),
            ("panentheismScore", "panpsychismScore"),
            ("'complete_enervation'", "'complete_attenuation'"),
            ("'panentheism'", "'panpsychism'"),
            ("attenuating", "dissipating"),
            ("complete_attenuation", "complete_dissipation"),
        ],
    )

    clone_module(
        "settlement-existential-absolute-nullity-consecration.ts",
        "settlement-existential-absolute-nullity-beatification.ts",
        [
            ("Consecration", "Beatification"),
            ("consecration", "beatification"),
            ("Sanctification", "Consecration"),
            ("sanctification", "consecration"),
            ("Panentheism", "Panpsychism"),
            ("panentheism", "panpsychism"),
            ("existentialAbsoluteNullitySanctification", "existentialAbsoluteNullityConsecration"),
            ("collapseOmniSingularityPanentheism", "collapseOmniSingularityPanpsychism"),
            ("sanctificationScore", "consecrationScore"),
            ("panentheismScore", "panpsychismScore"),
            ("'panentheism'", "'panpsychism'"),
            ("'total_sanctification'", "'total_consecration'"),
            ("consecrating", "beatifying"),
            ("total_consecration", "total_beatification"),
        ],
    )

    types = (SRC / "types.ts").read_text()
    types = types.replace(
        "export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.47' as const;",
        "export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.48' as const;",
    )
    types = types.replace(
        "  | 'existential_absolute_nullity_consecration';",
        "  | 'existential_absolute_nullity_consecration'\n"
        "  | 'collapse_omni_singularity_panidealism'\n"
        "  | 'void_total_erosion_dissipation'\n"
        "  | 'existential_absolute_nullity_beatification';",
    )
    insert_after = """export interface OP10M_A11_ExistentialAbsoluteNullityConsecrationRow {
  regionId: OP10M_A11_RegionId;
  consecrationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityConsecrationBand;
  marks: string[];
  narrative: string;
}

"""
    new_types = """
export type OP10M_A11_CollapseOmniSingularityPanidealismBand = 'latent' | 'aligning' | 'total' | 'panidealism';

export interface OP10M_A11_CollapseOmniSingularityPanidealismRow {
  regionId: OP10M_A11_RegionId;
  panidealismScore: number;
  band: OP10M_A11_CollapseOmniSingularityPanidealismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionDissipationBand = 'dormant' | 'dissipating' | 'total' | 'complete_dissipation';

export interface OP10M_A11_VoidTotalErosionDissipationRow {
  regionId: OP10M_A11_RegionId;
  dissipationScore: number;
  band: OP10M_A11_VoidTotalErosionDissipationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityBeatificationBand = 'trace' | 'beatifying' | 'absolute' | 'total_beatification';

export interface OP10M_A11_ExistentialAbsoluteNullityBeatificationRow {
  regionId: OP10M_A11_RegionId;
  beatificationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityBeatificationBand;
  marks: string[];
  narrative: string;
}

"""
    if "PanidealismBand" not in types:
        types = types.replace(insert_after, insert_after + new_types)

    types = types.replace(
        """  nationalExistentialAbsoluteNullityConsecrationIndex: number;
  summary: string;""",
        """  nationalExistentialAbsoluteNullityConsecrationIndex: number;
  collapseOmniSingularityPanidealism: OP10M_A11_CollapseOmniSingularityPanidealismRow[];
  nationalCollapseOmniSingularityPanidealismIndex: number;
  voidTotalErosionDissipation: OP10M_A11_VoidTotalErosionDissipationRow[];
  nationalVoidTotalErosionDissipationIndex: number;
  existentialAbsoluteNullityBeatification: OP10M_A11_ExistentialAbsoluteNullityBeatificationRow[];
  nationalExistentialAbsoluteNullityBeatificationIndex: number;
  summary: string;""",
    )
    types = types.replace(
        """  lastExistentialAbsoluteNullityConsecrationIndex: number;
  inputHash: string;""",
        """  lastExistentialAbsoluteNullityConsecrationIndex: number;
  lastCollapseOmniSingularityPanidealismIndex: number;
  lastVoidTotalErosionDissipationIndex: number;
  lastExistentialAbsoluteNullityBeatificationIndex: number;
  inputHash: string;""",
    )
    (SRC / "types.ts").write_text(types)

    comp = (SRC / "composite-recompute.ts").read_text()
    import_block = """
import {
  op10mA11CollapseOmniSingularityPanidealismEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityPanidealism,
  op10mA11RegionsWithCollapseSingularityPanidealism,
} from './regional-collapse-omni-singularity-panidealism.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionDissipation,
  op10mA11RegionsWithTotalErosionDissipation,
  op10mA11VoidTotalErosionDissipationEscalating,
} from './interregional-void-total-erosion-dissipation.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityBeatification,
  op10mA11ExistentialAbsoluteNullityBeatificationEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityBeatification,
} from './settlement-existential-absolute-nullity-beatification.ts';
"""
    if "panidealism.ts" not in comp:
        comp = comp.replace(
            "} from './settlement-existential-absolute-nullity-consecration.ts';\n",
            "} from './settlement-existential-absolute-nullity-consecration.ts';\n" + import_block,
        )

    comp = comp.replace(
        "    lastExistentialAbsoluteNullityConsecrationIndex: 0,\n",
        "    lastExistentialAbsoluteNullityConsecrationIndex: 0,\n"
        "    lastCollapseOmniSingularityPanidealismIndex: 0,\n"
        "    lastVoidTotalErosionDissipationIndex: 0,\n"
        "    lastExistentialAbsoluteNullityBeatificationIndex: 0,\n",
    )

    validation = """
  if (state.collapseOmniSingularityPanidealism.length !== 8) errs.push('collapse omni singularity panidealism row count');
  if (state.voidTotalErosionDissipation.length !== 8) errs.push('void total erosion dissipation row count');
  if (state.existentialAbsoluteNullityBeatification.length !== 8) errs.push('existential absolute nullity beatification row count');
  if (state.nationalCollapseOmniSingularityPanidealismIndex < 0 || state.nationalCollapseOmniSingularityPanidealismIndex > 100) errs.push('collapse omni singularity panidealism index out of range');
  if (state.nationalVoidTotalErosionDissipationIndex < 0 || state.nationalVoidTotalErosionDissipationIndex > 100) errs.push('void total erosion dissipation index out of range');
  if (state.nationalExistentialAbsoluteNullityBeatificationIndex < 0 || state.nationalExistentialAbsoluteNullityBeatificationIndex > 100) errs.push('existential absolute nullity beatification index out of range');
"""
    if "panidealism row count" not in comp:
        comp = comp.replace(
            "  if (state.nationalExistentialAbsoluteNullityConsecrationIndex < 0 || state.nationalExistentialAbsoluteNullityConsecrationIndex > 100) errs.push('existential absolute nullity consecration index out of range');\n",
            "  if (state.nationalExistentialAbsoluteNullityConsecrationIndex < 0 || state.nationalExistentialAbsoluteNullityConsecrationIndex > 100) errs.push('existential absolute nullity consecration index out of range');\n"
            + validation,
        )

    compute_block = """
  const collapseOmniSingularityPanidealismOut = op10mA11ComputeRegionalCollapseOmniSingularityPanidealism({
    collapseOmniSingularityPanpsychism: collapseOmniSingularityPanpsychismOut.rows,
    voidTotalErosionAttenuation: voidTotalErosionAttenuationOut.rows,
    existentialAbsoluteNullityConsecration: existentialAbsoluteNullityConsecrationOut.rows,
  });

  const voidTotalErosionDissipationOut = op10mA11ComputeInterregionalVoidTotalErosionDissipation({
    voidTotalErosionAttenuation: voidTotalErosionAttenuationOut.rows,
    collapseOmniSingularityPanpsychism: collapseOmniSingularityPanpsychismOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityBeatificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityBeatification({
    existentialAbsoluteNullityConsecration: existentialAbsoluteNullityConsecrationOut.rows,
    collapseOmniSingularityPanpsychism: collapseOmniSingularityPanpsychismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
    if "collapseOmniSingularityPanidealismOut" not in comp:
        comp = comp.replace(
            """  const existentialAbsoluteNullityConsecrationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration({
    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const derivedRaw""",
            """  const existentialAbsoluteNullityConsecrationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration({
    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
            + compute_block
            + """
  const derivedRaw""",
        )

    derived_insert_marker = """      existentialAbsoluteNullityConsecrationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;"""

    derived_block = """
  const singularityPanidealism = op10mA11RegionsWithCollapseSingularityPanidealism(
    collapseOmniSingularityPanidealismOut.rows,
  );
  if (
    singularityPanidealism.length >= 2 ||
    collapseOmniSingularityPanidealismOut.nationalIndex >= 82 ||
    op10mA11CollapseOmniSingularityPanidealismEscalating(
      collapseOmniSingularityPanidealismOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityPanidealismIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_panidealism',
      singularityPanidealism.slice(0, 5),
      `Regional collapse omni singularity panidealism (index ${collapseOmniSingularityPanidealismOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityPanidealismOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  const erosionDissipation = op10mA11RegionsWithTotalErosionDissipation(voidTotalErosionDissipationOut.rows);
  if (
    erosionDissipation.length >= 2 ||
    voidTotalErosionDissipationOut.nationalIndex >= 81 ||
    op10mA11VoidTotalErosionDissipationEscalating(
      voidTotalErosionDissipationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionDissipationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_dissipation',
      erosionDissipation.slice(0, 5),
      `Interregional void total erosion dissipation (index ${voidTotalErosionDissipationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionDissipationOut.nationalIndex >= 91 ? 'major' : 'meaningful',
    );
  }

  const nullityBeatification = op10mA11RegionsWithTotalAbsoluteNullityBeatification(
    existentialAbsoluteNullityBeatificationOut.rows,
  );
  if (
    nullityBeatification.length >= 2 ||
    existentialAbsoluteNullityBeatificationOut.nationalIndex >= 83 ||
    op10mA11ExistentialAbsoluteNullityBeatificationEscalating(
      existentialAbsoluteNullityBeatificationOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityBeatificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_beatification',
      nullityBeatification.slice(0, 5),
      `Settlement existential absolute nullity beatification (index ${existentialAbsoluteNullityBeatificationOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityBeatificationOut.nationalIndex >= 93 ? 'major' : 'meaningful',
    );
  }
"""
    if "singularityPanidealism" not in comp:
        comp = comp.replace(
            derived_insert_marker,
            """      existentialAbsoluteNullityConsecrationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }
"""
            + derived_block
            + """
  base.revision += 1;""",
            1,
        )

    comp = comp.replace(
        "  base.lastExistentialAbsoluteNullityConsecrationIndex = existentialAbsoluteNullityConsecrationOut.nationalIndex;\n  base.inputHash",
        "  base.lastExistentialAbsoluteNullityConsecrationIndex = existentialAbsoluteNullityConsecrationOut.nationalIndex;\n"
        "  base.lastCollapseOmniSingularityPanidealismIndex = collapseOmniSingularityPanidealismOut.nationalIndex;\n"
        "  base.lastVoidTotalErosionDissipationIndex = voidTotalErosionDissipationOut.nationalIndex;\n"
        "  base.lastExistentialAbsoluteNullityBeatificationIndex = existentialAbsoluteNullityBeatificationOut.nationalIndex;\n"
        "  base.inputHash",
    )

    comp = comp.replace(
        "${existentialAbsoluteNullityConsecrationOut.nationalIndex}`,",
        "${existentialAbsoluteNullityConsecrationOut.nationalIndex}:${collapseOmniSingularityPanidealismOut.nationalIndex}:${voidTotalErosionDissipationOut.nationalIndex}:${existentialAbsoluteNullityBeatificationOut.nationalIndex}`,",
    )

    comp = comp.replace(
        """    existentialAbsoluteNullityConsecration: existentialAbsoluteNullityConsecrationOut.rows,
    nationalExistentialAbsoluteNullityConsecrationIndex: existentialAbsoluteNullityConsecrationOut.nationalIndex,
    summary:""",
        """    existentialAbsoluteNullityConsecration: existentialAbsoluteNullityConsecrationOut.rows,
    nationalExistentialAbsoluteNullityConsecrationIndex: existentialAbsoluteNullityConsecrationOut.nationalIndex,
    collapseOmniSingularityPanidealism: collapseOmniSingularityPanidealismOut.rows,
    nationalCollapseOmniSingularityPanidealismIndex: collapseOmniSingularityPanidealismOut.nationalIndex,
    voidTotalErosionDissipation: voidTotalErosionDissipationOut.rows,
    nationalVoidTotalErosionDissipationIndex: voidTotalErosionDissipationOut.nationalIndex,
    existentialAbsoluteNullityBeatification: existentialAbsoluteNullityBeatificationOut.rows,
    nationalExistentialAbsoluteNullityBeatificationIndex: existentialAbsoluteNullityBeatificationOut.nationalIndex,
    summary:""",
    )

    comp = comp.replace(
        "nullity consecration ${existentialAbsoluteNullityConsecrationOut.nationalIndex}.`,",
        "nullity consecration ${existentialAbsoluteNullityConsecrationOut.nationalIndex}; omni panidealism ${collapseOmniSingularityPanidealismOut.nationalIndex}; erosion dissipation ${voidTotalErosionDissipationOut.nationalIndex}; nullity beatification ${existentialAbsoluteNullityBeatificationOut.nationalIndex}.`,",
    )

    (SRC / "composite-recompute.ts").write_text(comp)

    idx = (SRC / "index.ts").read_text()
    if "panidealism.ts" not in idx:
        idx = idx.replace(
            "export * from './settlement-existential-absolute-nullity-consecration.ts';\n",
            "export * from './settlement-existential-absolute-nullity-consecration.ts';\n"
            "export * from './regional-collapse-omni-singularity-panidealism.ts';\n"
            "export * from './interregional-void-total-erosion-dissipation.ts';\n"
            "export * from './settlement-existential-absolute-nullity-beatification.ts';\n",
        )
        (SRC / "index.ts").write_text(idx)

    st = (SRC / "self-tests.ts").read_text()
    st = st.replace(
        "composite.state.schemaVersion === '10m.a11.composite.47'",
        "composite.state.schemaVersion === '10m.a11.composite.48'",
    )
    imports = """
import { op10mA11ComputeRegionalCollapseOmniSingularityPanidealism } from './regional-collapse-omni-singularity-panidealism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionDissipation } from './interregional-void-total-erosion-dissipation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityBeatification } from './settlement-existential-absolute-nullity-beatification.ts';
"""
    if "Panidealism" not in st:
        st = st.replace(
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration } from './settlement-existential-absolute-nullity-consecration.ts';\n",
            "import { op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration } from './settlement-existential-absolute-nullity-consecration.ts';\n"
            + imports,
        )

    wave49_tests = """
  const collapseOmniSingularityPanidealism = op10mA11ComputeRegionalCollapseOmniSingularityPanidealism({
    collapseOmniSingularityPanpsychism: composite.state.collapseOmniSingularityPanpsychism,
    voidTotalErosionAttenuation: composite.state.voidTotalErosionAttenuation,
    existentialAbsoluteNullityConsecration: composite.state.existentialAbsoluteNullityConsecration,
  });
  push(out, 'a11_429', composite.state.collapseOmniSingularityPanidealism.length === 8 && composite.state.nationalCollapseOmniSingularityPanidealismIndex === collapseOmniSingularityPanidealism.nationalIndex, `omni panidealism ${composite.state.nationalCollapseOmniSingularityPanidealismIndex}`);

  const voidTotalErosionDissipation = op10mA11ComputeInterregionalVoidTotalErosionDissipation({
    voidTotalErosionAttenuation: composite.state.voidTotalErosionAttenuation,
    collapseOmniSingularityPanpsychism: composite.state.collapseOmniSingularityPanpsychism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_430', composite.state.voidTotalErosionDissipation.length === 8 && composite.state.nationalVoidTotalErosionDissipationIndex === voidTotalErosionDissipation.nationalIndex, `erosion dissipation ${composite.state.nationalVoidTotalErosionDissipationIndex}`);

  const existentialAbsoluteNullityBeatification = op10mA11ComputeSettlementExistentialAbsoluteNullityBeatification({
    existentialAbsoluteNullityConsecration: composite.state.existentialAbsoluteNullityConsecration,
    collapseOmniSingularityPanpsychism: composite.state.collapseOmniSingularityPanpsychism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_431', composite.state.existentialAbsoluteNullityBeatification.length === 8 && composite.state.nationalExistentialAbsoluteNullityBeatificationIndex === existentialAbsoluteNullityBeatification.nationalIndex, `nullity beatification ${composite.state.nationalExistentialAbsoluteNullityBeatificationIndex}`);

  push(out, 'a11_432', composite.state.collapseOmniSingularityPanidealism.every((p) => p.narrative.includes('collapse omni singularity panidealism')), composite.state.collapseOmniSingularityPanidealism[0]?.band ?? 'none');
  push(out, 'a11_433', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_panidealism') || composite.state.collapseOmniSingularityPanidealism.some((p) => p.band === 'total' || p.band === 'panidealism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_434', composite.derived.some((d) => d.kind === 'void_total_erosion_dissipation') || composite.state.voidTotalErosionDissipation.some((e) => e.band === 'total' || e.band === 'complete_dissipation'), composite.state.voidTotalErosionDissipation[0]?.band ?? 'none');
  push(out, 'a11_435', composite.persisted.lastVoidTotalErosionDissipationIndex === composite.state.nationalVoidTotalErosionDissipationIndex, `persisted dissipation ${composite.persisted.lastVoidTotalErosionDissipationIndex}`);
  push(out, 'a11_436', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_beatification') || composite.state.existentialAbsoluteNullityBeatification.some((c) => c.band === 'absolute' || c.band === 'total_beatification'), composite.state.existentialAbsoluteNullityBeatification[0]?.band ?? 'none');
  push(out, 'a11_437', composite.state.existentialAbsoluteNullityBeatification.every((c) => c.narrative.includes('existential absolute nullity beatification')), composite.state.existentialAbsoluteNullityBeatification[0]?.band ?? 'none');
"""
    if "a11_429" not in st:
        st = st.replace(
            "  push(out, 'a11_428', composite.state.existentialAbsoluteNullityConsecration.every((c) => c.narrative.includes('existential absolute nullity consecration')), composite.state.existentialAbsoluteNullityConsecration[0]?.band ?? 'none');\n\n  return out;",
            "  push(out, 'a11_428', composite.state.existentialAbsoluteNullityConsecration.every((c) => c.narrative.includes('existential absolute nullity consecration')), composite.state.existentialAbsoluteNullityConsecration[0]?.band ?? 'none');"
            + wave49_tests
            + "\n  return out;",
        )
    (SRC / "self-tests.ts").write_text(st)

    harness_path = SRC / "integration/regional-regression-harness.ts"
    harness = harness_path.read_text()
    if "collapseOmniSingularityPanidealismIndex" not in harness:
        harness = harness.replace(
            "  existentialAbsoluteNullityConsecrationIndex: number;\n",
            "  existentialAbsoluteNullityConsecrationIndex: number;\n"
            "  collapseOmniSingularityPanidealismIndex: number;\n"
            "  voidTotalErosionDissipationIndex: number;\n"
            "  existentialAbsoluteNullityBeatificationIndex: number;\n",
        )
        harness = harness.replace(
            "      existentialAbsoluteNullityConsecrationIndex: out.state.nationalExistentialAbsoluteNullityConsecrationIndex,\n",
            "      existentialAbsoluteNullityConsecrationIndex: out.state.nationalExistentialAbsoluteNullityConsecrationIndex,\n"
            "      collapseOmniSingularityPanidealismIndex: out.state.nationalCollapseOmniSingularityPanidealismIndex,\n"
            "      voidTotalErosionDissipationIndex: out.state.nationalVoidTotalErosionDissipationIndex,\n"
            "      existentialAbsoluteNullityBeatificationIndex: out.state.nationalExistentialAbsoluteNullityBeatificationIndex,\n",
        )
        harness = harness.replace(
            "  const nullityConsecrationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityConsecrationIndex >= 8 && s.existentialAbsoluteNullityConsecrationIndex <= 100,\n"
            "  );\n",
            "  const nullityConsecrationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityConsecrationIndex >= 8 && s.existentialAbsoluteNullityConsecrationIndex <= 100,\n"
            "  );\n"
            "  const omniPanidealismStable = snapshots.every(\n"
            "    (s) => s.collapseOmniSingularityPanidealismIndex >= 8 && s.collapseOmniSingularityPanidealismIndex <= 100,\n"
            "  );\n"
            "  const erosionDissipationStable = snapshots.every(\n"
            "    (s) => s.voidTotalErosionDissipationIndex >= 8 && s.voidTotalErosionDissipationIndex <= 100,\n"
            "  );\n"
            "  const nullityBeatificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityBeatificationIndex >= 8 && s.existentialAbsoluteNullityBeatificationIndex <= 100,\n"
            "  );\n",
        )
        harness = harness.replace(
            "    nullityConsecrationStable;",
            "    nullityConsecrationStable &&\n    omniPanidealismStable &&\n    erosionDissipationStable &&\n    nullityBeatificationStable;",
        )
        harness = harness.replace(
            "nullity consecration ${snapshots[snapshots.length - 1].existentialAbsoluteNullityConsecrationIndex}`",
            "nullity beatification ${snapshots[snapshots.length - 1].existentialAbsoluteNullityBeatificationIndex}`",
        )
        harness_path.write_text(harness)

    readme = ROOT / "README.md"
    text = readme.read_text()
    if "round 49" not in text:
        text = re.sub(
            r"\*\*Scale wave round 48 \(O10-227\):\*\*[^\n]+\n",
            "**Scale wave round 49 (O10-229):** regional collapse omni singularity panidealism, interregional void total erosion dissipation, settlement existential absolute nullity beatification (schema `10m.a11.composite.48`).\n",
            text,
            count=1,
        )
        readme.write_text(text)

    integration = ROOT / "INTEGRATION.md"
    intext = integration.read_text()
    if "round 49" not in intext:
        intext = intext.replace(
            "### Scale wave round 48 (O10-227, schema `10m.a11.composite.47`)",
            "### Scale wave round 49 (O10-229, schema `10m.a11.composite.48`)\n\n"
            "- **Regional collapse omni singularity panidealism** — panpsychism × attenuation × consecration (`op10mA11ComputeRegionalCollapseOmniSingularityPanidealism`)\n"
            "- **Interregional void total erosion dissipation** — attenuation × panpsychism × void front (`op10mA11ComputeInterregionalVoidTotalErosionDissipation`)\n"
            "- **Settlement existential absolute nullity beatification** — consecration × panpsychism × nullity sentence (`op10mA11ComputeSettlementExistentialAbsoluteNullityBeatification`)\n"
            "- Derived events: `collapse_omni_singularity_panidealism`, `void_total_erosion_dissipation`, `existential_absolute_nullity_beatification`\n\n"
            "### Scale wave round 48 (O10-227, schema `10m.a11.composite.47`)",
        )
        integration.write_text(intext)

    print("wave 49 round 49 patches applied")


if __name__ == "__main__":
    main()
