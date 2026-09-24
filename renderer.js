(function () {
  'use strict';

  if (typeof document === 'undefined') return;
  const { formatClock, normalizeSettings, nextDelay } = globalThis.ClockCore;
  const STORAGE_KEY = 'dynamic-clock.settings.v1';

  function readSettings(storage) {
    try {
      return normalizeSettings(JSON.parse(storage.getItem(STORAGE_KEY)));
    } catch {
      return normalizeSettings();
    }
  }

  function startClock({ doc = document, storage = localStorage, now = () => new Date(), schedule = setTimeout, cancel = clearTimeout } = {}) {
    const fields = Object.fromEntries(['hours', 'minutes', 'seconds', 'suffix', 'date'].map(id => [id, doc.getElementById(id)]));
    const controls = {
      hour12: doc.getElementById('hour12'),
      showSeconds: doc.getElementById('showSeconds'),
      timeZone: doc.getElementById('timeZone')
    };
    let settings = readSettings(storage);
    let timer;

    function render(current) {
      const formatted = formatClock(current, settings);
      for (const [key, element] of Object.entries(fields)) {
        if (element.textContent !== formatted[key]) element.textContent = formatted[key];
      }
      fields.seconds.hidden = !settings.showSeconds;
      doc.querySelector('.seconds-separator').hidden = !settings.showSeconds;
      controls.hour12.checked = settings.hour12;
      controls.showSeconds.checked = settings.showSeconds;
      controls.timeZone.value = settings.timeZone;
    }

    function tick() {
      cancel(timer);
      if (doc.hidden) return;
      const current = now();
      render(current);
      timer = schedule(tick, nextDelay(current, settings.showSeconds));
    }

    function updateSettings() {
      settings = normalizeSettings({
        hour12: controls.hour12.checked,
        showSeconds: controls.showSeconds.checked,
        timeZone: controls.timeZone.value
      });
      try { storage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* Clock still works if storage is unavailable. */ }
      tick();
    }

    for (const control of Object.values(controls)) control.addEventListener('change', updateSettings);
    doc.addEventListener('visibilitychange', tick);
    tick();
    return () => { cancel(timer); doc.removeEventListener('visibilitychange', tick); };
  }

  document.addEventListener('DOMContentLoaded', () => {
    startClock();
    document.getElementById('close').addEventListener('click', () => window.close());
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = { readSettings, startClock };
})();
