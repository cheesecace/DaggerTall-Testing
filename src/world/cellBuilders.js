import * as THREE from 'three';
import { createTileTexture } from '../render/pixelTextures.js';
import { createCuboid, createVoxelHumanoid, WORLD_HUMANOID_SCALE } from '../render/voxel.js';
import { poseVoxelHumanoid } from '../render/voxelAnimator.js';
import { createNpcSkin } from '../data/npcSkins.js';
import { CAPITAL_BUILDINGS, CAPITAL_DISTRICTS } from './capitalPlan.js';
import { getCitizenActivity } from '../simulation/livingCity.js';

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
    blueBrick: material('plaster', ['#175f7d', '#237f9c', '#0f405a', '#d9a342']),
    clay: material('plaster', ['#a95736', '#c97645', '#783a2c']),
    reeds: material('wood', ['#8f8b3f', '#b6ae55', '#55572b']),
    plaster: material('plaster', ['#e0bd7b', '#f0d49c', '#aa794d']),
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

function addPlannedBuilding(addBox, materials, building) {
  const [x, z] = building.position;
  const [width, depth] = building.size;
  const accent = building.district === 'canal' ? materials.turquoise : building.district === 'artisans' ? materials.crimson : building.district === 'citadel' ? materials.brass : materials.reeds;
  const districtMaterial = {
    gate: materials.clay,
    market: materials.sandstone,
    artisans: materials.clay,
    canal: materials.plaster,
    temple: materials.paleStone,
    citadel: materials.blueBrick,
  }[building.district];
  addBox({ size: [width, building.height, depth], position: [x, building.height / 2, z], material: districtMaterial, name: building.id });
  addBox({ size: [width + 0.5, 0.28, depth + 0.5], position: [x, building.height + 0.14, z], material: materials.plaster, collision: false });
  const northSouth = building.facing === 'north' || building.facing === 'south';
  const direction = building.facing === 'north' || building.facing === 'west' ? -1 : 1;
  const doorPosition = northSouth
    ? [x, 1.35, z + direction * (depth / 2 + 0.13)]
    : [x + direction * (width / 2 + 0.13), 1.35, z];
  const doorSize = northSouth ? [1.45, 2.7, 0.22] : [0.22, 2.7, 1.45];
  const isBrassCamel = building.id === 'market-tavern-04';
  addBox({
    size: doorSize,
    position: doorPosition,
    material: materials.wood,
    collision: false,
    name: isBrassCamel ? 'The Brass Camel door' : `${building.id}-door`,
    userData: isBrassCamel
      ? { interaction: 'Enter The Brass Camel', portal: 'inn' }
      : { interaction: `${building.type.replaceAll('-', ' ')} · ${building.district} district` },
  });
  const lintelPosition = [...doorPosition];
  lintelPosition[1] = 2.9;
  addBox({ size: northSouth ? [2.1, 0.28, 0.42] : [0.42, 0.28, 2.1], position: lintelPosition, material: accent, collision: false });
  for (let edge = -width / 2 + 0.6; edge < width / 2; edge += 1.5) {
    addBox({ size: [0.72, 0.55, 0.72], position: [x + edge, building.height + 0.55, z], material: materials.plaster, collision: false });
  }
}

function addWallRing(addBox, materials, radius, height, thickness, gateHalfWidth, material) {
  const sideLength = radius * 2;
  for (const x of [-radius, radius]) addBox({ size: [thickness, height, sideLength], position: [x, height / 2, 0], material });
  for (const z of [-radius, radius]) {
    const segmentWidth = radius - gateHalfWidth;
    addBox({ size: [segmentWidth, height, thickness], position: [-(radius + gateHalfWidth) / 2, height / 2, z], material });
    addBox({ size: [segmentWidth, height, thickness], position: [(radius + gateHalfWidth) / 2, height / 2, z], material });
  }
  for (let offset = -radius + 12; offset <= radius - 12; offset += 18) {
    for (const z of [-radius, radius]) addBox({ size: [3.8, height + 3, 5.2], position: [offset, (height + 3) / 2, z], material });
    for (const x of [-radius, radius]) addBox({ size: [5.2, height + 3, 3.8], position: [x, (height + 3) / 2, offset], material });
  }
  for (const z of [-radius, radius]) {
    addBox({ size: [3.8, height + 5, 7], position: [-gateHalfWidth, (height + 5) / 2, z], material });
    addBox({ size: [3.8, height + 5, 7], position: [gateHalfWidth, (height + 5) / 2, z], material });
    addBox({ size: [gateHalfWidth * 2, 2.2, 5], position: [0, height + 2.2, z], material: materials.blueBrick });
  }
}

