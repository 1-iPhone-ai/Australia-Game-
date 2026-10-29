import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound14Console } from '../forecast-round14-console.tsx';

test('round 14 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound14Console, { seed: 59 }));
  assert.match(html, /data-testid="ag21-round14-console"/);
  assert.match(html, /data-testid="ag21-round14-compliance"/);
  assert.match(html, /data-testid="ag21-round14-rollup"/);
  assert.match(html, /data-testid="ag21-round14-governance"/);
});
