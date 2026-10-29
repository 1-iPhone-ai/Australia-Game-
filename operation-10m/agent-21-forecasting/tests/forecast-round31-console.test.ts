import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound31Console } from '../forecast-round31-console.tsx';

test('round 31 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound31Console, { seed: 33 }));
  assert.match(html, /data-testid="ag21-round31-console"/);
  assert.match(html, /data-testid="ag21-round31-prior"/);
  assert.match(html, /data-testid="ag21-round31-projection"/);
  assert.match(html, /data-testid="ag21-round31-handoff"/);
});
