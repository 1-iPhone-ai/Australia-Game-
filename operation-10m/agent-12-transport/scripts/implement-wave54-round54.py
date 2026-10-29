#!/usr/bin/env python3
"""Generate Agent 12 wave 54 / round 54 from round 52 templates."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("scale-wave-round52-assets", "scale-wave-round53-assets"),
    ("corridors-round52", "corridors-round53"),
    ("scenarios-round52", "scenarios-round53"),
    ("TRANSPORT_CORRIDORS_ROUND52", "TRANSPORT_CORRIDORS_ROUND53"),
    ("TRANSPORT_SCENARIOS_ROUND52", "TRANSPORT_SCENARIOS_ROUND53"),
    ("SCALE_WAVE_ROUND52_ASSETS", "SCALE_WAVE_ROUND53_ASSETS"),
    ("ROUND52_", "ROUND53_"),
    ("round52", "round53"),
    ("Round52", "Round53"),
    ("Round 52", "Round 53"),
    ("fusion-tritium-breeding-export-index", "stellarator-helium3-export-index"),
    ("remote-pediatric-oncology-supply-staging-index", "remote-burn-center-supply-staging-index"),
    ("port-bio-lng-bunkering-logistics-index", "port-green-ammonia-efuel-bunkering-logistics-index"),
    ("fusion_tritium_breeding_export", "stellarator_helium3_export"),
    ("tritium_breeding_logistics", "helium3_export_logistics"),
    ("fusion_freight_corridor", "stellarator_freight_corridor"),
    ("Fusion Tritium Breeding", "Stellarator Helium-3"),
    ("fusion tritium breeding", "stellarator helium-3"),
    ("FusionTritiumBreeding", "StellaratorHelium3"),
    ("fusionTritiumBreeding", "stellaratorHelium3"),
    ("Fusion Tritium Breeding", "Stellarator Helium-3"),
    ("remote_pediatric_oncology_supply", "remote_burn_center_supply"),
    ("pediatric_oncology_staging", "burn_center_staging"),
    ("oncology_critical_care_logistics", "burn_center_critical_care_logistics"),
    ("RemotePediatricOncology", "RemoteBurnCenter"),
    ("remotePediatricOncology", "remoteBurnCenter"),
    ("PediatricOncology", "BurnCenter"),
    ("pediatricOncology", "burnCenter"),
    ("Pediatric Oncology", "Burn Center"),
    ("pediatric oncology", "burn center"),
    ("port_bio_lng_bunkering", "port_green_ammonia_efuel_bunkering"),
    ("bio_lng_mooring", "green_ammonia_efuel_mooring"),
    ("liquefied_biofuel_bunkering", "green_ammonia_efuel_bunkering"),
    ("PortBioLngBunkering", "PortGreenAmmoniaEfuelBunkering"),
    ("portBioLngBunkering", "portGreenAmmoniaEfuelBunkering"),
    ("Bio-LNG", "Green Ammonia E-Fuel"),
    ("Bio LNG", "Green Ammonia E Fuel"),
    ("bio-LNG", "green ammonia e-fuel"),
    ("Bio-LNG Bunkering", "Green Ammonia E-Fuel Bunkering"),
    ("bio-LNG bunkering", "green ammonia e-fuel bunkering"),
    ("bio-LNG", "green-ammonia-efuel"),
    ("Tritium Feed", "Helium-3 Feed"),
    ("tritium berths", "helium3 berths"),
    ("tritium feed", "helium3 feed"),
    ("superconducting_hvdc", "stellarator_helium3"),
    ("fusion_tritium_breeding", "stellarator_helium3"),
    ("pediatricOncology", "burn_center"),
    ("methanol_liquefied_biofuel_bunkering", "green_ammonia_efuel_bunkering"),
    ("718", "733"),
    ("170", "173"),
    ("278", "283"),
    ("agent12/54", "agent12/55"),
    ("O10-237", "O10-240"),
    ("wave 53", "wave 54"),
    ("round 53", "round 54"),
    ("WAVE52", "WAVE53"),
    ("wave53", "wave54"),
    ("Wave 52", "Wave 53"),
    ("51039c5eeda7383be02de7a9dc7b233186cbccbb", "5bd043ada9953c5df4f7577e5b4de911c8f5b972"),
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
    write_from_template(catalog / "scale-wave-round52-assets.ts", catalog / "scale-wave-round53-assets.ts")
    write_from_template(catalog / "corridors-round52.ts", catalog / "corridors-round53.ts")
    write_from_template(catalog / "scenarios-round52.ts", catalog / "scenarios-round53.ts")

    write_from_template(
        ROOT / "network/fusion-tritium-breeding-export-index.ts",
        ROOT / "network/stellarator-helium3-export-index.ts",
    )
    write_from_template(
        ROOT / "operations/remote-pediatric-oncology-supply-staging-index.ts",
        ROOT / "operations/remote-burn-center-supply-staging-index.ts",
    )
    write_from_template(
        ROOT / "productivity/port-bio-lng-bunkering-logistics-index.ts",
        ROOT / "productivity/port-green-ammonia-efuel-bunkering-logistics-index.ts",
    )

    for name in ("all-catalog.ts", "corridors-catalog.ts", "scenarios-catalog.ts"):
        path = catalog / name
        text = path.read_text(encoding="utf-8")
        if "round53" not in text:
            text = text.replace("round52-assets.ts", "round52-assets.ts")
            if "scale-wave-round52" in text:
                text = text.replace(
                    "from './scale-wave-round52-assets.ts';",
                    "from './scale-wave-round52-assets.ts';\nimport { SCALE_WAVE_ROUND53_ASSETS } from './scale-wave-round53-assets.ts';",
                )
                text = text.replace(
                    "...SCALE_WAVE_ROUND52_ASSETS,",
                    "...SCALE_WAVE_ROUND52_ASSETS,\n    ...SCALE_WAVE_ROUND53_ASSETS,",
                )
            if "corridors-round52" in text:
                text = text.replace(
                    "from './corridors-round52.ts';",
                    "from './corridors-round52.ts';\nimport { TRANSPORT_CORRIDORS_ROUND53 } from './corridors-round53.ts';",
                )
                text = text.replace(
                    "...TRANSPORT_CORRIDORS_ROUND52,",
                    "...TRANSPORT_CORRIDORS_ROUND52,\n  ...TRANSPORT_CORRIDORS_ROUND53,",
                )
            if "scenarios-round52" in text:
                text = text.replace(
                    "from './scenarios-round52.ts';",
                    "from './scenarios-round52.ts';\nimport { TRANSPORT_SCENARIOS_ROUND53 } from './scenarios-round53.ts';",
                )
                text = text.replace(
                    "...TRANSPORT_SCENARIOS_ROUND52,",
                    "...TRANSPORT_SCENARIOS_ROUND52,\n  ...TRANSPORT_SCENARIOS_ROUND53,",
                )
            path.write_text(text, encoding="utf-8")

    chunk = ROOT / "scripts/build-chunk.mjs"
    chunk_text = chunk.read_text(encoding="utf-8")
    inserts = [
        ("  'catalog/corridors-round52.ts',", "  'catalog/corridors-round52.ts',\n  'catalog/corridors-round53.ts',"),
        ("  'catalog/scenarios-round52.ts',", "  'catalog/scenarios-round52.ts',\n  'catalog/scenarios-round53.ts',"),
        (
            "  'catalog/scale-wave-round52-assets.ts',",
            "  'catalog/scale-wave-round52-assets.ts',\n  'catalog/scale-wave-round53-assets.ts',",
        ),
        (
            "  'network/fusion-tritium-breeding-export-index.ts',",
            "  'network/fusion-tritium-breeding-export-index.ts',\n  'network/stellarator-helium3-export-index.ts',",
        ),
        (
            "  'operations/remote-pediatric-oncology-supply-staging-index.ts',",
            "  'operations/remote-pediatric-oncology-supply-staging-index.ts',\n  'operations/remote-burn-center-supply-staging-index.ts',",
        ),
        (
            "  'productivity/port-bio-lng-bunkering-logistics-index.ts',",
            "  'productivity/port-bio-lng-bunkering-logistics-index.ts',\n  'productivity/port-green-ammonia-efuel-bunkering-logistics-index.ts',",
        ),
    ]
    for old, new in inserts:
        if "round53" not in chunk_text and old in chunk_text:
            chunk_text = chunk_text.replace(old, new, 1)
    chunk.write_text(chunk_text, encoding="utf-8")

    types_path = ROOT / "types.ts"
    types = types_path.read_text(encoding="utf-8")
    if "StellaratorHelium3ExportPolicy" not in types:
        types = types.replace(
            "export type FusionTritiumBreedingExportPolicy = 'baseline' | 'accelerate';",
            "export type FusionTritiumBreedingExportPolicy = 'baseline' | 'accelerate';\n"
            "export type StellaratorHelium3ExportPolicy = 'baseline' | 'accelerate';",
        )
        types = types.replace(
            "export type PortBioLngBunkeringLogisticsPolicy = 'baseline' | 'expand';",
            "export type PortBioLngBunkeringLogisticsPolicy = 'baseline' | 'expand';\n"
            "export type PortGreenAmmoniaEfuelBunkeringLogisticsPolicy = 'baseline' | 'expand';",
        )
        types = types.replace(
            "export type RemotePediatricOncologySupplyStagingPolicy = 'baseline' | 'surge';",
            "export type RemotePediatricOncologySupplyStagingPolicy = 'baseline' | 'surge';\n"
            "export type RemoteBurnCenterSupplyStagingPolicy = 'baseline' | 'surge';",
        )
        types = types.replace(
            "  portBioLngBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n  computeMs: number;",
            "  portMethanolDualFuelBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n"
            "  nationalStellaratorHelium3ExportIndex: number;\n"
            "  stellaratorHelium3ExportByRegion: Record<AuRegionCode, number>;\n"
            "  remoteBurnCenterSupplyStagingShare: number;\n"
            "  nationalRemoteBurnCenterSupplyStagingIndex: number;\n"
            "  remoteBurnCenterSupplyStagingByRegion: Record<AuRegionCode, number>;\n"
            "  portGreenAmmoniaEfuelBunkeringLogisticsShare: number;\n"
            "  nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex: number;\n"
            "  portGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion: Record<AuRegionCode, number>;\n"
            "  computeMs: number;",
        )
        types = types.replace(
            "  portBioLngBunkeringLogisticsPolicy?: PortBioLngBunkeringLogisticsPolicy;\n}",
            "  portBioLngBunkeringLogisticsPolicy?: PortBioLngBunkeringLogisticsPolicy;\n"
            "  stellaratorHelium3ExportPolicy?: StellaratorHelium3ExportPolicy;\n"
            "  remoteBurnCenterSupplyStagingPolicy?: RemoteBurnCenterSupplyStagingPolicy;\n"
            "  portGreenAmmoniaEfuelBunkeringLogisticsPolicy?: PortGreenAmmoniaEfuelBunkeringLogisticsPolicy;\n}",
        )
        types_path.write_text(types, encoding="utf-8")

    compute = ROOT / "productivity/compute-infrastructure-state.ts"
    ctext = compute.read_text(encoding="utf-8")
    if "stellaratorHelium3ExportByRegion" not in ctext:
        import_block = """import {
  computePortBioLngBunkeringLogisticsShare,
  computePortBioLngBunkeringLogisticsThroughputByRegion,
  nationalPortBioLngBunkeringLogisticsThroughputIndex,
  portBioLngBunkeringLogisticsProductivityMultiplier,
} from './port-bio-lng-bunkering-logistics-index.ts';"""
        new_imports = import_block + """
