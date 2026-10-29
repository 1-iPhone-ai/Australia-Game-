import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound15Console } from '../forecast-round15-console.tsx';

test('round 15 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound15Console, { seed: 61 }));
  assert.match(html, /data-testid="ag21-round15-console"/);
  assert.match(html, /data-testid="ag21-round15-remediation"/);
  assert.match(html, /data-testid="ag21-round15-origin"/);
  assert.match(html, /data-testid="ag21-round15-continuity"/);
});