function addZiggurat(addBox, materials) {
  const levels = [[24, 5, 20], [18, 4, 15], [12, 4, 10], [7, 5, 6]];
  let y = 0;
  for (const [width, height, depth] of levels) {
    addBox({ size: [width, height, depth], position: [-36, y + height / 2, -92], material: y % 2 ? materials.blueBrick : materials.clay });
    y += height;
  }
  for (let index = 0; index < 10; index += 1) addBox({ size: [2, 0.45, 1.8], position: [-36, 0.3 + index * 0.42, -80 + index * -1.25], material: materials.paleStone });
}

function addPalace(addBox, materials) {
  addBox({ size: [42, 8, 26], position: [42, 4, -96], material: materials.sandstone });
  addBox({ size: [34, 1, 18], position: [42, 8.5, -96], material: materials.blueBrick });
  addBox({ size: [20, 8, 18], position: [42, 12.5, -96], material: materials.plaster });
  for (const x of [27, 34.5, 49.5, 57]) addBox({ size: [3.5, 12, 3.5], position: [x, 6, -82.5], material: materials.blueBrick });
  addBox({ size: [13, 3, 2], position: [42, 9.5, -82.5], material: materials.brass, collision: false });
}

function addResourceBelt(addBox, materials) {
  const palms = [[-132, 92], [-118, 112], [120, 104], [136, 76], [-138, -58], [132, -82], [-112, -126], [112, -132]];
  palms.forEach(([x, z]) => addPalm(addBox, materials, x, z));
  for (const [x, z] of [[-136, 36], [-128, 18], [128, 32], [136, 12], [-126, -104], [124, -112]]) {
    addBox({ size: [0.8, 5.4, 0.8], position: [x, 2.7, z], material: materials.wood });
    addBox({ size: [4.4, 1.2, 3], position: [x, 5.2, z], material: materials.foliage, collision: false });
  }
  for (const [x, z] of [[-108, 132], [-92, 135], [92, 135], [108, 130]]) {
    addBox({ size: [6, 0.45, 4], position: [x, 0.23, z], material: materials.clay, collision: false });
    addBox({ size: [0.9, 1.6, 0.9], position: [x - 1.6, 0.8, z], material: materials.clay });
    addBox({ size: [0.9, 1.2, 0.9], position: [x + 1.5, 0.6, z + 0.8], material: materials.clay });
  }
}

