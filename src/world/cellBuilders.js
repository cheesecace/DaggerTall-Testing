import * as THREE from 'three';
import { createTileTexture } from '../render/pixelTextures.js';
import { createCuboid, createVoxelHumanoid, WORLD_HUMANOID_SCALE } from '../render/voxel.js';
import { createNpcSkin } from '../data/npcSkins.js';

function makeMaterials() {
  const material = (pattern, colors) => new THREE.MeshLambertMaterial({
    map: createTileTexture(pattern, colors),
  });
  return {
    sand: material('sand', ['#c97836', '#e19a4a', '#92502b']),
    road: material('road', ['#d5a35e', '#edc47f', '#8f5d38', '#f0cf8c']),
    sandstone: material('plaster', ['#d29a58', '#efbd76', '#9a6039']),
    paleStone: material('stone', ['#dfb875', '#f0d092', '#9d754a']),
    darkStone: material('darkStone', ['#443630', '#665046', '#211d1b']),
    wood: material('wood', ['#68432d', '#8d5d39', '#35261f']),
    turquoise: material('cloth', ['#238b8d', '#47aa9f', '#15545a']),
    crimson: material('cloth', ['#a43d2d', '#d16845', '#60251f']),
    foliage: material('foliage', ['#496d3b', '#71954d', '#29472d']),
    water: material('water', ['#258d96', '#6bc1b2', '#c6e5bd']),
    brass: material('stone', ['#b98231', '#e1b55b', '#66421f']),
    ember: material('cloth', ['#b73e20', '#ee7933', '#5e1e19']),
    black: new THREE.MeshLambertMaterial({ color: '#130e0d' }),
  };
}

function createBuilder(rapier, world, group) {
  const interactive = [];
  const addBox = ({ size, position, material, collision = true, name, userData }) => {
    const mesh = createCuboid({ size, position, material, name, userData });
    group.add(mesh);
    if (collision) {
      const collider = rapier.ColliderDesc.cuboid(size[0] / 2, size[1] / 2, size[2] / 2)
        .setTranslation(position[0], position[1], position[2]);
      world.createCollider(collider);
    }
    if (userData?.interaction) interactive.push(mesh);
    return mesh;
  };
  return { addBox, interactive };
}

function addBuilding(addBox, materials, x, z, width, depth, height, accent = materials.turquoise) {
  addBox({ size: [width, height, depth], position: [x, height / 2, z], material: materials.sandstone });
  addBox({ size: [width + 0.5, 0.35, depth + 0.5], position: [x, height + 0.18, z], material: materials.paleStone });
  addBox({ size: [width * 0.72, 0.24, 1.25], position: [x, height * 0.72, z + depth / 2 + 0.58], material: accent, collision: false });
  addBox({ size: [1.6, 2.8, 0.24], position: [x, 1.4, z + depth / 2 + 0.13], material: materials.wood, collision: false });
  for (const windowX of [-width * 0.28, width * 0.28]) {
    addBox({ size: [1.05, 1.15, 0.2], position: [x + windowX, height * 0.56, z + depth / 2 + 0.14], material: materials.turquoise, collision: false });
    addBox({ size: [1.35, 0.15, 0.35], position: [x + windowX, height * 0.56 - 0.65, z + depth / 2 + 0.2], material: materials.paleStone, collision: false });
  }
  for (let edge = -width / 2 + 0.5; edge <= width / 2 - 0.5; edge += 1.5) {
    addBox({ size: [0.7, 0.65, 0.7], position: [x + edge, height + 0.62, z + depth / 2 - 0.15], material: materials.paleStone, collision: false });
  }
}

