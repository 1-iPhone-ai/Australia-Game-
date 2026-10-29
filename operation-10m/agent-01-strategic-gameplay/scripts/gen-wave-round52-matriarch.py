#!/usr/bin/env python3
"""Generate wave 52 matriarch apotheosis tier from wave 51 transcendence pattern."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
ENGINE = SRC / "engine"
TESTS = ROOT / "tests"

# wave 51 -> wave 52 tier naming
OLD = "Transcendence"
NEW = "Apotheosis"
old_snake = "transcendence"
new_snake = "apotheosis"
old_upper = "TRANSCENDENCE"
new_upper = "APOTHEOSIS"


def repl(text: str) -> str:
    text = text.replace(f"Matriarch{OLD}", f"Matriarch{NEW}")
    text = text.replace(f"matriarch_{old_snake}", f"matriarch_{new_snake}")
    text = text.replace(f"MATRIARCH_{old_upper}", f"MATRIARCH_{new_upper}")
    text = text.replace(f"coalitionMatriarch{OLD}", f"coalitionMatriarch{NEW}")
    text = text.replace(f"CoalitionMatriarch{OLD}", f"CoalitionMatriarch{NEW}")
    text = text.replace(f"min_coalition_matriarch_{old_snake}_streak", f"min_coalition_matriarch_{new_snake}_streak")
    text = text.replace(f"minCoalitionMatriarch{OLD}", f"minCoalitionMatriarch{NEW}")
    text = text.replace(f"isMatriarchCoalition{OLD}", f"isMatriarchCoalition{NEW}")
    text = text.replace(f"applyMatriarch{OLD}", f"applyMatriarch{NEW}")
    text = text.replace(f"advanceCoalitionMatriarch{OLD}", f"advanceCoalitionMatriarch{NEW}")
    text = text.replace(f"resetCoalitionMatriarch{OLD}", f"resetCoalitionMatriarch{NEW}")
    text = text.replace(f"coalitionMatriarch{OLD}StreakIssues", f"coalitionMatriarch{NEW}StreakIssues")
    text = text.replace(f"matriarch{OLD}Eligible", f"matriarch{NEW}Eligible")
    text = text.replace(f"matriarch{OLD}RankingBonus", f"matriarch{NEW}RankingBonus")
    text = text.replace(f"sga_coalition_matriarch_{old_snake}_", f"sga_coalition_matriarch_{new_snake}_")
    text = text.replace(f"COALITION_MATRIARCH_{old_upper}_STREAK", f"COALITION_MATRIARCH_{new_upper}_STREAK")
    return text


def copy_engine_pair() -> None:
    for suffix in ("", "-gates"):
        src_name = f"coalition-matriarch-{old_snake}{suffix}.ts"
        dst_name = f"coalition-matriarch-{new_snake}{suffix}.ts"
        text = (ENGINE / src_name).read_text()
        # Parent tier: transcendence was after infinity; apotheosis after transcendence
        text = text.replace(
            "./coalition-matriarch-infinity.ts",
            "./coalition-matriarch-transcendence.ts",
        )
        text = text.replace(
            "MATRIARCH_COALITION_INFINITY_THRESHOLD",
            "MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD",
        )
        text = text.replace(
            "isMatriarchCoalitionInfinity",
            "isMatriarchCoalitionTranscendence",
        )
        text = text.replace(
            "coalitionMatriarchInfinityStreakDays",
            "coalitionMatriarchTranscendenceStreakDays",
        )
        text = text.replace(
            "matriarchInfinityEligible",
            "matriarchTranscendenceEligible",
        )
        text = text.replace(
            "after matriarch infinity is sustained",
            "after matriarch transcendence is sustained",
        )
        text = text.replace(
            f"Matriarch infinity streak",
            f"Matriarch transcendence streak",
        )
        text = repl(text)
        (ENGINE / dst_name).write_text(text)


def patch_file(path: Path, transform) -> None:
    if not path.exists():
        return
    original = path.read_text()
    updated = transform(original)
    if updated != original:
        path.write_text(updated)


def insert_after(content: str, needle: str, block: str) -> str:
    if block.strip() in content:
        return content
    idx = content.find(needle)
    if idx == -1:
        raise RuntimeError(f"needle not found in {needle[:60]!r}")
    end = idx + len(needle)
    return content[:end] + block + content[end:]


def main() -> None:
    copy_engine_pair()

    # scale test from round 51
    t51 = (TESTS / "scale-wave-round51.test.ts").read_text()
    t52 = t51
    t52 = t52.replace("round 51", "round 52")
    t52 = t52.replace("round51", "round52")
    t52 = repl(t52)
    t52 = t52.replace("save v49", "save v50")
    t52 = t52.replace("StrategicGameplaySaveV49", "StrategicGameplaySaveV50")
    (TESTS / "scale-wave-round52.test.ts").write_text(t52)

    # catalog: duplicate transcendence charter/covenant block -> apotheosis
    catalog = ROOT / "src/catalog/strategic-action-catalog.ts"
    cat = catalog.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in cat:
        m = re.search(
            r"  'sga_coalition_matriarch_transcendence_charter': \{.*?\n  \},\n  'sga_coalition_matriarch_transcendence_covenant': \{.*?\n  \},",
            cat,
            re.S,
        )
        if not m:
            raise RuntimeError("catalog transcendence block not found")
        block = repl(m.group(0))
        block = block.replace("minCoalitionMatriarchInfinityStreakDays: 4", "minCoalitionMatriarchTranscendenceStreakDays: 4")
        block = block.replace("minCoalitionBalanceIndex: 116", "minCoalitionBalanceIndex: 118")
        block = block.replace("treasuryCost: 216_000", "treasuryCost: 218_000")
        block = block.replace("cashCost: 80_000", "cashCost: 82_000")
        block = block.replace("cashDelta: -80_000", "cashDelta: -82_000")
        block = block.replace("treasuryDelta: -216_000", "treasuryDelta: -218_000")
        block = block.replace("cashCost: 61_000", "cashCost: 63_000")
        block = block.replace("treasuryCost: 150_000", "treasuryCost: 152_000")
        block = block.replace("cashDelta: -61_000", "cashDelta: -63_000")
        block = block.replace("treasuryDelta: -150_000", "treasuryDelta: -152_000")
        cat = cat.replace(m.group(0), m.group(0) + "\n" + block)
        catalog.write_text(cat)

    # coalition balance ranking +45
    bal = ENGINE / "coalition-balance.ts"
    btext = bal.read_text()
    if f"matriarch{NEW}RankingBonus" not in btext:
        bonus = btext.split("export function matriarchTranscendenceRankingBonus")[1]
        bonus_block = "export function matriarchTranscendenceRankingBonus" + bonus.split("\n}\n")[0] + "\n}\n"
        new_bonus = repl(bonus_block).replace("return 44;", "return 45;")
        btext = btext.rstrip() + "\n\n\n" + new_bonus
        bal.write_text(btext)

    # strategic-calendar imports + advance lines
    cal = ENGINE / "strategic-calendar.ts"
    ctext = cal.read_text()
    imp = (
        "import {\n"
        "  advanceCoalitionMatriarchApotheosisStreak,\n"
        "  applyMatriarchApotheosisMandateBonus,\n"
        "} from './coalition-matriarch-apotheosis.ts';\n"
    )
    if "coalition-matriarch-apotheosis" not in ctext:
        ctext = insert_after(
            ctext,
            "} from './coalition-matriarch-transcendence.ts';\n",
            imp,
        )
        ctext = insert_after(
            ctext,
            "  next = applyMatriarchTranscendenceMandateBonus(next, daysAdvanced);\n",
            "  next = advanceCoalitionMatriarchApotheosisStreak(next, daysAdvanced);\n"
            "  next = applyMatriarchApotheosisMandateBonus(next, daysAdvanced);\n",
        )
        cal.write_text(ctext)

    # engine reset hooks
    eng = ENGINE / "strategic-gameplay-engine.ts"
    etext = eng.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in etext:
        etext = insert_after(
            etext,
            "  if (action.id === 'sga_coalition_matriarch_transcendence_covenant') {\n"
            "    nextState = resetCoalitionMatriarchTranscendenceStreak(nextState);\n"
            "  }\n",
            "  if (action.id === 'sga_coalition_matriarch_apotheosis_charter') {\n"
            "    nextState = resetCoalitionMatriarchApotheosisStreak(nextState);\n"
            "  }\n"
            "  if (action.id === 'sga_coalition_matriarch_apotheosis_covenant') {\n"
            "    nextState = resetCoalitionMatriarchApotheosisStreak(nextState);\n"
            "  }\n",
        )
        etext = insert_after(
            etext,
            "import { resetCoalitionMatriarchTranscendenceStreak } from './coalition-matriarch-transcendence.ts';\n",
            "import { resetCoalitionMatriarchApotheosisStreak } from './coalition-matriarch-apotheosis.ts';\n",
        )
        if "coalitionMatriarchApotheosisStreakDays: 0" not in etext:
            etext = etext.replace(
                "coalitionMatriarchTranscendenceStreakDays: 0,\n",
                "coalitionMatriarchTranscendenceStreakDays: 0,\n    coalitionMatriarchApotheosisStreakDays: 0,\n",
                1,
            )
        eng.write_text(etext)

    # validation
    val = ENGINE / "validation.ts"
    vtext = val.read_text()
    if "coalitionMatriarchApotheosisStreakIssues" not in vtext:
        vtext = insert_after(
            vtext,
            "import { coalitionMatriarchTranscendenceStreakIssues } from './coalition-matriarch-transcendence-gates.ts';\n",
            "import { coalitionMatriarchApotheosisStreakIssues } from './coalition-matriarch-apotheosis-gates.ts';\n",
        )
        vtext = insert_after(
            vtext,
            "    issues.push(...coalitionMatriarchTranscendenceStreakIssues(action, state));\n",
            "    issues.push(...coalitionMatriarchApotheosisStreakIssues(action, state));\n",
        )
        val.write_text(vtext)

    # turn briefing
    tb = ENGINE / "turn-briefing.ts"
    tbt = tb.read_text()
    if "isMatriarchCoalitionApotheosis" not in tbt:
        tbt = insert_after(
            tbt,
            "import { isMatriarchCoalitionTranscendence } from './coalition-matriarch-transcendence.ts';\n",
            "import { isMatriarchCoalitionApotheosis } from './coalition-matriarch-apotheosis.ts';\n",
        )
        tbt = insert_after(
            tbt,
            "    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,\n",
            "    matriarchApotheosisActive: isMatriarchCoalitionApotheosis(state),\n"
            "    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,\n",
        )
        tb.write_text(tbt)

    # external signals
    sig = SRC / "integrations/external-coalition-turn-signals.ts"
    st = sig.read_text()
    if "coalitionMatriarchApotheosisStreakDays" not in st:
        st = insert_after(
            st,
            "import { isMatriarchCoalitionTranscendence } from '../engine/coalition-matriarch-transcendence.ts';\n",
            "import { isMatriarchCoalitionApotheosis } from '../engine/coalition-matriarch-apotheosis.ts';\n",
        )
        st = repl(
            insert_after(
                st,
                "  coalitionMatriarchTranscendenceStreakDays: number;\n",
                "  matriarchApotheosisActive: boolean;\n  coalitionMatriarchApotheosisStreakDays: number;\n",
            )
        )
        st = insert_after(
            st,
            "    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,\n",
            "    matriarchApotheosisActive: isMatriarchCoalitionApotheosis(state),\n"
            "    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchTranscendenceStreakDays: raw?.coalitionMatriarchTranscendenceStreakDays ?? 0,\n",
            "    matriarchApotheosisActive: raw?.matriarchApotheosisActive ?? false,\n"
            "    coalitionMatriarchApotheosisStreakDays: raw?.coalitionMatriarchApotheosisStreakDays ?? 0,\n",
        )
        sig.write_text(st)

    # types
    sa = SRC / "types/strategic-action.ts"
    sat = sa.read_text()
    if "min_coalition_matriarch_apotheosis_streak" not in sat:
        sat = insert_after(
            sat,
            "  | { kind: 'min_coalition_matriarch_transcendence_streak'; minDays: number };",
            "\n  | { kind: 'min_coalition_matriarch_apotheosis_streak'; minDays: number };",
        )
        sat = insert_after(
            sat,
            "  /** Action requires matriarch transcendence streak after matriarch infinity. */\n  minCoalitionMatriarchTranscendenceStreakDays?: number;",
            "\n  /** Action requires matriarch apotheosis streak after matriarch transcendence. */\n  minCoalitionMatriarchApotheosisStreakDays?: number;",
        )
        sat = insert_after(
            sat,
            "  coalitionMatriarchTranscendenceStreakDays?: number;\n",
            "  coalitionMatriarchApotheosisStreakDays?: number;\n",
        )
        sa.write_text(sat)

    cm = SRC / "types/coalition-mandate.ts"
    cmt = cm.read_text()
    if "coalitionMatriarchApotheosisStreakDays" not in cmt:
        cmt = insert_after(
            cmt,
            "  coalitionMatriarchTranscendenceStreakDays: number;\n",
            "  matriarchApotheosisActive: boolean;\n  coalitionMatriarchApotheosisStreakDays: number;\n",
        )
        cm.write_text(cmt)

    # index exports
    idx = SRC / "index.ts"
    it = idx.read_text()
    if "coalition-matriarch-apotheosis.ts" not in it:
        block = """
