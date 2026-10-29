#!/usr/bin/env python3
"""Generate Agent 12 wave 55 / round 55 from round 52 templates."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("scale-wave-round53-assets", "scale-wave-round54-assets"),
    ("corridors-round53", "corridors-round54"),
    ("scenarios-round53", "scenarios-round54"),
    ("TRANSPORT_CORRIDORS_ROUND53", "TRANSPORT_CORRIDORS_ROUND54"),
    ("TRANSPORT_SCENARIOS_ROUND53", "TRANSPORT_SCENARIOS_ROUND54"),
    ("SCALE_WAVE_ROUND54_ASSETS", "SCALE_WAVE_ROUND54_ASSETS"),
    ("ROUND53_", "ROUND54_"),
    ("round53", "round54"),
    ("Round52", "Round53"),
    ("Round 52", "Round 53"),
    ("fusion-tritium-breeding-export-index", "tokamak-deuterium-export-index"),
    ("remote-pediatric-oncology-supply-staging-index", "remote-trauma-surgery-supply-staging-index"),
    ("port-bio-lng-bunkering-logistics-index", "port-liquid-hydrogen-bunkering-logistics-index"),
    ("fusion_tritium_breeding_export", "tokamak_deuterium_export"),
    ("tritium_breeding_logistics", "deuterium_export_logistics"),
    ("fusion_freight_corridor", "tokamak_freight_corridor"),
    ("Fusion Tritium Breeding", "Tokamak Deuterium"),
    ("fusion tritium breeding", "tokamak deuterium"),
    ("FusionTritiumBreeding", "TokamakDeuteriumExport"),
    ("fusionTritiumBreeding", "tokamakDeuteriumExport"),
    ("Fusion Tritium Breeding", "Tokamak Deuterium"),
    ("remote_pediatric_oncology_supply", "remote_trauma_surgery_supply"),
    ("pediatric_oncology_staging", "trauma_surgery_staging"),
    ("oncology_critical_care_logistics", "trauma_surgery_critical_care_logistics"),
    ("RemotePediatricOncology", "RemoteTraumaSurgery"),
    ("remotePediatricOncology", "remoteTraumaSurgery"),
    ("PediatricOncology", "TraumaSurgery"),
    ("pediatricOncology", "traumaSurgery"),
    ("Pediatric Oncology", "Trauma Surgery"),
    ("pediatric oncology", "trauma surgery"),
    ("port_bio_lng_bunkering", "port_liquid_hydrogen_bunkering"),
    ("bio_lng_mooring", "liquid_hydrogen_mooring"),
    ("liquefied_biofuel_bunkering", "liquid_hydrogen_bunkering"),
    ("PortBioLngBunkering", "PortLiquidHydrogenBunkering"),
    ("portBioLngBunkering", "portLiquidHydrogenBunkering"),
    ("Bio-LNG", "Liquid Hydrogen"),
    ("Bio LNG", "Liquid Hydrogen"),
    ("bio-LNG", "liquid hydrogen"),
    ("Bio-LNG Bunkering", "Liquid Hydrogen Bunkering"),
    ("bio-LNG bunkering", "liquid hydrogen bunkering"),
    ("bio-LNG", "liquid-hydrogen"),
    ("Tritium Feed", "Deuterium Feed"),
    ("tritium berths", "deuterium berths"),
    ("tritium feed", "deuterium feed"),
    ("superconducting_hvdc", "stellarator_helium3"),
    ("fusion_tritium_breeding", "stellarator_helium3"),
    ("pediatricOncology", "burn_center"),
    ("methanol_liquefied_biofuel_bunkering", "liquid_hydrogen_bunkering"),
    ("718", "748"),
    ("170", "176"),
    ("278", "288"),
    ("agent12/54", "agent12/56"),
    ("O10-237", "O10-247"),
    ("wave 54", "wave 54"),
    ("round 54", "round 54"),
    ("WAVE52", "WAVE53"),
    ("wave53", "wave55"),
    ("Wave 52", "Wave 54"),
    ("51039c5eeda7383be02de7a9dc7b233186cbccbb", "c4bbec67109a453217e2966bd0ab02bdbaf94787"),
]


def apply_replacements(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def write_from_template(src: Path, dest: Path) -> None:
    dest.write_text(apply_replacements(src.read_text()), encoding="utf-8")


def patch_file(path: Path, fn) -> None:
    text = path.read_text(encoding="utf-8")
    new_text = fn(text)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")


def main() -> None:
    catalog = ROOT / "catalog"
    write_from_template(catalog / "scale-wave-round53-assets.ts", catalog / "scale-wave-round54-assets.ts")
    write_from_template(catalog / "corridors-round53.ts", catalog / "corridors-round54.ts")
    write_from_template(catalog / "scenarios-round53.ts", catalog / "scenarios-round54.ts")

    write_from_template(
        ROOT / "network/fusion-tritium-breeding-export-index.ts",
        ROOT / "network/tokamak-deuterium-export-index.ts",
    )
    write_from_template(
        ROOT / "operations/remote-pediatric-oncology-supply-staging-index.ts",
        ROOT / "operations/remote-trauma-surgery-supply-staging-index.ts",
    )
    write_from_template(
        ROOT / "productivity/port-bio-lng-bunkering-logistics-index.ts",
        ROOT / "productivity/port-liquid-hydrogen-bunkering-logistics-index.ts",
    )

    for name in ("all-catalog.ts", "corridors-catalog.ts", "scenarios-catalog.ts"):
        path = catalog / name
        text = path.read_text(encoding="utf-8")
        if "round54" not in text:
            text = text.replace("round53-assets.ts", "round53-assets.ts")
            if "scale-wave-round53" in text:
                text = text.replace(
                    "from './scale-wave-round53-assets.ts';",
                    "from './scale-wave-round53-assets.ts';\nimport { SCALE_WAVE_ROUND54_ASSETS } from './scale-wave-round54-assets.ts';",
                )
                text = text.replace(
                    "...SCALE_WAVE_ROUND54_ASSETS,",
                    "...SCALE_WAVE_ROUND54_ASSETS,\n    ...SCALE_WAVE_ROUND54_ASSETS,",
                )
            if "corridors-round53" in text:
                text = text.replace(
                    "from './corridors-round53.ts';",
                    "from './corridors-round53.ts';\nimport { TRANSPORT_CORRIDORS_ROUND54 } from './corridors-round54.ts';",
                )
                text = text.replace(
                    "...TRANSPORT_CORRIDORS_ROUND53,",
                    "...TRANSPORT_CORRIDORS_ROUND53,\n  ...TRANSPORT_CORRIDORS_ROUND54,",
                )
            if "scenarios-round53" in text:
                text = text.replace(
                    "from './scenarios-round53.ts';",
                    "from './scenarios-round53.ts';\nimport { TRANSPORT_SCENARIOS_ROUND54 } from './scenarios-round54.ts';",
                )
                text = text.replace(
                    "...TRANSPORT_SCENARIOS_ROUND53,",
                    "...TRANSPORT_SCENARIOS_ROUND53,\n  ...TRANSPORT_SCENARIOS_ROUND54,",
                )
            path.write_text(text, encoding="utf-8")

    chunk = ROOT / "scripts/build-chunk.mjs"
    chunk_text = chunk.read_text(encoding="utf-8")
    inserts = [
        ("  'catalog/corridors-round53.ts',", "  'catalog/corridors-round53.ts',\n  'catalog/corridors-round54.ts',"),
        ("  'catalog/scenarios-round53.ts',", "  'catalog/scenarios-round53.ts',\n  'catalog/scenarios-round54.ts',"),
        (
            "  'catalog/scale-wave-round53-assets.ts',",
            "  'catalog/scale-wave-round53-assets.ts',\n  'catalog/scale-wave-round54-assets.ts',",
        ),
        (
            "  'network/fusion-tritium-breeding-export-index.ts',",
            "  'network/fusion-tritium-breeding-export-index.ts',\n  'network/tokamak-deuterium-export-index.ts',",
        ),
        (
            "  'operations/remote-pediatric-oncology-supply-staging-index.ts',",
            "  'operations/remote-pediatric-oncology-supply-staging-index.ts',\n  'operations/remote-trauma-surgery-supply-staging-index.ts',",
        ),
        (
            "  'productivity/port-bio-lng-bunkering-logistics-index.ts',",
            "  'productivity/port-bio-lng-bunkering-logistics-index.ts',\n  'productivity/port-liquid-hydrogen-bunkering-logistics-index.ts',",
        ),
    ]
    for old, new in inserts:
        if "round54" not in chunk_text and old in chunk_text:
            chunk_text = chunk_text.replace(old, new, 1)
    chunk.write_text(chunk_text, encoding="utf-8")

    types_path = ROOT / "types.ts"
    types = types_path.read_text(encoding="utf-8")
    if "TokamakDeuteriumExportExportPolicy" not in types:
        types = types.replace(
            "export type FusionTritiumBreedingExportPolicy = 'baseline' | 'accelerate';",
            "export type FusionTritiumBreedingExportPolicy = 'baseline' | 'accelerate';\n"
            "export type TokamakDeuteriumExportExportPolicy = 'baseline' | 'accelerate';",
        )
        types = types.replace(
            "export type PortBioLngBunkeringLogisticsPolicy = 'baseline' | 'expand';",
            "export type PortBioLngBunkeringLogisticsPolicy = 'baseline' | 'expand';\n"
            "export type PortLiquidHydrogenBunkeringLogisticsPolicy = 'baseline' | 'expand';",
        )
        types = types.replace(
            "export type RemotePediatricOncologySupplyStagingPolicy = 'baseline' | 'surge';",
            "export type RemotePediatricOncologySupplyStagingPolicy = 'baseline' | 'surge';\n"
            "export type RemoteTraumaSurgerySupplyStagingPolicy = 'baseline' | 'surge';",
        )
        types = types.replace(
            "  portBioLngBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n  computeMs: number;",
            "  portMethanolDualFuelBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n"
            "  nationalTokamakDeuteriumExportExportIndex: number;\n"
            "  tokamakDeuteriumExportExportByRegion: Record<AuRegionCode, number>;\n"
            "  remoteTraumaSurgerySupplyStagingShare: number;\n"
            "  nationalRemoteTraumaSurgerySupplyStagingIndex: number;\n"
            "  remoteTraumaSurgerySupplyStagingByRegion: Record<AuRegionCode, number>;\n"
            "  portLiquidHydrogenBunkeringLogisticsShare: number;\n"
            "  nationalPortLiquidHydrogenBunkeringLogisticsThroughputIndex: number;\n"
            "  portLiquidHydrogenBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n"
            "  computeMs: number;",
        )
        types = types.replace(
            "  portBioLngBunkeringLogisticsPolicy?: PortBioLngBunkeringLogisticsPolicy;\n}",
            "  portBioLngBunkeringLogisticsPolicy?: PortBioLngBunkeringLogisticsPolicy;\n"
            "  tokamakDeuteriumExportExportPolicy?: TokamakDeuteriumExportExportPolicy;\n"
            "  remoteTraumaSurgerySupplyStagingPolicy?: RemoteTraumaSurgerySupplyStagingPolicy;\n"
            "  portLiquidHydrogenBunkeringLogisticsPolicy?: PortLiquidHydrogenBunkeringLogisticsPolicy;\n}",
        )
        types_path.write_text(types, encoding="utf-8")

    compute = ROOT / "productivity/compute-infrastructure-state.ts"
    ctext = compute.read_text(encoding="utf-8")
    if "tokamakDeuteriumExportExportByRegion" not in ctext:
        import_block = """import {
  computePortBioLngBunkeringLogisticsShare,
  computePortBioLngBunkeringLogisticsThroughputByRegion,
  nationalPortBioLngBunkeringLogisticsThroughputIndex,
  portBioLngBunkeringLogisticsProductivityMultiplier,
} from './port-bio-lng-bunkering-logistics-index.ts';"""
        new_imports = import_block + """
