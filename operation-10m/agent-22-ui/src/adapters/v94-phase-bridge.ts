export type V94StandardizedGamePhase =
  | 'main_menu'
  | 'setup'
  | 'human_turn'
  | 'ai_turn'
  | 'approval_waiting'
  | 'paused'
  | 'save_load'
  | 'replay'
  | 'post_match';

/** Standalone phase resolver aligned with V9.4 resolveCurrentGamePhase (simplified). */
export function resolveV94GamePhase(input: {
  gameState?: { gameStarted?: boolean; gameMode?: string; isAiTurn?: boolean; isPaused?: boolean; isGameOver?: boolean; currentActorId?: string };
  uiState?: {
    showStartScreen?: boolean;
    showCampaignSelect?: boolean;
    showSaveLoadModal?: boolean;
    showReplayViewer?: boolean;
    isApprovalWaiting?: boolean;
    isPaused?: boolean;
    showEndGameModal?: boolean;
  };
  activeBlockingModal?: string | null;
}): V94StandardizedGamePhase {
  const { gameState, uiState } = input;
  const modal = input.activeBlockingModal ?? null;
  if (uiState?.showStartScreen || gameState?.gameMode === 'start_screen' || gameState?.gameMode === 'menu' || gameState?.gameStarted === false) {
    return uiState?.showCampaignSelect ? 'setup' : 'main_menu';
  }
  if (modal === 'save_load_modal' || uiState?.showSaveLoadModal) return 'save_load';
  if (modal === 'replay_viewer' || uiState?.showReplayViewer) return 'replay';
  if (modal === 'approval_dialog' || uiState?.isApprovalWaiting) return 'approval_waiting';
  if (uiState?.isPaused || gameState?.isPaused) return 'paused';
  if (gameState?.isGameOver || uiState?.showEndGameModal) return 'post_match';
  if (gameState?.isAiTurn || gameState?.currentActorId?.startsWith('ai_')) return 'ai_turn';
  return 'human_turn';
}

export function shouldShowEvolvingRailForPhase(phase: V94StandardizedGamePhase): boolean {
  return phase === 'human_turn' || phase === 'paused' || phase === 'approval_waiting';
}
