# Dynamic Clock

A small, transparent desktop clock built with Electron. Drag anywhere on the clock to move it; use the × button to close it. The time follows your computer's local time zone and updates every second.

## Requirements

- Node.js 22 or later and npm
- Windows, macOS, or Linux desktop session

## Run locally

```sh
git clone https://github.com/Yili-code/Dynamic-Clock.git
cd Dynamic-Clock
npm ci
npm start
```

Run `npm test` to check the clock formatting and second-boundary updates. Run `npm run check` for syntax checks and tests.

The window is transparent, so visibility depends on your wallpaper. On Linux, transparency and dragging depend on your window manager. Close using the × button or the operating system's window shortcut.

## Project structure

- `main.js`: desktop window lifecycle and security settings
- `index.html` and `styles.css`: clock layout and appearance
- `renderer.js`: local time formatting and display updates

Licensed under CC0-1.0 (see `package.json`).