import {
  computeStellaratorHelium3ExportByRegion,
  nationalStellaratorHelium3ExportIndex,
  stellaratorHelium3ExportProductivityMultiplier,
} from '../network/stellarator-helium3-export-index.ts';
import {
  computeRemoteBurnCenterSupplyStagingByRegion,
  computeRemoteBurnCenterSupplyStagingShare,
  nationalRemoteBurnCenterSupplyStagingIndex,
  remoteBurnCenterSupplyStagingProductivityMultiplier,
} from '../operations/remote-burn-center-supply-staging-index.ts';
import {
  computePortGreenAmmoniaEfuelBunkeringLogisticsShare,
  computePortGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion,
  nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex,
  portGreenAmmoniaEfuelBunkeringLogisticsProductivityMultiplier,
} from './port-green-ammonia-efuel-bunkering-logistics-index.ts';"""
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
  const stellaratorHelium3ExportByRegion = computeStellaratorHelium3ExportByRegion(ops);
  const nationalStellaratorHelium3 = nationalStellaratorHelium3ExportIndex(stellaratorHelium3ExportByRegion);
  const stellaratorHelium3Mult = stellaratorHelium3ExportProductivityMultiplier(
    nationalStellaratorHelium3,
    options?.stellaratorHelium3ExportPolicy ?? 'baseline',
  );
  const remoteBurnCenterSupplyStagingByRegion = computeRemoteBurnCenterSupplyStagingByRegion(
    ops,
    networkStress,
  );
  const nationalBurnCenter = nationalRemoteBurnCenterSupplyStagingIndex(
    remoteBurnCenterSupplyStagingByRegion,
  );
  const remoteBurnCenterSupplyStagingShare = computeRemoteBurnCenterSupplyStagingShare(
    ops,
    options?.remoteBurnCenterSupplyStagingPolicy ?? 'baseline',
  );
  const burnCenterMult = remoteBurnCenterSupplyStagingProductivityMultiplier(
    remoteBurnCenterSupplyStagingShare,
    options?.remoteBurnCenterSupplyStagingPolicy ?? 'baseline',
  );
  const portGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion =
    computePortGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion(ops);
  const nationalGreenAmmoniaEfuelBunkering = nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex(
    portGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion,
  );
  const portGreenAmmoniaEfuelBunkeringLogisticsShare = computePortGreenAmmoniaEfuelBunkeringLogisticsShare(
    ops,
    options?.portGreenAmmoniaEfuelBunkeringLogisticsPolicy ?? 'baseline',
  );
  const greenAmmoniaEfuelBunkeringMult = portGreenAmmoniaEfuelBunkeringLogisticsProductivityMultiplier(
    portGreenAmmoniaEfuelBunkeringLogisticsShare,
    options?.portGreenAmmoniaEfuelBunkeringLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {"""
        ctext = ctext.replace(compute_snippet, compute_add)

        ctext = ctext.replace(
            "    const bioLngBunkeringBoost = (portBioLngBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;",
            "    const bioLngBunkeringBoost = (portBioLngBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;\n"
            "    const stellaratorHelium3Boost = (stellaratorHelium3ExportByRegion[code] - 5) * 0.0017;\n"
            "    const burnCenterBoost = (remoteBurnCenterSupplyStagingByRegion[code] - 6) * 0.0013;\n"
            "    const greenAmmoniaEfuelBunkeringBoost = (portGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion[code] - 2) * 0.0009;",
        )
        ctext = ctext.replace(
            "        bioLngBunkeringBoost) *",
            "        bioLngBunkeringBoost +\n"
            "        stellaratorHelium3Boost +\n"
            "        burnCenterBoost +\n"
            "        greenAmmoniaEfuelBunkeringBoost) *",
        )
        ctext = ctext.replace(
            "      bioLngBunkeringMult;",
            "      bioLngBunkeringMult *\n"
            "      stellaratorHelium3Mult *\n"
            "      burnCenterMult *\n"
            "      greenAmmoniaEfuelBunkeringMult;",
        )
        ctext = ctext.replace("    schemaVersion: 'agent12/53',", "    schemaVersion: 'agent12/55',")
        ctext = ctext.replace(
            "    portBioLngBunkeringLogisticsThroughputByRegion,\n    computeMs,",
            "    portMethanolDualFuelBunkeringLogisticsThroughputByRegion,\n"
            "    nationalStellaratorHelium3ExportIndex: nationalStellaratorHelium3,\n"
            "    stellaratorHelium3ExportByRegion,\n"
            "    remoteBurnCenterSupplyStagingShare,\n"
            "    nationalRemoteBurnCenterSupplyStagingIndex: nationalBurnCenter,\n"
            "    remoteBurnCenterSupplyStagingByRegion,\n"
            "    portGreenAmmoniaEfuelBunkeringLogisticsShare,\n"
            "    nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex: nationalGreenAmmoniaEfuelBunkering,\n"
            "    portGreenAmmoniaEfuelBunkeringLogisticsThroughputByRegion,\n"
            "    computeMs,",
        )
        compute.write_text(ctext, encoding="utf-8")

    tests_dir = ROOT / "tests"
    for test_file in tests_dir.glob("*.ts"):
        text = test_file.read_text(encoding="utf-8")
        if "agent12/54" in text:
            test_file.write_text(text.replace("agent12/54", "agent12/55"), encoding="utf-8")

    round53_test_src = tests_dir / "transport-round52.test.ts"
    round53_test = tests_dir / "transport-round53.test.ts"
    if not round53_test.exists():
        write_from_template(round53_test_src, round53_test)

    self_checks = ROOT / "run-self-checks.ts"
    sc = self_checks.read_text(encoding="utf-8")
    sc = sc.replace("agent12/54", "agent12/55")
    if "nationalStellaratorHelium3ExportIndex" not in sc:
        sc = sc.replace(
            "      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2,",
            "      infra.nationalPortMethanolDualFuelBunkeringLogisticsThroughputIndex >= 2 &&\n"
            "      infra.nationalStellaratorHelium3ExportIndex >= 5 &&\n"
            "      infra.nationalRemoteBurnCenterSupplyStagingIndex >= 6 &&\n"
            "      infra.portGreenAmmoniaEfuelBunkeringLogisticsShare >= 0.03 &&\n"
            "      infra.nationalPortGreenAmmoniaEfuelBunkeringLogisticsThroughputIndex >= 2,",
        )
        sc = sc.replace(
            "hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)}`",
            "hvdc=${infra.nationalSuperconductingHvdcExportIndex.toFixed(1)} helium3=${infra.nationalStellaratorHelium3ExportIndex.toFixed(1)}`",
        )
    self_checks.write_text(sc, encoding="utf-8")

    readme = ROOT / "README.md"
    rm = readme.read_text(encoding="utf-8")
    if "agent12/55" not in rm:
        rm = apply_replacements(rm)
        round53_section = """

## Wave 53 / round 53 (O10-237)

- Schema **`agent12/55`**: fusion tritium breeding export throughput, remote pediatric oncology supply staging readiness, port bio-LNG bunkering logistics share (`stellaratorHelium3ExportPolicy`, `remoteBurnCenterSupplyStagingPolicy`, `portGreenAmmoniaEfuelBunkeringLogisticsPolicy`)
- Catalog: **733** assets, **173** corridors, **283** scenarios
"""
        if "## Wave 53" not in rm:
            rm = rm.replace("## Wave 52", "## Wave 53 / round 53 (O10-237)\n\n- Schema **`agent12/55`**: fusion tritium breeding export, remote pediatric oncology supply staging, port bio-LNG bunkering logistics\n- Catalog: **733** assets, **173** corridors, **283** scenarios\n\n## Wave 52")
        readme.write_text(rm, encoding="utf-8")

    gate = ROOT / "scale-wave-round54-origin-gate-latch.ts"
    gate.write_text(
        """export const AGENT12_OP10M_WAVE54_GATE = {
  ticket: 'O10-240',
  wave: 54,
  round: 54,
  integrationBaseline: '5bd043ada9953c5df4f7577e5b4de911c8f5b972',
} as const;
""",
        encoding="utf-8",
    )

    print("wave54 round53 implementation files written")


if __name__ == "__main__":
    main()