import {
  computeTokamakDeuteriumExportExportByRegion,
  nationalTokamakDeuteriumExportExportIndex,
  tokamakDeuteriumExportExportProductivityMultiplier,
} from '../network/tokamak-deuterium-export-index.ts';
import {
  computeRemoteTraumaSurgerySupplyStagingByRegion,
  computeRemoteTraumaSurgerySupplyStagingShare,
  nationalRemoteTraumaSurgerySupplyStagingIndex,
  remoteTraumaSurgerySupplyStagingProductivityMultiplier,
} from '../operations/remote-trauma-surgery-supply-staging-index.ts';
import {
  computePortLiquidHydrogenBunkeringLogisticsShare,
  computePortLiquidHydrogenBunkeringLogisticsThroughputByRegion,
  nationalPortLiquidHydrogenBunkeringLogisticsThroughputIndex,
  portLiquidHydrogenBunkeringLogisticsProductivityMultiplier,
} from './port-liquid-hydrogen-bunkering-logistics-index.ts';"""
        ctext = ctext.replace(import_block, new_imports)

        compute_snippet = """  const bioLngBunkeringMult = portBioLngBunkeringLogisticsProductivityMultiplier(
    portBioLngBunkeringLogisticsShare,
    options?.portBioLngBunkeringLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {"""
        compute_add = """  const bioLngBunkeringMult = portBioLngBunkeringLogisticsProductivityMultiplier(
    portBioLngBunkeringLogisticsShare,
    options?.portBioLngBunkeringLogisticsPolicy ?? 'baseline',
  );
  const tokamakDeuteriumExportExportByRegion = computeTokamakDeuteriumExportExportByRegion(ops);
  const nationalTokamakDeuteriumExport = nationalTokamakDeuteriumExportExportIndex(tokamakDeuteriumExportExportByRegion);
  const tokamakDeuteriumExportMult = tokamakDeuteriumExportExportProductivityMultiplier(
    nationalTokamakDeuteriumExport,
    options?.tokamakDeuteriumExportExportPolicy ?? 'baseline',
  );
  const remoteTraumaSurgerySupplyStagingByRegion = computeRemoteTraumaSurgerySupplyStagingByRegion(
    ops,
    networkStress,
  );
  const nationalTraumaSurgery = nationalRemoteTraumaSurgerySupplyStagingIndex(
    remoteTraumaSurgerySupplyStagingByRegion,
  );
  const remoteTraumaSurgerySupplyStagingShare = computeRemoteTraumaSurgerySupplyStagingShare(
    ops,
    options?.remoteTraumaSurgerySupplyStagingPolicy ?? 'baseline',
  );
  const traumaSurgeryMult = remoteTraumaSurgerySupplyStagingProductivityMultiplier(
    remoteTraumaSurgerySupplyStagingShare,
    options?.remoteTraumaSurgerySupplyStagingPolicy ?? 'baseline',
  );
  const portLiquidHydrogenBunkeringLogisticsThroughputByRegion =
    computePortLiquidHydrogenBunkeringLogisticsThroughputByRegion(ops);
  const nationalGreenAmmoniaEfuelBunkering = nationalPortLiquidHydrogenBunkeringLogisticsThroughputIndex(
    portLiquidHydrogenBunkeringLogisticsThroughputByRegion,
  );
  const portLiquidHydrogenBunkeringLogisticsShare = computePortLiquidHydrogenBunkeringLogisticsShare(
    ops,
    options?.portLiquidHydrogenBunkeringLogisticsPolicy ?? 'baseline',
  );
  const liquidHydrogenBunkeringMult = portLiquidHydrogenBunkeringLogisticsProductivityMultiplier(
    portLiquidHydrogenBunkeringLogisticsShare,
    options?.portLiquidHydrogenBunkeringLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {"""
        ctext = ctext.replace(compute_snippet, compute_add)

        ctext = ctext.replace(
            "    const bioLngBunkeringBoost = (portBioLngBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;",
            "    const bioLngBunkeringBoost = (portBioLngBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;\n"
            "    const tokamakDeuteriumExportBoost = (tokamakDeuteriumExportExportByRegion[code] - 5) * 0.0017;\n"
            "    const traumaSurgeryBoost = (remoteTraumaSurgerySupplyStagingByRegion[code] - 6) * 0.0013;\n"
            "    const liquidHydrogenBunkeringBoost = (portLiquidHydrogenBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;",
        )
        ctext = ctext.replace(
            "        bioLngBunkeringBoost) *",
            "        bioLngBunkeringBoost +\n"
            "        tokamakDeuteriumExportBoost +\n"
            "        traumaSurgeryBoost +\n"
            "        liquidHydrogenBunkeringBoost) *",
        )
        ctext = ctext.replace(
            "      bioLngBunkeringMult;",
            "      bioLngBunkeringMult *\n"
            "      tokamakDeuteriumExportMult *\n"
            "      traumaSurgeryMult *\n"
            "      liquidHydrogenBunkeringMult;",
        )
        ctext = ctext.replace("    schemaVersion: 'agent12/53',", "    schemaVersion: 'agent12/56',")
        ctext = ctext.replace(
            "    portBioLngBunkeringLogisticsThroughputByRegion,\n    computeMs,",
            "    portMethanolDualFuelBunkeringLogisticsThroughputByRegion,\n"
            "    nationalTokamakDeuteriumExportExportIndex: nationalTokamakDeuteriumExport,\n"
            "    tokamakDeuteriumExportExportByRegion,\n"
            "    remoteTraumaSurgerySupplyStagingShare,\n"
            "    nationalRemoteTraumaSurgerySupplyStagingIndex: nationalTraumaSurgery,\n"
            "    remoteTraumaSurgerySupplyStagingByRegion,\n"
            "    portLiquidHydrogenBunkeringLogisticsShare,\n"
            "    nationalPortLiquidHydrogenBunkeringLogisticsThroughputIndex: nationalGreenAmmoniaEfuelBunkering,\n"
            "    portLiquidHydrogenBunkeringLogisticsThroughputByRegion,\n"
            "    computeMs,",
        )
        compute.write_text(ctext, encoding="utf-8")

    tests_dir = ROOT / "tests"
    for test_file in tests_dir.glob("*.ts"):
        text = test_file.read_text(encoding="utf-8")
        if "agent12/54" in text:
            test_file.write_text(text.replace("agent12/54", "agent12/56"), encoding="utf-8")

    round54_test_src = tests_dir / "transport-round53.test.ts"
    round54_test = tests_dir / "transport-round54.test.ts"
    if not round54_test.exists():
        write_from_template(round54_test_src, round54_test)

    self_checks = ROOT / "run-self-checks.ts"
    sc = self_checks.read_text(encoding="utf-8")
    sc = sc.replace("agent12/54", "agent12/56")
    if "nationalTokamakDeuteriumExportExportIndex" not in sc:
        sc = sc.replace(
            "      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2,",
            "      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2 &&\n"
            "      infra.nationalTokamakDeuteriumExportExportIndex >= 5 &&\n"
            "      infra.nationalRemoteTraumaSurgerySupplyStagingIndex >= 6 &&\n"
            "      infra.portLiquidHydrogenBunkeringLogisticsShare >= 0.03 &&\n"
            "      infra.nationalPortLiquidHydrogenBunkeringLogisticsThroughputIndex >= 2,",
        )
        sc = sc.replace(
            "hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)}`",
            "hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)} deuterium=${infra.nationalTokamakDeuteriumExportExportIndex.toFixed(1)}`",
        )
    self_checks.write_text(sc, encoding="utf-8")

    readme = ROOT / "README.md"
    rm = readme.read_text(encoding="utf-8")
    if "agent12/56" not in rm:
        rm = apply_replacements(rm)
        round54_section = """

## Wave 54 / round 54 (O10-237)

- Schema **`agent12/56`**: fusion tritium breeding export throughput, remote pediatric oncology supply staging readiness, port bio-LNG bunkering logistics share (`tokamakDeuteriumExportExportPolicy`, `remoteTraumaSurgerySupplyStagingPolicy`, `portLiquidHydrogenBunkeringLogisticsPolicy`)
- Catalog: **748** assets, **176** corridors, **288** scenarios
"""
        if "## Wave 54" not in rm:
            rm = rm.replace("## Wave 52", "## Wave 54 / round 54 (O10-237)\n\n- Schema **`agent12/56`**: fusion tritium breeding export, remote pediatric oncology supply staging, port bio-LNG bunkering logistics\n- Catalog: **748** assets, **176** corridors, **288** scenarios\n\n## Wave 52")
        readme.write_text(rm, encoding="utf-8")

    gate = ROOT / "scale-wave-round55-origin-gate-latch.ts"
    gate.write_text(
        """export const AGENT12_OP10M_WAVE55_GATE = {
  ticket: 'O10-247',
  wave: 55,
  round: 55,
  integrationBaseline: 'c4bbec67109a453217e2966bd0ab02bdbaf94787',
} as const;
""",
        encoding="utf-8",
    )

    print("wave55 round54 implementation files written")


if __name__ == "__main__":
    main()
