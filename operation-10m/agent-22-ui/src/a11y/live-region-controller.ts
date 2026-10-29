import type { AccessibilitySettingsSnapshot, LiveRegionMessage, ScreenReaderAnnounceVerbosity } from '../types/accessibility.js';

export class LiveRegionController {
  private messages: LiveRegionMessage[] = [];
  private seq = 0;

  constructor(private verbosity: ScreenReaderAnnounceVerbosity = 'polite') {}

  setVerbosity(v: ScreenReaderAnnounceVerbosity): void {
    this.verbosity = v;
  }

  announce(text: string, politeness: 'polite' | 'assertive' = 'polite'): LiveRegionMessage | null {
    if (this.verbosity === 'off') return null;
    if (this.verbosity === 'minimal' && politeness !== 'assertive') return null;
    const msg: LiveRegionMessage = {
      id: `lr-${++this.seq}`,
      text,
      politeness,
      createdAt: Date.now(),
    };
    this.messages.push(msg);
    if (this.messages.length > 20) this.messages.shift();
    return msg;
  }

  flush(): LiveRegionMessage[] {
    const out = [...this.messages];
    this.messages = [];
    return out;
  }

  peekLatest(): LiveRegionMessage | undefined {
    return this.messages[this.messages.length - 1];
  }
}

export function createLiveRegionController(settings: AccessibilitySettingsSnapshot): LiveRegionController {
  const v = settings.screenReaderAnnouncements ? settings.announceVerbosity : 'off';
  return new LiveRegionController(v);
}

export function formatPanelUnlockAnnouncement(panelLabel: string, unlockHint: string): string {
  return `${panelLabel} unlocked. ${unlockHint}`;
}
