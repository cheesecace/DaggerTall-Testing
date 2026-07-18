# Capes, Cloth Palettes, And Elf Ears Design

Date: 2026-07-18

## Goal

Expand character customization with authored capes and additional cloth palettes, while correcting elf ears so they always remain skin-colored outside helmets. The update must preserve strict cube-and-cuboid graphics, nearest-filtered pixel textures, existing armor behavior, and the shared humanoid body contract.

## Cape Catalog

The first cape catalog contains 24 records: four capes for each race-and-gender combination. Each record has a stable ID, display name, race, gender, four-color palette, pattern, clasp, and hem style.

- Human capes use heraldry, caravan cloth, tournament mantles, lion and solar motifs.
- Orc capes use hide, bone clasps, beetle-shell panels, salt-clan marks, and trophy trim.
- Elf capes use moon-silk, starweave, glass-thread, crescent motifs, and angular leaf-cut hems.
- Female variants use elegant hems, ribbons, jewels, petals, and brighter trim.
- Male variants use broad heraldry, heavy shoulders, trophies, crests, and severe geometry.

`none` is always valid and renders no cape. Changing race or gender resets the cape selection to `none`, preventing a cape from another identity catalog from leaking across.

## Cape Geometry And Rendering

A cape is one thin rectangular cuboid positioned behind the torso. It follows the existing paperdoll group scale and rotation but does not become a seventh canonical body part in `HUMANOID_PARTS`. This preserves geometry tests and the shared animation contract.

The cape texture is a 16-by-16 nearest-filtered procedural canvas. Pattern, clasp, hem, race motif, and gender trim visibly affect the front/back/side materials. The cape does not animate in this pass and does not receive physics or collision.

Armor and capes are independent selections. Any cape can render with any owned armor set for the same race and gender. The cape sits behind armor and must not cover the face, ears, arms, or front torso.

## Cloth Palettes

The garment palette catalog expands from 10 to 20 records. The ten new combinations add jewel tones, moon-silver, black and gold, desert pastels, crimson steel, forest teal, salt white, royal blue, orchid and brass, and jade and ivory.

All palette records receive authored names rather than numeric labels. Existing saved numeric indexes retain the same first ten palette values and therefore remain compatible. Palette selection recolors clothing and coordinated legwear while preserving outfit construction details. Armor keeps its authored armor palette and is not recolored by the cloth selector.

## Elf Ear Correction

Elf ears no longer reuse a head-side material. A dedicated skin-only ear material resolves from the customized skin color and shadow, never from hair or helmet textures. Both ear cuboids remain outside open, full, and eye-slit helmets and visibly retain skin color.

The ear material uses the existing paperdoll texture pipeline and nearest filtering. Armor coverage changes only the six head faces; it cannot recolor or suppress the separate ear cuboids.

## Character Creator

The Appearance scroll region gains a race-and-gender-filtered Cape selector with `No Cape` first. The Cloth Palette selector displays twenty authored names. Cape selection updates the live preview and is included in the player cache identity and submitted character data.

The existing bounded Appearance scroll region remains independently scrollable. Adding the selector must not make Class or Enter the Capital unreachable at a 1280-by-650 desktop viewport.

## Validation

Automated tests require:

- Exactly 24 unique cape records.
- Exactly four records for each race-and-gender combination.
- Unique names and visual combinations within every catalog.
- Ownership-safe cape resolution and a safe `none` fallback.
- Exactly 20 cloth palettes with unique names and color combinations.
- The original ten palette values preserved at indexes zero through nine.
- A dedicated elf ear material that does not resolve armor head textures.
- `HUMANOID_PARTS` remains exactly six parts.

Browser verification covers a representative female and male cape, cape plus full helmet, all twenty palette options, skin-colored ears with full and eye-slit elf helmets, Appearance scrolling at desktop and short desktop heights, and successful game entry with cape and armor selected.

## Git Update

The project is already an initialized repository on branch `main` with `origin` set to `https://github.com/cheesecace/DaggerTall-Testing.git`. The update uses `git add`, `git commit`, and `git push origin main`. It must not run `git init`, replace the remote, or recreate the branch.

## Out Of Scope

- Cape cloth simulation, wind, animation, collision, and combat effects.
- Cape statistics, inventory acquisition, or equipment restrictions.
- Dye sliders or arbitrary user-entered colors.
- Additional humanoid body geometry beyond the optional cape cuboid.