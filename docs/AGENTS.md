# AGENTS.md

## Project overview
This repository contains a browser-based 2D trials motorcycle game inspired by classic games like Elastomania in spirit, but implemented with modern minimalist graphics and more realistic physics.

Primary target:
- modern desktop web browsers
- Windows 10 / Windows 11 / Linux
- keyboard controls
- HTML5 Canvas 2D
- TypeScript
- Vite
- Planck.js for the first playable physics version

## Product goals
- Deliver a playable prototype quickly.
- Keep the codebase modular and easy to extend.
- Prioritize believable and stable bike dynamics over flashy graphics.
- Use simple minimalist visuals.
- Avoid unnecessary features and dependencies.

## Non-goals for early versions
Do not add these unless explicitly requested:
- React
- backend/server features
- online multiplayer
- account systems
- mobile support
- advanced UI frameworks
- complex visual effects
- audio systems
- level editor
- replay system
- save/load systems

## Engineering principles
- Make small, reviewable changes.
- Do not perform broad speculative refactors.
- Do not rewrite working modules without a clear reason.
- Prefer the smallest change that satisfies the task.
- Keep modules focused and well named.
- Keep the repository understandable for a non-programmer user managing development by prompts.

## Required architecture
Keep these concerns separated:
- physics/
- render/
- gameplay/
- data/

Rules:
- Physics code must not depend on rendering code.
- Rendering code must not contain hidden gameplay or physics logic.
- Gameplay rules should not be hardcoded inside rendering.
- Tunable constants must be centralized in data or tuning files, not scattered through the codebase.

## Physics requirements
The game should use a 2D multibody motorcycle model.

For v1:
- use Planck.js
- use a fixed timestep simulation loop
- model the bike as multiple rigid bodies, not as a single fake body
- include masses, inertias, joints, suspension, drive/brake torque, and rider weight shift
- prefer stable, believable behavior over overfitted hacks

Avoid:
- teleporting bodies to fake controls
- hiding physical behavior in render code
- magic constants scattered across many files
- unstable or frame-rate-dependent simulation behavior

## Code style
- Use TypeScript.
- Prefer explicit names over clever abstractions.
- Keep functions short and single-purpose where practical.
- Add comments only where they genuinely improve understanding.
- Avoid premature abstraction.
- Avoid unnecessary classes when plain modules/functions are clearer.

## Workflow rules
For each task:
1. Read the relevant docs first.
2. Inspect existing code before creating new abstractions.
3. Change only what is needed.
4. Preserve project structure.
5. Report:
   - changed files
   - what was implemented
   - how to run it
   - current limitations
   - next recommended step

## Validation
Before finishing a task:
- ensure the project still runs
- prefer keeping `npm run dev` working at all times
- ensure `npm run build` works when the task is meant to be build-ready
- do not claim completion if something is untested or known broken
- state limitations explicitly

## Docs to keep updated
When relevant, update:
- docs/vision.md
- docs/scope-v1.md
- docs/physics-model.md
- docs/roadmap.md

## Prompt-response expectations
When responding to a task:
- be concrete
- mention tradeoffs explicitly
- do not overpromise
- do not invent features that were not requested
- ask for clarification only when truly necessary; otherwise make the best grounded implementation choice

## Current priority
Priority order unless the prompt says otherwise:
1. runnable prototype
2. stable physics foundation
3. clean modular architecture
4. tuning hooks for iteration
5. polish