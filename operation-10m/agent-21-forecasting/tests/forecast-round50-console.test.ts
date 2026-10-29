import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound50Console } from '../forecast-round50-console.tsx';

test('round 50 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound50Console, { seed: 55 }));
  assert.match(html, /data-testid="ag21-round50-console"/);
  assert.match(html, /data-testid="ag21-round50-prior"/);
  assert.match(html, /data-testid="ag21-round50-projection"/);
  assert.match(html, /data-testid="ag21-round50-handoff"/);
});
