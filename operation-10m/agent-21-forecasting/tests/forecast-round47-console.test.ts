import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound47Console } from '../forecast-round47-console.tsx';

test('round 47 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound47Console, { seed: 52 }));
  assert.match(html, /data-testid="ag21-round47-console"/);
  assert.match(html, /data-testid="ag21-round47-prior"/);
  assert.match(html, /data-testid="ag21-round47-projection"/);
  assert.match(html, /data-testid="ag21-round47-handoff"/);
});
