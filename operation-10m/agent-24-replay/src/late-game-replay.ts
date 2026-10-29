import { o6kAgent24Fingerprint } from './fingerprint.ts';

export type Agent24MatchPhase = 'opening' | 'midgame' | 'endgame' | 'overtime';

export interface Agent24LateGameReplayContext {
  turn: number;
  day: number;
  maxTurns?: number;
  endgameStartTurn?: number;
  overtimeStartTurn?: number;
  victoryDeclared?: boolean;
  checkpointKinds?: string[];
}

export interface Agent24LateGameReplayAssessment {
  phase: Agent24MatchPhase;
  isLateGame: boolean;
  requiresEndgameCheckpoint: boolean;
  recommendedCheckpointKinds: string[];
  fingerprint: string;
}

const DEFAULT_ENDGAME_RATIO = 0.75;
const DEFAULT_OVERTIME_RATIO = 0.92;

export function classifyAgent24MatchPhase(ctx: Agent24LateGameReplayContext): Agent24MatchPhase {
  const maxTurns = ctx.maxTurns && ctx.maxTurns > 0 ? ctx.maxTurns : 120;
  const endTurn = ctx.endgameStartTurn ?? Math.floor(maxTurns * DEFAULT_ENDGAME_RATIO);
  const otTurn = ctx.overtimeStartTurn ?? Math.floor(maxTurns * DEFAULT_OVERTIME_RATIO);
  if (ctx.victoryDeclared) return 'overtime';
  if (ctx.turn >= otTurn || ctx.day >= otTurn) return 'overtime';
  if (ctx.turn >= endTurn || ctx.day >= endTurn) return 'endgame';
  if (ctx.turn >= Math.floor(maxTurns * 0.35)) return 'midgame';
  return 'opening';
}

export function assessAgent24LateGameReplay(ctx: Agent24LateGameReplayContext): Agent24LateGameReplayAssessment {
  const phase = classifyAgent24MatchPhase(ctx);
  const isLateGame = phase === 'endgame' || phase === 'overtime';
  const recommendedCheckpointKinds = isLateGame
    ? ['endgame_start', 'lead_change', 'major_action', 'turn', 'match_end']
    : ['turn', 'day'];
  const requiresEndgameCheckpoint =
    isLateGame && !(ctx.checkpointKinds || []).some(k => k === 'endgame_start' || k === 'match_end');

  const payload = { phase, isLateGame, requiresEndgameCheckpoint, recommendedCheckpointKinds, turn: ctx.turn };
  return {
    phase,
    isLateGame,
    requiresEndgameCheckpoint,
    recommendedCheckpointKinds,
    fingerprint: o6kAgent24Fingerprint('late_game_replay', payload),
  };
}
