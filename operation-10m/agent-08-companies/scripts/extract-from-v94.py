#!/usr/bin/env python3
"""Re-extract V10.14 private sector (SECTION 20AI) from canonical V9.4 into module core."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parents[1]
V94 = WORKSPACE / "(V9.4) australia-game-with-ai.tsx"
OUT = ROOT / "v1014-private-sector-core.tsx"

PREAMBLE = """// ============================================================================
// Operation 10M — Agent 08: Companies / Industries / Production (V10.14 private sector)
// MERGE: Inline into `(V9.4) australia-game-with-ai.tsx` at anchor
// `// O6K_AGENT08_INTEGRATION_ANCHOR` per INTEGRATION.md
// Remove upstream-stubs imports when merged (canonical types exist in V9.4).
// ============================================================================

import { useState } from 'react';
import type {
  EconomicGeographyState,
  GameSettingsState,
  IndustriesSupplyChainsState,
  LivingRegionsState,
  LRMomentumBand,
  LRSector,
  LRObserverMap,
  NationalSystemsState,
  NationalWorkforceState,
  StrategicIndustryKind,
  StrategicSupplyKind,
  StrategicWorldEvent,
  V9SelfTestResult,
} from './upstream-stubs';
import {
  LR_MOM_RANK,
  REGIONS,
  SUPPLY_LABEL,
} from './upstream-stubs';

export const O6K_AGENT08_MODULE_VERSION = '1.0.0';
export const O6K_AGENT08_MODULE_ID = 'companies_industries_production';

"""


def main() -> None:
    lines = V94.read_text(encoding="utf-8").splitlines(keepends=True)
    start = next(i for i, l in enumerate(lines) if l.startswith("// SECTION 20AI:"))
    end = next(i for i, l in enumerate(lines) if l.startswith("// SECTION 20AH:"))
    block = "".join(lines[start:end])
    OUT.write_text(PREAMBLE + block, encoding="utf-8")
    print(f"wrote {OUT.relative_to(WORKSPACE)} ({end - start} lines)")


if __name__ == "__main__":
    main()
