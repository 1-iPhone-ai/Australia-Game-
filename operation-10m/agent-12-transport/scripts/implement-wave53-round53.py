#!/usr/bin/env python3
"""Generate Agent 12 wave 53 / round 53 from round 51 templates."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("scale-wave-round51-assets", "scale-wave-round52-assets"),
    ("corridors-round51", "corridors-round52"),
    ("scenarios-round51", "scenarios-round52"),
    ("TRANSPORT_CORRIDORS_ROUND51", "TRANSPORT_CORRIDORS_ROUND52"),
    ("TRANSPORT_SCENARIOS_ROUND51", "TRANSPORT_SCENARIOS_ROUND52"),
    ("SCALE_WAVE_ROUND51_ASSETS", "SCALE_WAVE_ROUND52_ASSETS"),
    ("ROUND51_", "ROUND52_"),
    ("round51", "round52"),
    ("Round51", "Round52"),
    ("Round 51", "Round 52"),
    ("superconducting-hvdc-export-index", "fusion-tritium-breeding-export-index"),
    ("remote-neonatal-icu-supply-staging-index", "remote-pediatric-oncology-supply-staging-index"),
    ("port-methanol-dual-fuel-bunkering-logistics-index", "port-bio-lng-bunkering-logistics-index"),
    ("superconducting_hvdc_export", "fusion_tritium_breeding_export"),
    ("hvdc_superconducting_logistics", "tritium_breeding_logistics"),
    ("superconducting_freight_corridor", "fusion_freight_corridor"),
    ("Superconducting HVDC", "Fusion Tritium Breeding"),
    ("superconducting HVDC", "fusion tritium breeding"),
    ("SuperconductingHvdc", "FusionTritiumBreeding"),
    ("superconductingHvdc", "fusionTritiumBreeding"),
    ("Superconducting Hvdc", "Fusion Tritium Breeding"),
    ("remote_neonatal_icu_supply", "remote_pediatric_oncology_supply"),
    ("nicu_care_staging", "pediatric_oncology_staging"),
    ("neonatal_critical_care_logistics", "oncology_critical_care_logistics"),
    ("RemoteNeonatalIcu", "RemotePediatricOncology"),
    ("remoteNeonatalIcu", "remotePediatricOncology"),
    ("NeonatalIcu", "PediatricOncology"),
    ("neonatalIcu", "pediatricOncology"),
    ("NICU", "Pediatric Oncology"),
    ("neonatal ICU", "pediatric oncology"),
    ("port_methanol_dual_fuel_bunkering", "port_bio_lng_bunkering"),
    ("green_methanol_mooring", "bio_lng_mooring"),
    ("dual_fuel_bunkering", "liquefied_biofuel_bunkering"),
    ("PortMethanolDualFuelBunkering", "PortBioLngBunkering"),
    ("portMethanolDualFuelBunkering", "portBioLngBunkering"),
    ("Methanol Dual-Fuel", "Bio-LNG"),
    ("Methanol Dual Fuel", "Bio LNG"),
    ("methanol dual-fuel", "bio-LNG"),
    ("Methanol Bunkering", "Bio-LNG Bunkering"),
    ("methanol bunkering", "bio-LNG bunkering"),
    ("green-methanol", "bio-LNG"),
    ("Chiplet Feed", "Tritium Feed"),
    ("hvdc berths", "tritium berths"),
    ("hvdc feed", "tritium feed"),
    ("703", "718"),
    ("167", "170"),
    ("273", "278"),
    ("agent12/53", "agent12/54"),
    ("O10-233", "O10-237"),
    ("wave 51", "wave 53"),
    ("round 51", "round 53"),
    ("WAVE51", "WAVE52"),
    ("wave51", "wave53"),
    ("Wave 51", "Wave 52"),
    ("a32b2b15bceddd35278fc8e96be25bf809099632", "ba97bdce8f79f6215f04bc1497c19c70cb06d8f7"),
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
    write_from_template(catalog / "scale-wave-round51-assets.ts", catalog / "scale-wave-round52-assets.ts")
    write_from_template(catalog / "corridors-round51.ts", catalog / "corridors-round52.ts")
    write_from_template(catalog / "scenarios-round51.ts", catalog / "scenarios-round52.ts")

    write_from_template(
        ROOT / "network/superconducting-hvdc-export-index.ts",
        ROOT / "network/fusion-tritium-breeding-export-index.ts",
    )
    write_from_template(
        ROOT / "operations/remote-neonatal-icu-supply-staging-index.ts",
        ROOT / "operations/remote-pediatric-oncology-supply-staging-index.ts",
    )
    write_from_template(
        ROOT / "productivity/port-methanol-dual-fuel-bunkering-logistics-index.ts",
        ROOT / "productivity/port-bio-lng-bunkering-logistics-index.ts",
    )

    for name in ("all-catalog.ts", "corridors-catalog.ts", "scenarios-catalog.ts"):
        path = catalog / name
        text = path.read_text(encoding="utf-8")
        if "round52" not in text:
            text = text.replace("round51-assets.ts", "round51-assets.ts")
            if "scale-wave-round51" in text:
                text = text.replace(
                    "from './scale-wave-round51-assets.ts';",
                    "from './scale-wave-round51-assets.ts';\nimport { SCALE_WAVE_ROUND52_ASSETS } from './scale-wave-round52-assets.ts';",
                )
                text = text.replace(
                    "...SCALE_WAVE_ROUND51_ASSETS,",
                    "...SCALE_WAVE_ROUND51_ASSETS,\n    ...SCALE_WAVE_ROUND52_ASSETS,",
                )
            if "corridors-round51" in text:
                text = text.replace(
                    "from './corridors-round51.ts';",
                    "from './corridors-round51.ts';\nimport { TRANSPORT_CORRIDORS_ROUND52 } from './corridors-round52.ts';",
                )
                text = text.replace(
                    "...TRANSPORT_CORRIDORS_ROUND51,",
                    "...TRANSPORT_CORRIDORS_ROUND51,\n  ...TRANSPORT_CORRIDORS_ROUND52,",
                )
            if "scenarios-round51" in text:
                text = text.replace(
                    "from './scenarios-round51.ts';",
                    "from './scenarios-round51.ts';\nimport { TRANSPORT_SCENARIOS_ROUND52 } from './scenarios-round52.ts';",
                )
                text = text.replace(
                    "...TRANSPORT_SCENARIOS_ROUND51,",
                    "...TRANSPORT_SCENARIOS_ROUND51,\n  ...TRANSPORT_SCENARIOS_ROUND52,",
                )
            path.write_text(text, encoding="utf-8")

    chunk = ROOT / "scripts/build-chunk.mjs"
    chunk_text = chunk.read_text(encoding="utf-8")
    inserts = [
        ("  'catalog/corridors-round51.ts',", "  'catalog/corridors-round51.ts',\n  'catalog/corridors-round52.ts',"),
        ("  'catalog/scenarios-round51.ts',", "  'catalog/scenarios-round51.ts',\n  'catalog/scenarios-round52.ts',"),
        (
            "  'catalog/scale-wave-round51-assets.ts',",
            "  'catalog/scale-wave-round51-assets.ts',\n  'catalog/scale-wave-round52-assets.ts',",
        ),
        (
            "  'network/superconducting-hvdc-export-index.ts',",
            "  'network/superconducting-hvdc-export-index.ts',\n  'network/fusion-tritium-breeding-export-index.ts',",
        ),
        (
            "  'operations/remote-neonatal-icu-supply-staging-index.ts',",
            "  'operations/remote-neonatal-icu-supply-staging-index.ts',\n  'operations/remote-pediatric-oncology-supply-staging-index.ts',",
        ),
        (
            "  'productivity/port-methanol-dual-fuel-bunkering-logistics-index.ts',",
            "  'productivity/port-methanol-dual-fuel-bunkering-logistics-index.ts',\n  'productivity/port-bio-lng-bunkering-logistics-index.ts',",
        ),
    ]
    for old, new in inserts:
        if "round52" not in chunk_text and old in chunk_text:
            chunk_text = chunk_text.replace(old, new, 1)
    chunk.write_text(chunk_text, encoding="utf-8")

    types_path = ROOT / "types.ts"
    types = types_path.read_text(encoding="utf-8")
    if "FusionTritiumBreedingExportPolicy" not in types:
        types = types.replace(
            "export type SuperconductingHvdcExportPolicy = 'baseline' | 'accelerate';",
            "export type SuperconductingHvdcExportPolicy = 'baseline' | 'accelerate';\n"
            "export type FusionTritiumBreedingExportPolicy = 'baseline' | 'accelerate';",
        )
        types = types.replace(
            "export type PortMethanolDualFuelBunkeringLogisticsPolicy = 'baseline' | 'expand';",
            "export type PortMethanolDualFuelBunkeringLogisticsPolicy = 'baseline' | 'expand';\n"
            "export type PortBioLngBunkeringLogisticsPolicy = 'baseline' | 'expand';",
        )
        types = types.replace(
            "export type RemoteNeonatalIcuSupplyStagingPolicy = 'baseline' | 'surge';",
            "export type RemoteNeonatalIcuSupplyStagingPolicy = 'baseline' | 'surge';\n"
            "export type RemotePediatricOncologySupplyStagingPolicy = 'baseline' | 'surge';",
        )
        types = types.replace(
            "  portMethanolDualFuelBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n  computeMs: number;",
            "  portMethanolDualFuelBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n"
            "  nationalFusionTritiumBreedingExportIndex: number;\n"
            "  fusionTritiumBreedingExportByRegion: Record<AuRegionCode, number>;\n"
            "  remotePediatricOncologySupplyStagingShare: number;\n"
            "  nationalRemotePediatricOncologySupplyStagingIndex: number;\n"
            "  remotePediatricOncologySupplyStagingByRegion: Record<AuRegionCode, number>;\n"
            "  portBioLngBunkeringLogisticsShare: number;\n"
            "  nationalPortBioLngBunkeringLogisticsThroughputIndex: number;\n"
            "  portBioLngBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n"
            "  computeMs: number;",
        )
        types = types.replace(
            "  portMethanolDualFuelBunkeringLogisticsPolicy?: PortMethanolDualFuelBunkeringLogisticsPolicy;\n}",
            "  portMethanolDualFuelBunkeringLogisticsPolicy?: PortMethanolDualFuelBunkeringLogisticsPolicy;\n"
            "  fusionTritiumBreedingExportPolicy?: FusionTritiumBreedingExportPolicy;\n"
            "  remotePediatricOncologySupplyStagingPolicy?: RemotePediatricOncologySupplyStagingPolicy;\n"
            "  portBioLngBunkeringLogisticsPolicy?: PortBioLngBunkeringLogisticsPolicy;\n}",
        )
        types_path.write_text(types, encoding="utf-8")

    compute = ROOT / "productivity/compute-infrastructure-state.ts"
    ctext = compute.read_text(encoding="utf-8")
    if "fusionTritiumBreedingExportByRegion" not in ctext:
        import_block = """import {
  computePortMethanolDualFuelBunkeringLogisticsShare,
  computePortMethanolDualFuelBunkeringLogisticsThroughputByRegion,
  nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex,
  portMethanolDualFuelBunkeringLogisticsProductivityMultiplier,
} from './port-methanol-dual-fuel-bunkering-logistics-index.ts';"""
        new_imports = import_block + """
