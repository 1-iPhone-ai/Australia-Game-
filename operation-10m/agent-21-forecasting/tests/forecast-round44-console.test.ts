import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound44Console } from '../forecast-round44-console.tsx';

test('round 44 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound44Console, { seed: 49 }));
  assert.match(html, /data-testid="ag21-round44-console"/);
  assert.match(html, /data-testid="ag21-round44-prior"/);
  assert.match(html, /data-testid="ag21-round44-projection"/);
  assert.match(html, /data-testid="ag21-round44-handoff"/);
});
