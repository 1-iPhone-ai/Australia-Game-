#!/usr/bin/env python3
"""Generate wave 53 matriarch deification tier from wave 51 transcendence pattern."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
ENGINE = SRC / "engine"
TESTS = ROOT / "tests"

# wave 51 -> wave 52 tier naming
OLD = "Apotheosis"
NEW = "Deification"
old_snake = "apotheosis"
new_snake = "deification"
old_upper = "APOTHEOSIS"
new_upper = "DEIFICATION"


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
        # Parent tier: deification after apotheosis
        text = text.replace(
            "./coalition-matriarch-apotheosis.ts",
            "./coalition-matriarch-transcendence.ts",
        )
        text = text.replace(
            "MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD",
            "MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD",
        )
        text = text.replace(
            "isMatriarchCoalitionApotheosis",
            "isMatriarchCoalitionTranscendence",
        )
        text = text.replace(
            "coalitionMatriarchApotheosisStreakDays",
            "coalitionMatriarchTranscendenceStreakDays",
        )
        text = text.replace(
            "matriarchApotheosisEligible",
            "matriarchTranscendenceEligible",
        )
        text = text.replace(
            "after matriarch apotheosis is sustained",
            "after matriarch transcendence is sustained",
        )
        text = text.replace(
            f"Matriarch apotheosis streak",
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

    # scale test from round 52
    t52src = (TESTS / "scale-wave-round52.test.ts").read_text()
    t53 = t52src
    t53 = t53.replace("round 52", "round 53")
    t53 = t53.replace("round52", "round53")
    t53 = repl(t53)
    t53 = t53.replace("save v50", "save v51")
    t53 = t53.replace("StrategicGameplaySaveV51", "StrategicGameplaySaveV51")
    t53 = t53.replace("O10-235", "O10-237")
    (TESTS / "scale-wave-round53.test.ts").write_text(t53)

    # catalog: duplicate deification charter/covenant block -> deification
    catalog = ROOT / "src/catalog/strategic-action-catalog.ts"
    cat = catalog.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in cat:
        m = re.search(
            r"  'sga_coalition_matriarch_deification_charter': \{.*?\n  \},\n  'sga_coalition_matriarch_deification_covenant': \{.*?\n  \},",
            cat,
            re.S,
        )
        if not m:
            raise RuntimeError("catalog apotheosis block not found")
        block = repl(m.group(0))
        block = block.replace("minCoalitionMatriarchInfinityStreakDays: 4", "minCoalitionMatriarchDeificationStreakDays: 4")
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
        bonus = btext.split("export function matriarchApotheosisRankingBonus")[1]
        bonus_block = "export function matriarchDeificationRankingBonus" + bonus.split("\n}\n")[0] + "\n}\n"
        new_bonus = repl(bonus_block).replace("return 44;", "return 45;")
        btext = btext.rstrip() + "\n\n\n" + new_bonus
        bal.write_text(btext)

    # strategic-calendar imports + advance lines
    cal = ENGINE / "strategic-calendar.ts"
    ctext = cal.read_text()
    imp = (
        "import {\n"
        "  advanceCoalitionMatriarchDeificationStreak,\n"
        "  applyMatriarchDeificationMandateBonus,\n"
        "} from './coalition-matriarch-deification.ts';\n"
    )
    if "coalition-matriarch-deification" not in ctext:
        ctext = insert_after(
            ctext,
            "} from './coalition-matriarch-apotheosis.ts';\n",
            imp,
        )
        ctext = insert_after(
            ctext,
            "  next = applyMatriarchApotheosisMandateBonus(next, daysAdvanced);\n",
            "  next = advanceCoalitionMatriarchDeificationStreak(next, daysAdvanced);\n"
            "  next = applyMatriarchDeificationMandateBonus(next, daysAdvanced);\n",
        )
        cal.write_text(ctext)

    # engine reset hooks
    eng = ENGINE / "strategic-gameplay-engine.ts"
    etext = eng.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in etext:
        etext = insert_after(
            etext,
            "  if (action.id === 'sga_coalition_matriarch_apotheosis_covenant') {\n"
            "    nextState = resetCoalitionMatriarchApotheosisStreak(nextState);\n"
            "  }\n",
            "  if (action.id === 'sga_coalition_matriarch_deification_charter') {\n"
            "    nextState = resetCoalitionMatriarchDeificationStreak(nextState);\n"
            "  }\n"
            "  if (action.id === 'sga_coalition_matriarch_deification_covenant') {\n"
            "    nextState = resetCoalitionMatriarchDeificationStreak(nextState);\n"
            "  }\n",
        )
        etext = insert_after(
            etext,
            "import { resetCoalitionMatriarchApotheosisStreak } from './coalition-matriarch-apotheosis.ts';\n",
            "import { resetCoalitionMatriarchDeificationStreak } from './coalition-matriarch-deification.ts';\n",
        )
        if "coalitionMatriarchDeificationStreakDays: 0" not in etext:
            etext = etext.replace(
                "coalitionMatriarchApotheosisStreakDays: 0,\n",
                "coalitionMatriarchApotheosisStreakDays: 0,\n    coalitionMatriarchDeificationStreakDays: 0,\n",
                1,
            )
        eng.write_text(etext)

    # validation
    val = ENGINE / "validation.ts"
    vtext = val.read_text()
    if "coalitionMatriarchDeificationStreakIssues" not in vtext:
        vtext = insert_after(
            vtext,
            "import { coalitionMatriarchDeificationStreakIssues } from './coalition-matriarch-deification-gates.ts';\n",
            "import { coalitionMatriarchDeificationStreakIssues } from './coalition-matriarch-deification-gates.ts';\n",
        )
        vtext = insert_after(
            vtext,
            "    issues.push(...coalitionMatriarchDeificationStreakIssues(action, state));\n",
            "    issues.push(...coalitionMatriarchDeificationStreakIssues(action, state));\n",
        )
        val.write_text(vtext)

    # turn briefing
    tb = ENGINE / "turn-briefing.ts"
    tbt = tb.read_text()
    if "isMatriarchCoalitionDeification" not in tbt:
        tbt = insert_after(
            tbt,
            "import { isMatriarchCoalitionDeification } from './coalition-matriarch-apotheosis.ts';\n",
            "import { isMatriarchCoalitionDeification } from './coalition-matriarch-apotheosis.ts';\n",
        )
        tbt = insert_after(
            tbt,
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
            "    matriarchDeificationActive: isMatriarchCoalitionDeification(state),\n"
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
        )
        tb.write_text(tbt)

    # external signals
    sig = SRC / "integrations/external-coalition-turn-signals.ts"
    st = sig.read_text()
    if "coalitionMatriarchDeificationStreakDays" not in st:
        st = insert_after(
            st,
            "import { isMatriarchCoalitionDeification } from '../engine/coalition-matriarch-apotheosis.ts';\n",
            "import { isMatriarchCoalitionDeification } from '../engine/coalition-matriarch-apotheosis.ts';\n",
        )
        st = repl(
            insert_after(
                st,
                "  coalitionMatriarchDeificationStreakDays: number;\n",
                "  matriarchDeificationActive: boolean;\n  coalitionMatriarchDeificationStreakDays: number;\n",
            )
        )
        st = insert_after(
            st,
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
            "    matriarchDeificationActive: isMatriarchCoalitionDeification(state),\n"
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchDeificationStreakDays: raw?.coalitionMatriarchDeificationStreakDays ?? 0,\n",
            "    matriarchDeificationActive: raw?.matriarchDeificationActive ?? false,\n"
            "    coalitionMatriarchDeificationStreakDays: raw?.coalitionMatriarchDeificationStreakDays ?? 0,\n",
        )
        sig.write_text(st)

    # types
    sa = SRC / "types/strategic-action.ts"
    sat = sa.read_text()
    if "min_coalition_matriarch_deification_streak" not in sat:
        sat = insert_after(
            sat,
            "  | { kind: 'min_coalition_matriarch_deification_streak'; minDays: number };",
            "\n  | { kind: 'min_coalition_matriarch_deification_streak'; minDays: number };",
        )
        sat = insert_after(
            sat,
            "  /** Action requires matriarch deification streak after matriarch infinity. */\n  minCoalitionMatriarchDeificationStreakDays?: number;",
            "\n  /** Action requires matriarch deification streak after matriarch deification. */\n  minCoalitionMatriarchDeificationStreakDays?: number;",
        )
        sat = insert_after(
            sat,
            "  coalitionMatriarchDeificationStreakDays?: number;\n",
            "  coalitionMatriarchDeificationStreakDays?: number;\n",
        )
        sa.write_text(sat)

    cm = SRC / "types/coalition-mandate.ts"
    cmt = cm.read_text()
    if "coalitionMatriarchDeificationStreakDays" not in cmt:
        cmt = insert_after(
            cmt,
            "  coalitionMatriarchDeificationStreakDays: number;\n",
            "  matriarchDeificationActive: boolean;\n  coalitionMatriarchDeificationStreakDays: number;\n",
        )
        cm.write_text(cmt)

    # index exports
    idx = SRC / "index.ts"
    it = idx.read_text()
    if "coalition-matriarch-apotheosis.ts" not in it:
        block = """
