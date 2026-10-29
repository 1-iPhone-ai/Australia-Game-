import {
  AdvanceOptions,
  EffectTraceEntry,
  IntegrityReport,
  RegisterObligationInput,
  ScheduleEventInput,
  StartConstructionInput,
  TurnClock,
  TurnPhase,
  TurnTimeSnapshot,
  TURN_PHASE_ORDER,
  deterministicEpochIso,
} from './types.js';
import { createInitialClock, enterPhaseOnce, cloneClock } from './turn-sequence.js';
import {
  obligationsDueOnTurn,
  registerObligation,
  cancelObligation,
  fireObligationOnce,
} from './scheduled-obligations.js';
import {
  enqueueScheduledEvent,
  cancelScheduledEvent,
  eventsDueForDispatch,
  dispatchScheduledEventOnce,
} from './event-scheduling-queue.js';
import {
  startConstruction,
  tickConstructionLaborOnce,
  activeConstruction,
} from './multi-turn-construction.js';
import { appendTrace, validateTurnTimeIntegrity } from './diagnostics.js';
import { deferObligationDueTurn, deferEventDueTurn } from './defer-schedule.js';
import {
  applyFollowUpsForTrigger,
  registerFollowUpRule,
  type RegisterFollowUpInput,
} from './delayed-consequences.js';
import { buildTurnTimeAuditReport, snapshotDigest, type TurnTimeAuditReport } from './turn-audit.js';
import { cancelArmedFollowUpsForTrigger, cancelArmedFollowUpsSpawnedAs } from './cancel-cascade.js';
import { slipActiveConstructionCompletion } from './construction-pause-slip.js';
import { planEffectsThroughTurn, type PlannedEffect } from './turn-horizon.js';
import { compareTurnTimeSnapshots, type SnapshotCompareReport } from './replay-compare.js';
import {
  derivePipelineStageHits,
  summarizePipelineByTurn,
  incompletePipelineTurns,
  listRegisteredPipelineStageIds,
  type Agent02PipelineStageHit,
  type Agent02PipelineTurnSummary,
  type Op10mAgent02PipelineStageId,
} from './pipeline-stages.js';
import { reconcileLastStepHorizon, type HorizonReconcileRow } from './plan-actual-reconcile.js';
import { mergeExternalDayPlan, type ExternalDayPlanMergeResult } from './external-day-plan.js';
import {
  buildAgent02TurnPipelineReport,
  computeTurnPipelineDigest,
  type Agent02TurnPipelineReport,
} from './turn-pipeline-report.js';
import {
  createInitialPauseState,
  clonePauseState,
  pauseTime,
  resumeTime,
  recordBlockedAdvance,
  isTimePaused,
} from './pause-resume.js';
import type {
  ConstructionProject,
  FollowUpRule,
  PauseDiagnosticsState,
  ScheduledEvent,
  ScheduledObligation,
} from './types.js';

export interface StepTurnResult {
  clockBefore: TurnClock;
  clockAfter: TurnClock;
  firedObligationIds: string[];
  dispatchedEventIds: string[];
  completedProjects: string[];
  traceEntries: EffectTraceEntry[];
  blockedByPause: boolean;
}

export class TurnTimeEngine {
  private clock: TurnClock;
  private obligations: ScheduledObligation[];
  private projects: ConstructionProject[];
  private events: ScheduledEvent[];
  private followUpRules: FollowUpRule[];
  private pauseState: PauseDiagnosticsState;
  private trace: EffectTraceEntry[];
  private traceConsumedThrough: number;

