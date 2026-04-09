# Roadmap

## Phase 0: Foundation

Status: complete

- Establish Vite + TypeScript project structure
- Separate physics, rendering, gameplay, world data, and tuning modules
- Create docs for vision, scope, physics direction, and delivery plan
- Add a minimal browser runtime with fixed timestep simulation

## Phase 1: First Playable Prototype

Status: in progress

- Ship one playable desktop browser prototype
- Maintain one test level with isolated level data
- Keep the bike as a Planck.js multibody system
- Support throttle, braking, rider shift, reset, pause, and debug HUD
- Continue tuning for low-speed balance, suspension feel, and stable ground contact

Exit criteria:
- `npm run dev` starts reliably
- `npm run build` passes
- the bike can spawn, fall, recover, and traverse the test course without frequent numerical failure

## Phase 2: Physics Refinement

- Add wheel contact telemetry and clearer debug views for tuning
- Improve tire and traction modeling beyond basic friction-only contact
- Add a rider posture controller using additional bodies or constrained posture logic
- Refine suspension geometry and damping with less approximation in the fork
- Review the physics API so a future backend swap stays possible

## Phase 3: Content And Structure

- Add support for multiple handcrafted levels through `data/levels`
- Define a lightweight level-loading flow and selection model
- Separate session configuration from app startup for alternate bikes or scenarios
- Prepare clean save points in the architecture for future replay capture

## Phase 4: Presentation Layer

- Introduce lightweight UI modules without coupling them to physics
- Add optional sound hooks and event points without embedding audio logic in simulation code
- Refine camera, HUD readability, and minimalist presentation
- Add visual markers such as checkpoints, start, and finish when needed

## Phase 5: Replay And Analysis

- Record deterministic-enough input and timing data for replay experiments
- Expose playback controls in a future UI layer
- Keep replay data separate from simulation and rendering modules
- Add debug comparisons between live and replayed runs

## Phase 6: Expansion Readiness

- Review folder structure and public module boundaries before adding larger features
- Document tuning workflow for non-programmer iteration through prompts
- Identify what should become data-driven next: bikes, levels, control presets, and camera presets
- Decide whether to deepen realism in Planck.js or begin a physics-backend transition plan
