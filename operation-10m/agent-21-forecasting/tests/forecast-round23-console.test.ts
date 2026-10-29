import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound23Console } from '../forecast-round23-console.tsx';

test('round 23 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound23Console, { seed: 17 }));
  assert.match(html, /data-testid="ag21-round23-console"/);
  assert.match(html, /data-testid="ag21-round23-prior"/);
  assert.match(html, /data-testid="ag21-round23-projection"/);
  assert.match(html, /data-testid="ag21-round23-handoff"/);
});
