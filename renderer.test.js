const assert = require('node:assert/strict');
const test = require('node:test');
const { formatClock, startClock } = require('./renderer');

test('formats local time, full year and weekday across midnight', () => {
  const date = new Date(2026, 11, 31, 23, 59, 59, 250);
  assert.deepEqual(formatClock(date), {
    hours: '23', minutes: '59', seconds: '59', date: '31 / 12 / 2026 Thu'
  });
  assert.equal(formatClock(new Date(2027, 0, 1, 0, 0, 0)).date, '01 / 01 / 2027 Fri');
});

test('updates elements and schedules at the next second boundary', () => {
  const elements = Object.fromEntries(['hours', 'minutes', 'seconds', 'date'].map(id => [id, { textContent: '' }]));
  let callback;
  let delay;
  let current = new Date(2026, 0, 1, 12, 34, 59, 875);
  startClock({ getElementById: id => elements[id] }, (fn, ms) => { callback = fn; delay = ms; }, () => current);
  assert.equal(elements.seconds.textContent, '59');
  assert.equal(delay, 125);
  current = new Date(2026, 0, 1, 12, 35, 0, 0);
  callback();
  assert.equal(elements.minutes.textContent, '35');
  assert.equal(elements.seconds.textContent, '00');
  assert.equal(delay, 1000);
});
