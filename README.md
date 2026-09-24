# Dynamic Clock

A transparent, draggable desktop clock built with Electron. The project demonstrates a small but complete desktop application: isolated renderer logic, persisted preferences, security boundaries, deterministic tests, and CI.

## Features

- Live local or UTC time; 12/24-hour mode and optional seconds
- Settings saved locally between launches
- Transparent, resizable window; drag the background to move it
- Clock pauses its timer when hidden and resynchronizes when visible
- No external font or runtime network dependency

## Getting started

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

## Architecture

| File | Responsibility |
| --- | --- |
| `main.js` | Window lifecycle, Electron isolation and navigation restrictions |
| `clock-core.js` | Pure formatting, settings validation, scheduling calculation |
| `renderer.js` | DOM updates, visibility lifecycle and local settings storage |
| `index.html`, `styles.css` | Accessible controls and transparent presentation |
| `*.test.js` | Time edge cases and DOM behavior with injected time and timers |

The renderer runs with Node integration disabled, context isolation enabled, and sandboxing enabled. The clock needs no privileged IPC or preload API. See [engineering log](docs/engineering-log.md) for the improvement sequence, decisions, verification, and interview discussion prompts.

## Limitations and next steps

- Preferences are local to the current app profile; there is no account or sync.
- The test suite simulates the DOM and clock. Real window behavior, transparency, and keyboard navigation should also be checked manually on each target operating system.
- There is no signed installer or release pipeline yet.

Licensed under CC0-1.0 (see `package.json`).
