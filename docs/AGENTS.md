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
- Improve observability and debugging before pursuing deeper physics tuning.

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
- When a problem is not yet clearly identified, prefer diagnostics first and fixes second.
- Preserve working behavior unless the task explicitly changes it.

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
- Debug visualization must not become the source of truth for physics behavior.
- Physics state and joint/body data are the source of truth; render and overlay must derive from them.

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
- unconstrained suspension or rotating assemblies without realistic limits unless explicitly intended for a debug rig

## Debugging and overlay rules
- Prefer adding focused debug observability when the root cause is unclear.
- Keep debug-only systems clearly separated from normal gameplay presentation.
- Overlay and debug modes must be optional and toggleable.
- Overlay legends should only appear when their corresponding overlay is active.
- Main gameplay/HUD information and debug overlay legends should remain visually separated.
- If multiple overlays exist (bike/body overlay, terrain overlay, etc.), they must be independently toggleable.
- Debug visuals must be derived from actual simulation/joint/body state, not hand-authored approximations.
- Use stable and clearly distinguishable colors for bodies, constraints, ranges, anchors, contacts, and terrain debug information.
- Avoid color collisions between different debug concepts.
- Travel ranges, anchor markers, and other debug elements tied to the bike must remain attached to the correct bike/frame reference, not world space, unless world anchoring is explicitly intended.

## Camera, zoom, and debug rendering
- Zoom behavior should be implemented for inspection when requested.
- When zooming, preserve constant on-screen thickness for debug and structural lines unless explicitly requested otherwise.
- Preserve constant on-screen size for debug markers such as pivots, endpoints, anchors, and other circular markers unless explicitly requested otherwise.
- Prefer frame/body-centered inspection behavior for bike debugging when appropriate.
- Keep debug rendering readable at all supported zoom levels.

## UI and HUD rules
- Keep UI minimalist and practical.
- The in-game HUD/legend is the source of truth for currently active controls.
- Separate gameplay controls from debug/general controls in the UI when relevant.
- Keep the main legend readable on common desktop aspect ratios.
- Do not allow long debug legend text to clip off-screen; reposition or reflow layout instead of shortening useful explanations unless explicitly requested.
- Debug overlay legends should explain colors and special debug line meanings directly and clearly.

## Test-rig and diagnostic mode rules
- Test-rig/debug inspection modes are valid tools and may be used when helpful.
- Test-rig behavior should be deterministic and designed for inspection clarity.
- When comparing front and rear suspension motion in a sweep mode, use synchronized motion unless the task explicitly requests independent or phase-shifted motion.
- Test-rig utilities must not silently alter normal gameplay behavior.

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
5. Do not modify unrelated systems without necessity.
6. Report:
   - changed files
   - what was implemented
   - how to run it
   - current limitations
   - next recommended step

If the task involves unclear behavior or a suspected mismatch between physics and rendering:
- identify whether the issue is physics, rendering, tuning, or mixed
- prefer narrow diagnostic additions before broad fixes

## Validation
Before finishing a task:
- ensure the project still runs
- prefer keeping `npm run dev` working at all times
- ensure `npm run build` works when the task is meant to be build-ready
- do not claim completion if something is untested or known broken
- state limitations explicitly
- if a change affects debug UI or overlays, confirm how to access and validate it in-game
- if a change affects GitHub Pages deployment, do not break existing deploy behavior without explicit instruction

## Deployment constraints
- The project is deployed through GitHub Pages.
- Preserve compatibility with the current Vite base path and Pages deployment unless explicitly asked to change deployment behavior.
- Do not introduce deployment steps that require manual copying of `dist` into the repository.
- Do not change branch/deployment conventions unless explicitly requested.

## Docs to keep updated
When relevant, update:
- docs/vision.md
- docs/scope-v1.md
- docs/physics-model.md
- docs/roadmap.md
- README.md when user-facing run/deploy behavior changes

Do not update documentation unnecessarily for minor internal-only changes.

## Prompt-response expectations
When responding to a task:
- be concrete
- mention tradeoffs explicitly
- do not overpromise
- do not invent features that were not requested
- ask for clarification only when truly necessary; otherwise make the best grounded implementation choice
- distinguish verified behavior from assumed behavior
- distinguish diagnostics from fixes
- distinguish current limitations from future recommendations

## Current priority
Priority order unless the prompt says otherwise:
1. runnable prototype
2. observability / debug clarity
3. stable physics foundation
4. clean modular architecture
5. tuning hooks for iteration
6. polish