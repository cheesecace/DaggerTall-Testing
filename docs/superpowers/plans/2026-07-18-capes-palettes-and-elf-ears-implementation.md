# Capes, Palettes, And Elf Ears Implementation Plan

Source: `docs/superpowers/specs/2026-07-18-capes-palettes-and-elf-ears-design.md`

## Task 1: Cosmetic Data

- Add `src/data/capeSkins.js` with 24 immutable race/gender-owned cape records.
- Export filtered catalog and safe resolver helpers.
- Expand garment palettes from 10 to 20 while preserving the first ten color arrays.
- Give every palette an authored display name.
- Add focused tests for cape totals, ownership, uniqueness, and palette compatibility.
- Run the focused data tests.

## Task 2: Paperdoll Rendering

- Add procedural 16-by-16 cape texture painters for race motif, pattern, clasp, and hem.
- Attach an optional thin cape cuboid behind the torso without changing `HUMANOID_PARTS`.
- Add a dedicated skin-only ear material helper.
- Render elf ears with that helper instead of a head-side material.
- Include cape ID in player material cache identity.
- Add renderer tests for cape resolution, ear skin colors, and invariant body geometry.
- Run focused renderer tests and a production build.

## Task 3: Character Creator

- Add `capeId: 'none'` to the default character.
- Add a race/gender-filtered Cape selector to Appearance.
- Reset cape on race or gender change.
- Display twenty authored palette names.
- Preserve cape selection through preview and game submission.
- Keep the Appearance and creator panel scroll behavior usable at 1280-by-650.

## Task 4: Verification And Git Update

- Run `npm test` and `npm run build`.
- Verify female and male capes, cape plus full armor, and palette switching in the browser.
- Verify elf ears remain skin-colored with full and eye-slit helmets.
- Verify short-height scrolling and game entry.
- Review staged files with `git diff --cached --check` and `git diff --cached --stat`.
- Commit with a focused feature message.
- Push the existing `main` branch using `git push origin main`.
- Confirm local `HEAD` equals `origin/main` and the worktree is clean.