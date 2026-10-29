#!/usr/bin/env python3
"""Generate wave 54 matriarch omnipotence tier from wave 53 deification pattern."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
ENGINE = SRC / "engine"
TESTS = ROOT / "tests"

OLD = "Deification"
NEW = "Omnipotence"
old_snake = "deification"
new_snake = "omnipotence"
old_upper = "DEIFICATION"
new_upper = "OMNIPOTENCE"


def repl(text: str) -> str:
    text = text.replace(f"Matriarch{OLD}", f"Matriarch{NEW}")
    text = text.replace(f"matriarch_{old_snake}", f"matriarch_{new_snake}")
    text = text.replace(f"MATRIARCH_{old_upper}", f"MATRIARCH_{new_upper}")
    text = text.replace(f"coalitionMatriarch{OLD}", f"coalitionMatriarch{NEW}")
    text = text.replace(f"CoalitionMatriarch{OLD}", f"CoalitionMatriarch{NEW}")
    text = text.replace(
        f"min_coalition_matriarch_{old_snake}_streak",
        f"min_coalition_matriarch_{new_snake}_streak",
    )
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


def insert_after(content: str, needle: str, block: str) -> str:
    if block.strip() in content:
        return content
    idx = content.find(needle)
    if idx == -1:
        raise RuntimeError(f"needle not found: {needle[:80]!r}")
    end = idx + len(needle)
    return content[:end] + block + content[end:]


def copy_engine_pair() -> None:
    for suffix in ("", "-gates"):
        src_name = f"coalition-matriarch-{old_snake}{suffix}.ts"
        dst_name = f"coalition-matriarch-{new_snake}{suffix}.ts"
        text = (ENGINE / src_name).read_text()
        text = text.replace(
            "./coalition-matriarch-apotheosis.ts",
            "./coalition-matriarch-deification.ts",
        )
        text = text.replace(
            "MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD",
            "MATRIARCH_COALITION_DEIFICATION_THRESHOLD",
        )
        text = text.replace(
            "isMatriarchCoalitionApotheosis",
            "isMatriarchCoalitionDeification",
        )
        text = text.replace(
            "coalitionMatriarchApotheosisStreakDays",
            "coalitionMatriarchDeificationStreakDays",
        )
        text = text.replace(
            "matriarchApotheosisEligible",
            "matriarchDeificationEligible",
        )
        text = text.replace(
            "after matriarch apotheosis is sustained",
            "after matriarch deification is sustained",
        )
        text = text.replace(
            "Matriarch apotheosis streak",
            "Matriarch deification streak",
        )
        text = repl(text)
        (ENGINE / dst_name).write_text(text)


def main() -> None:
    copy_engine_pair()

    t53 = (TESTS / "scale-wave-round53.test.ts").read_text()
    t54 = t53
    t54 = t54.replace("round 53", "round 54")
    t54 = t54.replace("round53", "round54")
    t54 = repl(t54)
    t54 = t54.replace("save v51", "save v52")
    t54 = t54.replace("StrategicGameplaySaveV51", "StrategicGameplaySaveV52")
    t54 = t54.replace("O10-237", "O10-240")
    t54 = t54.replace(
        "matriarch coalition apotheosis",
        "matriarch coalition omnipotence",
    )
    t54 = t54.replace("matriarch apotheosis", "matriarch omnipotence")
    t54 = t54.replace(
        "isMatriarchCoalitionDeification",
        "isMatriarchCoalitionOmnipotence",
    )
    t54 = t54.replace(
        "MATRIARCH_COALITION_DEIFICATION_THRESHOLD",
        "MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD",
    )
    (TESTS / "scale-wave-round54.test.ts").write_text(t54)

    catalog = ROOT / "src/catalog/strategic-action-catalog.ts"
    cat = catalog.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in cat:
        m = re.search(
            r"  'sga_coalition_matriarch_deification_charter': \{.*?\n  \},\n  'sga_coalition_matriarch_deification_covenant': \{.*?\n  \},",
            cat,
            re.S,
        )
        if not m:
            raise RuntimeError("catalog deification block not found")
        block = repl(m.group(0))
        block = block.replace("minCoalitionMatriarchApotheosisStreakDays: 4", "minCoalitionMatriarchDeificationStreakDays: 4")
        block = block.replace("minCoalitionBalanceIndex: 118", "minCoalitionBalanceIndex: 120")
        block = block.replace("treasuryCost: 218_000", "treasuryCost: 220_000")
        block = block.replace("cashCost: 82_000", "cashCost: 84_000")
        block = block.replace("cashDelta: -82_000", "cashDelta: -84_000")
        block = block.replace("treasuryDelta: -218_000", "treasuryDelta: -220_000")
        block = block.replace("cashCost: 63_000", "cashCost: 65_000")
        block = block.replace("treasuryCost: 152_000", "treasuryCost: 154_000")
        block = block.replace("cashDelta: -63_000", "cashDelta: -65_000")
        block = block.replace("treasuryDelta: -152_000", "treasuryDelta: -154_000")
        cat = cat.replace(m.group(0), m.group(0) + "\n" + block)
        catalog.write_text(cat)

    bal = ENGINE / "coalition-balance.ts"
    btext = bal.read_text()
    if f"matriarch{NEW}RankingBonus" not in btext:
        bonus = btext.split("export function matriarchDeificationRankingBonus")[1]
        bonus_block = "export function matriarchOmnipotenceRankingBonus" + bonus.split("\n}\n")[0] + "\n}\n"
        new_bonus = repl(bonus_block).replace("return 46;", "return 47;")
        btext = btext.rstrip() + "\n\n\n" + new_bonus
        bal.write_text(btext)

    cal = ENGINE / "strategic-calendar.ts"
    ctext = cal.read_text()
    imp = (
        "import {\n"
        "  advanceCoalitionMatriarchOmnipotenceStreak,\n"
        "  applyMatriarchOmnipotenceMandateBonus,\n"
        "} from './coalition-matriarch-omnipotence.ts';\n"
    )
    if "coalition-matriarch-omnipotence" not in ctext:
        ctext = insert_after(
            ctext,
            "} from './coalition-matriarch-deification.ts';\n",
            imp,
        )
        ctext = insert_after(
            ctext,
            "  next = applyMatriarchDeificationMandateBonus(next, daysAdvanced);\n",
            "  next = advanceCoalitionMatriarchOmnipotenceStreak(next, daysAdvanced);\n"
            "  next = applyMatriarchOmnipotenceMandateBonus(next, daysAdvanced);\n",
        )
        cal.write_text(ctext)

    eng = ENGINE / "strategic-gameplay-engine.ts"
    etext = eng.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in etext:
        etext = insert_after(
            etext,
            "  if (action.id === 'sga_coalition_matriarch_deification_covenant') {\n"
            "    nextState = resetCoalitionMatriarchDeificationStreak(nextState);\n"
            "  }\n",
            "  if (action.id === 'sga_coalition_matriarch_omnipotence_charter') {\n"
            "    nextState = resetCoalitionMatriarchOmnipotenceStreak(nextState);\n"
            "  }\n"
            "  if (action.id === 'sga_coalition_matriarch_omnipotence_covenant') {\n"
            "    nextState = resetCoalitionMatriarchOmnipotenceStreak(nextState);\n"
            "  }\n",
        )
        etext = insert_after(
            etext,
            "import { resetCoalitionMatriarchDeificationStreak } from './coalition-matriarch-deification.ts';\n",
            "import { resetCoalitionMatriarchOmnipotenceStreak } from './coalition-matriarch-omnipotence.ts';\n",
        )
        if "coalitionMatriarchOmnipotenceStreakDays: 0" not in etext:
            etext = etext.replace(
                "coalitionMatriarchDeificationStreakDays: 0,\n",
                "coalitionMatriarchDeificationStreakDays: 0,\n    coalitionMatriarchOmnipotenceStreakDays: 0,\n",
                1,
            )
        eng.write_text(etext)

    val = ENGINE / "validation.ts"
    vtext = val.read_text()
    if "coalitionMatriarchOmnipotenceStreakIssues" not in vtext:
        vtext = insert_after(
            vtext,
            "import { coalitionMatriarchDeificationStreakIssues } from './coalition-matriarch-deification-gates.ts';\n",
            "import { coalitionMatriarchOmnipotenceStreakIssues } from './coalition-matriarch-omnipotence-gates.ts';\n",
        )
        vtext = insert_after(
            vtext,
            "    issues.push(...coalitionMatriarchDeificationStreakIssues(action, state));\n",
            "    issues.push(...coalitionMatriarchOmnipotenceStreakIssues(action, state));\n",
        )
        val.write_text(vtext)

    tb = ENGINE / "turn-briefing.ts"
    tbt = tb.read_text()
    if "isMatriarchCoalitionOmnipotence" not in tbt:
        tbt = insert_after(
            tbt,
            "import { isMatriarchCoalitionDeification } from './coalition-matriarch-deification.ts';\n",
            "import { isMatriarchCoalitionOmnipotence } from './coalition-matriarch-omnipotence.ts';\n",
        )
        tbt = insert_after(
            tbt,
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
            "    matriarchOmnipotenceActive: isMatriarchCoalitionOmnipotence(state),\n"
            "    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
        )
        tb.write_text(tbt)

    sig = SRC / "integrations/external-coalition-turn-signals.ts"
    st = sig.read_text()
    if "coalitionMatriarchOmnipotenceStreakDays" not in st:
        st = insert_after(
            st,
            "import { isMatriarchCoalitionDeification } from '../engine/coalition-matriarch-deification.ts';\n",
            "import { isMatriarchCoalitionOmnipotence } from '../engine/coalition-matriarch-omnipotence.ts';\n",
        )
        st = insert_after(
            st,
            "  coalitionMatriarchDeificationStreakDays: number;\n",
            "  matriarchOmnipotenceActive: boolean;\n  coalitionMatriarchOmnipotenceStreakDays: number;\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
            "    matriarchOmnipotenceActive: isMatriarchCoalitionOmnipotence(state),\n"
            "    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchDeificationStreakDays: raw?.coalitionMatriarchDeificationStreakDays ?? 0,\n",
            "    matriarchOmnipotenceActive: raw?.matriarchOmnipotenceActive ?? false,\n"
            "    coalitionMatriarchOmnipotenceStreakDays: raw?.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
        )
        sig.write_text(st)

    sa = SRC / "types/strategic-action.ts"
    sat = sa.read_text()
    if f"min_coalition_matriarch_{new_snake}_streak" not in sat:
        sat = insert_after(
            sat,
            "  | { kind: 'min_coalition_matriarch_deification_streak'; minDays: number };",
            "\n  | { kind: 'min_coalition_matriarch_omnipotence_streak'; minDays: number };",
        )
        sat = insert_after(
            sat,
            "  minCoalitionMatriarchDeificationStreakDays?: number;",
            "\n  /** Action requires matriarch omnipotence streak after matriarch deification. */\n  minCoalitionMatriarchOmnipotenceStreakDays?: number;",
        )
        sat = insert_after(
            sat,
            "  coalitionMatriarchDeificationStreakDays?: number;\n",
            "  coalitionMatriarchOmnipotenceStreakDays?: number;\n",
        )
        sa.write_text(sat)

    cm = SRC / "types/coalition-mandate.ts"
    cmt = cm.read_text()
    if "coalitionMatriarchOmnipotenceStreakDays" not in cmt:
        cmt = insert_after(
            cmt,
            "  coalitionMatriarchDeificationStreakDays: number;\n",
            "  matriarchOmnipotenceActive: boolean;\n  coalitionMatriarchOmnipotenceStreakDays: number;\n",
        )
        cm.write_text(cmt)

    idx = ROOT / "src/index.ts"
    it = idx.read_text()
    if "coalition-matriarch-omnipotence.ts" not in it:
        block = """
