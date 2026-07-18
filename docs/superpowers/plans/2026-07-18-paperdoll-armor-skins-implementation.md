# Paperdoll Armor Skins Implementation Plan

Source: `docs/superpowers/specs/2026-07-18-paperdoll-armor-skins-design.md`

## Delivery Strategy

Extend the current semantic paperdoll pipeline without changing `HUMANOID_PARTS`. Keep armor records pure and testable, resolve armor into the existing material design object, and use bounded procedural painters for visual variety. Validate each layer before wiring the next.

## Task 1: Armor Catalog

- Add `src/data/armorSkins.js` with 72 immutable records.
- Author twelve records for each human/orc/elf and female/male combination.
- Balance every catalog across four `open`, four `full`, and four `eye-slit` helmets.
- Include desert, western, barbarian, and race-heritage families in every catalog.
- Give each set a stable ID, palette, motif, material, helmet style, torso pattern, arm pattern, and leg pattern.
- Export filtered lookup and safe ID-resolution helpers.
- Add `tests/armorSkins.test.js` for count, balance, uniqueness, race/gender ownership, family coverage, and safe fallback.
- Run `npm test -- --run tests/armorSkins.test.js`.

## Task 2: Unique Clothing Legwear

- Add an explicit legwear pattern to every male and female coordinated identity in `src/data/npcSkins.js`.
- Resolve legwear through `getPaperdollDesign` in `src/render/pixelTextures.js`.
- Replace the shared trouser painter with construction-specific leg painters for all coordinated looks.
- Preserve palette recoloring while keeping pattern geometry unique.
- Extend `tests/npcSkins.test.js` and `tests/paperdollDesign.test.js` to enforce distinct legwear and invariant six-part geometry.
- Run the two focused test files.

## Task 3: Armor Rendering

- Resolve the selected armor record after normal appearance customization.
- Include armor ID in all player texture cache identities.
- Add torso, sleeve, and leg armor painters driven by catalog pattern IDs.
- Add helmet painters for open, full, and eye-slit coverage.
- Ensure full and eye-slit helmets suppress customized hair and facial markings while open helmets preserve them.
- Keep nearest filtering, 16-by-16 textures, and cuboid-only geometry.
- Run paperdoll and armor tests, then `npm run build`.

## Task 4: Character Creator

- Add `armorId: 'none'` to the default character.
- Add a race/gender-filtered Armor selector with `No armor` first.
- Reset armor when race or gender changes.
- Preserve armor through customized character resolution and game entry.
- Bound `.appearance-grid` in a vertical scroll region while keeping Class and Enter the Capital reachable.
- Style scrollbars and focus states consistently with the existing creator.
- Verify desktop layout at the current viewport and a shorter desktop viewport.

## Task 5: End-To-End Verification

- Run `npm test` and require all tests to pass.
- Run `npm run build` and confirm no build errors.
- In the browser, verify female and male catalogs for all three races.
- Capture representative desert, western full-plate, barbarian, and race-heritage previews.
- Verify open face, fully covered head, and visible eye-slit behavior.
- Confirm Coordinated Look, Armor, and the Appearance region scroll correctly.
- Enter the capital with armor selected and confirm normal gameplay startup.

## Acceptance Criteria

1. The catalog contains 72 unique armor records and twelve valid options per race/gender.
2. Every race/gender has all four armor families and balanced helmet coverage.
3. Female collections are ornate and charming; male collections are forceful and martial.
4. Human, orc, and elf sets read as race-specific rather than palette swaps.
5. Full helmets hide face and hair, eye-slit helmets expose only readable eyes, and open sets preserve customization.
6. Every coordinated clothing look has distinct legwear, and every armor set has matching armored legs.
7. The creator remains usable at desktop heights with scrollable appearance controls.
8. Humanoid geometry remains exactly six shared body parts.
9. All automated tests and the production build pass.