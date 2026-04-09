# Vision

## Goal

Build a browser-based 2D trials motorcycle game inspired by Elastomania in spirit, but with modern minimalist presentation and more realistic bike dynamics.

The first version should feel grounded, readable, and immediately playable on desktop browsers without requiring a backend or heavy framework stack.

## Design Pillars

1. Physics first
   The bike should behave like a believable multibody machine rather than a single rigid body with scripted tricks.
2. Minimal visuals
   Graphics should stay clean and simple so gameplay readability and fast iteration remain the priority.
3. Tight control loop
   Input, simulation, and rendering should support precise balance, traction management, and weight transfer.
4. Modular architecture
   Physics, rendering, gameplay, and tuning data should remain separate so systems can evolve independently.
5. Web-native delivery
   The game should run smoothly in modern desktop browsers on Windows 10, Windows 11, and Linux.

## Player Experience Target

The player should feel like they are controlling a light but physically plausible trials motorcycle over technical terrain. Success should come from throttle discipline, brake timing, body positioning, and momentum management rather than memorizing hidden assists.

## Visual Direction

- HTML5 Canvas 2D only
- Flat colors and sparse linework
- Strong silhouette readability
- Minimal HUD in early versions
- Terrain and bike visuals designed for clarity before decoration

## Non-Goals For V1

- Career progression
- Multiplayer
- Backend services
- Mobile support
- Complex rider animation
- Photorealistic presentation
