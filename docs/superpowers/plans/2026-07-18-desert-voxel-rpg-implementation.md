# Scorchlands Voxel RPG Implementation Plan

Source: `docs/superpowers/specs/2026-07-18-desert-voxel-rpg-design.md`

## Delivery Strategy

Build in playable milestones. Every milestone ends with a browser smoke test, focused automated tests, and a production build. New content is data-driven after the core cell and simulation boundaries stabilize.

## Milestone 1: Capital Gate Vertical Slice

- [ ] Scaffold a Vite JavaScript project with Three.js, Rapier, Vitest, and seeded-noise dependencies.
- [ ] Establish application, renderer, input, game-state, and UI boundaries.
- [ ] Build the character creator for name, human/orc/elf race, appearance texture, and class.
- [ ] Generate runtime nearest-neighbor pixel textures for Minecraft-shaped humanoids.
- [ ] Implement first-person pointer-lock movement, gravity, grounded collision, sprinting, and interaction raycasts.
- [ ] Implement `CellManager` with deterministic IDs, spawn anchors, portal links, unload, and snapshot lifecycle.
- [ ] Build a handcrafted capital-gate exterior cell from cubes and cuboids.
- [ ] Build a separate inn interior cell and a two-way door transition.
- [ ] Add HUD, interaction prompt, cell title, clock, crosshair, and pause behavior.
- [ ] Verify character creation to capital spawn, movement, collision, and repeated exterior/interior transitions.

## Milestone 2: Grounded Capital Generation

- [ ] Implement stepped terrain sampling and deterministic exterior-cell generation.
- [ ] Implement road graphs, plazas, districts, lots, terraces, and clearance reservations.
- [ ] Add grounded building foundations and road-facing entrances.
- [ ] Generate city walls, gates, towers, market stalls, houses, guild hall, temple, palace keep, and outer farms.
- [ ] Add validation for border agreement, grounded placement, overlap, road connectivity, and reachable doors.
- [ ] Stream neighboring exterior cells around the player.

## Milestone 3: Citizens And Dialogue

- [ ] Define persistent NPC, household, workplace, schedule, need, relationship, knowledge, and economy schemas.
- [ ] Add loaded physical NPC navigation and unloaded timestamped schedule simulation.
- [ ] Add jobs, wages, rent, hunger, food purchasing, sleep, work, socializing, and happiness.
- [ ] Add deterministic paperdoll appearance generation and basic cuboid locomotion.
- [ ] Build topic-based dynamic dialogue from personality, knowledge, needs, events, and relationship.
- [ ] Add rumor propagation, directions, employment, local news, and conversation consequences.

## Milestone 4: Quests, Journal, And Map

- [ ] Define quest-pack data for giver, motive, objective, target, location, complication, reward, consequence, and failure.
- [ ] Generate and validate deliver, investigate, recover, hunt, escort, and clear quests.
- [ ] Add journal tracking, objective state, compass markers, world markers, and map markers.
- [ ] Add the regional map with known locations, roads, filters, search, faction borders, and armies.
- [ ] Add Daggerfall-style fast travel with time, food, danger, restrictions, and safe arrival anchors.
- [ ] Add the adventurers' guild, ranks, themed quest packs, and a first quest line.

## Milestone 5: Combat, Equipment, And Dungeons

- [ ] Add health, stamina, magicka, experience, skills, and class starting abilities.
- [ ] Add melee, shield, bow, and spell combat with cuboid feedback effects.
- [ ] Add inventory, loot, paperdoll equipment slots, armor, weapons, consumables, and trinkets.
- [ ] Build procedural interior-cell room graphs for caves, crypts, fortresses, and labyrinths.
- [ ] Add locks, keys, traps, containers, encounter rooms, persistence, and completion state.
- [ ] Add skeleton, minotaur, lich, hostile wizard, and dragon combat behaviors.

## Milestone 6: Region And Conquest

- [ ] Add the mining town, oasis village, frontier fortress, wizard tower chain, and wilderness landmarks.
- [ ] Add wildlife, caravans, patrols, ruins, dragon territories, and procedural encounters.
- [ ] Define three factions with wealth, food, manpower, leaders, diplomacy, claims, armies, and campaigns.
- [ ] Simulate recruitment, patrols, raids, sieges, relief armies, distant battles, and territorial transfer.
- [ ] Instantiate representative nearby battles and expose player participation and faction advancement.

## Milestone 7: Persistence, Balance, And Release

- [ ] Persist world seed, player, cell deltas, portals, quests, NPCs, economy, and factions in IndexedDB.
- [ ] Add schema migrations, rotating snapshots, corruption handling, and safe-anchor recovery.
- [ ] Add settings, key rebinding, sensitivity, volume, render distance, accessibility, and save slots.
- [ ] Profile cell streaming, instancing, collision, NPC updates, and strategic simulation.
- [ ] Complete the end-to-end playtest route and produce a deployable production build.

## Initial Module Boundaries

- `src/core`: game loop, state machine, events, deterministic random streams, simulation clock.
- `src/world`: cells, portals, exterior generation, interior templates, settlement generation, validation.
- `src/render`: Three.js scene, voxel materials, cuboid factories, lighting, camera, effects.
- `src/player`: input, movement, interaction, character data, inventory, combat.
- `src/sim`: NPC, household, economy, faction, strategic travel, event simulation.
- `src/quests`: quest packs, assembly, validation, objectives, markers, journal.
- `src/data`: races, classes, appearances, items, spells, creatures, buildings, factions, dialogue.
- `src/ui`: character creator, HUD, dialogue, inventory, journal, map, menus.
- `src/save`: IndexedDB persistence, snapshots, schemas, migrations.
- `tests`: deterministic unit tests and generation invariants.

## First Milestone Acceptance Criteria

1. Opening the game shows a complete character creator rather than a marketing page.
2. Human, orc, and elf choices visibly change the cuboid paperdoll texture.
3. Starting the game spawns the chosen character at the capital gate.
4. The player can walk, sprint, look, collide with walls and buildings, and cannot fall through the ground.
5. Capital structures, roads, walls, market, and gate are cube/cuboid geometry with nearest-filtered pixel textures.
6. A road-facing inn door enters a separately loaded interior cell.
7. The interior exit returns to the correct exterior spawn anchor without duplicate or floating geometry.
8. The HUD clearly identifies current cell, time, controls, and interaction target.
9. Automated cell-link tests and the production build pass.