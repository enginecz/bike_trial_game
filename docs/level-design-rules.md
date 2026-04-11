# Level Design Rules

## Spawn Alignment

All level definitions must follow this baseline convention:

- The player spawn is always at `x: 0`.
- The terrain directly under the spawn is always at `y: 0`.

This rule gives every level the same horizontal reference point, keeps terrain authoring consistent, and makes spawn-related debugging easier.

## Notes

- The spawn `y` value can still be set above ground as needed for bike placement.
- Levels may define additional `testSpawns` for debug iteration and section testing.
- Test spawns should sit approximately 3 meters above the local terrain they are meant to test.
- Keyboard mapping is reserved as follows: `1` selects the main level spawn, and `testSpawns` use numbered keys starting at `2`.
- Existing and future levels should be authored or adjusted around this origin convention.
