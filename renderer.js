const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

function formatClock(date) {
  const twoDigits = value => String(value).padStart(2, '0');
  return {
    hours: twoDigits(date.getHours()),
    minutes: twoDigits(date.getMinutes()),
    seconds: twoDigits(date.getSeconds()),
    date: `${twoDigits(date.getDate())} / ${twoDigits(date.getMonth() + 1)} / ${date.getFullYear()} ${weekdayFormatter.format(date)}`
  };
}

function startClock(doc = document, schedule = setTimeout, now = () => new Date()) {
  const fields = Object.fromEntries(['hours', 'minutes', 'seconds', 'date'].map(id => [id, doc.getElementById(id)]));

  function tick() {
    const current = now();
    const formatted = formatClock(current);
    for (const [key, element] of Object.entries(fields)) {
      if (element.textContent !== formatted[key]) element.textContent = formatted[key];
    }
    schedule(tick, 1000 - current.getMilliseconds());
  }

  tick();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    startClock();
    document.getElementById('close').addEventListener('click', () => window.close());
  });
}

if (typeof module !== 'undefined') module.exports = { formatClock, startClock };