import {
  computeFusionTritiumBreedingExportByRegion,
  nationalFusionTritiumBreedingExportIndex,
  fusionTritiumBreedingExportProductivityMultiplier,
} from '../network/fusion-tritium-breeding-export-index.ts';
import {
  computeRemotePediatricOncologySupplyStagingByRegion,
  computeRemotePediatricOncologySupplyStagingShare,
  nationalRemotePediatricOncologySupplyStagingIndex,
  remotePediatricOncologySupplyStagingProductivityMultiplier,
} from '../operations/remote-pediatric-oncology-supply-staging-index.ts';
import {
  computePortBioLngBunkeringLogisticsShare,
  computePortBioLngBunkeringLogisticsThroughputByRegion,
  nationalPortBioLngBunkeringLogisticsThroughputIndex,
  portBioLngBunkeringLogisticsProductivityMultiplier,
} from './port-bio-lng-bunkering-logistics-index.ts';"""
        ctext = ctext.replace(import_block, new_imports)

        compute_snippet = """  const methanolBunkeringMult = portMethanolDualFuelBunkeringLogisticsProductivityMultiplier(
    portMethanolDualFuelBunkeringLogisticsShare,
    options?.portMethanolDualFuelBunkeringLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {"""
        compute_add = """  const methanolBunkeringMult = portMethanolDualFuelBunkeringLogisticsProductivityMultiplier(
    portMethanolDualFuelBunkeringLogisticsShare,
    options?.portMethanolDualFuelBunkeringLogisticsPolicy ?? 'baseline',
  );
  const fusionTritiumBreedingExportByRegion = computeFusionTritiumBreedingExportByRegion(ops);
  const nationalFusionTritiumBreeding = nationalFusionTritiumBreedingExportIndex(fusionTritiumBreedingExportByRegion);
  const fusionTritiumBreedingMult = fusionTritiumBreedingExportProductivityMultiplier(
    nationalFusionTritiumBreeding,
    options?.fusionTritiumBreedingExportPolicy ?? 'baseline',
  );
  const remotePediatricOncologySupplyStagingByRegion = computeRemotePediatricOncologySupplyStagingByRegion(
    ops,
    networkStress,
  );
  const nationalPediatricOncology = nationalRemotePediatricOncologySupplyStagingIndex(
    remotePediatricOncologySupplyStagingByRegion,
  );
  const remotePediatricOncologySupplyStagingShare = computeRemotePediatricOncologySupplyStagingShare(
    ops,
    options?.remotePediatricOncologySupplyStagingPolicy ?? 'baseline',
  );
  const pediatricOncologyMult = remotePediatricOncologySupplyStagingProductivityMultiplier(
    remotePediatricOncologySupplyStagingShare,
    options?.remotePediatricOncologySupplyStagingPolicy ?? 'baseline',
  );
  const portBioLngBunkeringLogisticsThroughputByRegion =
    computePortBioLngBunkeringLogisticsThroughputByRegion(ops);
  const nationalBioLngBunkering = nationalPortBioLngBunkeringLogisticsThroughputIndex(
    portBioLngBunkeringLogisticsThroughputByRegion,
  );
  const portBioLngBunkeringLogisticsShare = computePortBioLngBunkeringLogisticsShare(
    ops,
    options?.portBioLngBunkeringLogisticsPolicy ?? 'baseline',
  );
  const bioLngBunkeringMult = portBioLngBunkeringLogisticsProductivityMultiplier(
    portBioLngBunkeringLogisticsShare,
    options?.portBioLngBunkeringLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {"""
        ctext = ctext.replace(compute_snippet, compute_add)

        ctext = ctext.replace(
            "    const methanolBunkeringBoost = (portMethanolDualFuelBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;",
            "    const methanolBunkeringBoost = (portMethanolDualFuelBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;\n"
            "    const fusionTritiumBreedingBoost = (fusionTritiumBreedingExportByRegion[code] - 5) * 0.0017;\n"
            "    const pediatricOncologyBoost = (remotePediatricOncologySupplyStagingByRegion[code] - 6) * 0.0013;\n"
            "    const bioLngBunkeringBoost = (portBioLngBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;",
        )
        ctext = ctext.replace(
            "        methanolBunkeringBoost) *",
            "        methanolBunkeringBoost +\n"
            "        fusionTritiumBreedingBoost +\n"
            "        pediatricOncologyBoost +\n"
            "        bioLngBunkeringBoost) *",
        )
        ctext = ctext.replace(
            "      methanolBunkeringMult;",
            "      methanolBunkeringMult *\n"
            "      fusionTritiumBreedingMult *\n"
            "      pediatricOncologyMult *\n"
            "      bioLngBunkeringMult;",
        )
        ctext = ctext.replace("    schemaVersion: 'agent12/53',", "    schemaVersion: 'agent12/54',")
        ctext = ctext.replace(
            "    portMethanolDualFuelBunkeringLogisticsThroughputByRegion,\n    computeMs,",
            "    portMethanolDualFuelBunkeringLogisticsThroughputByRegion,\n"
            "    nationalFusionTritiumBreedingExportIndex: nationalFusionTritiumBreeding,\n"
            "    fusionTritiumBreedingExportByRegion,\n"
            "    remotePediatricOncologySupplyStagingShare,\n"
            "    nationalRemotePediatricOncologySupplyStagingIndex: nationalPediatricOncology,\n"
            "    remotePediatricOncologySupplyStagingByRegion,\n"
            "    portBioLngBunkeringLogisticsShare,\n"
            "    nationalPortBioLngBunkeringLogisticsThroughputIndex: nationalBioLngBunkering,\n"
            "    portBioLngBunkeringLogisticsThroughputByRegion,\n"
            "    computeMs,",
        )
        compute.write_text(ctext, encoding="utf-8")

    tests_dir = ROOT / "tests"
    for test_file in tests_dir.glob("*.ts"):
        text = test_file.read_text(encoding="utf-8")
        if "agent12/53" in text:
            test_file.write_text(text.replace("agent12/53", "agent12/54"), encoding="utf-8")

    round52_test_src = tests_dir / "transport-round51.test.ts"
    round52_test = tests_dir / "transport-round52.test.ts"
    if not round52_test.exists():
        write_from_template(round52_test_src, round52_test)

    self_checks = ROOT / "run-self-checks.ts"
    sc = self_checks.read_text(encoding="utf-8")
    sc = sc.replace("agent12/53", "agent12/54")
    if "nationalFusionTritiumBreedingExportIndex" not in sc:
        sc = sc.replace(
            "      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2,",
            "      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2 &&\n"
            "      infra.nationalFusionTritiumBreedingExportIndex >= 5 &&\n"
            "      infra.nationalRemotePediatricOncologySupplyStagingIndex >= 6 &&\n"
            "      infra.portBioLngBunkeringLogisticsShare >= 0.03 &&\n"
            "      infra.nationalPortBioLngBunkeringLogisticsThroughputIndex >= 2,",
        )
        sc = sc.replace(
            "hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)}`",
            "hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)} fusion=${infra.nationalFusionTritiumBreedingExportIndex.toFixed(1)}`",
        )
    self_checks.write_text(sc, encoding="utf-8")

    readme = ROOT / "README.md"
    rm = readme.read_text(encoding="utf-8")
    if "agent12/54" not in rm:
        rm = apply_replacements(rm)
        round52_section = """

## Wave 52 / round 53 (O10-237)

- Schema **`agent12/54`**: fusion tritium breeding export throughput, remote pediatric oncology supply staging readiness, port bio-LNG bunkering logistics share (`fusionTritiumBreedingExportPolicy`, `remotePediatricOncologySupplyStagingPolicy`, `portBioLngBunkeringLogisticsPolicy`)
- Catalog: **718** assets, **170** corridors, **278** scenarios
"""
        if "## Wave 52" not in rm:
            rm = rm.replace("## Wave 51", "## Wave 52 / round 53 (O10-237)\n\n- Schema **`agent12/54`**: fusion tritium breeding export, remote pediatric oncology supply staging, port bio-LNG bunkering logistics\n- Catalog: **718** assets, **170** corridors, **278** scenarios\n\n## Wave 51")
        readme.write_text(rm, encoding="utf-8")

    gate = ROOT / "scale-wave-round52-origin-gate-latch.ts"
    gate.write_text(
        """export const AGENT12_OP10M_WAVE52_GATE = {
  ticket: 'O10-237',
  wave: 52,
  round: 52,
  integrationBaseline: 'ba97bdce8f79f6215f04bc1497c19c70cb06d8f7',
} as const;
""",
        encoding="utf-8",
    )

    print("wave53 round52 implementation files written")


if __name__ == "__main__":
    main()
