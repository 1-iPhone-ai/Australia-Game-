import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound13Console } from '../forecast-round13-console.tsx';

test('round 13 console SSR markers', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound13Console, { seed: 53 }));
  assert.match(html, /data-testid="ag21-round13-console"/);
  assert.match(html, /data-testid="ag21-round13-confirmation"/);
  assert.match(html, /data-testid="ag21-round13-audit"/);
  assert.match(html, /data-testid="ag21-round13-retention"/);
});
