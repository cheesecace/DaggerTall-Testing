export const WORLD_RADIUS = 4;

const BIOMES = ['red-dunes', 'salt-flat', 'rocky-hamada', 'dry-wadi', 'date-steppe'];
const RESOURCES = ['desert-cedar', 'date-palm', 'salt', 'clay', 'copper', 'reeds'];

function hashCell(seed, x, z) {
  let value = seed ^ Math.imul(x + 101, 374761393) ^ Math.imul(z + 211, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return (value ^ (value >>> 16)) >>> 0;
}

export function getWorldCell(seed, x, z) {
  if (x === 0 && z === 0) return { id: '0,0', x, z, kind: 'capital', name: 'Qadira', biome: 'river-oasis', resource: 'commerce', road: true, discovered: true };
  const value = hashCell(seed, x, z);
  const distance = Math.max(Math.abs(x), Math.abs(z));
  const road = x === 0 || z === 0 || x === z;
  const kind = distance === 1 && road ? 'outskirts' : value % 17 === 0 ? 'ruin' : value % 23 === 0 ? 'oasis' : 'wilderness';
  return {
    id: `${x},${z}`,
    x,
    z,
    kind,
    name: kind === 'ruin' ? `Buried Tell ${value % 97}` : kind === 'oasis' ? `Oasis ${value % 89}` : kind === 'outskirts' ? 'Qadira Outskirts' : `${BIOMES[value % BIOMES.length].replaceAll('-', ' ')} ${Math.abs(x)}:${Math.abs(z)}`,
    biome: BIOMES[value % BIOMES.length],
    resource: RESOURCES[(value >>> 4) % RESOURCES.length],
    road,
    discovered: distance <= 1,
  };
}

export function generateWorldMap(seed = 73191, radius = WORLD_RADIUS) {
  const cells = [];
  for (let z = -radius; z <= radius; z += 1) {
    for (let x = -radius; x <= radius; x += 1) cells.push(getWorldCell(seed, x, z));
  }
  return { seed, radius, cells };
}
