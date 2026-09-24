# Engineering log / 優化歷程

This log records the starting point, decisions, verification, and remaining work. Each stage corresponds to a Git commit, so an interviewer can inspect the code before and after.

## 0. Starting point (upstream)

The repository contained one Electron window and a renderer that displayed local time. It had no automated behavioral tests. The UI used a remote font, lacked an explicit close control and drag region, and the repository included automation and ownership files referencing the Electron organization. The README contained a Windows batch example with a placeholder path.

## 1. Stabilize the base — `fix: stabilize transparent clock and remove unrelated automation`

- Made the transparent window frameless and draggable, added a close button and responsive typography.
- Removed the font CDN, keeping runtime resources local under a restrictive content security policy.
- Corrected the year display and aligned timer updates with the next second.
- Removed unrelated organization workflow and CODEOWNERS references. Added initial tests and accurate setup instructions.
- Verification: `npm run check` passed with two tests at the time of the commit.

**Tradeoff:** A frameless window provides full transparency and a clean drag surface, but native title bar actions are unavailable. The close button and OS window shortcuts cover closing; native minimize and maximize controls are intentionally outside this small clock's scope.

## 2. Add configurable behavior — `feat: add persisted clock preferences and deterministic time tests`

- Extracted `clock-core.js` to format time, validate preferences, and calculate the next tick without reading the DOM or system clock implicitly.
- Added local/UTC, 12/24-hour and seconds preferences using browser storage. Malformed or unavailable storage falls back to defaults.
- Paused timer scheduling when the page is hidden, then refreshed immediately when visible. Cached the current `Date` for each tick so displayed time and scheduled boundary use the same instant.
- Kept Electron's renderer sandbox and disabled Node integration. Blocked new windows and navigation because the app needs only its local page.
- Added injected timer and DOM tests for midnight, UTC, invalid settings, persistence, hidden state, and next-second/minute alignment.

**Tradeoff:** Browser storage is simpler than a main-process IPC and file persistence layer for three display preferences. It is scoped to this app profile, and no Node capability is exposed to the renderer.

## 3. Documentation and CI — current commit

- Documented architecture, commands, limitations, and the evolution of the project.
- CI runs syntax checks and behavior tests on push and pull requests.

## Interview walkthrough / 面試說明

1. **Architecture:** Explain the main/renderer process boundary. Formatting and timer math live in a pure module, making edge cases testable without Electron.
2. **Correctness:** A repeated fixed 1000 ms timeout drifts relative to wall-clock second boundaries. `nextDelay` schedules based on current milliseconds; each callback reads a new `Date`. On visibility restoration the display resynchronizes immediately.
3. **Security:** Local-only assets, a restrictive CSP, sandboxed renderer, no Node integration, and navigation denial reduce the surface available to untrusted content.
4. **Reliability:** Settings are validated before use; malformed persisted JSON does not stop the clock. Storage write errors are tolerated.
5. **Evidence:** Run `npm run check`, explain what each test asserts, then manually inspect the app on the intended OS. The DOM tests do not prove native window appearance or platform behavior.

## Future improvements

- Add Electron integration and visual checks on supported desktop systems.
- If distributing the app, add versioned builds, code signing, and release automation with platform-specific verification.
- Consider system time-zone changes and system sleep in an integration test; the next tick uses a fresh clock reading and should recover, but this needs platform verification.
