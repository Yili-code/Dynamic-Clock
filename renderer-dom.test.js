const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('./clock-core');

function fixture(savedSettings = null) {
  const elements = {};
  const listeners = {};
  for (const id of ['hours', 'minutes', 'seconds', 'suffix', 'date', 'hour12', 'showSeconds', 'timeZone', 'close']) {
    elements[id] = { textContent: '', checked: false, value: 'local', hidden: false, addEventListener(event, callback) { this[event] = callback; } };
  }
  const separator = { hidden: false };
  const doc = {
    hidden: false,
    getElementById: id => elements[id],
    querySelector: () => separator,
    addEventListener(event, callback) { listeners[event] = callback; },
    removeEventListener(event) { delete listeners[event]; }
  };
  const storage = {
    saved: savedSettings,
    getItem() { return this.saved; },
    setItem(_key, value) { this.saved = value; }
  };
  let scheduled;
  let cancelled;
  let current = new Date('2027-01-01T00:05:08.875Z');
  const context = { document: doc, ClockCore: core, module: { exports: {} } };
  vm.runInNewContext(fs.readFileSync(require.resolve('./renderer'), 'utf8'), context);
  const stop = context.module.exports.startClock({ doc, storage, now: () => current, schedule: (fn, delay) => { scheduled = { fn, delay }; return 42; }, cancel: id => { cancelled = id; } });
  return { elements, separator, doc, storage, listeners, stop, get scheduled() { return scheduled; }, get cancelled() { return cancelled; }, setCurrent(value) { current = value; } };
}

test('invalid saved settings recover and changes persist', () => {
  const view = fixture('{invalid');
  assert.equal(view.elements.seconds.hidden, false);
  assert.equal(view.scheduled.delay, 125);
  view.elements.showSeconds.checked = false;
  view.elements.timeZone.value = 'UTC';
  view.elements.showSeconds.change();
  assert.equal(view.elements.seconds.hidden, true);
  assert.equal(view.separator.hidden, true);
  assert.equal(view.scheduled.delay, 51125);
  assert.deepEqual(JSON.parse(view.storage.saved), { hour12: false, showSeconds: false, timeZone: 'UTC' });
  view.stop();
  assert.equal(view.cancelled, 42);
});

test('hidden clock pauses and resumes with fresh time', () => {
  const view = fixture();
  view.doc.hidden = true;
  view.listeners.visibilitychange();
  assert.equal(view.cancelled, 42);
  view.setCurrent(new Date('2027-01-01T00:05:10.000Z'));
  view.doc.hidden = false;
  view.listeners.visibilitychange();
  assert.equal(view.elements.seconds.textContent, '10');
  assert.equal(view.scheduled.delay, 1000);
});
