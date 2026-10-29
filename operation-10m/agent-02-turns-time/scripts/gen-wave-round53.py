#!/usr/bin/env python3
"""Copy agent-02 wave 51 integration files to wave 52 (O10-237 / 51039c5e)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
TESTS = ROOT / "tests"
BUNDLE = ROOT / "scripts" / "bundle-chunk-for-agent25.ts"
INDEX = SRC / "index.ts"

pairs = [
    ("wave51", "wave53"),
    ("Wave51", "Wave53"),
    ("WAVE51", "WAVE53"),
    ("O10-233", "O10-237"),
    ("a32b2b15", "51039c5e"),
    ("2_887_600", "2_979_928"),
    ("2887600", "2979928"),
    ("5.10.0", "5.13.0"),
    ("round 51", "round 53"),
    ("round51", "round53"),
]


def xform(text: str) -> str:
    for a, b in pairs:
        text = text.replace(a, b)
    return text


def main() -> None:
    for name in [
        "batch-national-tick-session-wave51-integration-seal.ts",
        "batch-national-tick-session-wave51-integration-export.ts",
        "batch-national-tick-session-wave51-integration-export-compare.ts",
        "batch-national-tick-session-wave51-integration-replay-parity.ts",
    ]:
        src = SRC / name
        dst_name = name.replace("wave51", "wave53")
        dst = SRC / dst_name
        dst.write_text(xform(src.read_text()))

    t51 = (TESTS / "scale-wave-round51.test.ts").read_text()
    (TESTS / "scale-wave-round53.test.ts").write_text(xform(t51))

    idx = INDEX.read_text()
    block = """
export * from './batch-national-tick-session-wave53-integration-seal.js';
export * from './batch-national-tick-session-wave53-integration-export.js';
export * from './batch-national-tick-session-wave53-integration-export-compare.js';
export * from './batch-national-tick-session-wave53-integration-replay-parity.js';
"""
    if "wave53-integration-seal" not in idx:
        needle = "export * from './batch-national-tick-session-wave51-integration-replay-parity.js';\n"
        idx = idx.replace(needle, needle + block)
        INDEX.write_text(idx)

    bt = BUNDLE.read_text()
    if "wave53-integration-seal" not in bt:
        bt = bt.replace(
            "  'src/batch-national-tick-session-wave51-integration-replay-parity.ts',\n",
            "  'src/batch-national-tick-session-wave51-integration-replay-parity.ts',\n"
            "  'src/batch-national-tick-session-wave53-integration-seal.ts',\n"
            "  'src/batch-national-tick-session-wave53-integration-export.ts',\n"
            "  'src/batch-national-tick-session-wave53-integration-export-compare.ts',\n"
            "  'src/batch-national-tick-session-wave53-integration-replay-parity.ts',\n",
        )
        bt = bt.replace("5.10.0", "5.13.0")
        bt = bt.replace("wave51", "wave53") if "agent02_national_tick_session_wave53" in bt else bt
        if "agent02_national_tick_session_wave51" in bt and "wave53" not in bt.split("agent02_national_tick_session_wave51")[1][:200]:
            bt = bt.replace(
                "agent02_national_tick_session_wave51_integration_seal",
                "agent02_national_tick_session_wave53_integration_seal",
            )
            bt = bt.replace(
                "national tick session wave 51 O10-233 integration seal a32b2b15",
                "national tick session wave 52 O10-237 integration seal 51039c5e",
            )
        BUNDLE.write_text(bt)

    print("agent-02 wave53 copy ok")


if __name__ == "__main__":
    main()