  constructor(snapshot?: Partial<TurnTimeSnapshot>) {
    this.clock = snapshot?.clock ? cloneClock(snapshot.clock) : createInitialClock();
    this.obligations = snapshot?.obligations ? snapshot.obligations.map((o) => ({ ...o })) : [];
    this.projects = snapshot?.projects ? snapshot.projects.map((p) => ({ ...p })) : [];
    this.events = snapshot?.events ? snapshot.events.map((e) => ({ ...e })) : [];
    this.followUpRules = snapshot?.followUpRules ? snapshot.followUpRules.map((r) => ({ ...r })) : [];
    this.pauseState = snapshot?.pause ? clonePauseState(snapshot.pause) : createInitialPauseState();
    this.trace = snapshot?.trace ? [...snapshot.trace] : [];
    this.traceConsumedThrough = this.trace.length;
  }

  static fromSnapshot(snapshot: TurnTimeSnapshot): TurnTimeEngine {
    return new TurnTimeEngine(snapshot);
  }

  snapshot(): TurnTimeSnapshot {
    return {
      clock: cloneClock(this.clock),
      obligations: this.obligations.map((o) => ({ ...o })),
      projects: this.projects.map((p) => ({ ...p })),
      events: this.events.map((e) => ({ ...e })),
      followUpRules: this.followUpRules.map((r) => ({ ...r })),
      pause: clonePauseState(this.pauseState),
      trace: [...this.trace],
    };
  }

  registerObligation(input: RegisterObligationInput): void {
    this.obligations = registerObligation(this.obligations, input);
  }

  cancelObligation(id: string): void {
    this.obligations = cancelObligation(this.obligations, id);
    this.followUpRules = cancelArmedFollowUpsForTrigger(this.followUpRules, id);
    this.followUpRules = cancelArmedFollowUpsSpawnedAs(this.followUpRules, id);
  }

  scheduleEvent(input: ScheduleEventInput): void {
    this.events = enqueueScheduledEvent(this.events, this.clock, input);
  }

  cancelEvent(id: string): void {
    this.events = cancelScheduledEvent(this.events, id);
    this.followUpRules = cancelArmedFollowUpsForTrigger(this.followUpRules, id);
    this.followUpRules = cancelArmedFollowUpsSpawnedAs(this.followUpRules, id);
  }

  cancelFollowUpsFor(triggerRefId: string): void {
    this.followUpRules = cancelArmedFollowUpsForTrigger(this.followUpRules, triggerRefId);
  }

  planThroughTurn(throughTurn: number): PlannedEffect[] {
    return planEffectsThroughTurn(this.snapshot(), throughTurn);
  }

  compareToSnapshot(other: TurnTimeSnapshot): SnapshotCompareReport {
    return compareTurnTimeSnapshots(this.snapshot(), other);
  }

  getPipelineStageHits(): Agent02PipelineStageHit[] {
    return derivePipelineStageHits(this.snapshot().trace);
  }

  getPipelineTurnSummaries(): Agent02PipelineTurnSummary[] {
    const snap = this.snapshot();
    return summarizePipelineByTurn(snap.trace, snap.clock.turnIndex);
  }

  getIncompletePipelineTurns(): number[] {
    const snap = this.snapshot();
    return incompletePipelineTurns(snap.trace, snap.clock.turnIndex);
  }

  listRegisteredPipelineStageIds(): Op10mAgent02PipelineStageId[] {
    return listRegisteredPipelineStageIds();
  }

  reconcileLastStepHorizon(before: TurnTimeSnapshot): HorizonReconcileRow {
    return reconcileLastStepHorizon(before, this.snapshot());
  }

  mergeExternalDayPlan(
    turnIndex: number,
    externalEventIds: string[],
    strict = true,
  ): ExternalDayPlanMergeResult {
    return mergeExternalDayPlan(this.snapshot(), turnIndex, externalEventIds, strict);
  }

  buildTurnPipelineReport(before?: TurnTimeSnapshot): Agent02TurnPipelineReport {
    return buildAgent02TurnPipelineReport(this.snapshot(), before);
  }

  getTurnPipelineDigest(): string {
    return computeTurnPipelineDigest(this.snapshot());
  }

  registerFollowUp(input: RegisterFollowUpInput): void {
    this.followUpRules = registerFollowUpRule(this.followUpRules, input);
  }

