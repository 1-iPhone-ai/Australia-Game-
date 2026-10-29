import React, { useEffect, useState } from 'react';
import { createLiveRegionController } from '../a11y/live-region-controller.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface AccessibilityAnnouncerProps {
  settings: AccessibilitySettingsSnapshot;
  message?: string | null;
  politeness?: 'polite' | 'assertive';
}

export function AccessibilityAnnouncer({
  settings,
  message,
  politeness = 'polite',
}: AccessibilityAnnouncerProps): React.ReactElement | null {
  const [liveText, setLiveText] = useState('');
  const controller = createLiveRegionController(settings);

  useEffect(() => {
    if (!message) return;
    const msg = controller.announce(message, politeness);
    if (msg) setLiveText(msg.text);
  }, [message, politeness, settings]);

  if (!settings.screenReaderAnnouncements || settings.announceVerbosity === 'off') {
    return null;
  }

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      data-testid="accessibility-announcer"
    >
      {liveText}
    </div>
  );
}
