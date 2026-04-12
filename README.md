# Bike Trial Game

Browser-based 2D trials motorcycle physics prototype built with TypeScript, Vite, and HTML5 Canvas 2D. This repository is an early playable prototype focused on simulation, handling, and iteration speed rather than a finished game.

## Current Status

The project currently runs as a playable desktop-browser prototype with core riding, terrain, camera, rendering, debug overlays, and multiple bike presets in place. It is still in progress and should be treated as a physics testbed, not a content-complete or polished release.

## Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL in a modern desktop browser.

## Production Build

```bash
npm run build
```

This creates the production output in `dist`.

## Public Playable Build

`https://enginecz.github.io/bike_trial_game/`

GitHub Pages deployment happens automatically on pushes to `master` through GitHub Actions.

## Controls

Controls are still evolving. The in-game legend and debug HUD are the current source of truth for keyboard input, debug toggles, reset behavior, pause, stepping, zoom controls, and bike switching.

## Project Goal

Build a browser-based 2D trials motorcycle game inspired by the feel of technical balance and momentum riding, with readable visuals and more grounded bike dynamics.

## Notes

This project is intended to run directly in the browser without local installation for players. Local development still uses Vite, and the public GitHub Pages build is the main shared playable version for testing.