  deferObligation(id: string, newDueTurn: number): void {
    this.obligations = deferObligationDueTurn(this.obligations, id, newDueTurn);
  }

  deferEvent(id: string, newDueTurn: number): void {
    this.events = deferEventDueTurn(this.events, id, newDueTurn);
  }

  getAuditReport(): TurnTimeAuditReport {
    return buildTurnTimeAuditReport(this.snapshot());
  }

  getSnapshotDigest(): string {
    return snapshotDigest(this.snapshot());
  }

  startConstruction(input: StartConstructionInput): void {
    this.projects = startConstruction(this.projects, this.clock, input);
  }

  setPaused(reason: string): void {
    if (isTimePaused(this.pauseState)) return;
    const seq = this.clock.effectSequence + 1;
    const result = pauseTime(this.pauseState, this.clock, reason, seq);
    this.pauseState = result.pause;
    this.clock = { ...this.clock, effectSequence: seq };
    this.trace = appendTrace(this.trace, result.traceEntry);
  }

  clearPaused(): void {
    if (!isTimePaused(this.pauseState)) return;
    const seq = this.clock.effectSequence + 1;
    const result = resumeTime(this.pauseState, this.clock, seq);
    this.pauseState = result.pause;
    this.clock = { ...this.clock, effectSequence: seq };
    this.trace = appendTrace(this.trace, result.traceEntry);
  }

  getPauseDiagnostics(): PauseDiagnosticsState {
    return clonePauseState(this.pauseState);
  }

  validate(): IntegrityReport {
    return validateTurnTimeIntegrity(
      this.clock,
      this.obligations,
      this.projects,
      this.events,
      this.followUpRules,
    );
  }

  consumeTrace(): EffectTraceEntry[] {
    const out = this.trace.slice(this.traceConsumedThrough);
    this.traceConsumedThrough = this.trace.length;
    return out;
  }

  /**
   * Runs start → main → end for the current turn, firing due obligations and construction labor.
   */
  stepFullTurn(options: AdvanceOptions = {}): StepTurnResult {
    const clockBefore = cloneClock(this.clock);

    if (isTimePaused(this.pauseState)) {
      const seq = this.clock.effectSequence + 1;
      const blocked = recordBlockedAdvance(this.pauseState, this.clock, seq);
      this.pauseState = blocked.pause;
      this.clock = { ...this.clock, effectSequence: seq };
      this.projects = slipActiveConstructionCompletion(this.projects, 1);
      const blockedTrace = blocked.traceEntry;
      this.trace = appendTrace(this.trace, blockedTrace);
      return {
        clockBefore,
        clockAfter: cloneClock(this.clock),
        firedObligationIds: [],
        dispatchedEventIds: [],
        completedProjects: [],
        traceEntries: [blockedTrace],
        blockedByPause: true,
      };
    }

    const firedObligationIds: string[] = [];
    const dispatchedEventIds: string[] = [];
    const completedProjects: string[] = [];
    const traceEntries: EffectTraceEntry[] = [];
    const scope = options.scope ?? 'global';
    const phases = options.phases ?? [...TURN_PHASE_ORDER];
    const advanceDay = options.advanceDayOnEnd ?? true;

    for (const phase of phases) {
      const enter = enterPhaseOnce(this.clock, phase, scope, 'turn_engine');
      this.clock = enter.clock;
      if (!enter.entered) continue;

      const phaseTrace = {
        sequence: enter.sequence,
        turnIndex: clockBefore.turnIndex,
        dayIndex: clockBefore.dayIndex,
        phase,
        kind: 'phase_enter' as const,
        detail: enter.token,
      };
      this.trace = appendTrace(this.trace, phaseTrace);
      traceEntries.push(phaseTrace);

      if (phase === 'main') {
        this.runDueObligations(clockBefore, phase, firedObligationIds, traceEntries);
      }

      this.runDueEvents(clockBefore, phase, dispatchedEventIds, traceEntries);

      if (phase === 'end') {
        this.runConstructionLabor(clockBefore, phase, completedProjects, traceEntries);
        const nextTurn = clockBefore.turnIndex + 1;
        const nextDay = advanceDay ? clockBefore.dayIndex + 1 : clockBefore.dayIndex;
        this.clock = {
          ...this.clock,
          turnIndex: nextTurn,
          dayIndex: nextDay,
          phase: 'start',
          epochIso: deterministicEpochIso(nextTurn),
        };
      }
    }

    return {
      clockBefore,
      clockAfter: cloneClock(this.clock),
      firedObligationIds,
      dispatchedEventIds,
      completedProjects,
      traceEntries,
      blockedByPause: false,
    };
  }

