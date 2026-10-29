import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound43Console } from '../forecast-round43-console.tsx';

test('round 43 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound43Console, { seed: 48 }));
  assert.match(html, /data-testid="ag21-round43-console"/);
  assert.match(html, /data-testid="ag21-round43-prior"/);
  assert.match(html, /data-testid="ag21-round43-projection"/);
  assert.match(html, /data-testid="ag21-round43-handoff"/);
});
