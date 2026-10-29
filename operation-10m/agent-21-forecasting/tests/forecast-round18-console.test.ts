import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound18Console } from '../forecast-round18-console.tsx';

test('round 18 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound18Console, { seed: 7 }));
  assert.match(html, /data-testid="ag21-round18-console"/);
  assert.match(html, /data-testid="ag21-round18-execution"/);
  assert.match(html, /data-testid="ag21-round18-projection"/);
  assert.match(html, /data-testid="ag21-round18-handoff"/);
});
