# Scorchlands Voxel RPG Design

Date: 2026-07-18

## Product Goal

Build a playable browser-based open-world life-simulation RPG set in a scorching desert. The first release is a broad vertical slice: one capital, satellite settlements, wilderness, a dungeon family, simulated citizens, modular quests, character progression, and a three-faction territorial war. The architecture must support expansion through data packs rather than rewrites.

## Technology

- Vite hosts an ES-module JavaScript application.
- Three.js renders the 3D world.
- Rapier provides player, creature, and world collision.
- Seeded noise and deterministic random streams generate repeatable terrain and content.
- CSS supplies menus, HUD panels, maps, dialogue, inventory, and character creation.
- IndexedDB stores world seeds and simulation deltas.

The project uses generated pixel-art textures and procedural cuboid geometry. No rounded or smooth mesh geometry appears in the world.

## Visual Rules

- Every world object is assembled exclusively from cubes and rectangular cuboids.
- Terrain uses stepped voxel elevations with no smooth slopes.
- Humanoids share one Minecraft-like cuboid rig and body proportions.
- Human, orc, elf, face, skin, hair, clothing, armor, and faction variations come from layered pixel-art texture atlases.
- Wildlife and monsters follow the same cuboid construction rule.
- Pixel textures use nearest-neighbor filtering and fixed texel density.
- A hot ochre desert palette is balanced with turquoise cloth, painted plaster, green oasis vegetation, pale limestone, and faction colors.

## World And Cell Architecture

The world is divided into deterministic cells. A cell owns its geometry, actors, interactables, navigation data, ambient state, and simulation snapshot.

### Exterior Cells

- The overworld is a grid of streamed exterior cells generated from the world seed and cell coordinates.
- Authored key areas reserve footprints in the procedural grid: the capital, towns, castles, guild halls, wizard towers, fortresses, caves, crypt entrances, and quest landmarks.
- Neighboring cells agree on border height, road exits, watercourses, and biome features.
- Only cells near the player render at full detail. Distant cells continue through a cheaper strategic simulation.
- Fast travel advances simulation time along a route and resolves food use, danger, weather, NPC schedules, patrols, and faction encounters.

### Interior Cells

- Entering a building doorway transitions into a separate interior cell, following classic RPG cell design.
- Houses, shops, inns, guild halls, castles, towers, caves, crypts, fortresses, and labyrinths each use interior cell templates and seeded room variations.
- An interior cell can be spatially larger than its exterior shell without affecting the overworld layout.
- Doors and portals store two-way links between cell IDs and named spawn anchors.
- Interior state persists independently: occupants, ownership, containers, stolen items, locks, damage, quest state, and cleared encounters.
- Windows use staged exterior views or cuboid skyline proxies instead of rendering the full overworld.
- Multi-floor structures use linked floor cells when a single interior becomes too large.
- NPCs crossing an unloaded doorway become abstract travel records and materialize in the destination cell when needed.

### Placement Guarantees

- Terrain is sampled before placing roads or structures.
- Roads conform to the terrain surface and use stepped grades.
- Lots are flattened or terraced before construction.
- Building entrances face a reachable road, lane, courtyard, or plaza.
- Footprints reserve clearance so buildings, props, vegetation, and roads cannot merge.
- Foundations extend to the sampled ground, preventing floating geometry.
- Castles occupy defensible elevation and include walls, gates, towers, baileys, and protected keeps.
- Cities contain an outer road network, massive inner walls, gate approaches, civic plazas, markets, workshops, housing districts, wells, and service alleys.
- Connectivity checks reject settlements with unreachable entrances or disconnected roads.

## First Playable Region

- The capital: a walled inner city, palace keep, central market, residential lanes, crafting quarter, guild buildings, inn, temple, and outer farms.
- Three satellite settlements: a mining town, oasis village, and frontier fortress.
- Three major factions with settlements, patrols, armies, diplomacy, and territorial goals.
- One joinable adventurers' guild with a quest line.
- Procedural desert cells containing roads, wildlife, caravans, ruins, encounters, and dragon territory.
- One crypt and labyrinth content family culminating in a lich encounter.
- One wizard tower interior cell chain.

## Character Creation And Paperdolls

The game opens in a character creator. The player chooses:

- Race: human, orc, or elf.
- Appearance: skin, face, hair, eye, and marking texture layers.
- Class: warrior, ranger, mage, or rogue.
- Name and faction-neutral background.

All humanoid entities use the same body geometry and animation hierarchy. Appearance is assembled into a runtime pixel atlas. Equipment overlays replace or layer texture regions for head, torso, hands, legs, feet, cloak, main hand, off hand, and trinkets. Seeded layer selection creates reproducible NPC paperdolls.

After creation, the player enters the capital arrival cell at the main gate.

## NPC Life Simulation

Each persistent NPC tracks identity, household, home cell, workplace, job, money, rent, hunger, food inventory, happiness, relationships, faction, schedule, personality, knowledge, and current intent.

NPCs choose activities from needs and obligations. They sleep, commute, work, trade, eat, socialize, worship, guard, travel, and react to danger. Loaded NPCs navigate physically. Unloaded NPCs advance through timestamped schedule events and cell transfers.