  advance(options: AdvanceOptions = {}): StepTurnResult {
    return this.stepFullTurn(options);
  }

  private runDueObligations(
    turnView: TurnClock,
    phase: TurnPhase,
    firedObligationIds: string[],
    traceEntries: EffectTraceEntry[],
  ): void {
    const due = obligationsDueOnTurn(this.obligations, turnView);
    for (const obligation of due) {
      const seq = this.clock.effectSequence + 1;
      const fired = fireObligationOnce(this.obligations, obligation.id, turnView, seq);
      this.obligations = fired.obligations;
      if (!fired.fired) continue;
      this.clock = { ...this.clock, effectSequence: seq };
      firedObligationIds.push(obligation.id);
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: 'obligation_fired' as const,
        refId: obligation.id,
        detail: obligation.kind,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
      this.processFollowUps('obligation_fired', obligation.id, turnView, phase, traceEntries);
    }
  }

  private processFollowUps(
    trigger: 'obligation_fired' | 'event_dispatched',
    triggerRefId: string,
    turnView: TurnClock,
    phase: TurnPhase,
    traceEntries: EffectTraceEntry[],
  ): void {
    const applied = applyFollowUpsForTrigger(
      this.followUpRules,
      this.obligations,
      this.events,
      turnView,
      trigger,
      triggerRefId,
    );
    this.followUpRules = applied.rules;
    this.obligations = applied.obligations;
    this.events = applied.events;
    for (const spawnId of applied.scheduledIds) {
      const seq = this.clock.effectSequence + 1;
      this.clock = { ...this.clock, effectSequence: seq };
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: 'follow_up_scheduled' as const,
        refId: spawnId,
        detail: triggerRefId,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
    }
  }

  private runDueEvents(
    turnView: TurnClock,
    phase: TurnPhase,
    dispatchedEventIds: string[],
    traceEntries: EffectTraceEntry[],
  ): void {
    const due = eventsDueForDispatch(this.events, turnView, phase);
    for (const event of due) {
      const seq = this.clock.effectSequence + 1;
      const result = dispatchScheduledEventOnce(this.events, event.id, turnView, seq);
      this.events = result.events;
      if (!result.dispatched) continue;
      this.clock = { ...this.clock, effectSequence: seq };
      dispatchedEventIds.push(event.id);
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: 'event_dispatched' as const,
        refId: event.id,
        detail: event.kind,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
      this.processFollowUps('event_dispatched', event.id, turnView, phase, traceEntries);
    }
  }

  private runConstructionLabor(
    turnView: TurnClock,
    phase: TurnPhase,
    completedProjects: string[],
    traceEntries: EffectTraceEntry[],
  ): void {
    for (const project of activeConstruction(this.projects)) {
      const seq = this.clock.effectSequence + 1;
      const tick = tickConstructionLaborOnce(this.projects, project.id, turnView, seq);
      this.projects = tick.projects;
      if (!tick.project || tick.project.lastLaborSequence !== seq) continue;
      this.clock = { ...this.clock, effectSequence: seq };
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: tick.completed ? ('construction_completed' as const) : ('construction_labor' as const),
        refId: project.id,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
      if (tick.completed) completedProjects.push(project.id);
    }
  }
}