export { coalitionMatriarchDeificationStreakIssues } from './engine/coalition-matriarch-deification-gates.ts';
export {
  MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
  advanceCoalitionMatriarchDeificationStreak,
  applyMatriarchDeificationMandateBonus,
  isMatriarchCoalitionDeification,
  resetCoalitionMatriarchDeificationStreak,
} from './engine/coalition-matriarch-apotheosis.ts';
"""
        it = insert_after(
            it,
            "} from './engine/coalition-matriarch-apotheosis.ts';\n",
            block,
        )
        it = it.replace("5.13.0", "5.13.0")
        it = insert_after(
            it,
            "  matriarchDeificationRankingBonus,\n",
            "  matriarchDeificationRankingBonus,\n",
        )
        idx.write_text(it)

    rec = ENGINE / "strategic-recommendations.ts"
    rt = rec.read_text()
    if "matriarchDeificationRankingBonus" not in rt:
        rt = insert_after(
            rt,
            "  matriarchDeificationRankingBonus,\n",
            "  matriarchDeificationRankingBonus,\n",
        )
        rt = insert_after(
            rt,
            "        matriarchDeificationRankingBonus(state, action),\n",
            "        matriarchDeificationRankingBonus(state, action),\n",
        )
        rec.write_text(rt)

    # save v50 — mirror v49 addition
    save = ENGINE / "strategic-save.ts"
    stext = save.read_text()
    if "StrategicGameplaySaveV51" not in stext:
        stext = insert_after(
            stext,
            "export interface StrategicGameplaySaveV51 extends Omit<StrategicGameplaySaveV48, 'version'> {\n"
            "  version: 49;\n"
            "  coalitionMatriarchDeificationStreakDays: number;\n"
            "}\n",
            "\nexport interface StrategicGameplaySaveV51 extends Omit<StrategicGameplaySaveV51, 'version'> {\n"
            "  version: 50;\n"
            "  coalitionMatriarchDeificationStreakDays: number;\n"
            "}\n",
        )
        stext = stext.replace(
            "  | StrategicGameplaySaveV51;",
            "  | StrategicGameplaySaveV51\n  | StrategicGameplaySaveV51;",
        )
        stext = stext.replace("): StrategicGameplaySaveV51 {", "): StrategicGameplaySaveV51 {")
        stext = stext.replace("    version: 49,", "    version: 51,")
        stext = insert_after(
            stext,
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n  };\n}",
            "    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,\n",
        )
        stext = stext.replace(
            "    coalitionMatriarchDeificationStreakDays: 0,\n    };",
            "    coalitionMatriarchDeificationStreakDays: 0,\n    coalitionMatriarchDeificationStreakDays: 0,\n    };",
        )
        stext = insert_after(
            stext,
            "    coalitionMatriarchDeificationStreakDays: save.coalitionMatriarchDeificationStreakDays,\n",
            "    coalitionMatriarchDeificationStreakDays: save.coalitionMatriarchDeificationStreakDays,\n",
        )
        save.write_text(stext)

    bundle = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    bt = bundle.read_text()
    if "coalition-matriarch-deification.ts" not in bt:
        bt = insert_after(
            bt,
            "  'src/engine/coalition-matriarch-deification-gates.ts',\n",
            "  'src/engine/coalition-matriarch-apotheosis.ts',\n"
            "  'src/engine/coalition-matriarch-deification-gates.ts',\n",
        )
        bt = bt.replace("5.13.0", "5.13.0")
        bundle.write_text(bt)

    cj = TESTS / "commitment-journal.test.ts"
    cjt = cj.read_text().replace("106", "108")
    cj.write_text(cjt)

    print("gen-wave-round53-matriarch: ok")


if __name__ == "__main__":
    main()
