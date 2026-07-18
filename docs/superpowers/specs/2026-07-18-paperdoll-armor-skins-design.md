# Paperdoll Armor Skins Design

Date: 2026-07-18

## Goal

Add a substantial armor collection to character creation and the shared humanoid paperdoll system. Armor must remain strict pixel art on the existing cube-and-cuboid body geometry. Human, orc, and elf characters receive separate female and male collections whose silhouettes, materials, motifs, faces, and helmets express race and gender without changing body proportions.

## Catalog Scope

The first armor pass contains 36 authored sets: six sets for each race-and-gender combination.

Each combination receives:

- Two open-head sets that preserve the selected face, marking, hair, or headwear.
- Two full-head sets that replace the visible face and hair with a closed helmet front.
- Two eye-slit sets that cover the head while exposing narrow, readable eyes.

Female sets favor elegant, charming shapes through crowns, ribbons, gems, bright trim, floral geometry, and graceful armor patterns. Male sets favor imposing shapes through crests, horns, heavy brows, severe plating, and bold heraldry. Both remain practical armor rather than sexualized body shapes.

## Race Identity

- Human armor uses caravan steel, sun-brass, dyed cloth, civic heraldry, lion and tower motifs, and polished tournament details.
- Orc armor uses dark iron, bone, salt leather, tusk and beetle motifs, layered clan plates, and rugged trophy details.
- Elf armor uses moon-silver, glassy teal, star and crescent motifs, fine lamellar, angular masks, and luminous trim.

Race identity comes from authored names, palettes, motifs, armor patterns, and helmet treatments. Sets are not recolors of a shared generic list.

## Data Model

Armor data lives in a dedicated catalog module. Each immutable armor record contains:

- Stable `id`, display `name`, `race`, and `gender`.
- `helmetCoverage`: `open`, `full`, or `eye-slit`.
- Four-color armor palette.
- Race-specific motif and material identifiers.
- Torso, arm, and leg pattern identifiers.
- Helmet style identifier.

The catalog exports lookup helpers for a race and gender, plus a resolver for a selected armor ID. `none` is a valid player selection and leaves the current clothing paperdoll unchanged.

## Rendering

Armor is resolved after the selected appearance preset and independent customization controls. When armor is selected:

- Torso, arm, and leg textures use the armor palette and authored armor painters.
- Open helmets preserve the customized face, facial detail, and hair/headwear.
- Full helmets paint an opaque armored front and suppress face, marking, and hair pixels.
- Eye-slit helmets paint an opaque armored front with a narrow dark opening and the character's eye color inside it.
- Side, top, and back head faces receive matching helmet materials for covered helmets.
- Skin remains visible only where the armor record explicitly permits it.

Texture cache keys include the armor ID so live creator changes cannot reuse stale materials. Unknown armor IDs fall back to `none` rather than producing a broken paperdoll.

## Character Creator

The Appearance section gains an Armor selector. Its first option is `No armor`; remaining options show the six sets matching the selected race and gender. Changing race or gender resets armor to `none`, preventing an invalid cross-race selection. Changing armor updates the live preview without changing class, complexion, face, hair, clothing choices, or shared body geometry.

## NPC Compatibility

The catalog is reusable by NPC profiles and future equipment systems, but this pass does not randomly equip the existing capital crowd. That avoids silently replacing their authored clothing identities before inventory and equipment simulation exists.

## Validation

Automated tests require:

- Exactly 36 armor records.
- Exactly six records for every race-and-gender combination.
- Exactly two `open`, two `full`, and two `eye-slit` records in every combination.
- Unique IDs and unique coordinated visual records.
- Race-specific catalog names, motifs, and palettes.
- Female and male collections that are independently authored.
- Armor selection that does not alter the six-part humanoid geometry.

Browser verification covers switching race, gender, open armor, full armor, and eye-slit armor; confirming each preview visibly changes; confirming covered helmets hide hair and markings; and entering the capital successfully with armor selected.

## Out Of Scope

- Armor statistics, durability, loot, inventory slots, and combat mitigation.
- Additional mesh pieces or changes to humanoid proportions.
- Random NPC equipment assignment.
- Armor dye controls beyond the authored set palettes.