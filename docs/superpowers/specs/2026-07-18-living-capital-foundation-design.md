# Living Capital Foundation

## Purpose

This phase turns Qadira from a plaza-sized vertical slice into the authored center of a deterministic regional world. It establishes the city plan, regional survey map, households, work schedules, rent, homelessness, and visible citizen circulation without claiming to complete exterior streaming or full NPC pathfinding.

## Historical City Grammar

Qadira combines documented patterns from first-millennium BCE Babylon, Nineveh, and other Mesopotamian cities:

- A ceremonial processional axis passes through named monumental gates and links civic, market, temple, and palace precincts.
- Outer and inner wall rings use projecting towers and controlled gate passages rather than one decorative perimeter.
- A canal spine supports gardens, reeds, docks, clay work, and date cultivation.
- Palace and temple masses occupy the protected northern acropolis, with a stepped ziggurat as the city's long-distance landmark.
- Dense mixed-use wards place courtyard-scale homes beside workshops, markets, taverns, guilds, schools, barracks, and archives.
- Road-facing entrances and street-side activity make the plan serviceable at player scale.

Reference basis:

- UNESCO World Heritage Centre, Babylon: https://whc.unesco.org/en/list/278/
- Encyclopaedia Britannica, Babylon: https://www.britannica.com/place/Babylon-ancient-city-Mesopotamia-Asia
- Encyclopaedia Britannica, Nineveh: https://www.britannica.com/place/Nineveh-ancient-city-Iraq
- The Metropolitan Museum of Art, Mesopotamia: https://www.metmuseum.org/toah/hd/meru/hd_meru.htm

The game does not reconstruct one historical city. These references supply planning rules for an original fantasy capital built entirely from cuboids and nearest-filtered pixel textures.

## Capital Structure

The 330 by 330 capital cell contains six functional wards, 60 planned buildings, two defensive wall rings, a north-south processional way, four cross streets, a canal, resource belts, a palace, and a ziggurat. Generated lots reserve the processional footprint and face their nearest planned road. District materials distinguish red-clay gate and kiln wards, pale temple fabric, canal plaster, sandstone markets, and blue-glazed citadel buildings.

The Brass Camel is the planned market tavern rather than a detached portal prop. Its street-facing door links to the existing interior cell and returns the player to a clear point on the market road.

## Living-City Model

The deterministic simulation creates 12 households and 36 citizens with race, gender, age, family, home, role, workplace, wage, and appearance records. Time schedules choose sleep, home, school, work, and market activities. Adults earn daily wages; households owe rent every seven days and become homeless when they cannot pay. Homeless citizens retain jobs but sleep at the gate shelter.

Visible citizens use shared cuboid paperdolls and opposing arm-leg walk cycles. Each ward owns authored street waypoints so scheduled citizens circulate along roads instead of converging on one district coordinate. This is deliberately a lightweight visual routing layer; obstacle-aware navigation, physical NPC bodies, and portal travel into individual homes remain later work.

## Regional Foundation

The royal survey tablet exposes a deterministic 9 by 9 region centered on Qadira. The capital, caravan roads, biomes, oasis cells, ruins, and resource identities are stable for seed 73191. The capital panel renders the two wall rings, canal, roads, and six wards from the same plan used by the world builder.

Future exterior streaming should consume these cell records rather than replacing them. Authored destinations reserve known coordinates while intervening wilderness derives from seed and cell coordinates.

## Acceptance Evidence

- Female elf, full helmet, cape, and two skin-colored external ears render together.
- The Red Sun arrival point is clear and the processional way remains open through both wall rings.
- The market, citizens, district silhouettes, and nested defenses are visible during a normal walk from the gate.
- Both survey canvases contain rendered pixels and remain legible at desktop and mobile widths.
- The Brass Camel supports a complete exterior-to-interior-to-exterior portal round-trip.
- Unit tests cover deterministic maps, household links, rent failure, schedule destinations, capital clearance, portal topology, and walk poses.
