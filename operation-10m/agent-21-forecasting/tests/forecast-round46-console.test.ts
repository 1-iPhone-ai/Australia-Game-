import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound46Console } from '../forecast-round46-console.tsx';

test('round 46 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound46Console, { seed: 51 }));
  assert.match(html, /data-testid="ag21-round46-console"/);
  assert.match(html, /data-testid="ag21-round46-prior"/);
  assert.match(html, /data-testid="ag21-round46-projection"/);
  assert.match(html, /data-testid="ag21-round46-handoff"/);
});
