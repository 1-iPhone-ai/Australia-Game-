/** Agent 01 — UI / intent surfacing contract slice (no React in this module). */

export interface StrategicChoicePresentation {
  choiceId: string;
  stageId: string;
  title: string;
  summary: string;
  optionLabels: string[];
  blockedReason?: string;
  nationalPriorityHint?: string;
  delayedTradeOffPreview?: string;
}

export interface StrategicActionToast {
  id: string;
  severity: 'info' | 'warning' | 'success';
  title: string;
  body: string;
  day: number;
}

export interface UiContract {
  readonly moduleId: 'agent-01-ui';
  presentChoice(model: StrategicChoicePresentation): void;
  pushToast(toast: StrategicActionToast): void;
  setActionHudSummary(actionsUsed: number, actionsMax: number, pendingDelayed: number): void;
}
