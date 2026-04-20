/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

let lastDateString = '';

window.addEventListener('DOMContentLoaded', () => {
})


function updateClock() {
  const now = new Date();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(now);
  const currentDateString = `${day} / ${month} ${year} ${weekday}`;
  
  if (currentDateString !== lastDateString) {
    document.getElementById('date').textContent = currentDateString;
    lastDateString = currentDateString;
  }
  
  const msUntilNextSecond = 1000 - now.getMilliseconds();
  setTimeout(updateClock, msUntilNextSecond);
}

// Start the clock
updateClock();
