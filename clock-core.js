(function (root) {
  'use strict';

  const DEFAULT_SETTINGS = Object.freeze({ hour12: false, showSeconds: true, timeZone: 'local' });

  function normalizeSettings(value) {
    const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return {
      hour12: typeof input.hour12 === 'boolean' ? input.hour12 : DEFAULT_SETTINGS.hour12,
      showSeconds: typeof input.showSeconds === 'boolean' ? input.showSeconds : DEFAULT_SETTINGS.showSeconds,
      timeZone: input.timeZone === 'UTC' ? 'UTC' : 'local'
    };
  }

  function formatClock(date, settings = DEFAULT_SETTINGS) {
    const options = normalizeSettings(settings);
    const utc = options.timeZone === 'UTC';
    const two = number => String(number).padStart(2, '0');
    const hour = utc ? date.getUTCHours() : date.getHours();
    const month = utc ? date.getUTCMonth() : date.getMonth();
    const day = utc ? date.getUTCDate() : date.getDate();
    const year = utc ? date.getUTCFullYear() : date.getFullYear();
    const weekday = new Intl.DateTimeFormat('en-US', {
      weekday: 'short', timeZone: utc ? 'UTC' : undefined
    }).format(date);
    return {
      hours: two(options.hour12 ? hour % 12 || 12 : hour),
      minutes: two(utc ? date.getUTCMinutes() : date.getMinutes()),
      seconds: two(utc ? date.getUTCSeconds() : date.getSeconds()),
      suffix: options.hour12 ? (hour < 12 ? 'AM' : 'PM') : '',
      date: `${two(day)} / ${two(month + 1)} / ${year} ${weekday}${utc ? ' · UTC' : ''}`
    };
  }

  function nextDelay(date, showSeconds) {
    const milliseconds = date.getMilliseconds();
    return showSeconds
      ? 1000 - milliseconds
      : 60000 - date.getSeconds() * 1000 - milliseconds;
  }

  const api = { DEFAULT_SETTINGS, normalizeSettings, formatClock, nextDelay };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ClockCore = api;
})(globalThis);