export { coalitionMatriarchApotheosisStreakIssues } from './engine/coalition-matriarch-apotheosis-gates.ts';
export {
  MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD,
  advanceCoalitionMatriarchApotheosisStreak,
  applyMatriarchApotheosisMandateBonus,
  isMatriarchCoalitionApotheosis,
  resetCoalitionMatriarchApotheosisStreak,
} from './engine/coalition-matriarch-apotheosis.ts';
"""
        it = insert_after(
            it,
            "} from './engine/coalition-matriarch-transcendence.ts';\n",
            block,
        )
        it = it.replace("5.11.0", "5.12.0")
        it = insert_after(
            it,
            "  matriarchTranscendenceRankingBonus,\n",
            "  matriarchApotheosisRankingBonus,\n",
        )
        idx.write_text(it)

    rec = ENGINE / "strategic-recommendations.ts"
    rt = rec.read_text()
    if "matriarchApotheosisRankingBonus" not in rt:
        rt = insert_after(
            rt,
            "  matriarchTranscendenceRankingBonus,\n",
            "  matriarchApotheosisRankingBonus,\n",
        )
        rt = insert_after(
            rt,
            "        matriarchTranscendenceRankingBonus(state, action),\n",
            "        matriarchApotheosisRankingBonus(state, action),\n",
        )
        rec.write_text(rt)

    # save v50 — mirror v49 addition
    save = ENGINE / "strategic-save.ts"
    stext = save.read_text()
    if "StrategicGameplaySaveV50" not in stext:
        stext = insert_after(
            stext,
            "export interface StrategicGameplaySaveV49 extends Omit<StrategicGameplaySaveV48, 'version'> {\n"
            "  version: 49;\n"
            "  coalitionMatriarchTranscendenceStreakDays: number;\n"
            "}\n",
            "\nexport interface StrategicGameplaySaveV50 extends Omit<StrategicGameplaySaveV49, 'version'> {\n"
            "  version: 50;\n"
            "  coalitionMatriarchApotheosisStreakDays: number;\n"
            "}\n",
        )
        stext = stext.replace(
            "  | StrategicGameplaySaveV49;",
            "  | StrategicGameplaySaveV49\n  | StrategicGameplaySaveV50;",
        )
        stext = stext.replace("): StrategicGameplaySaveV49 {", "): StrategicGameplaySaveV50 {")
        stext = stext.replace("    version: 49,", "    version: 50,")
        stext = insert_after(
            stext,
            "    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,\n  };\n}",
            "    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,\n",
        )
        stext = stext.replace(
            "    coalitionMatriarchTranscendenceStreakDays: 0,\n    };",
            "    coalitionMatriarchTranscendenceStreakDays: 0,\n    coalitionMatriarchApotheosisStreakDays: 0,\n    };",
        )
        stext = insert_after(
            stext,
            "    coalitionMatriarchTranscendenceStreakDays: save.coalitionMatriarchTranscendenceStreakDays,\n",
            "    coalitionMatriarchApotheosisStreakDays: save.coalitionMatriarchApotheosisStreakDays,\n",
        )
        save.write_text(stext)

    bundle = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    bt = bundle.read_text()
    if "coalition-matriarch-apotheosis.ts" not in bt:
        bt = insert_after(
            bt,
            "  'src/engine/coalition-matriarch-transcendence-gates.ts',\n",
            "  'src/engine/coalition-matriarch-apotheosis.ts',\n"
            "  'src/engine/coalition-matriarch-apotheosis-gates.ts',\n",
        )
        bt = bt.replace("5.11.0", "5.12.0")
        bundle.write_text(bt)

    cj = TESTS / "commitment-journal.test.ts"
    cjt = cj.read_text().replace("104", "106")
    cj.write_text(cjt)

    print("gen-wave-round52-matriarch: ok")


if __name__ == "__main__":
    main()
