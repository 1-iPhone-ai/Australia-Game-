import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound7Console } from '../forecast-round7-console.tsx';

test('round 7 console renders decision, telemetry, packet test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound7Console, { seed: 21 }));
  assert.match(html, /data-testid="ag21-round7-console"/);
  assert.match(html, /data-testid="ag21-round7-decision"/);
  assert.match(html, /data-testid="ag21-round7-telemetry"/);
  assert.match(html, /data-testid="ag21-round7-packet"/);
});
