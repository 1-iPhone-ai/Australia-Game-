import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound32Console } from '../forecast-round32-console.tsx';

test('round 32 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound32Console, { seed: 35 }));
  assert.match(html, /data-testid="ag21-round32-console"/);
  assert.match(html, /data-testid="ag21-round32-prior"/);
  assert.match(html, /data-testid="ag21-round32-projection"/);
  assert.match(html, /data-testid="ag21-round32-handoff"/);
});
