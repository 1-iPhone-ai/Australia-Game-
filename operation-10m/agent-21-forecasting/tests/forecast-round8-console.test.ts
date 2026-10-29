import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound8Console } from '../forecast-round8-console.tsx';

test('round 8 console renders validation, escalation, replay test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound8Console, { seed: 22 }));
  assert.match(html, /data-testid="ag21-round8-console"/);
  assert.match(html, /data-testid="ag21-round8-validation"/);
  assert.match(html, /data-testid="ag21-round8-escalation"/);
  assert.match(html, /data-testid="ag21-round8-replay"/);
});
