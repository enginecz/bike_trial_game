# Scope V1

## Objective

Deliver a first playable browser build that proves the core riding loop:

- Start the game in a desktop browser
- Control a multibody bike with keyboard input
- Ride across a simple test track
- Balance, accelerate, brake, and shift rider weight
- Reset after tipping or getting stuck

## In Scope

- Vite + TypeScript frontend project
- Canvas 2D renderer
- Fixed timestep simulation loop
- Planck.js-based physics backend
- Bike made from 6 to 8 rigid bodies
- Suspension using joints and spring-damper behavior
- Rear-wheel drive torque
- Front and rear braking
- Rider weight shift input
- One test environment with a few obstacles
- Minimal camera follow
- Minimal debug-friendly HUD or overlay

## Out Of Scope

- Audio
- Menus beyond what is required to launch the test scene
- Level editor
- Multiple bikes
- Advanced replay system
- Cosmetic customization
- Touch controls
- Gamepad support
- Save/load systems

## Acceptance Criteria

V1 is successful when a non-programmer can run the project locally, open the browser, and play a simple trials section with controls that feel consistent enough to support iteration on handling.

## Technical Constraints

- TypeScript only
- HTML5 Canvas 2D only
- No React
- No backend
- No unnecessary tooling
- Architecture must allow later replacement of the physics backend