function addMarketStall(addBox, materials, x, z, accent) {
  addBox({ size: [4.4, 0.25, 3.2], position: [x, 2.65, z], material: accent, collision: false });
  for (const dx of [-1.9, 1.9]) for (const dz of [-1.35, 1.35]) {
    addBox({ size: [0.2, 2.65, 0.2], position: [x + dx, 1.32, z + dz], material: materials.wood });
  }
  addBox({ size: [3.9, 0.75, 1.05], position: [x, 0.58, z], material: materials.wood });
  for (const itemX of [-1.25, -0.4, 0.45, 1.3]) {
    addBox({ size: [0.55, 0.38, 0.55], position: [x + itemX, 1.12, z], material: itemX < 0 ? materials.brass : materials.foliage, collision: false });
  }
}

function addChair(addBox, materials, x, z, facingZ) {
  const seatHeight = 0.58;
  for (const legX of [-0.28, 0.28]) for (const legZ of [-0.28, 0.28]) {
    addBox({ size: [0.14, 0.5, 0.14], position: [x + legX, 0.25, z + legZ], material: materials.wood });
  }
  addBox({ size: [0.8, 0.18, 0.8], position: [x, seatHeight, z], material: materials.wood });
  addBox({
    size: [0.8, 1.15, 0.15],
    position: [x, 1.08, z - facingZ * 0.36],
    material: materials.wood,
  });
  addBox({
    size: [0.58, 0.16, 0.12],
    position: [x, 1.38, z - facingZ * 0.45],
    material: materials.brass,
    collision: false,
  });
}

function addPalm(addBox, materials, x, z) {
  addBox({ size: [0.45, 4.5, 0.45], position: [x, 2.25, z], material: materials.wood });
  addBox({ size: [3.2, 0.3, 0.55], position: [x, 4.5, z], material: materials.foliage, collision: false });
  addBox({ size: [0.55, 0.3, 3.2], position: [x, 4.45, z], material: materials.foliage, collision: false });
}

function addCapitalCrowd(group) {
  const citizens = [
    ['human', 'female', 8, -4.2, -1.2, Math.PI],
    ['orc', 'male', 0, 4.5, -1.4, Math.PI],
    ['elf', 'female', 7, -10.2, -4.5, -Math.PI / 2],
    ['human', 'male', 4, 10.5, -4.8, Math.PI / 2],
    ['orc', 'female', 1, -10.5, -12.4, -Math.PI / 2],
    ['elf', 'male', 1, 10.5, -12.5, Math.PI / 2],
    ['human', 'female', 3, -3.8, -15.7, 0],
    ['orc', 'male', 4, 4.2, -15.5, 0],
    ['elf', 'female', 9, -17.5, 5.7, Math.PI / 2],
    ['human', 'male', 8, 17.8, -6.3, -Math.PI / 2],
    ['orc', 'female', 10, -7.2, 9.8, Math.PI],
    ['elf', 'male', 12, 7.2, 10.8, Math.PI],
  ];
  citizens.forEach(([race, gender, variant, x, z, rotation]) => {
    const profile = createNpcSkin(race, gender, variant);
    const citizen = createVoxelHumanoid(profile, WORLD_HUMANOID_SCALE);
    citizen.name = profile.visual.title;
    citizen.userData.npcSkinId = profile.id;
    citizen.position.set(x, 0, z);
    citizen.rotation.y = rotation;
    group.add(citizen);
  });
}

