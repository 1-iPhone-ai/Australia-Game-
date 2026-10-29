import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound17Console } from '../forecast-round17-console.tsx';

test('round 17 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound17Console, { seed: 73 }));
  assert.match(html, /data-testid="ag21-round17-console"/);
  assert.match(html, /data-testid="ag21-round17-execution"/);
  assert.match(html, /data-testid="ag21-round17-projection"/);
  assert.match(html, /data-testid="ag21-round17-closure"/);
});
