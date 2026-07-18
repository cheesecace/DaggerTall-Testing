export const CAPITAL_BOUNDS = 145;

export const CAPITAL_DISTRICTS = [
  { id: 'gate', name: 'Red Gate Ward', center: [0, 88], color: '#c85d35', purpose: 'caravans, hostels, guards' },
  { id: 'market', name: 'Processional Market', center: [0, 25], color: '#d9a441', purpose: 'markets, taverns, shops' },
  { id: 'artisans', name: 'Kiln and Loom Ward', center: [58, 24], color: '#a84a32', purpose: 'brickworks, weavers, guilds' },
  { id: 'canal', name: 'Canal Gardens', center: [-58, 18], color: '#2d8f91', purpose: 'docks, gardens, waterworks' },
  { id: 'temple', name: 'Star Temple Ward', center: [-38, -58], color: '#527c6a', purpose: 'temples, scribes, school' },
  { id: 'citadel', name: 'Lion Citadel', center: [38, -67], color: '#714232', purpose: 'palace, barracks, factions' },
];

export const CAPITAL_ROADS = [
  { id: 'processional-way', axis: 'z', center: 0, from: -125, to: 125, width: 9 },
  { id: 'market-way', axis: 'x', center: 25, from: -120, to: 120, width: 7 },
  { id: 'temple-way', axis: 'x', center: -42, from: -110, to: 110, width: 6 },
  { id: 'inner-ring-south', axis: 'x', center: 72, from: -78, to: 78, width: 5 },
  { id: 'inner-ring-north', axis: 'x', center: -72, from: -78, to: 78, width: 5 },
];

const BUILDING_TYPES = {
  gate: ['caravanserai', 'guard-barracks', 'tavern', 'stable', 'factor-shop', 'house'],
  market: ['spice-market', 'baker', 'cloth-shop', 'tavern', 'money-changer', 'house'],
  artisans: ['brickworks', 'weaver-guild', 'bronzesmith', 'potter', 'carpenter', 'house'],
  canal: ['date-gardener', 'canal-office', 'fish-market', 'brewer', 'boatwright', 'house'],
  temple: ['scribe-house', 'temple-school', 'astronomer', 'healer', 'priest-house', 'house'],
  citadel: ['faction-hall', 'armory', 'barracks', 'palace-office', 'archive', 'house'],
};

function nearestFacing(x, z) {
  const candidates = CAPITAL_ROADS.map((road) => ({
    facing: road.axis === 'x' ? (z < road.center ? 'south' : 'north') : (x < road.center ? 'east' : 'west'),
    distance: Math.abs((road.axis === 'x' ? z : x) - road.center),
  }));
  return candidates.sort((left, right) => left.distance - right.distance)[0].facing;
}

function districtBuildings(district, districtIndex) {
  const buildings = [];
  const [centerX, centerZ] = district.center;
  const columnOffsets = [-27, -16, 16, 27, 38];
  for (let index = 0; index < 10; index += 1) {
    const column = index % 5;
    const row = Math.floor(index / 5);
    const rawX = centerX + columnOffsets[column];
    const x = Math.abs(rawX) < 11 ? (centerX <= 0 ? -12 : 12) : rawX;
    const z = centerZ + (row ? 9 : -9);
    const type = BUILDING_TYPES[district.id][index % BUILDING_TYPES[district.id].length];
    const isHome = index >= 8;
    buildings.push({
      id: isHome ? `home-${district.id}-${String(districtIndex + 1 + (index - 8) * CAPITAL_DISTRICTS.length).padStart(2, '0')}` : `${district.id}-${type}-${String(index + 1).padStart(2, '0')}`,
      district: district.id,
      type: isHome ? 'house' : type,
      position: [x, z],
      size: [7 + (index % 3), 7 + ((index + 1) % 3)],
      height: 5 + (index % 4),
      facing: nearestFacing(x, z),
      residents: isHome ? 2 + (index % 3) : 0,
    });
  }
  return buildings;
}

export const CAPITAL_BUILDINGS = CAPITAL_DISTRICTS.flatMap(districtBuildings);

export const CAPITAL_LANDMARKS = [
  { id: 'ziggurat', type: 'ziggurat', position: [-36, -82], district: 'temple' },
  { id: 'palace-without-rival', type: 'palace', position: [40, -91], district: 'citadel' },
  { id: 'ishtar-gate', type: 'gate', position: [0, -126], district: 'citadel' },
  { id: 'red-sun-gate', type: 'gate', position: [0, 126], district: 'gate' },
  { id: 'market-square', type: 'market', position: [0, 25], district: 'market' },
  { id: 'canal-harbor', type: 'harbor', position: [-91, 22], district: 'canal' },
];

export function validateCapitalPlan() {
  const errors = [];
  const ids = new Set();
  for (const building of CAPITAL_BUILDINGS) {
    if (ids.has(building.id)) errors.push(`Duplicate building ${building.id}`);
    ids.add(building.id);
    const [x, z] = building.position;
    if (Math.abs(x) > 118 || Math.abs(z) > 118) errors.push(`${building.id} is outside the city wall`);
    if (Math.abs(x) - building.size[0] / 2 < 5 && Math.abs(z) < 125) errors.push(`${building.id} overlaps the processional way`);
    if (!['north', 'south', 'east', 'west'].includes(building.facing)) errors.push(`${building.id} has no road-facing entrance`);
  }
  return errors;
}
