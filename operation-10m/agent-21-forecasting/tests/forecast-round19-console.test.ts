import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound19Console } from '../forecast-round19-console.tsx';

test('round 19 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound19Console, { seed: 9 }));
  assert.match(html, /data-testid="ag21-round19-console"/);
  assert.match(html, /data-testid="ag21-round19-prior"/);
  assert.match(html, /data-testid="ag21-round19-projection"/);
  assert.match(html, /data-testid="ag21-round19-handoff"/);
});
