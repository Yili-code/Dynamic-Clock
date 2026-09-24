const assert = require('node:assert/strict');
const test = require('node:test');
const { formatClock, normalizeSettings, nextDelay } = require('./clock-core');

test('normalizes invalid and partial settings', () => {
  assert.deepEqual(normalizeSettings({ hour12: 'yes', showSeconds: false, timeZone: 'Mars' }), {
    hour12: false, showSeconds: false, timeZone: 'local'
  });
  assert.deepEqual(normalizeSettings(null), { hour12: false, showSeconds: true, timeZone: 'local' });
});

test('formats local time across midnight with full year', () => {
  const date = new Date(2026, 11, 31, 23, 59, 59, 250);
  assert.equal(formatClock(date).date, '31 / 12 / 2026 Thu');
  assert.equal(formatClock(new Date(2027, 0, 1)).date, '01 / 01 / 2027 Fri');
  assert.equal(formatClock(date, { hour12: true }).suffix, 'PM');
  assert.equal(formatClock(new Date(2027, 0, 1), { hour12: true }).hours, '12');
});

test('formats UTC independently of the local timezone', () => {
  const result = formatClock(new Date('2027-01-01T00:05:08.000Z'), { timeZone: 'UTC', hour12: true });
  assert.deepEqual(result, {
    hours: '12', minutes: '05', seconds: '08', suffix: 'AM', date: '01 / 01 / 2027 Fri · UTC'
  });
});

test('aligns next tick with second or minute boundary', () => {
  const date = new Date('2027-01-01T00:05:08.875Z');
  assert.equal(nextDelay(date, true), 125);
  assert.equal(nextDelay(date, false), 51125);
});
