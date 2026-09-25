# Dynamic Clock

A transparent desktop clock for Windows, macOS, and Linux, built with Electron. Drag the clock over your wallpaper, switch between local time and UTC, and choose 12-hour or 24-hour display. Preferences are saved on your device.

## Why use Dynamic Clock?

Dynamic Clock is a lightweight desktop time widget for people who want an always-visible digital clock without a full dashboard. The transparent window keeps your wallpaper visible, while local and UTC modes make it useful for remote work across time zones. No account or runtime internet connection is required.

## Features

- Live local or UTC time; 12/24-hour mode and optional seconds
- Settings saved locally between launches
- Transparent, resizable window; drag the background to move it
- Clock pauses its timer when hidden and resynchronizes when visible
- No external font or runtime network dependency

## Install and run the desktop clock

Requires Node.js 22+ and npm on a Windows, macOS, or Linux desktop.

```sh
git clone https://github.com/Yili-code/Dynamic-Clock.git
cd Dynamic-Clock
npm ci
npm start
```

Drag the clock background to move it. Select **Settings** in the lower left to change display preferences, and **×** in the upper right to close it. The settings use this app's browser storage on your computer. On Linux, transparent windows and dragging depend on the window manager.

```sh
npm test       # Unit and DOM interaction tests
npm run check  # Syntax checks and tests (also run in CI)
```

## For developers

This Electron clock is also a compact software engineering portfolio project. The source separates pure time formatting from DOM rendering and includes tests for time boundaries, settings validation, and timer lifecycle.

## Architecture

| File | Responsibility |
| --- | --- |
| `main.js` | Window lifecycle, Electron isolation and navigation restrictions |
| `clock-core.js` | Pure formatting, settings validation, scheduling calculation |
| `renderer.js` | DOM updates, visibility lifecycle and local settings storage |
| `index.html`, `styles.css` | Accessible controls and transparent presentation |
| `*.test.js` | Time edge cases and DOM behavior with injected time and timers |

The renderer runs with Node integration disabled, context isolation enabled, and sandboxing enabled. The clock needs no privileged IPC or preload API. See [engineering log](docs/engineering-log.md) for the improvement sequence, decisions, verification, and interview discussion prompts.

## Frequently asked questions

### Does the clock need an internet connection?

No. The app loads local files and uses your computer’s clock; it does not fetch a font or time service at runtime. `npm ci` needs a connection to download dependencies for the initial setup.

### Can I switch between local time and UTC?

Yes. Open **Settings** and choose **Local** or **UTC**. You can also switch between 12-hour and 24-hour time and hide seconds.

### Is there a downloadable installer?

Not yet. Clone the repository and run it with Node.js and npm using the commands above.

## Limitations and next steps

- Preferences are local to the current app profile; there is no account or sync.
- The test suite simulates the DOM and clock. Real window behavior, transparency, and keyboard navigation should also be checked manually on each target operating system.
- There is no signed installer or release pipeline yet.

Licensed under CC0-1.0 (see `package.json`).
