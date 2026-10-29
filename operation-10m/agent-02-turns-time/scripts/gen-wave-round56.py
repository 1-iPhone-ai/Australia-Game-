#!/usr/bin/env python3
"""Copy agent-02 wave 55 integration files to wave 56 (O10-254 / 8e2366bb)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
TESTS = ROOT / "tests"
BUNDLE = ROOT / "scripts" / "bundle-chunk-for-agent25.ts"
INDEX = SRC / "index.ts"

pairs = [
    ("wave55", "wave56"),
    ("Wave55", "Wave56"),
    ("WAVE55", "WAVE56"),
    ("O10-247", "O10-254"),
    ("c4bbec67", "8e2366bb"),
    ("3_054_213", "3_084_921"),
    ("3054213", "3084921"),
    ("5.16.0", "5.18.0"),
    ("round 55", "round 56"),
    ("round55", "round56"),
]


def xform(text: str) -> str:
    for a, b in pairs:
        text = text.replace(a, b)
    return text


def main() -> None:
    for name in [
        "batch-national-tick-session-wave55-integration-seal.ts",
        "batch-national-tick-session-wave55-integration-export.ts",
        "batch-national-tick-session-wave55-integration-export-compare.ts",
        "batch-national-tick-session-wave55-integration-replay-parity.ts",
    ]:
        src = SRC / name
        dst_name = name.replace("wave55", "wave56")
        dst = SRC / dst_name
        dst.write_text(xform(src.read_text()))

    t55 = (TESTS / "scale-wave-round55.test.ts").read_text()
    (TESTS / "scale-wave-round56.test.ts").write_text(xform(t55))

    idx = INDEX.read_text()
    block = """
export * from './batch-national-tick-session-wave56-integration-seal.js';
export * from './batch-national-tick-session-wave56-integration-export.js';
export * from './batch-national-tick-session-wave56-integration-export-compare.js';
export * from './batch-national-tick-session-wave56-integration-replay-parity.js';
"""
    if "wave56-integration-seal" not in idx:
        needle = "export * from './batch-national-tick-session-wave55-integration-replay-parity.js';\n"
        idx = idx.replace(needle, needle + block)
        INDEX.write_text(idx)

    bt = BUNDLE.read_text()
    if "wave56-integration-seal" not in bt:
        bt = bt.replace(
            "  'src/batch-national-tick-session-wave55-integration-replay-parity.ts',\n",
            "  'src/batch-national-tick-session-wave55-integration-replay-parity.ts',\n"
            "  'src/batch-national-tick-session-wave56-integration-seal.ts',\n"
            "  'src/batch-national-tick-session-wave56-integration-export.ts',\n"
            "  'src/batch-national-tick-session-wave56-integration-export-compare.ts',\n"
            "  'src/batch-national-tick-session-wave56-integration-replay-parity.ts',\n",
        )
        bt = bt.replace("5.16.0", "5.18.0")
        if "agent02_national_tick_session_wave55" in bt and "wave56" not in bt.split(
            "agent02_national_tick_session_wave55"
        )[1][:200]:
            bt = bt.replace(
                "agent02_national_tick_session_wave55_integration_seal",
                "agent02_national_tick_session_wave56_integration_seal",
            )
            bt = bt.replace(
                "national tick session wave 54 O10-247 integration seal c4bbec67",
                "national tick session wave 55 O10-254 integration seal 8e2366bb",
            )
        BUNDLE.write_text(bt)

    latch = ROOT / "scale-wave-round56-origin-gate-latch.ts"
    latch.write_text(
        """export const AGENT02_OP10M_WAVE56_GATE = {
  ticket: 'O10-254',
  wave: 56,
  round: 56,
  integrationBaseline: '8e2366bb438a75b184f0fe47cc2b0247a32059cb',
} as const;
"""
    )

    print("agent-02 wave56 copy ok")


if __name__ == "__main__":
    main()
