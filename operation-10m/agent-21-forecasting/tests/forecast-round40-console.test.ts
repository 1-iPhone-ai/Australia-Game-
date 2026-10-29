import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound40Console } from '../forecast-round40-console.tsx';

test('round 40 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound40Console, { seed: 45 }));
  assert.match(html, /data-testid="ag21-round40-console"/);
  assert.match(html, /data-testid="ag21-round40-prior"/);
  assert.match(html, /data-testid="ag21-round40-projection"/);
  assert.match(html, /data-testid="ag21-round40-handoff"/);
});
