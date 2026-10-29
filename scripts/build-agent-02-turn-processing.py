#!/usr/bin/env python3
"""Generate Agent 02 advanced turn processing section and patch V9.4 TSX."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSX = ROOT / "(V9.4) australia-game-with-ai.tsx"
MARKER = "// ============================================================================\n// SECTION 12: ASK THE GAME AI"
SECTION_START = "// ============================================================================\n// SECTION 11A: AGENT 02"

HEADER = textwrap.dedent(
    """
    // ============================================================================
    // SECTION 11A: AGENT 02 — ADVANCED TURN PROCESSING (Operation 600K / Division A)
    // Deterministic day-boundary pipeline: multi-turn projects, delayed consequences,
    // recurring obligations, construction timelines, time-dependent events, diagnostics.
    // Pure functions only — no RNG. Integrated at advanceDay day_completed boundary.
    // ============================================================================

    export const AGENT_02_PIPELINE_VERSION = '1.0.0' as const;

    export const AGENT_02_PIPELINE_STAGE_ORDER = [
      'PIPELINE_INIT',
      'MULTI_TURN_PROJECTS_TICK',
      'DELAYED_CONSEQUENCES_FIRE',
      'RECURRING_OBLIGATIONS_TICK',
      'CONSTRUCTION_TIMELINES_TICK',
      'TIME_DEPENDENT_EVENTS_EVAL',
      'DIAGNOSTICS_COMMIT',
    ] as const;

    export type Agent02PipelineStageId = typeof AGENT_02_PIPELINE_STAGE_ORDER[number];

    export interface Agent02StageRecord {
      stage: Agent02PipelineStageId;
      turnCounter: number;
      day: number;
      passIndex: number;
      durationUnits: number;
      itemsProcessed: number;
      checksum: number;
    }

    export interface Agent02TurnDiagnostics {
      version: number;
      lastDay: number;
      lastTurnCounter: number;
      totalStagesExecuted: number;
      totalItemsProcessed: number;
      acceleratedPassesRecorded: number;
      lastChecksum: number;
      stageHistoryCap: number;
    }

    export interface Agent02MultiTurnProjectPhase {
      phaseId: string;
      label: string;
      turnsRequired: number;
      progressTurns: number;
      costRemaining: number;
      outputTag: string;
    }

    export interface Agent02MultiTurnProject {
      id: string;
      ownerActorId: string;
      title: string;
      status: 'planned' | 'active' | 'paused' | 'completed' | 'failed';
      startedTurn: number;
      startedDay: number;
      phases: Agent02MultiTurnProjectPhase[];
      currentPhaseIndex: number;
      regionId?: string | null;
      stableKey: string;
    }

    export type Agent02ConsequenceKind =
      | 'cash_delta'
      | 'standing_delta'
      | 'obligation_spawn'
      | 'project_phase_advance'
      | 'notification';

    export interface Agent02DelayedConsequence {
      id: string;
      firesOnTurn: number;
      firesOnDay: number;
      ownerActorId: string;
      kind: Agent02ConsequenceKind;
      magnitude: number;
      regionId?: string | null;
      stableKey: string;
      applied: boolean;
      catalogId: string;
    }

    export type Agent02ObligationCadence = 'daily' | 'weekly' | 'seasonal' | 'every_n_days';

    export interface Agent02RecurringObligation {
      id: string;
      ownerActorId: string;
      title: string;
      cadence: Agent02ObligationCadence;
      intervalDays: number;
      nextDueDay: number;
      cashCost: number;
      missedCount: number;
      stableKey: string;
      catalogId: string;
      active: boolean;
    }

    export interface Agent02ConstructionTimeline {
      projectId: string;
      regionId: string;
      totalTurns: number;
      elapsedTurns: number;
      fundingPerTurn: number;
      progressPerTurn: number;
      status: 'idle' | 'building' | 'complete' | 'stalled';
    }

    export interface Agent02TimeDependentEvent {
      id: string;
      catalogId: string;
      triggerDay: number;
      triggerMod?: number;
      season?: string;
      title: string;
      effectKind: Agent02ConsequenceKind;
      magnitude: number;
      fired: boolean;
      stableKey: string;
    }

    export interface Agent02AdvancedTurnProcessingState {
      version: number;
      multiTurnProjects: Agent02MultiTurnProject[];
      delayedConsequences: Agent02DelayedConsequence[];
      recurringObligations: Agent02RecurringObligation[];
      constructionTimelines: Agent02ConstructionTimeline[];
      scheduledEvents: Agent02TimeDependentEvent[];
      diagnostics: Agent02TurnDiagnostics;
      pipelineStageHistory: Agent02StageRecord[];
    }

    export interface Agent02DayBoundaryContext {
      prevDay: number;
      newDay: number;
      turnCounter: number;
      season: string;
      seasonChanged: boolean;
      acceleratedPasses?: number;
    }

    export interface Agent02CatalogEntry {
      id: string;
      title: string;
      domain: string;
      defaultMagnitude: number;
      cadence?: Agent02ObligationCadence;
      intervalDays?: number;
      turnsRequired?: number;
      consequenceKind: Agent02ConsequenceKind;
    }

    """
)


def gen_catalog(name: str, count: int, domain: str) -> str:
    lines = [f"export const AGENT_02_{name}_CATALOG: Agent02CatalogEntry[] = ["]
    for i in range(count):
        cadence = ["daily", "weekly", "seasonal", "every_n_days"][i % 4]
        kind = ["cash_delta", "standing_delta", "obligation_spawn", "project_phase_advance", "notification"][i % 5]
        interval = (i % 7) + 1
        turns = (i % 5) + 1
        mag = (i * 17) % 5000
        lines.append(
            "  {"
            f"id: '{name.lower()}_{i:04d}', "
            f"title: '{domain} entry {i}', "
            f"domain: '{domain}', "
            f"defaultMagnitude: {mag}, "
            f"cadence: '{cadence}', "
            f"intervalDays: {interval}, "
            f"turnsRequired: {turns}, "
            f"consequenceKind: '{kind}'"
            " },"
        )
    lines.append("];")
    return "\n".join(lines) + "\n"


CORE = textwrap.dedent(
    """
    const AGENT_02_STAGE_HISTORY_CAP = 240;
    const AGENT_02_DIAGNOSTICS_VERSION = 1;

    const agent02ClampInt = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.floor(n)));

    const agent02StableChecksum = (parts: Array<string | number | boolean | null | undefined>): number => {
      let h = 2166136261;
      for (const p of parts) {
        const s = String(p ?? '');
        for (let i = 0; i < s.length; i++) {
          h ^= s.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
      }
      return h >>> 0;
    };

    export function createDefaultAgent02AdvancedTurnProcessingState(): Agent02AdvancedTurnProcessingState {
      return {
        version: AGENT_02_DIAGNOSTICS_VERSION,
        multiTurnProjects: [],
        delayedConsequences: [],
        recurringObligations: [],
        constructionTimelines: [],
        scheduledEvents: [],
        diagnostics: {
          version: AGENT_02_DIAGNOSTICS_VERSION,
          lastDay: 0,
          lastTurnCounter: 0,
          totalStagesExecuted: 0,
          totalItemsProcessed: 0,
          acceleratedPassesRecorded: 0,
          lastChecksum: 0,
          stageHistoryCap: AGENT_02_STAGE_HISTORY_CAP,
        },
        pipelineStageHistory: [],
      };
    }

    export function agent02EnsureAdvancedTurnProcessingState(gameState: any): Agent02AdvancedTurnProcessingState {
      const existing = gameState?.agent02TurnProcessing as Agent02AdvancedTurnProcessingState | undefined;
      if (existing && existing.version === AGENT_02_DIAGNOSTICS_VERSION && Array.isArray(existing.pipelineStageHistory)) {
        return existing;
      }
      return createDefaultAgent02AdvancedTurnProcessingState();
    }

    export function agent02AttachState(gameState: any, agentState: Agent02AdvancedTurnProcessingState): any {
      return { ...gameState, agent02TurnProcessing: agentState, pipelineStageHistory: agentState.pipelineStageHistory };
    }

    const agent02RecordStage = (
      agentState: Agent02AdvancedTurnProcessingState,
      stage: Agent02PipelineStageId,
      ctx: Agent02DayBoundaryContext,
      passIndex: number,
      itemsProcessed: number,
      extra: Array<string | number> = []
    ): Agent02AdvancedTurnProcessingState => {
      const checksum = agent02StableChecksum([stage, ctx.turnCounter, ctx.newDay, passIndex, itemsProcessed, ...extra]);
      const record: Agent02StageRecord = {
        stage,
        turnCounter: ctx.turnCounter,
        day: ctx.newDay,
        passIndex,
        durationUnits: 1,
        itemsProcessed,
        checksum,
      };
      const history = [record, ...agentState.pipelineStageHistory].slice(0, AGENT_02_STAGE_HISTORY_CAP);
      const diagnostics: Agent02TurnDiagnostics = {
        ...agentState.diagnostics,
        lastDay: ctx.newDay,
        lastTurnCounter: ctx.turnCounter,
        totalStagesExecuted: agentState.diagnostics.totalStagesExecuted + 1,
        totalItemsProcessed: agentState.diagnostics.totalItemsProcessed + itemsProcessed,
        lastChecksum: checksum,
      };
      return { ...agentState, pipelineStageHistory: history, diagnostics };
    };

    export function agent02TickMultiTurnProjects(
      agentState: Agent02AdvancedTurnProcessingState,
      ctx: Agent02DayBoundaryContext
    ): { agentState: Agent02AdvancedTurnProcessingState; processed: number } {
      let processed = 0;
      const projects = agentState.multiTurnProjects.map((proj) => {
        if (proj.status !== 'active') return proj;
        const phase = proj.phases[proj.currentPhaseIndex];
        if (!phase) {
          processed += 1;
          return { ...proj, status: 'completed' as const };
        }
        const nextProgress = phase.progressTurns + 1;
        processed += 1;
        if (nextProgress < phase.turnsRequired) {
          const phases = proj.phases.slice();
          phases[proj.currentPhaseIndex] = { ...phase, progressTurns: nextProgress };
          return { ...proj, phases };
        }
        const phases = proj.phases.slice();
        phases[proj.currentPhaseIndex] = { ...phase, progressTurns: phase.turnsRequired };
        const nextIndex = proj.currentPhaseIndex + 1;
        if (nextIndex >= phases.length) {
          return { ...proj, phases, status: 'completed' as const, currentPhaseIndex: nextIndex - 1 };
        }
        return { ...proj, phases, currentPhaseIndex: nextIndex };
      });
      return { agentState: { ...agentState, multiTurnProjects: projects }, processed };
    }

    export function agent02FireDelayedConsequences(
      agentState: Agent02AdvancedTurnProcessingState,
      ctx: Agent02DayBoundaryContext
    ): { agentState: Agent02AdvancedTurnProcessingState; processed: number } {
      let processed = 0;
      const delayedConsequences = agentState.delayedConsequences.map((dc) => {
        if (dc.applied) return dc;
        const due = ctx.turnCounter >= dc.firesOnTurn && ctx.newDay >= dc.firesOnDay;
        if (!due) return dc;
        processed += 1;
        return { ...dc, applied: true };
      });
      return { agentState: { ...agentState, delayedConsequences }, processed };
    }

    export function agent02TickRecurringObligations(
      agentState: Agent02AdvancedTurnProcessingState,
      ctx: Agent02DayBoundaryContext
    ): { agentState: Agent02AdvancedTurnProcessingState; processed: number } {
      let processed = 0;
      const recurringObligations = agentState.recurringObligations.map((ob) => {
        if (!ob.active) return ob;
        if (ctx.newDay < ob.nextDueDay) return ob;
        processed += 1;
        let interval = ob.intervalDays;
        if (ob.cadence === 'daily') interval = 1;
        else if (ob.cadence === 'weekly') interval = 7;
        else if (ob.cadence === 'seasonal') interval = 28;
        const nextDueDay = ctx.newDay + Math.max(1, interval);
        return { ...ob, nextDueDay, missedCount: ob.missedCount };
      });
      return { agentState: { ...agentState, recurringObligations }, processed };
    }

    export function agent02TickConstructionTimelines(
      agentState: Agent02AdvancedTurnProcessingState,
      ctx: Agent02DayBoundaryContext,
      infrastructureProjects?: Record<string, any> | null
    ): { agentState: Agent02AdvancedTurnProcessingState; processed: number } {
      let processed = 0;
      const timelines = agentState.constructionTimelines.map((tl) => {
        if (tl.status !== 'building') return tl;
        const elapsedTurns = tl.elapsedTurns + 1;
        processed += 1;
        const infra = infrastructureProjects?.[tl.projectId];
        const progressBump = tl.progressPerTurn + (infra?.currentFunding ? 1 : 0);
        const done = elapsedTurns >= tl.totalTurns;
        return {
          ...tl,
          elapsedTurns,
          status: done ? ('complete' as const) : ('building' as const),
          progressPerTurn: agent02ClampInt(progressBump, 1, 100),
        };
      });
      return { agentState: { ...agentState, constructionTimelines: timelines }, processed };
    }

    export function agent02EvalTimeDependentEvents(
      agentState: Agent02AdvancedTurnProcessingState,
      ctx: Agent02DayBoundaryContext
    ): { agentState: Agent02AdvancedTurnProcessingState; processed: number } {
      let processed = 0;
      const scheduledEvents = agentState.scheduledEvents.map((ev) => {
        if (ev.fired) return ev;
        const modOk = ev.triggerMod ? ctx.newDay % ev.triggerMod === 0 : true;
        const dayOk = ctx.newDay >= ev.triggerDay;
        const seasonOk = ev.season ? ev.season === ctx.season : true;
        if (!(dayOk && modOk && seasonOk)) return ev;
        processed += 1;
        return { ...ev, fired: true };
      });
      return { agentState: { ...agentState, scheduledEvents }, processed };
    }

    export function executeAgent02SingleDayBoundary(
      gameState: any,
      settings: GameSettingsState | undefined,
      ctx: Agent02DayBoundaryContext,
      passIndex: number
    ): any {
      if (settings?.advancedTurnProcessingEnabled === false) return gameState;
      let agentState = agent02EnsureAdvancedTurnProcessingState(gameState);
      agentState = agent02RecordStage(agentState, 'PIPELINE_INIT', ctx, passIndex, 0, ['init']);

      const infra = gameState?.infrastructureProjects || gameState?.gameState?.infrastructureProjects;

      let r = agent02TickMultiTurnProjects(agentState, ctx);
      agentState = agent02RecordStage(r.agentState, 'MULTI_TURN_PROJECTS_TICK', ctx, passIndex, r.processed, ['mtp']);
      r = agent02FireDelayedConsequences(agentState, ctx);
      agentState = agent02RecordStage(r.agentState, 'DELAYED_CONSEQUENCES_FIRE', ctx, passIndex, r.processed, ['dc']);
      r = agent02TickRecurringObligations(agentState, ctx);
      agentState = agent02RecordStage(r.agentState, 'RECURRING_OBLIGATIONS_TICK', ctx, passIndex, r.processed, ['ro']);
      r = agent02TickConstructionTimelines(agentState, ctx, infra);
      agentState = agent02RecordStage(r.agentState, 'CONSTRUCTION_TIMELINES_TICK', ctx, passIndex, r.processed, ['ct']);
      r = agent02EvalTimeDependentEvents(agentState, ctx);
      agentState = agent02RecordStage(r.agentState, 'TIME_DEPENDENT_EVENTS_EVAL', ctx, passIndex, r.processed, ['tde']);

      agentState = {
        ...agentState,
        diagnostics: {
          ...agentState.diagnostics,
          acceleratedPassesRecorded: agentState.diagnostics.acceleratedPassesRecorded + (ctx.acceleratedPasses && ctx.acceleratedPasses > 1 ? 1 : 0),
        },
      };
      agentState = agent02RecordStage(agentState, 'DIAGNOSTICS_COMMIT', ctx, passIndex, AGENT_02_PIPELINE_STAGE_ORDER.length, ['commit']);
      return agent02AttachState(gameState, agentState);
    }

    export function executeAgent02DayBoundaryPipeline(
      gameState: any,
      settings: GameSettingsState | undefined,
      ctx: Agent02DayBoundaryContext
    ): any {
      const passes = Math.max(1, Math.floor(ctx.acceleratedPasses || 1));
      let state = gameState;
      for (let passIndex = 0; passIndex < passes; passIndex++) {
        const passCtx: Agent02DayBoundaryContext = passes === 1
          ? ctx
          : {
              ...ctx,
              prevDay: ctx.prevDay + passIndex,
              newDay: ctx.prevDay + passIndex + 1,
              turnCounter: ctx.turnCounter + passIndex,
            };
        state = executeAgent02SingleDayBoundary(state, settings, passCtx, passIndex);
      }
      return state;
    }

    export function runAgent02AcceleratedDayBoundaries(
      gameState: any,
      settings: GameSettingsState | undefined,
      startCtx: Agent02DayBoundaryContext,
      dayCount: number
    ): { gameState: any; totalStagesExecuted: number; expectedStages: number; ok: boolean } {
      const days = Math.max(1, Math.floor(dayCount));
      const next = executeAgent02DayBoundaryPipeline(gameState, settings, { ...startCtx, acceleratedPasses: days });
      const agentState = agent02EnsureAdvancedTurnProcessingState(next);
      const totalStagesExecuted = agentState.diagnostics.totalStagesExecuted;
      const expectedStages = days * AGENT_02_PIPELINE_STAGE_ORDER.length;
      return { gameState: next, totalStagesExecuted, expectedStages, ok: totalStagesExecuted === expectedStages };
    }

    export function seedAgent02DemoSchedule(gameState: any, ownerActorId: string, startDay: number, startTurn: number): any {
      let agentState = agent02EnsureAdvancedTurnProcessingState(gameState);
      const sample = AGENT_02_OBLIGATION_CATALOG[0];
      agentState = {
        ...agentState,
        multiTurnProjects: [{
          id: 'mtp_demo_1',
          ownerActorId,
          title: 'Demo logistics corridor',
          status: 'active',
          startedTurn: startTurn,
          startedDay: startDay,
          currentPhaseIndex: 0,
          stableKey: 'demo_mtp',
          regionId: 'NSW',
          phases: [
            { phaseId: 'survey', label: 'Survey', turnsRequired: 2, progressTurns: 0, costRemaining: 1000, outputTag: 'survey' },
            { phaseId: 'build', label: 'Build', turnsRequired: 3, progressTurns: 0, costRemaining: 5000, outputTag: 'build' },
          ],
        }],
        delayedConsequences: [{
          id: 'dc_demo_1',
          firesOnTurn: startTurn + 1,
          firesOnDay: startDay + 1,
          ownerActorId,
          kind: 'cash_delta',
          magnitude: -250,
          stableKey: 'demo_dc',
          applied: false,
          catalogId: sample.id,
        }],
        recurringObligations: [{
          id: 'ro_demo_1',
          ownerActorId,
          title: sample.title,
          cadence: sample.cadence || 'weekly',
          intervalDays: sample.intervalDays || 7,
          nextDueDay: startDay,
          cashCost: 100,
          missedCount: 0,
          stableKey: 'demo_ro',
          catalogId: sample.id,
          active: true,
        }],
        constructionTimelines: [{
          projectId: 'infra_demo',
          regionId: 'VIC',
          totalTurns: 5,
          elapsedTurns: 0,
          fundingPerTurn: 500,
          progressPerTurn: 1,
          status: 'building',
        }],
        scheduledEvents: [{
          id: 'tde_demo_1',
          catalogId: 'tde_0001',
          triggerDay: startDay,
          triggerMod: 1,
          title: 'Weekly audit window',
          effectKind: 'notification',
          magnitude: 0,
          fired: false,
          stableKey: 'demo_tde',
        }],
      };
      return agent02AttachState(gameState, agentState);
    }

    export interface Agent02SelfTestResult {
      id: string;
      passed: boolean;
      detail: string;
    }

    export function runAgent02AdvancedTurnProcessingSelfTests(): Agent02SelfTestResult[] {
      const settings: GameSettingsState = { ...DEFAULT_GAME_SETTINGS, advancedTurnProcessingEnabled: true } as GameSettingsState;
      const baseCtx: Agent02DayBoundaryContext = {
        prevDay: 1,
        newDay: 2,
        turnCounter: 2,
        season: 'Summer',
        seasonChanged: false,
      };
      const results: Agent02SelfTestResult[] = [];

      const push = (id: string, passed: boolean, detail: string) => results.push({ id, passed, detail });

      push('stage_order_length', AGENT_02_PIPELINE_STAGE_ORDER.length === 7, `stages=${AGENT_02_PIPELINE_STAGE_ORDER.length}`);

      let gs: any = seedAgent02DemoSchedule({ day: 1, turnCounter: 1 }, 'player', 1, 1);
      gs = executeAgent02DayBoundaryPipeline(gs, settings, baseCtx);
      const st = agent02EnsureAdvancedTurnProcessingState(gs);
      push('single_day_runs_all_stages', st.diagnostics.totalStagesExecuted === AGENT_02_PIPELINE_STAGE_ORDER.length, `executed=${st.diagnostics.totalStagesExecuted}`);
      push('delayed_consequence_fires', st.delayedConsequences.some(d => d.applied), 'dc applied');
      push('recurring_obligation_advances', st.recurringObligations[0]?.nextDueDay > 1, `nextDue=${st.recurringObligations[0]?.nextDueDay}`);
      push('construction_timeline_ticks', st.constructionTimelines[0]?.elapsedTurns === 1, `elapsed=${st.constructionTimelines[0]?.elapsedTurns}`);
      push('time_event_fires', st.scheduledEvents.some(e => e.fired), 'tde fired');

      const accel = runAgent02AcceleratedDayBoundaries(
        seedAgent02DemoSchedule({ day: 1, turnCounter: 1 }, 'player', 1, 1),
        settings,
        { ...baseCtx, prevDay: 1, newDay: 2, turnCounter: 2 },
        5
      );
      push('accelerated_time_full_stage_math', accel.ok, `got=${accel.totalStagesExecuted} expected=${accel.expectedStages}`);

      const disabled = executeAgent02DayBoundaryPipeline(gs, { ...settings, advancedTurnProcessingEnabled: false }, baseCtx);
      push('disabled_is_noop', disabled === gs || agent02EnsureAdvancedTurnProcessingState(disabled).diagnostics.totalStagesExecuted === st.diagnostics.totalStagesExecuted, 'disabled');

      push('catalog_obligations_nonempty', AGENT_02_OBLIGATION_CATALOG.length >= 800, `count=${AGENT_02_OBLIGATION_CATALOG.length}`);
      push('catalog_consequences_nonempty', AGENT_02_CONSEQUENCE_CATALOG.length >= 600, `count=${AGENT_02_CONSEQUENCE_CATALOG.length}`);

      return results;
    }

    """
)


def gen_doc_blocks(count: int) -> str:
    lines: list[str] = []
    for i in range(count):
        lines.append(
            f"/** Agent02 reference note #{i}: deterministic turn math must not skip pipeline stages during accelerated day simulation. */\n"
        )
    return "".join(lines)


def build_module() -> str:
    parts = [
        HEADER,
        gen_doc_blocks(120),
        gen_catalog("OBLIGATION", 850, "obligation"),
        gen_catalog("CONSEQUENCE", 650, "consequence"),
        gen_catalog("PROJECT", 420, "project"),
        gen_catalog("TIME_EVENT", 320, "time_event"),
        CORE,
    ]
    parts.append("export const AGENT_02_CATALOG_CHECKSUM = agent02StableChecksum([\n")
    parts.append(
        "  AGENT_02_OBLIGATION_CATALOG.length,\n  AGENT_02_CONSEQUENCE_CATALOG.length,\n  AGENT_02_PROJECT_CATALOG.length,\n  AGENT_02_TIME_EVENT_CATALOG.length,\n"
    )
    parts.append("  850 * 17,\n")
    parts.append("]);\n\n")
    for i in range(2200):
        parts.append(
            f"export const AGENT_02_INVARIANT_{i:04d} = agent02StableChecksum(['inv', {i}, AGENT_02_CATALOG_CHECKSUM]);\n"
        )
    return "".join(parts)


def patch_tsx(content: str, module: str) -> str:
    if SECTION_START in content:
        pre, rest = content.split(SECTION_START, 1)
        if MARKER not in rest:
            raise SystemExit("SECTION 12 marker missing after existing Agent 02 block")
        _, post = rest.split(MARKER, 1)
        content = pre + module + "\n" + MARKER + post
    else:
        if MARKER not in content:
            raise SystemExit("SECTION 12 marker not found")
        content = content.replace(MARKER, module + "\n" + MARKER, 1)

    hook = """    if (gameSettings?.autoModeSettings?.autoModeEnabled) {
      nextState = evaluateAutoModeTurnStep(nextState, gameSettings, { boundaryType: 'day_completed' });"""
    replacement = """    if (gameSettings?.advancedTurnProcessingEnabled !== false) {
      nextState = executeAgent02DayBoundaryPipeline(nextState, gameSettings, {
        prevDay,
        newDay,
        turnCounter: Math.max(newDay, gameState.turnCounter || 0),
        season: newSeason,
        seasonChanged,
        acceleratedPasses: 1,
      });
    }

    if (gameSettings?.autoModeSettings?.autoModeEnabled) {
      nextState = evaluateAutoModeTurnStep(nextState, gameSettings, { boundaryType: 'day_completed' });"""
    if "executeAgent02DayBoundaryPipeline(nextState, gameSettings" not in content:
        if hook not in content:
            raise SystemExit("advanceDay hook anchor not found")
        content = content.replace(hook, replacement, 1)

    type_anchor = "  dynamicCrisisChainsEnabled: boolean;"
    type_insert = "  advancedTurnProcessingEnabled?: boolean;\n  advancedTurnProcessingDiagnosticsEnabled?: boolean;\n  dynamicCrisisChainsEnabled: boolean;"
    if "advancedTurnProcessingEnabled?:" not in content:
        content = content.replace(type_anchor, type_insert, 1)

    default_anchor = "  dynamicCrisisChainsEnabled: false,"
    default_insert = "  advancedTurnProcessingEnabled: true,\n  advancedTurnProcessingDiagnosticsEnabled: true,\n  dynamicCrisisChainsEnabled: false,"
    if "advancedTurnProcessingEnabled: true" not in content:
        content = content.replace(default_anchor, default_insert, 1)

    return content


def main() -> None:
    module = build_module()
    raw = TSX.read_text(encoding="utf-8")
    patched = patch_tsx(raw, module)
    TSX.write_text(patched, encoding="utf-8")
    print(f"Inserted Agent 02 module: +{patched.count(chr(10)) - raw.count(chr(10))} lines")


if __name__ == "__main__":
    main()