export function buildCapitalCell(rapier, world) {
  const group = new THREE.Group();
  const materials = makeMaterials();
  const { addBox, interactive } = createBuilder(rapier, world, group);

  addBox({ size: [80, 1, 80], position: [0, -0.5, 0], material: materials.sand });
  addBox({ size: [7, 0.18, 72], position: [0, 0.09, 3], material: materials.road, collision: false });
  addBox({ size: [46, 0.16, 7], position: [1, 0.1, -8], material: materials.road, collision: false });
  addBox({ size: [12, 0.17, 3], position: [7.5, 0.1, 5.5], material: materials.road, collision: false });
  addBox({ size: [11, 0.17, 3], position: [-8, 0.1, 6], material: materials.road, collision: false });
  addBox({ size: [18, 0.18, 16], position: [0, 0.11, -8], material: materials.paleStone, collision: false });

  const wallSections = [
    [-24, 3, 0, 4, 6, 58], [24, 3, 0, 4, 6, 58],
    [-15, 3, -29, 18, 6, 4], [15, 3, -29, 18, 6, 4],
    [-17, 3, 29, 14, 6, 4], [17, 3, 29, 14, 6, 4],
  ];
  for (const [x, y, z, width, height, depth] of wallSections) {
    addBox({ size: [width, height, depth], position: [x, y, z], material: materials.paleStone });
  }
  for (const x of [-24, 24]) for (const z of [-29, 29]) {
    addBox({ size: [6, 9, 6], position: [x, 4.5, z], material: materials.paleStone });
  }
  addBox({ size: [13, 4, 4], position: [0, 7.5, 29], material: materials.paleStone });
  addBox({ size: [3, 11, 5], position: [-6.5, 5.5, 29], material: materials.paleStone });
  addBox({ size: [3, 11, 5], position: [6.5, 5.5, 29], material: materials.paleStone });
  for (const x of [-5.4, -3.6, -1.8, 0, 1.8, 3.6, 5.4]) {
    addBox({ size: [0.9, 0.9, 0.9], position: [x, 9.9, 29], material: materials.paleStone, collision: false });
  }

  addBuilding(addBox, materials, 10, 1, 9, 9, 5.5, materials.crimson);
  addBuilding(addBox, materials, -13, 1, 8, 10, 6.5);
  addBuilding(addBox, materials, 14, -15, 9, 8, 7, materials.crimson);
  addBuilding(addBox, materials, -14, -16, 8, 7, 5.5);
  addBuilding(addBox, materials, 0, -23, 15, 8, 10, materials.turquoise);

  const door = addBox({
    size: [1.85, 3.05, 0.28], position: [10, 1.53, 5.58], material: materials.wood, collision: false,
    name: 'Inn door', userData: { interaction: 'Enter The Brass Camel', portal: 'inn' },
  });
  door.castShadow = false;
  addBox({ size: [2.6, 0.35, 0.5], position: [10, 3.22, 5.65], material: materials.brass, collision: false });
  addBox({ size: [0.28, 3.45, 0.5], position: [8.95, 1.72, 5.65], material: materials.brass, collision: false });
  addBox({ size: [0.28, 3.45, 0.5], position: [11.05, 1.72, 5.65], material: materials.brass, collision: false });

  addMarketStall(addBox, materials, -7, -3, materials.turquoise);
  addMarketStall(addBox, materials, 7, -3, materials.crimson);
  addMarketStall(addBox, materials, -7, -13, materials.crimson);
  addMarketStall(addBox, materials, 7, -13, materials.turquoise);
  addBox({ size: [6, 0.3, 6], position: [0, 0.25, -8], material: materials.paleStone });
  addBox({ size: [3.5, 0.4, 3.5], position: [0, 0.55, -8], material: materials.water, collision: false });
  addBox({ size: [1.3, 2.8, 1.3], position: [0, 1.7, -8], material: materials.paleStone });
  addBox({ size: [3.1, 0.35, 0.35], position: [0, 2.65, -8], material: materials.brass, collision: false });
  addBox({ size: [0.35, 0.35, 3.1], position: [0, 2.65, -8], material: materials.brass, collision: false });
  addPalm(addBox, materials, -8, 12);
  addPalm(addBox, materials, 8, 14);
  addPalm(addBox, materials, -18, -5);
  addPalm(addBox, materials, 18, -6);
  addCapitalCrowd(group);

  return { group, interactive, ambient: '#d97632', fog: ['#dc8a45', 42, 115] };
}

