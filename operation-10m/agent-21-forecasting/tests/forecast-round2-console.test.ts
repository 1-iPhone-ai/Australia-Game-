import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Ag21ForecastRound2Console } from '../forecast-round2-console.tsx';

test('round 2 console renders sensitivity, matrix, audit test ids', () => {
  const html = renderToStaticMarkup(React.createElement(Ag21ForecastRound2Console, { seed: 9 }));
  assert.match(html, /data-testid="ag21-round2-console"/);
  assert.match(html, /data-testid="ag21-round2-sensitivity"/);
  assert.match(html, /data-testid="ag21-round2-matrix"/);
  assert.match(html, /data-testid="ag21-round2-audit"/);
});