The economy uses bounded simulation: households earn wages, pay rent, buy food, and respond to shortages. Strategic summaries prevent distant populations from requiring per-frame simulation.

## Dialogue

Dialogue is assembled dynamically from deterministic rules and content fragments rather than requiring an online language service. Responses draw from:

- Personality and relationship.
- Current need, mood, job, and activity.
- Knowledge of places, people, quests, crimes, prices, and faction events.
- Conversation topics unlocked by player skills and previous statements.
- Rumors generated from real simulation events.

The player can ask about work, rumors, directions, local news, factions, people, trade, and personal matters. Important facts become journal topics. Dialogue choices can affect trust, quest availability, prices, witnesses, and faction reputation.

## Modular Quests

Quest packs are data-driven assemblies of compatible parts:

- Giver and motivation.
- Objective verbs such as deliver, escort, investigate, recover, hunt, rescue, defend, sabotage, negotiate, or clear.
- Target and destination constraints.
- Complication, opposition, and optional twist.
- Reward, reputation, relationship, and world-state consequences.
- Failure and expiry conditions.

The generator validates that selected cells, targets, routes, keys, and required actors exist and are reachable. Active objectives receive compass, world, and map markers where appropriate. Guilds and factions use themed quest packs and progression requirements.

## Combat, Magic, Equipment, And Creatures

- First-person movement and interaction support melee weapons, bows, shields, and spell casting.
- Classes determine starting skills and abilities but do not permanently lock progression.
- Armor and trinkets modify defense, resistances, needs, reputation, and utility.
- Wildlife includes desert hares, lizards, beetles, scorpions, hyenas, camels, and giant vultures.
- Monsters include skeletons, minotaurs, dragons, liches, and hostile wizard servants.
- Dragons occupy territories, hunt wildlife and caravans, and can influence faction routes.
- Combat feedback uses cuboid particles, texture flashes, impact audio, readable telegraphs, and restrained camera impulse.

## Factions And Conquest

Factions own settlements and strategic sites. They maintain wealth, food, manpower, armies, leaders, diplomacy, claims, and current campaigns. Strategic simulation evaluates recruitment, patrols, raids, sieges, relief forces, and territorial transfer.

The player can join factions and guilds, gain ranks, influence wars, defend settlements, sabotage supplies, escort armies, and earn holdings. Battles near the player instantiate representative combat groups; distant battles resolve statistically from the same unit data.

## Maps And Fast Travel

- The regional map reveals visited cells, known roads, settlements, dungeons, faction borders, armies, and quest markers.
- Search and filters find known places by category.
- Selecting a destination previews travel duration, food cost, danger, and route.
- Fast travel is unavailable while pursued, overburdened, imprisoned, inside hostile restricted cells, or missing a viable route.
- Arrival anchors prevent spawning inside geometry or hostile formations.

## Data Flow And Boundaries

- `WorldSeed` creates named deterministic random streams.
- `WorldMap` resolves coordinates into authored reservations or procedural cell descriptors.
- `CellManager` loads, unloads, links, and snapshots exterior and interior cells.
- `SettlementGenerator` creates terrain-aware roads, lots, districts, and grounded structures.
- `SimulationClock` advances loaded and strategic systems.
- `NpcSimulation`, `FactionSimulation`, and `QuestSystem` communicate through timestamped domain events.
- `Renderer` consumes cell descriptions but does not own simulation state.
- `SaveSystem` persists the seed, player state, cell deltas, quests, NPC deltas, and faction deltas.

Data packs define textures, races, classes, items, spells, creatures, buildings, interior templates, dialogue fragments, quests, factions, and settlements.

## Failure Handling

- Invalid generated cells fall back to a known-safe sparse desert cell and record diagnostics.
- Settlement generation retries with a derived seed when connectivity or collision validation fails.
- Quest generation discards combinations that cannot prove target and route reachability.
- Missing portal destinations return the player to the last safe anchor.
- Corrupt saves retain rotating previous snapshots and validate schema versions before loading.
- Systems use deterministic IDs so regenerated content reconnects to saved deltas.

## Verification

Automated tests cover:

- Deterministic generation from equal seeds.
- Matching terrain and road edges across exterior cell borders.
- Roads connected to the ground and to required destinations.
- Foundations touching terrain with no floating buildings.
- Non-overlapping lots, structures, and reserved paths.
- Reachable building entrances and valid two-way interior portals.
- NPC schedules with reachable home, food, and work cells.
- Quest assemblies with valid actors, targets, routes, and completion conditions.
- Save and reload equivalence for modified cells and simulations.
- Faction battles producing bounded, reproducible outcomes.

Playtesting validates character creation, capital arrival, dialogue, employment and needs, one generated guild quest, wilderness travel, dungeon completion, combat, equipment, fast travel, and a visible faction territory change.

## Scope Boundary

The first release proves every major pillar but does not attempt unlimited content. It contains one capital, three satellite settlements, three factions, one guild, one dungeon family, one wizard tower chain, a focused creature roster, and modular data packs. Additional regions, races, guilds, interiors, quest packs, spells, equipment, and faction cultures are expansion content built on the same systems.