function addLivingCitizens(group, city) {
  if (!city) return () => {};
  const districtRoutes = {
    gate: [[-30, 72], [-18, 72], [18, 72], [30, 72], [5, 82], [-5, 94]],
    market: [[-34, 25], [-24, 25], [24, 25], [34, 25], [5, 15], [-5, 36]],
    artisans: [[36, 25], [48, 25], [60, 25], [72, 25], [5, 18], [5, 32]],
    canal: [[-82, 25], [-70, 25], [-58, 25], [-46, 25], [-34, 25], [-5, 18]],
    temple: [[-70, -42], [-58, -42], [-46, -42], [-34, -42], [-22, -42], [-5, -52]],
    citadel: [[22, -72], [34, -72], [46, -72], [58, -72], [70, -72], [5, -62]],
  };
  const homePositions = Object.fromEntries(CAPITAL_BUILDINGS.map((building) => [building.id, building.position]));
  const actors = city.citizens.map((citizen, index) => {
    const profile = createNpcSkin(citizen.race, citizen.gender, citizen.appearance);
    const figure = createVoxelHumanoid(profile, WORLD_HUMANOID_SCALE);
    const household = city.households.find((item) => item.id === citizen.householdId);
    const start = homePositions[household.homeId] ?? districtRoutes[household.district][0];
    figure.position.set(start[0] + (index % 3) - 1, 0, start[1] + (index % 2 ? 2 : -2));
    figure.name = citizen.name;
    figure.userData.npcId = citizen.id;
    group.add(figure);
    return { citizen, figure, target: new THREE.Vector3(figure.position.x, 0, figure.position.z), routeIndex: index, activityKey: '', elapsed: index * 0.31 };
  });

  return (deltaTime) => {
    for (const actor of actors) {
      actor.elapsed += deltaTime;
      const activity = getCitizenActivity(actor.citizen, city);
      actor.figure.visible = activity.type !== 'sleep' && activity.type !== 'home';
      if (!actor.figure.visible) continue;
      const route = districtRoutes[activity.district] ?? districtRoutes.market;
      const activityKey = `${activity.type}:${activity.district}`;
      if (activityKey !== actor.activityKey) {
        actor.activityKey = activityKey;
        actor.routeIndex %= route.length;
        actor.figure.position.set(route[actor.routeIndex][0], 0, route[actor.routeIndex][1]);
        actor.routeIndex = (actor.routeIndex + 1) % route.length;
        actor.target.set(route[actor.routeIndex][0], 0, route[actor.routeIndex][1]);
      }
      if (actor.figure.position.distanceToSquared(actor.target) < 1.2) {
        actor.routeIndex = (actor.routeIndex + 1) % route.length;
        actor.target.set(route[actor.routeIndex][0], 0, route[actor.routeIndex][1]);
      }
      const direction = actor.target.clone().sub(actor.figure.position);
      direction.y = 0;
      const distance = direction.length();
      if (distance > 0.15) {
        direction.normalize();
        actor.figure.position.addScaledVector(direction, Math.min(distance, deltaTime * 2.1));
        actor.figure.rotation.y = Math.atan2(direction.x, direction.z);
        poseVoxelHumanoid(actor.figure, 'walk', actor.elapsed, 1);
      } else {
        poseVoxelHumanoid(actor.figure, 'idle', actor.elapsed);
      }
    }
  };
}

export function buildCapitalCell(rapier, world, context = {}) {
  const group = new THREE.Group();
  const materials = makeMaterials();
  const { addBox, interactive } = createBuilder(rapier, world, group);

  addBox({ size: [330, 1, 330], position: [0, -0.5, 0], material: materials.sand });
  addBox({ size: [14, 0.12, 310], position: [-94, 0.08, 0], material: materials.water, collision: false });
  addBox({ size: [9, 0.18, 292], position: [0, 0.1, 0], material: materials.road, collision: false });
  for (const z of [88, 25, -42, -76]) addBox({ size: [274, 0.17, z === 25 ? 8 : 5], position: [0, 0.1, z], material: materials.road, collision: false });
  for (const z of [82, 25, -42, -88]) addBox({ size: [22, 0.35, 16], position: [-94, 0.2, z], material: materials.paleStone });
  addWallRing(addBox, materials, 126, 10, 4.5, 7, materials.clay);
  addWallRing(addBox, materials, 78, 8, 3.5, 6, materials.paleStone);
  for (const district of CAPITAL_DISTRICTS) {
    addBox({ size: [52, 0.12, 36], position: [district.center[0], 0.08, district.center[1]], material: district.id === 'canal' ? materials.reeds : materials.sandstone, collision: false });
  }
  CAPITAL_BUILDINGS.forEach((building) => addPlannedBuilding(addBox, materials, building));
  addZiggurat(addBox, materials);
  addPalace(addBox, materials);
  addResourceBelt(addBox, materials);
  for (const [x, z] of [[-73, -62], [-62, -67], [-51, -62], [-73, -78], [-61, -82]]) addPalm(addBox, materials, x, z);
  addMarketStall(addBox, materials, -11, 25, materials.turquoise);
  addMarketStall(addBox, materials, 11, 25, materials.crimson);
  addMarketStall(addBox, materials, -11, 36, materials.crimson);
  addMarketStall(addBox, materials, 11, 36, materials.turquoise);

  const updateCitizens = addLivingCitizens(group, context.city);

  return { group, interactive, update: updateCitizens, ambient: '#bd6d36', fog: ['#d58a4d', 95, 310] };
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