export function buildInnCell(rapier, world) {
  const group = new THREE.Group();
  const materials = makeMaterials();
  const { addBox, interactive } = createBuilder(rapier, world, group);
  addBox({ size: [18, 1, 20], position: [0, -0.5, 0], material: materials.darkStone });
  addBox({ size: [18, 6, 0.7], position: [0, 3, -10], material: materials.sandstone });
  addBox({ size: [0.7, 6, 20], position: [-9, 3, 0], material: materials.sandstone });
  addBox({ size: [0.7, 6, 20], position: [9, 3, 0], material: materials.sandstone });
  addBox({ size: [7.5, 6, 0.7], position: [-5.25, 3, 10], material: materials.sandstone });
  addBox({ size: [7.5, 6, 0.7], position: [5.25, 3, 10], material: materials.sandstone });
  addBox({ size: [18, 0.6, 20], position: [0, 6, 0], material: materials.wood });
  addBox({ size: [4.5, 0.12, 9], position: [0, 0.08, 2], material: materials.crimson, collision: false });
  for (const x of [-6, 0, 6]) addBox({ size: [0.35, 5.5, 0.35], position: [x, 3, -0.2], material: materials.wood });
  for (const z of [-5, 0, 5]) addBox({ size: [17, 0.32, 0.32], position: [0, 5.45, z], material: materials.wood, collision: false });

  addBox({ size: [7, 1.1, 1.5], position: [0, 0.55, -6.5], material: materials.wood });
  addBox({ size: [8, 0.22, 2], position: [0, 1.2, -6.5], material: materials.brass });
  addBox({ size: [7, 3.4, 0.4], position: [0, 2.45, -9.3], material: materials.wood });
  for (const x of [-2.5, -1.25, 0, 1.25, 2.5]) {
    addBox({ size: [0.45, 0.7, 0.45], position: [x, 2.25, -9], material: x % 2 ? materials.turquoise : materials.brass, collision: false });
  }
  for (const x of [-5.5, 5.5]) for (const z of [-3, 2.5]) {
    addBox({ size: [3.2, 0.3, 2.2], position: [x, 1.4, z], material: materials.wood });
    for (const dx of [-1.2, 1.2]) addBox({ size: [0.3, 1.4, 0.3], position: [x + dx, 0.7, z], material: materials.wood });
    addChair(addBox, materials, x, z - 1.6, 1);
    addChair(addBox, materials, x, z + 1.6, -1);
  }
  addBox({ size: [3, 0.22, 3], position: [0, 5.25, 0], material: materials.turquoise, collision: false });
  addBox({ size: [0.2, 4.2, 0.2], position: [0, 3.1, 0], material: materials.brass, collision: false });
  addBox({ size: [0.6, 4, 4.5], position: [-8.25, 2, -5], material: materials.darkStone });
  addBox({ size: [0.7, 1.9, 2.8], position: [-7.88, 0.95, -5], material: materials.ember, collision: false });
  addBox({ size: [1, 0.7, 3.5], position: [-7.65, 2.05, -5], material: materials.paleStone });
  const fireLight = new THREE.PointLight('#ff8b3d', 20, 13, 1.8);
  fireLight.position.set(-6.8, 2, -5);
  group.add(fireLight);
  const exit = addBox({
    size: [2.2, 3.2, 0.2], position: [0, 1.6, 9.58], material: materials.wood, collision: false,
    name: 'Exit door', userData: { interaction: 'Return to Qadira', portal: 'exit' },
  });
  exit.castShadow = false;

  const innkeeper = createVoxelHumanoid({ race: 'orc', appearance: 0, classId: 'rogue' }, WORLD_HUMANOID_SCALE);
  innkeeper.position.set(0, 0, -8);
  innkeeper.rotation.y = Math.PI;
  group.add(innkeeper);

  return { group, interactive, ambient: '#3a1c18', fog: ['#3a1c18', 18, 34] };
}

export const CELL_BUILDERS = {
  'capital-gate': buildCapitalCell,
  'brass-camel-inn': buildInnCell,
};