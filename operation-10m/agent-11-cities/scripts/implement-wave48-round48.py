#!/usr/bin/env python3
"""Agent 11 O10-227 wave 48 round 48 — panpsychism, attenuation, consecration."""
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
        "regional-collapse-omni-singularity-panentheism.ts",
        "regional-collapse-omni-singularity-panpsychism.ts",
        [
            ("Panentheism", "Panpsychism"),
            ("panentheism", "panpsychism"),
            ("Pantheism", "Panentheism"),
            ("pantheism", "panentheism"),
            ("Exhaustion", "Enervation"),
            ("exhaustion", "enervation"),
            ("Canonization", "Sanctification"),
            ("canonization", "sanctification"),
            ("collapseOmniSingularityPantheism", "collapseOmniSingularityPanentheism"),
            ("voidTotalErosionExhaustion", "voidTotalErosionEnervation"),
            ("existentialAbsoluteNullityCanonization", "existentialAbsoluteNullitySanctification"),
            ("pantheismScore", "panentheismScore"),
            ("exhaustionScore", "enervationScore"),
            ("canonizationScore", "sanctificationScore"),
            ("'pantheism'", "'panentheism'"),
            ("'complete_exhaustion'", "'complete_enervation'"),
            ("'total_canonization'", "'total_sanctification'"),
        ],
    )

    clone_module(
        "interregional-void-total-erosion-enervation.ts",
        "interregional-void-total-erosion-attenuation.ts",
        [
            ("Enervation", "Attenuation"),
            ("enervation", "attenuation"),
            ("Exhaustion", "Enervation"),
            ("exhaustion", "enervation"),
            ("Pantheism", "Panentheism"),
            ("pantheism", "panentheism"),
            ("voidTotalErosionExhaustion", "voidTotalErosionEnervation"),
            ("collapseOmniSingularityPantheism", "collapseOmniSingularityPanentheism"),
            ("exhaustionScore", "enervationScore"),
            ("pantheismScore", "panentheismScore"),
            ("'complete_exhaustion'", "'complete_enervation'"),
            ("'pantheism'", "'panentheism'"),
            ("enervating", "attenuating"),
            ("complete_enervation", "complete_attenuation"),
        ],
    )

    clone_module(
        "settlement-existential-absolute-nullity-sanctification.ts",
        "settlement-existential-absolute-nullity-consecration.ts",
        [
            ("Sanctification", "Consecration"),
            ("sanctification", "consecration"),
            ("Canonization", "Sanctification"),
            ("canonization", "sanctification"),
            ("Pantheism", "Panentheism"),
            ("pantheism", "panentheism"),
            ("existentialAbsoluteNullityCanonization", "existentialAbsoluteNullitySanctification"),
            ("collapseOmniSingularityPantheism", "collapseOmniSingularityPanentheism"),
            ("canonizationScore", "sanctificationScore"),
            ("pantheismScore", "panentheismScore"),
            ("'pantheism'", "'panentheism'"),
            ("'total_canonization'", "'total_sanctification'"),
            ("sanctifying", "consecrating"),
            ("total_sanctification", "total_consecration"),
        ],
    )

    types = (SRC / "types.ts").read_text()
    types = types.replace(
        "export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.46' as const;",
        "export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.47' as const;",
    )
    types = types.replace(
        "  | 'existential_absolute_nullity_sanctification';",
        "  | 'existential_absolute_nullity_sanctification'\n"
        "  | 'collapse_omni_singularity_panpsychism'\n"
        "  | 'void_total_erosion_attenuation'\n"
        "  | 'existential_absolute_nullity_consecration';",
    )
    insert_after = """export interface OP10M_A11_ExistentialAbsoluteNullitySanctificationRow {
  regionId: OP10M_A11_RegionId;
  sanctificationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullitySanctificationBand;
  marks: string[];
  narrative: string;
}

"""
    new_types = """
export type OP10M_A11_CollapseOmniSingularityPanpsychismBand = 'latent' | 'aligning' | 'total' | 'panpsychism';

export interface OP10M_A11_CollapseOmniSingularityPanpsychismRow {
  regionId: OP10M_A11_RegionId;
  panpsychismScore: number;
  band: OP10M_A11_CollapseOmniSingularityPanpsychismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionAttenuationBand = 'dormant' | 'attenuating' | 'total' | 'complete_attenuation';

export interface OP10M_A11_VoidTotalErosionAttenuationRow {
  regionId: OP10M_A11_RegionId;
  attenuationScore: number;
  band: OP10M_A11_VoidTotalErosionAttenuationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityConsecrationBand = 'trace' | 'consecrating' | 'absolute' | 'total_consecration';

export interface OP10M_A11_ExistentialAbsoluteNullityConsecrationRow {
  regionId: OP10M_A11_RegionId;
  consecrationScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityConsecrationBand;
  marks: string[];
  narrative: string;
}

"""
    if "PanpsychismBand" not in types:
        types = types.replace(insert_after, insert_after + new_types)

    types = types.replace(
        """  nationalExistentialAbsoluteNullitySanctificationIndex: number;
  summary: string;""",
        """  nationalExistentialAbsoluteNullitySanctificationIndex: number;
  collapseOmniSingularityPanpsychism: OP10M_A11_CollapseOmniSingularityPanpsychismRow[];
  nationalCollapseOmniSingularityPanpsychismIndex: number;
  voidTotalErosionAttenuation: OP10M_A11_VoidTotalErosionAttenuationRow[];
  nationalVoidTotalErosionAttenuationIndex: number;
  existentialAbsoluteNullityConsecration: OP10M_A11_ExistentialAbsoluteNullityConsecrationRow[];
  nationalExistentialAbsoluteNullityConsecrationIndex: number;
  summary: string;""",
    )
    types = types.replace(
        """  lastExistentialAbsoluteNullitySanctificationIndex: number;
  inputHash: string;""",
        """  lastExistentialAbsoluteNullitySanctificationIndex: number;
  lastCollapseOmniSingularityPanpsychismIndex: number;
  lastVoidTotalErosionAttenuationIndex: number;
  lastExistentialAbsoluteNullityConsecrationIndex: number;
  inputHash: string;""",
    )
    (SRC / "types.ts").write_text(types)

    comp = (SRC / "composite-recompute.ts").read_text()
    import_block = """
import {
  op10mA11CollapseOmniSingularityPanpsychismEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityPanpsychism,
  op10mA11RegionsWithCollapseSingularityPanpsychism,
} from './regional-collapse-omni-singularity-panpsychism.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionAttenuation,
  op10mA11RegionsWithTotalErosionAttenuation,
  op10mA11VoidTotalErosionAttenuationEscalating,
} from './interregional-void-total-erosion-attenuation.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration,
  op10mA11ExistentialAbsoluteNullityConsecrationEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityConsecration,
} from './settlement-existential-absolute-nullity-consecration.ts';
"""
    if "panpsychism.ts" not in comp:
        comp = comp.replace(
            "} from './settlement-existential-absolute-nullity-sanctification.ts';\n",
            "} from './settlement-existential-absolute-nullity-sanctification.ts';\n" + import_block,
        )

    comp = comp.replace(
        "    lastExistentialAbsoluteNullitySanctificationIndex: 0,\n",
        "    lastExistentialAbsoluteNullitySanctificationIndex: 0,\n"
        "    lastCollapseOmniSingularityPanpsychismIndex: 0,\n"
        "    lastVoidTotalErosionAttenuationIndex: 0,\n"
        "    lastExistentialAbsoluteNullityConsecrationIndex: 0,\n",
    )

    validation = """
  if (state.collapseOmniSingularityPanpsychism.length !== 8) errs.push('collapse omni singularity panpsychism row count');
  if (state.voidTotalErosionAttenuation.length !== 8) errs.push('void total erosion attenuation row count');
  if (state.existentialAbsoluteNullityConsecration.length !== 8) errs.push('existential absolute nullity consecration row count');
  if (state.nationalCollapseOmniSingularityPanpsychismIndex < 0 || state.nationalCollapseOmniSingularityPanpsychismIndex > 100) errs.push('collapse omni singularity panpsychism index out of range');
  if (state.nationalVoidTotalErosionAttenuationIndex < 0 || state.nationalVoidTotalErosionAttenuationIndex > 100) errs.push('void total erosion attenuation index out of range');
  if (state.nationalExistentialAbsoluteNullityConsecrationIndex < 0 || state.nationalExistentialAbsoluteNullityConsecrationIndex > 100) errs.push('existential absolute nullity consecration index out of range');
"""
    if "panpsychism row count" not in comp:
        comp = comp.replace(
            "  if (state.nationalExistentialAbsoluteNullitySanctificationIndex < 0 || state.nationalExistentialAbsoluteNullitySanctificationIndex > 100) errs.push('existential absolute nullity sanctification index out of range');\n",
            "  if (state.nationalExistentialAbsoluteNullitySanctificationIndex < 0 || state.nationalExistentialAbsoluteNullitySanctificationIndex > 100) errs.push('existential absolute nullity sanctification index out of range');\n"
            + validation,
        )

    compute_block = """
  const collapseOmniSingularityPanpsychismOut = op10mA11ComputeRegionalCollapseOmniSingularityPanpsychism({
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    voidTotalErosionEnervation: voidTotalErosionEnervationOut.rows,
    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
  });

  const voidTotalErosionAttenuationOut = op10mA11ComputeInterregionalVoidTotalErosionAttenuation({
    voidTotalErosionEnervation: voidTotalErosionEnervationOut.rows,
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityConsecrationOut = op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration({
    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    collapseOmniSingularityPanentheism: collapseOmniSingularityPanentheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
    if "collapseOmniSingularityPanpsychismOut" not in comp:
        comp = comp.replace(
            """  const existentialAbsoluteNullitySanctificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullitySanctification({
    existentialAbsoluteNullityCanonization: existentialAbsoluteNullityCanonizationOut.rows,
    collapseOmniSingularityPantheism: collapseOmniSingularityPantheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const derivedRaw""",
            """  const existentialAbsoluteNullitySanctificationOut = op10mA11ComputeSettlementExistentialAbsoluteNullitySanctification({
    existentialAbsoluteNullityCanonization: existentialAbsoluteNullityCanonizationOut.rows,
    collapseOmniSingularityPantheism: collapseOmniSingularityPantheismOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });
"""
            + compute_block
            + """
  const derivedRaw""",
        )

    derived_insert_marker = """      existentialAbsoluteNullitySanctificationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;"""

    derived_block = """
  const singularityPanpsychism = op10mA11RegionsWithCollapseSingularityPanpsychism(
    collapseOmniSingularityPanpsychismOut.rows,
  );
  if (
    singularityPanpsychism.length >= 2 ||
    collapseOmniSingularityPanpsychismOut.nationalIndex >= 81 ||
    op10mA11CollapseOmniSingularityPanpsychismEscalating(
      collapseOmniSingularityPanpsychismOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityPanpsychismIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_panpsychism',
      singularityPanpsychism.slice(0, 5),
      `Regional collapse omni singularity panpsychism (index ${collapseOmniSingularityPanpsychismOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityPanpsychismOut.nationalIndex >= 91 ? 'major' : 'meaningful',
    );
  }

  const erosionAttenuation = op10mA11RegionsWithTotalErosionAttenuation(voidTotalErosionAttenuationOut.rows);
  if (
    erosionAttenuation.length >= 2 ||
    voidTotalErosionAttenuationOut.nationalIndex >= 80 ||
    op10mA11VoidTotalErosionAttenuationEscalating(
      voidTotalErosionAttenuationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionAttenuationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_attenuation',
      erosionAttenuation.slice(0, 5),
      `Interregional void total erosion attenuation (index ${voidTotalErosionAttenuationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionAttenuationOut.nationalIndex >= 90 ? 'major' : 'meaningful',
    );
  }

  const nullityConsecration = op10mA11RegionsWithTotalAbsoluteNullityConsecration(
    existentialAbsoluteNullityConsecrationOut.rows,
  );
  if (
    nullityConsecration.length >= 2 ||
    existentialAbsoluteNullityConsecrationOut.nationalIndex >= 82 ||
    op10mA11ExistentialAbsoluteNullityConsecrationEscalating(
      existentialAbsoluteNullityConsecrationOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityConsecrationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_consecration',
      nullityConsecration.slice(0, 5),
      `Settlement existential absolute nullity consecration (index ${existentialAbsoluteNullityConsecrationOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityConsecrationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }
"""
    if "singularityPanpsychism" not in comp:
        comp = comp.replace(
            derived_insert_marker,
            """      existentialAbsoluteNullitySanctificationOut.nationalIndex >= 92 ? 'major' : 'meaningful',
    );
  }
"""
            + derived_block
            + """
  base.revision += 1;""",
            1,
        )

    comp = comp.replace(
        "  base.lastExistentialAbsoluteNullitySanctificationIndex = existentialAbsoluteNullitySanctificationOut.nationalIndex;\n  base.inputHash",
        "  base.lastExistentialAbsoluteNullitySanctificationIndex = existentialAbsoluteNullitySanctificationOut.nationalIndex;\n"
        "  base.lastCollapseOmniSingularityPanpsychismIndex = collapseOmniSingularityPanpsychismOut.nationalIndex;\n"
        "  base.lastVoidTotalErosionAttenuationIndex = voidTotalErosionAttenuationOut.nationalIndex;\n"
        "  base.lastExistentialAbsoluteNullityConsecrationIndex = existentialAbsoluteNullityConsecrationOut.nationalIndex;\n"
        "  base.inputHash",
    )

    comp = comp.replace(
        "${existentialAbsoluteNullitySanctificationOut.nationalIndex}`,",
        "${existentialAbsoluteNullitySanctificationOut.nationalIndex}:${collapseOmniSingularityPanpsychismOut.nationalIndex}:${voidTotalErosionAttenuationOut.nationalIndex}:${existentialAbsoluteNullityConsecrationOut.nationalIndex}`,",
    )

    comp = comp.replace(
        """    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    nationalExistentialAbsoluteNullitySanctificationIndex: existentialAbsoluteNullitySanctificationOut.nationalIndex,
    summary:""",
        """    existentialAbsoluteNullitySanctification: existentialAbsoluteNullitySanctificationOut.rows,
    nationalExistentialAbsoluteNullitySanctificationIndex: existentialAbsoluteNullitySanctificationOut.nationalIndex,
    collapseOmniSingularityPanpsychism: collapseOmniSingularityPanpsychismOut.rows,
    nationalCollapseOmniSingularityPanpsychismIndex: collapseOmniSingularityPanpsychismOut.nationalIndex,
    voidTotalErosionAttenuation: voidTotalErosionAttenuationOut.rows,
    nationalVoidTotalErosionAttenuationIndex: voidTotalErosionAttenuationOut.nationalIndex,
    existentialAbsoluteNullityConsecration: existentialAbsoluteNullityConsecrationOut.rows,
    nationalExistentialAbsoluteNullityConsecrationIndex: existentialAbsoluteNullityConsecrationOut.nationalIndex,
    summary:""",
    )

    comp = comp.replace(
        "nullity sanctification ${existentialAbsoluteNullitySanctificationOut.nationalIndex}.`,",
        "nullity sanctification ${existentialAbsoluteNullitySanctificationOut.nationalIndex}; omni panpsychism ${collapseOmniSingularityPanpsychismOut.nationalIndex}; erosion attenuation ${voidTotalErosionAttenuationOut.nationalIndex}; nullity consecration ${existentialAbsoluteNullityConsecrationOut.nationalIndex}.`,",
    )

    (SRC / "composite-recompute.ts").write_text(comp)

    idx = (SRC / "index.ts").read_text()
    if "panpsychism.ts" not in idx:
        idx = idx.replace(
            "export * from './settlement-existential-absolute-nullity-sanctification.ts';\n",
            "export * from './settlement-existential-absolute-nullity-sanctification.ts';\n"
            "export * from './regional-collapse-omni-singularity-panpsychism.ts';\n"
            "export * from './interregional-void-total-erosion-attenuation.ts';\n"
            "export * from './settlement-existential-absolute-nullity-consecration.ts';\n",
        )
        (SRC / "index.ts").write_text(idx)

    st = (SRC / "self-tests.ts").read_text()
    st = st.replace(
        "composite.state.schemaVersion === '10m.a11.composite.46'",
        "composite.state.schemaVersion === '10m.a11.composite.47'",
    )
    imports = """
import { op10mA11ComputeRegionalCollapseOmniSingularityPanpsychism } from './regional-collapse-omni-singularity-panpsychism.ts';
import { op10mA11ComputeInterregionalVoidTotalErosionAttenuation } from './interregional-void-total-erosion-attenuation.ts';
import { op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration } from './settlement-existential-absolute-nullity-consecration.ts';
"""
    if "Panpsychism" not in st:
        st = st.replace(
            "import { op10mA11ComputeRegionalCollapseOmniSingularityPanentheism } from './regional-collapse-omni-singularity-panentheism.ts';\n",
            "import { op10mA11ComputeRegionalCollapseOmniSingularityPanentheism } from './regional-collapse-omni-singularity-panentheism.ts';\n"
            + imports,
        )

    wave48_tests = """
  const collapseOmniSingularityPanpsychism = op10mA11ComputeRegionalCollapseOmniSingularityPanpsychism({
    collapseOmniSingularityPanentheism: composite.state.collapseOmniSingularityPanentheism,
    voidTotalErosionEnervation: composite.state.voidTotalErosionEnervation,
    existentialAbsoluteNullitySanctification: composite.state.existentialAbsoluteNullitySanctification,
  });
  push(out, 'a11_420', composite.state.collapseOmniSingularityPanpsychism.length === 8 && composite.state.nationalCollapseOmniSingularityPanpsychismIndex === collapseOmniSingularityPanpsychism.nationalIndex, `omni panpsychism ${composite.state.nationalCollapseOmniSingularityPanpsychismIndex}`);

  const voidTotalErosionAttenuation = op10mA11ComputeInterregionalVoidTotalErosionAttenuation({
    voidTotalErosionEnervation: composite.state.voidTotalErosionEnervation,
    collapseOmniSingularityPanentheism: composite.state.collapseOmniSingularityPanentheism,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(out, 'a11_421', composite.state.voidTotalErosionAttenuation.length === 8 && composite.state.nationalVoidTotalErosionAttenuationIndex === voidTotalErosionAttenuation.nationalIndex, `erosion attenuation ${composite.state.nationalVoidTotalErosionAttenuationIndex}`);

  const existentialAbsoluteNullityConsecration = op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration({
    existentialAbsoluteNullitySanctification: composite.state.existentialAbsoluteNullitySanctification,
    collapseOmniSingularityPanentheism: composite.state.collapseOmniSingularityPanentheism,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(out, 'a11_422', composite.state.existentialAbsoluteNullityConsecration.length === 8 && composite.state.nationalExistentialAbsoluteNullityConsecrationIndex === existentialAbsoluteNullityConsecration.nationalIndex, `nullity consecration ${composite.state.nationalExistentialAbsoluteNullityConsecrationIndex}`);

  push(out, 'a11_423', composite.state.collapseOmniSingularityPanpsychism.every((p) => p.narrative.includes('collapse omni singularity panpsychism')), composite.state.collapseOmniSingularityPanpsychism[0]?.band ?? 'none');
  push(out, 'a11_424', composite.derived.some((d) => d.kind === 'collapse_omni_singularity_panpsychism') || composite.state.collapseOmniSingularityPanpsychism.some((p) => p.band === 'total' || p.band === 'panpsychism'), composite.derived.map((d) => d.kind).join(', '));
  push(out, 'a11_425', composite.derived.some((d) => d.kind === 'void_total_erosion_attenuation') || composite.state.voidTotalErosionAttenuation.some((e) => e.band === 'total' || e.band === 'complete_attenuation'), composite.state.voidTotalErosionAttenuation[0]?.band ?? 'none');
  push(out, 'a11_426', composite.persisted.lastVoidTotalErosionAttenuationIndex === composite.state.nationalVoidTotalErosionAttenuationIndex, `persisted attenuation ${composite.persisted.lastVoidTotalErosionAttenuationIndex}`);
  push(out, 'a11_427', composite.derived.some((d) => d.kind === 'existential_absolute_nullity_consecration') || composite.state.existentialAbsoluteNullityConsecration.some((c) => c.band === 'absolute' || c.band === 'total_consecration'), composite.state.existentialAbsoluteNullityConsecration[0]?.band ?? 'none');
  push(out, 'a11_428', composite.state.existentialAbsoluteNullityConsecration.every((c) => c.narrative.includes('existential absolute nullity consecration')), composite.state.existentialAbsoluteNullityConsecration[0]?.band ?? 'none');
"""
    if "a11_420" not in st:
        st = st.replace(
            "  push(out, 'a11_419', composite.state.existentialAbsoluteNullitySanctification.every((c) => c.narrative.includes('existential absolute nullity sanctification')), composite.state.existentialAbsoluteNullitySanctification[0]?.band ?? 'none');\n\n  return out;",
            "  push(out, 'a11_419', composite.state.existentialAbsoluteNullitySanctification.every((c) => c.narrative.includes('existential absolute nullity sanctification')), composite.state.existentialAbsoluteNullitySanctification[0]?.band ?? 'none');"
            + wave48_tests
            + "\n  return out;",
        )
    (SRC / "self-tests.ts").write_text(st)

    harness_path = SRC / "integration/regional-regression-harness.ts"
    harness = harness_path.read_text()
    if "collapseOmniSingularityPanpsychismIndex" not in harness:
        harness = harness.replace(
            "  existentialAbsoluteNullitySanctificationIndex: number;\n",
            "  existentialAbsoluteNullitySanctificationIndex: number;\n"
            "  collapseOmniSingularityPanpsychismIndex: number;\n"
            "  voidTotalErosionAttenuationIndex: number;\n"
            "  existentialAbsoluteNullityConsecrationIndex: number;\n",
        )
        harness = harness.replace(
            "      existentialAbsoluteNullitySanctificationIndex: out.state.nationalExistentialAbsoluteNullitySanctificationIndex,\n",
            "      existentialAbsoluteNullitySanctificationIndex: out.state.nationalExistentialAbsoluteNullitySanctificationIndex,\n"
            "      collapseOmniSingularityPanpsychismIndex: out.state.nationalCollapseOmniSingularityPanpsychismIndex,\n"
            "      voidTotalErosionAttenuationIndex: out.state.nationalVoidTotalErosionAttenuationIndex,\n"
            "      existentialAbsoluteNullityConsecrationIndex: out.state.nationalExistentialAbsoluteNullityConsecrationIndex,\n",
        )
        harness = harness.replace(
            "  const nullitySanctificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullitySanctificationIndex >= 8 && s.existentialAbsoluteNullitySanctificationIndex <= 100,\n"
            "  );\n",
            "  const nullitySanctificationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullitySanctificationIndex >= 8 && s.existentialAbsoluteNullitySanctificationIndex <= 100,\n"
            "  );\n"
            "  const omniPanpsychismStable = snapshots.every(\n"
            "    (s) => s.collapseOmniSingularityPanpsychismIndex >= 8 && s.collapseOmniSingularityPanpsychismIndex <= 100,\n"
            "  );\n"
            "  const erosionAttenuationStable = snapshots.every(\n"
            "    (s) => s.voidTotalErosionAttenuationIndex >= 8 && s.voidTotalErosionAttenuationIndex <= 100,\n"
            "  );\n"
            "  const nullityConsecrationStable = snapshots.every(\n"
            "    (s) => s.existentialAbsoluteNullityConsecrationIndex >= 8 && s.existentialAbsoluteNullityConsecrationIndex <= 100,\n"
            "  );\n",
        )
        harness = harness.replace(
            "    nullitySanctificationStable;",
            "    nullitySanctificationStable &&\n    omniPanpsychismStable &&\n    erosionAttenuationStable &&\n    nullityConsecrationStable;",
        )
        harness = harness.replace(
            "nullity sanctification ${snapshots[snapshots.length - 1].existentialAbsoluteNullitySanctificationIndex}`",
            "nullity consecration ${snapshots[snapshots.length - 1].existentialAbsoluteNullityConsecrationIndex}`",
        )
        harness_path.write_text(harness)

    for doc in (ROOT / "README.md", ROOT / "INTEGRATION.md"):
        text = doc.read_text()
        if "round 48" not in text:
            text = re.sub(
                r"\*\*Scale wave round 47 \(O10-225\):\*\*[^\n]+\n",
                "**Scale wave round 48 (O10-227):** regional collapse omni singularity panpsychism, interregional void total erosion attenuation, settlement existential absolute nullity consecration (schema `10m.a11.composite.47`).\n",
                text,
                count=1,
            )
            doc.write_text(text)

    print("wave 48 round 48 patches applied")


if __name__ == "__main__":
    main()
