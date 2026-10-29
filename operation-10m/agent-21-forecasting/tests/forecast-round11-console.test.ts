import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound11Console } from '../forecast-round11-console.tsx';

test('round 11 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound11Console, { seed: 36 }));
  assert.match(html, /data-testid="ag21-round11-console"/);
  assert.match(html, /data-testid="ag21-round11-verification"/);
  assert.match(html, /data-testid="ag21-round11-clearance"/);
  assert.match(html, /data-testid="ag21-round11-closeout"/);
});
