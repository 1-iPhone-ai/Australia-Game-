#!/usr/bin/env python3
"""Agent 05 O10-351 wave 75: tranche 76 (+220 → 22320 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE76_CHAINS = 220
TOTAL_CHAINS = 22320


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche75.py"
    dst = ROOT / "scripts/generate-catalog-tranche76.py"
    text = src.read_text()
    text = text.replace("Tranche 75", "Tranche 76")
    text = text.replace("tranche75", "tranche76")
    text = text.replace("TRANCHE75", "TRANCHE76")
    text = text.replace("op10m_t75_", "op10m_t76_")
    text = text.replace("generate-catalog-tranche76.py", "generate-catalog-tranche76.py")
    text = text.replace("75 + tier", "76 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE76" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75 } from '../generated/chain-catalog-tranche75.ts';"
    if "TRANCHE76 } from '../generated/chain-catalog-tranche76.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE76 } from '../generated/chain-catalog-tranche76.ts';",
        )
    text = text.replace(
        "  tranche75Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75.length,\n  totalChains:",
        "  tranche75Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75.length,\n"
        "  tranche76Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE76.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE76.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE75,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE76,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE75_STATS,\n} from '../generated/chain-catalog-tranche75.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE75_STATS,\n} from '../generated/chain-catalog-tranche75.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE76,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE76_STATS,\n} from '../generated/chain-catalog-tranche76.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("22100", str(TOTAL_CHAINS))
        new = new.replace("seventy tranches", "seventy-one tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("22100", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche76-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche76-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 75", "Tranche 76")
    text = text.replace("tranche75", "tranche76")
    text = text.replace("TRANCHE75", "TRANCHE76")
    text = text.replace("op10m_t75_", "op10m_t76_")
    text = text.replace("220", str(TRANSCHE76_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche76" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche75.ts',\n",
            "  'generated/chain-catalog-tranche75.ts',\n  'generated/chain-catalog-tranche76.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche76_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche76_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche76 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE76.length === {TRANSCHE76_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t76_')),`,\n"
            "  `  });`,\n"
        )
        if needle in text:
            text = text.replace(needle, insert + needle)
    text = re.sub(r"chainCount: \d+,", f"chainCount: {TOTAL_CHAINS},", text)
    text = re.sub(
        r"OP10M_AGENT05_CHAIN_CATALOG\.length === \d+",
        f"OP10M_AGENT05_CHAIN_CATALOG.length === {TOTAL_CHAINS}",
        text,
    )
    text = re.sub(
        r"name: '\d+ chain descriptors'",
        f"name: '{TOTAL_CHAINS} chain descriptors'",
        text,
    )
    path.write_text(text)


def main() -> None:
    copy_tranche_generator()
    patch_aggregate()
    bump_catalog_counts()
    copy_tranche_test()
    patch_bundle_script()
    print("tranche76 wave74 implementation ok")


if __name__ == "__main__":
    main()