export { coalitionMatriarchOmnipotenceStreakIssues } from './engine/coalition-matriarch-omnipotence-gates.ts';
export {
  MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD,
  advanceCoalitionMatriarchOmnipotenceStreak,
  applyMatriarchOmnipotenceMandateBonus,
  isMatriarchCoalitionOmnipotence,
  resetCoalitionMatriarchOmnipotenceStreak,
} from './engine/coalition-matriarch-omnipotence.ts';
"""
        it = insert_after(
            it,
            "} from './engine/coalition-matriarch-deification.ts';\n",
            block,
        )
        it = it.replace("5.13.0", "5.14.0")
        idx.write_text(it)

    rec = ENGINE / "strategic-recommendations.ts"
    rt = rec.read_text()
    if "matriarchOmnipotenceRankingBonus" not in rt:
        rt = insert_after(
            rt,
            "  matriarchDeificationRankingBonus,\n",
            "  matriarchOmnipotenceRankingBonus,\n",
        )
        rt = insert_after(
            rt,
            "        matriarchDeificationRankingBonus(state, action),\n",
            "        matriarchOmnipotenceRankingBonus(state, action),\n",
        )
        rec.write_text(rt)

    save = ENGINE / "strategic-save.ts"
    stext = save.read_text()
    if "StrategicGameplaySaveV52" not in stext:
        stext = insert_after(
            stext,
            "export interface StrategicGameplaySaveV51 extends Omit<StrategicGameplaySaveV50, 'version'> {\n"
            "  version: 51;\n"
            "  coalitionMatriarchDeificationStreakDays: number;\n"
            "}\n",
            "\nexport interface StrategicGameplaySaveV52 extends Omit<StrategicGameplaySaveV51, 'version'> {\n"
            "  version: 52;\n"
            "  coalitionMatriarchOmnipotenceStreakDays: number;\n"
            "}\n",
        )
        stext = stext.replace(
            "  | StrategicGameplaySaveV51;",
            "  | StrategicGameplaySaveV51\n  | StrategicGameplaySaveV52;",
        )
        stext = stext.replace(
            "): StrategicGameplaySaveV51 {",
            "): StrategicGameplaySaveV52 {",
        )
        stext = stext.replace("    version: 51,", "    version: 52,", 1)
        stext = insert_after(
            stext,
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n  };\n}",
            "    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
        )
        stext = insert_after(
            stext,
            "    coalitionMatriarchDeificationStreakDays: (save as StrategicGameplaySaveV51).coalitionMatriarchDeificationStreakDays,\n  };\n  }",
            "    coalitionMatriarchOmnipotenceStreakDays: 0,\n",
        )
        # v52 deserialize branch
        v51_block = "  if (save.version === 51) {"
        if "save.version === 52" not in stext:
            idx51 = stext.find(v51_block)
            if idx51 == -1:
                raise RuntimeError("v51 deserialize block missing")
            # duplicate v51 block as v52 with omnipotence field
            end_marker = "  if (save.version === 50) {"
            v51_section = stext[idx51 : stext.find(end_marker, idx51)]
            v52_section = v51_section.replace("save.version === 51", "save.version === 52")
            v52_section = v52_section.replace(
                "(save as StrategicGameplaySaveV51).coalitionMatriarchDeificationStreakDays,",
                "(save as StrategicGameplaySaveV52).coalitionMatriarchDeificationStreakDays,\n"
                "    coalitionMatriarchOmnipotenceStreakDays: (save as StrategicGameplaySaveV52).coalitionMatriarchOmnipotenceStreakDays,",
            )
            stext = stext.replace(v51_section, v52_section + v51_section)
        save.write_text(stext)

    bundle = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    bt = bundle.read_text()
    if "coalition-matriarch-deification.ts" not in bt:
        bt = insert_after(
            bt,
            "  'src/engine/coalition-matriarch-apotheosis-gates.ts',\n",
            "  'src/engine/coalition-matriarch-deification.ts',\n"
            "  'src/engine/coalition-matriarch-deification-gates.ts',\n",
        )
    if "coalition-matriarch-omnipotence.ts" not in bt:
        bt = insert_after(
            bt,
            "  'src/engine/coalition-matriarch-deification-gates.ts',\n",
            "  'src/engine/coalition-matriarch-omnipotence.ts',\n"
            "  'src/engine/coalition-matriarch-omnipotence-gates.ts',\n",
        )
    bt = bt.replace("5.13.0", "5.14.0")
    bundle.write_text(bt)

    cj = TESTS / "commitment-journal.test.ts"
    cjt = cj.read_text()
    cjt = re.sub(r"toBe\(\d+\)", "toBe(110)", cjt, count=1)
    cj.write_text(cjt)

    print("gen-wave-round54-matriarch: ok")


if __name__ == "__main__":
    main()
